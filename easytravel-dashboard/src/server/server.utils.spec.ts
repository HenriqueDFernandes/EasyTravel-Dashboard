import { describe, expect, it, vi } from 'vitest';

vi.mock('node:fs/promises', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs/promises')>();

  return {
    ...actual,
    mkdir: vi.fn().mockResolvedValue(undefined),
    writeFile: vi.fn().mockResolvedValue(undefined),
  };
});

vi.mock('@angular/ssr/node', () => ({
  AngularNodeAppEngine: class {
    handle() {
      return Promise.resolve(null);
    }
  },
  createNodeRequestHandler: vi.fn(() => vi.fn()),
  isMainModule: vi.fn(() => false),
  writeResponseToNodeResponse: vi.fn(),
}));

import {
  createApiFlightFromLeg,
  formatDurationFromMinutes,
  getDurationLabel,
  getRealPriceFromPricingOptions,
  isValidIsoDate,
  mapFlightsFromFlightApi,
  normalizePrice,
  parseFlightApiResponse,
} from './server';

describe('server utilities', () => {
  it('parseFlightApiResponse should parse valid JSON payloads', () => {
    const parsed = parseFlightApiResponse('{"itineraries":[]}');

    expect(parsed.itineraries).toEqual([]);
  });

  it('parseFlightApiResponse should return error object for invalid JSON', () => {
    const parsed = parseFlightApiResponse('invalid-json');

    expect(parsed.error).toBe('Resposta não está em JSON válido.');
  });

  it('formatDurationFromMinutes should format hours and minutes', () => {
    expect(formatDurationFromMinutes(185)).toBe('3h 5m');
  });

  it('normalizePrice should normalize numbers and pt-BR strings', () => {
    expect(normalizePrice(123.456)).toBe(123.46);
    expect(normalizePrice('987,65')).toBe(987.65);
    expect(normalizePrice('')).toBeNull();
  });

  it('isValidIsoDate should validate real calendar dates', () => {
    expect(isValidIsoDate('2026-05-03')).toBe(true);
    expect(isValidIsoDate('2026-02-30')).toBe(false);
  });

  it('getDurationLabel should estimate duration from iso datetimes', () => {
    expect(getDurationLabel('2026-05-03T10:00:00.000Z', '2026-05-03T12:45:00.000Z')).toBe('2h 45m');
    expect(getDurationLabel('2026-05-03T10:00:00.000Z', '2026-05-03T09:45:00.000Z')).toBe('N/A');
  });

  it('getRealPriceFromPricingOptions should use pricing option first and fallback to cheapest price', () => {
    expect(
      getRealPriceFromPricingOptions(
        [{ price: { amount: '321.99' } }],
        { amount: '555.90' },
      ),
    ).toBe(321.99);

    expect(
      getRealPriceFromPricingOptions([], { amount: '555.90' }),
    ).toBe(555.9);
  });

  it('createApiFlightFromLeg should map leg metadata into application flight format', () => {
    const flight = createApiFlightFromLeg(
      {
        id: 'leg-1',
        departure: '2026-06-01T08:00:00',
        arrival: '2026-06-01T11:15:00',
        duration: 195,
        stop_count: 0,
        marketing_carrier_ids: [99],
      },
      new Map([[99, 'LATAM']]),
      {
        id: 'flight-1',
        price: 799.9,
        origin: 'GRU',
        destination: 'REC',
        fallbackDate: '2026-06-01',
      },
    );

    expect(flight).toEqual({
      id: 'flight-1',
      airline: 'LATAM',
      price: 799.9,
      duration: '3h 15m',
      departure: '2026-06-01T08:00:00',
      arrival: '2026-06-01T11:15:00',
      stops: 0,
      origin: 'GRU',
      destination: 'REC',
    });
  });

  it('mapFlightsFromFlightApi should split outbound and return flights for round-trip results', () => {
    const results = mapFlightsFromFlightApi(
      {
        itineraries: [
          {
            id: 'iti-1',
            leg_ids: ['outbound-leg', 'return-leg'],
            cheapest_price: { amount: 1450.5 },
          },
        ],
        legs: [
          {
            id: 'outbound-leg',
            departure: '2026-06-01T09:00:00',
            arrival: '2026-06-01T12:00:00',
            duration: 180,
            stop_count: 0,
            marketing_carrier_ids: [7],
          },
          {
            id: 'return-leg',
            departure: '2026-06-10T18:00:00',
            arrival: '2026-06-10T21:30:00',
            duration: 210,
            stop_count: 1,
            marketing_carrier_ids: [7],
          },
        ],
        carriers: [{ id: 7, name: 'Azul' }],
      },
      'GRU',
      'REC',
      '2026-06-01',
      '2026-06-10',
      'round-trip',
    );

    expect(results.tripType).toBe('round-trip');
    expect(results.outboundFlights).toHaveLength(1);
    expect(results.returnFlights).toHaveLength(1);
    expect(results.outboundFlights[0]).toMatchObject({
      airline: 'Azul',
      price: 1450.5,
      origin: 'GRU',
      destination: 'REC',
    });
    expect(results.returnFlights[0]).toMatchObject({
      airline: 'Azul',
      origin: 'REC',
      destination: 'GRU',
      stops: 1,
    });
  });
});