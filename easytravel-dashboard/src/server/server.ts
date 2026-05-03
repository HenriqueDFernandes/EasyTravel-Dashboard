import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import 'dotenv/config';
import express from 'express';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import fallbackOneWay from './fallback-oneway.json' with { type: 'json' };
import fallbackRoundTrip from './fallback-roundtrip.json' with { type: 'json' };
import type {
  ApiFlight,
  ApiFlightSearchResults,
  CheapestPrice,
  CreateApiFlightOptions,
  FlightApiLeg,
  FlightApiPricingOption,
  FlightApiResponse,
  FlightSearchParams,
  TripType,
  ValidationError,
  WriteRawFlightApiResponseEntry,
} from './server.types';

const browserDistFolder = join(import.meta.dirname, '../browser');
const logsFolder = join(process.cwd(), 'logs');
const DEFAULT_LIMIT = 20;
const DEFAULT_TRIP_TYPE: TripType = 'one-way';
const FLIGHTAPI_BASE_URL = 'https://api.flightapi.io';
const FLIGHTAPI_ONE_WAY_PATH = 'onewaytrip';
const FLIGHTAPI_ROUND_TRIP_PATH = 'roundtrip';
const FLIGHTAPI_PAX = '1/0/0';
const FLIGHTAPI_CABIN_CLASS = 'Economy';
const FLIGHTAPI_CURRENCY = 'BRL';

export const app = express();
const angularApp = new AngularNodeAppEngine();

// Retorna dados de fallback com flag de dados fictícios
function getFallbackData(tripType: TripType): FlightApiResponse {
  return tripType === 'round-trip' ? (fallbackRoundTrip as FlightApiResponse) : (fallbackOneWay as FlightApiResponse);
}

// Encaminha buscas one-way e round-trip para a FlightAPI e devolve listas separadas por direcao.
app.get('/api/flights', async (req, res) => {
  const apiKey = process.env['FLIGHTAPI_API_KEY']?.trim();
  const paramsOrError = parseAndValidateSearchParams(req.query);

  if ('status' in paramsOrError) {
    res.status(paramsOrError.status).json({ message: paramsOrError.message });
    return;
  }

  if (!apiKey) {
    res.status(503).json({ message: 'FLIGHTAPI_API_KEY não configurada no servidor.' });
    return;
  }

  const upstreamUrl = buildFlightApiUrl(apiKey, paramsOrError);
  const logUrl = upstreamUrl.toString().replace(apiKey, '***');

  try {
    console.log('[FlightAPI] Calling:', logUrl);
    const upstreamResponse = await fetch(upstreamUrl);
    const rawPayload = await upstreamResponse.text();

    await writeRawFlightApiResponse({
      tripType: paramsOrError.tripType,
      origin: paramsOrError.origin,
      destination: paramsOrError.destination,
      date: paramsOrError.date,
      returnDate: paramsOrError.returnDate,
      status: upstreamResponse.status,
      payload: rawPayload,
    });

    if (!upstreamResponse.ok) {
      console.error(`[FlightAPI] Status ${upstreamResponse.status}:`, rawPayload);
      console.log('[Fallback] Retornando dados fictícios devido a falha na API');
      
      const fallbackData = getFallbackData(paramsOrError.tripType);
      const mappedResults = mapFlightsFromFlightApi(
        fallbackData,
        paramsOrError.origin,
        paramsOrError.destination,
        paramsOrError.date,
        paramsOrError.returnDate,
        paramsOrError.tripType,
      );

      res.json({
        tripType: paramsOrError.tripType,
        outboundFlights: mappedResults.outboundFlights.slice(0, paramsOrError.limit),
        returnFlights: mappedResults.returnFlights.slice(0, paramsOrError.limit),
        isMockData: true,
      });
      return;
    }

    const payload = parseFlightApiResponse(rawPayload);

    if (payload.error) {
      const errorMessage = typeof payload.error === 'string'
        ? payload.error
        : payload.error.message;

      res.status(502).json({ message: errorMessage ?? 'Resposta inválida do provedor de voos.' });
      return;
    }

    const mappedResults = mapFlightsFromFlightApi(
      payload,
      paramsOrError.origin,
      paramsOrError.destination,
      paramsOrError.date,
      paramsOrError.returnDate,
      paramsOrError.tripType,
    );

    res.json({
      tripType: paramsOrError.tripType,
      outboundFlights: mappedResults.outboundFlights.slice(0, paramsOrError.limit),
      returnFlights: mappedResults.returnFlights.slice(0, paramsOrError.limit),
      isMockData: false,
    });
  } catch {
    res.status(502).json({ message: 'Erro de comunicação com o provedor de voos.' });
  }
});

