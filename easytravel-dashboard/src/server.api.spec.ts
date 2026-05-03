import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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

import { app } from './server/server';

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