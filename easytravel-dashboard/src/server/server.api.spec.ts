import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { writeFile } from 'node:fs/promises';

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

import { app } from './server';

function buildOneWayPayload(count: number): string {
  return JSON.stringify({
    itineraries: Array.from({ length: count }, (_, index) => ({
      id: `iti-${index + 1}`,
      leg_ids: [`leg-${index + 1}`],
      pricing_options: [{ price: { amount: 300 + index } }],
    })),
    legs: Array.from({ length: count }, (_, index) => ({
      id: `leg-${index + 1}`,
      departure: `2026-06-01T${String(8 + (index % 10)).padStart(2, '0')}:00:00`,
      arrival: `2026-06-01T${String(10 + (index % 10)).padStart(2, '0')}:00:00`,
      duration: 120,
      stop_count: 0,
      marketing_carrier_ids: [1],
    })),
    carriers: [{ id: 1, name: 'LATAM' }],
  });
}

describe('/api/flights endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('FLIGHTAPI_API_KEY', 'test-key');
  });

  it('should return grouped one-way flights on success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({
        itineraries: [{ id: 'iti-1', leg_ids: ['leg-1'], pricing_options: [{ price: { amount: 799.9 } }] }],
        legs: [{ id: 'leg-1', departure: '2026-06-01T08:00:00', arrival: '2026-06-01T11:00:00', duration: 180, stop_count: 0, marketing_carrier_ids: [1] }],
        carriers: [{ id: 1, name: 'LATAM' }],
      })),
    }));

    const response = await request(app)
      .get('/api/flights')
      .query({ origin: 'gru', destination: 'rec', date: '2026-06-01', limit: '10' });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      tripType: 'one-way',
      outboundFlights: [
        {
          airline: 'LATAM',
          origin: 'GRU',
          destination: 'REC',
          price: 799.9,
        },
      ],
      returnFlights: [],
    });
    expect(String((vi.mocked(fetch).mock.calls[0] ?? [])[0])).toContain('/onewaytrip/');
    expect(String((vi.mocked(fetch).mock.calls[0] ?? [])[0])).toContain('/BRL');
  });

  it('should return 400 for invalid date parameter', async () => {
    const response = await request(app)
      .get('/api/flights')
      .query({ origin: 'GRU', destination: 'REC', date: '2026-02-30' });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('date inválido');
  });

  it('should return 400 for round-trip without returnDate', async () => {
    const response = await request(app)
      .get('/api/flights')
      .query({ origin: 'GRU', destination: 'REC', date: '2026-06-01', tripType: 'round-trip' });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('returnDate é obrigatório');
  });

  it('should return grouped outbound and return flights for round-trip success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({
        itineraries: [{ id: 'iti-rt-1', leg_ids: ['leg-out-1', 'leg-ret-1'], cheapest_price: { amount: 1500.5 } }],
        legs: [
          { id: 'leg-out-1', departure: '2026-06-01T08:00:00', arrival: '2026-06-01T11:00:00', duration: 180, stop_count: 0, marketing_carrier_ids: [7] },
          { id: 'leg-ret-1', departure: '2026-06-10T18:00:00', arrival: '2026-06-10T21:30:00', duration: 210, stop_count: 1, marketing_carrier_ids: [7] },
        ],
        carriers: [{ id: 7, name: 'Azul' }],
      })),
    }));

    const response = await request(app)
      .get('/api/flights')
      .query({
        origin: 'gru',
        destination: 'rec',
        date: '2026-06-01',
        returnDate: '2026-06-10',
        tripType: 'round-trip',
      });

    expect(response.status).toBe(200);
    expect(response.body.tripType).toBe('round-trip');
    expect(response.body.outboundFlights).toHaveLength(1);
    expect(response.body.returnFlights).toHaveLength(1);
    expect(response.body.outboundFlights[0]).toMatchObject({
      airline: 'Azul',
      origin: 'GRU',
      destination: 'REC',
      price: 1500.5,
    });
    expect(response.body.returnFlights[0]).toMatchObject({
      airline: 'Azul',
      origin: 'REC',
      destination: 'GRU',
      stops: 1,
    });
    expect(String((vi.mocked(fetch).mock.calls[0] ?? [])[0])).toContain('/roundtrip/');
  });

  it('should return 503 when FLIGHTAPI_API_KEY is missing', async () => {
    vi.stubEnv('FLIGHTAPI_API_KEY', '');

    const response = await request(app)
      .get('/api/flights')
      .query({ origin: 'GRU', destination: 'REC', date: '2026-06-01' });

    expect(response.status).toBe(503);
    expect(response.body.message).toContain('FLIGHTAPI_API_KEY não configurada');
  });

  it('should fallback to default limit when limit is invalid, zero or negative', async () => {
    const payload = buildOneWayPayload(25);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(payload),
    }));

    for (const invalidLimit of ['0', '-5', 'abc']) {
      const response = await request(app)
        .get('/api/flights')
        .query({ origin: 'GRU', destination: 'REC', date: '2026-06-01', limit: invalidLimit });

      expect(response.status).toBe(200);
      expect(response.body.outboundFlights).toHaveLength(20);
    }
  });

  it('should not fail request when raw log write fails', async () => {
    vi.mocked(writeFile).mockRejectedValueOnce(new Error('disk full'));
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({
        itineraries: [{ id: 'iti-1', leg_ids: ['leg-1'], pricing_options: [{ price: { amount: 799.9 } }] }],
        legs: [{ id: 'leg-1', departure: '2026-06-01T08:00:00', arrival: '2026-06-01T11:00:00', duration: 180, stop_count: 0, marketing_carrier_ids: [1] }],
        carriers: [{ id: 1, name: 'LATAM' }],
      })),
    }));

    const response = await request(app)
      .get('/api/flights')
      .query({ origin: 'GRU', destination: 'REC', date: '2026-06-01' });

    expect(response.status).toBe(200);
    expect(response.body.outboundFlights).toHaveLength(1);
  });

  it('should propagate provider status when the upstream request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: () => Promise.resolve('{"message":"bad key"}'),
    }));

    const response = await request(app)
      .get('/api/flights')
      .query({ origin: 'GRU', destination: 'REC', date: '2026-06-01' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Falha na consulta ao provedor de voos.');
  });

  it('should return 502 when fetch throws communication error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));

    const response = await request(app)
      .get('/api/flights')
      .query({ origin: 'GRU', destination: 'REC', date: '2026-06-01' });

    expect(response.status).toBe(502);
    expect(response.body.message).toBe('Erro de comunicação com o provedor de voos.');
  });
});