function parseAndValidateSearchParams(query: Record<string, unknown>): FlightSearchParams | ValidationError {
  const origin = query['origin']?.toString().trim().toUpperCase();
  const destination = query['destination']?.toString().trim().toUpperCase();
  const date = query['date']?.toString().trim();
  const returnDate = query['returnDate']?.toString().trim();
  const tripType = (query['tripType']?.toString().trim() ?? DEFAULT_TRIP_TYPE) as TripType;
  const limit = Number.parseInt(query['limit']?.toString().trim() ?? String(DEFAULT_LIMIT), 10);

  if (!origin || !destination || !date) {
    return { status: 400, message: 'Parâmetros obrigatórios: origin, destination, date.' };
  }

  if (!isValidIsoDate(date)) {
    return { status: 400, message: 'Parâmetro date inválido. Use o formato YYYY-MM-DD.' };
  }

  if (tripType === 'round-trip' && !returnDate) {
    return { status: 400, message: 'Parâmetro returnDate é obrigatório para buscas round-trip.' };
  }

  if (returnDate && !isValidIsoDate(returnDate)) {
    return { status: 400, message: 'Parâmetro returnDate inválido. Use o formato YYYY-MM-DD.' };
  }

  return {
    origin,
    destination,
    date,
    returnDate,
    tripType,
    limit: Number.isFinite(limit) && limit > 0 ? limit : DEFAULT_LIMIT,
  };
}

function buildFlightApiUrl(apiKey: string, params: FlightSearchParams): URL {
  if (params.tripType === 'round-trip' && params.returnDate) {
    return new URL(
      `${FLIGHTAPI_BASE_URL}/${FLIGHTAPI_ROUND_TRIP_PATH}/${apiKey}/${params.origin}/${params.destination}/${params.date}/${params.returnDate}/${FLIGHTAPI_PAX}/${FLIGHTAPI_CABIN_CLASS}/${FLIGHTAPI_CURRENCY}`
    );
  }

  return new URL(
    `${FLIGHTAPI_BASE_URL}/${FLIGHTAPI_ONE_WAY_PATH}/${apiKey}/${params.origin}/${params.destination}/${params.date}/${FLIGHTAPI_PAX}/${FLIGHTAPI_CABIN_CLASS}/${FLIGHTAPI_CURRENCY}`
  );
}

// Salva a resposta crua da FlightAPI para depuracao sem afetar o fluxo da aplicacao.
async function writeRawFlightApiResponse(entry: WriteRawFlightApiResponseEntry): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const returnSuffix = entry.returnDate ? `-${entry.returnDate}` : '';
  const fileName = `${timestamp}-${entry.tripType}-${entry.origin}-${entry.destination}-${entry.date}${returnSuffix}-status-${entry.status}.json`;

  try {
    await mkdir(logsFolder, { recursive: true });
    await writeFile(join(logsFolder, fileName), entry.payload, 'utf-8');
  } catch (error) {
    console.error('Falha ao salvar log cru da FlightAPI:', error);
  }
}

// Faz o parse seguro do payload cru retornado pela FlightAPI antes do mapeamento interno.
export function parseFlightApiResponse(rawPayload: string): FlightApiResponse {
  try {
    return JSON.parse(rawPayload) as FlightApiResponse;
  } catch {
    return {
      error: 'Resposta não está em JSON válido.',
    };
  }
}

