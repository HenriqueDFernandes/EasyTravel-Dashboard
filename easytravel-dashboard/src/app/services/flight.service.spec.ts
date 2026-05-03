import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

import { FlightService } from './flight.service';
import { SearchQuery } from '../models/search.model';

describe('FlightService', () => {
  let service: FlightService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = new FlightService(TestBed.inject(HttpClient));
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock?.verify();
    TestBed.resetTestingModule();
  });

  it('should request one-way flights from /api/flights', () => {
    const query: SearchQuery = {
      tripType: 'one-way',
      returnDate: null,
      segments: [{ id: '1', origin: 'GRU', destination: 'REC', date: new Date(2026, 5, 1) }],
    };

    let received: unknown;
    service.searchFlights(query).subscribe((results) => {
      received = results;
    });

    const request = httpMock.expectOne((req) =>
      req.url === '/api/flights'
      && req.params.get('origin') === 'GRU'
      && req.params.get('destination') === 'REC'
      && req.params.get('date') === '2026-06-01'
      && req.params.has('tripType') === false,
    );

    request.flush({ tripType: 'one-way', outboundFlights: [{ id: 'f1' }], returnFlights: [] });

    expect(received).toEqual({ tripType: 'one-way', outboundFlights: [{ id: 'f1' }], returnFlights: [] });
  });

  it('should request round-trip flights with returnDate and tripType', () => {
    const query: SearchQuery = {
      tripType: 'round-trip',
      returnDate: new Date(2026, 5, 10),
      segments: [{ id: '1', origin: 'GRU', destination: 'REC', date: new Date(2026, 5, 1) }],
    };

    service.searchFlights(query).subscribe();

    const request = httpMock.expectOne((req) =>
      req.url === '/api/flights'
      && req.params.get('tripType') === 'round-trip'
      && req.params.get('returnDate') === '2026-06-10',
    );

    request.flush({ tripType: 'round-trip', outboundFlights: [], returnFlights: [] });
  });

  it('should return empty grouped results when no valid segment is informed', async () => {
    const query: SearchQuery = {
      tripType: 'one-way',
      returnDate: null,
      segments: [{ id: '1', origin: '', destination: 'REC', date: null }],
    };

    await new Promise<void>((resolve) => {
      service.searchFlights(query).subscribe((results) => {
        expect(results).toEqual({ tripType: 'one-way', outboundFlights: [], returnFlights: [] });
        resolve();
      });
    });
  });

  it('should propagate backend errors', async () => {
    const query: SearchQuery = {
      tripType: 'one-way',
      returnDate: null,
      segments: [{ id: '1', origin: 'GRU', destination: 'REC', date: new Date(2026, 5, 1) }],
    };

    const errorPromise = new Promise<void>((resolve) => {
      service.searchFlights(query).subscribe({
        next: () => {},
        error: (error) => {
          expect(error.status).toBe(502);
          resolve();
        },
      });
    });

    const request = httpMock.expectOne('/api/flights?origin=GRU&destination=REC&date=2026-06-01&limit=20');
    request.flush({ message: 'Falha na consulta ao provedor de voos.' }, { status: 502, statusText: 'Bad Gateway' });

    await errorPromise;
  });
});