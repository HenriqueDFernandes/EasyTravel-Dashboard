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

interface FlightApiPrice {
  price?: {
    amount?: number | string;
    value?: number | string;
  };
}

interface FlightApiPricingOption extends FlightApiPrice {}

interface FlightApiItinerary {
  id?: string;
  leg_ids?: string[];
  pricing_options?: FlightApiPricingOption[];
  cheapest_price?: {
    amount?: number | string;
    value?: number | string;
  };
}

interface FlightApiLeg {
  id?: string;
  departure?: string;
  arrival?: string;
  duration?: number;
  stop_count?: number;
  marketing_carrier_ids?: number[];
}

interface FlightApiCarrier {
  id?: number;
  name?: string;
}

interface FlightApiError {
  message?: string;
}

interface FlightApiResponse {
  itineraries?: FlightApiItinerary[];
  legs?: FlightApiLeg[];
  carriers?: FlightApiCarrier[];
  error?: FlightApiError | string;
}

interface ApiFlight {
  id: string;
  airline: string;
  price: number;
  duration: string;
  departure: string;
  arrival: string;
  stops: number;
  origin: string;
  destination: string;
}

interface ApiFlightSearchResults {
  tripType: 'one-way' | 'round-trip';
  outboundFlights: ApiFlight[];
  returnFlights: ApiFlight[];
}

const browserDistFolder = join(import.meta.dirname, '../browser');
const logsFolder = join(process.cwd(), 'logs');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Encaminha buscas one-way e round-trip para a FlightAPI e devolve listas separadas por direcao.
app.get('/api/flights', async (req, res) => {
  const apiKey = process.env['FLIGHTAPI_API_KEY']?.trim();
  const origin = req.query['origin']?.toString().trim().toUpperCase();
  const destination = req.query['destination']?.toString().trim().toUpperCase();
  const date = req.query['date']?.toString().trim();
  const returnDate = req.query['returnDate']?.toString().trim();
  const tripType = (req.query['tripType']?.toString().trim() ?? 'one-way') as 'one-way' | 'round-trip';
  const limit = Number.parseInt(req.query['limit']?.toString().trim() ?? '20', 10);

  if (!origin || !destination || !date) {
    res.status(400).json({ message: 'Parâmetros obrigatórios: origin, destination, date.' });
    return;
  }

  if (!isValidIsoDate(date)) {
    res.status(400).json({ message: 'Parâmetro date inválido. Use o formato YYYY-MM-DD.' });
    return;
  }

  if (tripType === 'round-trip' && !returnDate) {
    res.status(400).json({ message: 'Parâmetro returnDate é obrigatório para buscas round-trip.' });
    return;
  }

  if (returnDate && !isValidIsoDate(returnDate)) {
    res.status(400).json({ message: 'Parâmetro returnDate inválido. Use o formato YYYY-MM-DD.' });
    return;
  }

  if (!apiKey) {
    res.status(503).json({ message: 'FLIGHTAPI_API_KEY não configurada no servidor.' });
    return;
  }

  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 20;

  let upstreamUrl: URL;
  if (tripType === 'round-trip' && returnDate) {
    upstreamUrl = new URL(
      `https://api.flightapi.io/roundtrip/${apiKey}/${origin}/${destination}/${date}/${returnDate}/1/0/0/Economy/BRL`
    );
  } else {
    upstreamUrl = new URL(
      `https://api.flightapi.io/onewaytrip/${apiKey}/${origin}/${destination}/${date}/1/0/0/Economy/BRL`
    );
  }

  try {
    const upstreamResponse = await fetch(upstreamUrl);
    const rawPayload = await upstreamResponse.text();

    await writeRawFlightApiResponse({
      tripType,
      origin,
      destination,
      date,
      returnDate,
      status: upstreamResponse.status,
      payload: rawPayload,
    });

    if (!upstreamResponse.ok) {
      res.status(upstreamResponse.status).json({ message: 'Falha na consulta ao provedor de voos.' });
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

    const mappedResults = mapFlightsFromFlightApi(payload, origin, destination, date, returnDate, tripType);

    res.json({
      tripType,
      outboundFlights: mappedResults.outboundFlights.slice(0, safeLimit),
      returnFlights: mappedResults.returnFlights.slice(0, safeLimit),
    });
  } catch {
    res.status(502).json({ message: 'Erro de comunicação com o provedor de voos.' });
  }
});

// Salva a resposta crua da FlightAPI para depuracao sem afetar o fluxo da aplicacao.
async function writeRawFlightApiResponse(entry: {
  tripType: 'one-way' | 'round-trip';
  origin: string;
  destination: string;
  date: string;
  returnDate?: string;
  status: number;
  payload: string;
}): Promise<void> {
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
function parseFlightApiResponse(rawPayload: string): FlightApiResponse {
  try {
    return JSON.parse(rawPayload) as FlightApiResponse;
  } catch {
    return {
      error: 'Resposta não está em JSON válido.',
    };
  }
}

// Converte a resposta da FlightAPI no contrato consumido pelo frontend, separando ida e volta.
function mapFlightsFromFlightApi(
  response: FlightApiResponse,
  origin: string,
  destination: string,
  fallbackDate: string,
  returnFallbackDate: string | undefined,
  tripType: 'one-way' | 'round-trip' = 'one-way',
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
function createApiFlightFromLeg(
  leg: FlightApiLeg | undefined,
  carriersById: Map<number, string>,
  options: {
    id: string;
    price: number;
    origin: string;
    destination: string;
    fallbackDate: string;
  },
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
function getRealPriceFromPricingOptions(
  pricingOptions: FlightApiPricingOption[],
  cheapestPrice?: { amount?: number | string; value?: number | string },
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

function formatDurationFromMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
}

function normalizePrice(value: number | string | undefined): number | null {
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

function isValidIsoDate(value: string): boolean {
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

function getDurationLabel(departureIso: string, arrivalIso: string): string {
  const departureTime = new Date(departureIso).getTime();
  const arrivalTime = new Date(arrivalIso).getTime();

  if (!Number.isFinite(departureTime) || !Number.isFinite(arrivalTime) || arrivalTime <= departureTime) {
    return 'N/A';
  }

  const totalMinutes = Math.round((arrivalTime - departureTime) / 60000);
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