// Converte a resposta da FlightAPI no contrato consumido pelo frontend, separando ida e volta.
export function mapFlightsFromFlightApi(
  response: FlightApiResponse,
  origin: string,
  destination: string,
  fallbackDate: string,
  returnFallbackDate: string | undefined,
  tripType: TripType = 'one-way',
): ApiFlightSearchResults {
  const legsById = new Map((response.legs ?? []).flatMap((leg) => leg.id ? [[leg.id, leg] as const] : []));
  const carriersById = new Map((response.carriers ?? []).flatMap((carrier) => {
    if (typeof carrier.id !== 'number') {
      return [];
    }

    return [[carrier.id, carrier.name ?? 'Companhia não informada'] as const];
  }));

  const outboundFlights: ApiFlight[] = [];
  const returnFlights: ApiFlight[] = [];

  (response.itineraries ?? []).forEach((itinerary, index) => {
    const price = getRealPriceFromPricingOptions(itinerary.pricing_options ?? [], itinerary.cheapest_price);

    if (price === null) {
      return;
    }

    const outboundLeg = itinerary.leg_ids?.[0] ? legsById.get(itinerary.leg_ids[0]) : undefined;
    const outboundFlight = createApiFlightFromLeg(
      outboundLeg,
      carriersById,
      {
        id: `${itinerary.id ?? `${origin}${destination}-${index}`}-outbound`,
        price,
        origin,
        destination,
        fallbackDate,
      },
    );

    if (outboundFlight) {
      outboundFlights.push(outboundFlight);
    }

    if (tripType !== 'round-trip') {
      return;
    }

    const returnLeg = itinerary.leg_ids?.[1] ? legsById.get(itinerary.leg_ids[1]) : undefined;
    const returnFlight = createApiFlightFromLeg(
      returnLeg,
      carriersById,
      {
        id: `${itinerary.id ?? `${origin}${destination}-${index}`}-return`,
        price,
        origin: destination,
        destination: origin,
        fallbackDate: returnFallbackDate ?? fallbackDate,
      },
    );

    if (returnFlight) {
      returnFlights.push(returnFlight);
    }
  });

  return {
    tripType,
    outboundFlights,
    returnFlights,
  };
}

// Monta um voo da aplicacao a partir de um leg da FlightAPI, preservando o preco do itinerario.
export function createApiFlightFromLeg(
  leg: FlightApiLeg | undefined,
  carriersById: Map<number, string>,
  options: CreateApiFlightOptions,
): ApiFlight | null {
  if (!leg) {
    return null;
  }

  const departure = leg.departure ?? `${options.fallbackDate}T08:00:00.000Z`;
  const arrival = leg.arrival ?? `${options.fallbackDate}T11:00:00.000Z`;

  const airline =
    (leg.marketing_carrier_ids ?? [])
      .map((carrierId) => carriersById.get(carrierId))
      .find((name) => Boolean(name))
    ?? 'Companhia não informada';

  const duration = typeof leg.duration === 'number' && leg.duration > 0
    ? formatDurationFromMinutes(leg.duration)
    : getDurationLabel(departure, arrival);

  return {
    id: options.id,
    airline,
    price: options.price,
    duration,
    departure,
    arrival,
    stops: leg.stop_count ?? 0,
    origin: options.origin,
    destination: options.destination,
  };
}

// Extrai o preco utilizavel do itinerario a partir das opcoes de compra retornadas pela API.
export function getRealPriceFromPricingOptions(
  pricingOptions: FlightApiPricingOption[],
  cheapestPrice?: CheapestPrice,
): number | null {
  const candidateValues = [
    ...pricingOptions.map((option) => option.price?.amount ?? option.price?.value),
    cheapestPrice?.amount,
    cheapestPrice?.value,
  ];

  for (const candidate of candidateValues) {
    const numeric = normalizePrice(candidate);

    if (numeric !== null) {
      return numeric;
    }
  }

  return null;
}

export function formatDurationFromMinutes(totalMinutes: number): string {
  return formatMinutesAsDuration(totalMinutes);
}

export function normalizePrice(value: number | string | undefined): number | null {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return Math.round(value * 100) / 100;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const normalized = Number.parseFloat(value.replace(',', '.'));

  if (!Number.isFinite(normalized) || normalized <= 0) {
    return null;
  }

  return Math.round(normalized * 100) / 100;
}

export function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) {
    return false;
  }

  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    parsed.getUTCFullYear() === year
    && parsed.getUTCMonth() === month - 1
    && parsed.getUTCDate() === day
  );
}

export function getDurationLabel(departureIso: string, arrivalIso: string): string {
  const departureTime = new Date(departureIso).getTime();
  const arrivalTime = new Date(arrivalIso).getTime();

  if (!Number.isFinite(departureTime) || !Number.isFinite(arrivalTime) || arrivalTime <= departureTime) {
    return 'N/A';
  }

  const totalMinutes = Math.round((arrivalTime - departureTime) / 60000);
  return formatMinutesAsDuration(totalMinutes);
}

function formatMinutesAsDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
}

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
