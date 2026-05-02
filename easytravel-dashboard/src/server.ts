import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

interface AviationstackFlight {
  airline?: {
    name?: string;
  };
  flight?: {
    iata?: string;
    number?: string;
  };
  departure?: {
    iata?: string;
    scheduled?: string;
  };
  arrival?: {
    iata?: string;
    scheduled?: string;
  };
}

interface AviationstackResponse {
  data?: AviationstackFlight[];
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

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.get('/api/flights', async (req, res) => {
  const apiKey = process.env['AVIATIONSTACK_API_KEY'];
  const origin = req.query['origin']?.toString().trim().toUpperCase();
  const destination = req.query['destination']?.toString().trim().toUpperCase();
  const date = req.query['date']?.toString().trim();
  const limit = req.query['limit']?.toString().trim() ?? '20';

  if (!origin || !destination || !date) {
    res.status(400).json({ message: 'Parâmetros obrigatórios: origin, destination, date.' });
    return;
  }

  if (!apiKey) {
    res.status(503).json({ message: 'AVIATIONSTACK_API_KEY não configurada no servidor.' });
    return;
  }

  const upstreamUrl = new URL('https://api.aviationstack.com/v1/flights');
  upstreamUrl.searchParams.set('access_key', apiKey);
  upstreamUrl.searchParams.set('dep_iata', origin);
  upstreamUrl.searchParams.set('arr_iata', destination);
  upstreamUrl.searchParams.set('flight_date', date);
  upstreamUrl.searchParams.set('limit', limit);

  try {
    const upstreamResponse = await fetch(upstreamUrl);

    if (!upstreamResponse.ok) {
      res.status(upstreamResponse.status).json({ message: 'Falha na consulta ao provedor de voos.' });
      return;
    }

    const payload = (await upstreamResponse.json()) as AviationstackResponse;
    const flights = mapFlightsFromAviationstack(payload.data ?? [], origin, destination, date);
    res.json(flights);
  } catch {
    res.status(502).json({ message: 'Erro de comunicação com o provedor de voos.' });
  }
});

function mapFlightsFromAviationstack(
  flights: AviationstackFlight[],
  origin: string,
  destination: string,
  fallbackDate: string,
): ApiFlight[] {
  return flights.map((flightData, index) => {
    const departure = flightData.departure?.scheduled ?? `${fallbackDate}T08:00:00.000Z`;
    const arrival = flightData.arrival?.scheduled ?? `${fallbackDate}T11:00:00.000Z`;
    const idSeed = flightData.flight?.iata ?? flightData.flight?.number ?? `${origin}${destination}`;

    return {
      id: `${idSeed}-${index}`,
      airline: flightData.airline?.name ?? 'Companhia não informada',
      price: estimatePrice(origin, destination, idSeed),
      duration: getDurationLabel(departure, arrival),
      departure,
      arrival,
      stops: 0,
      origin: flightData.departure?.iata ?? origin,
      destination: flightData.arrival?.iata ?? destination,
    };
  });
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

function estimatePrice(origin: string, destination: string, seed: string): number {
  const routeFactor = (origin.charCodeAt(0) + destination.charCodeAt(0)) % 10;
  const seedFactor = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0) % 500;

  return 400 + routeFactor * 70 + seedFactor;
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
