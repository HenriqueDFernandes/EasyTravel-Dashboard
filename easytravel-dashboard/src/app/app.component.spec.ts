import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AppComponent } from './app.component';

describe('AppComponent filter logic', () => {
  let component: AppComponent;

  beforeEach(() => {
    component = new AppComponent(
      { searchFlights: vi.fn() } as never,
      {
        searches$: of([]),
        addSearch: vi.fn(),
        removeSearch: vi.fn(),
      } as never,
      { open: vi.fn() } as never,
      { markForCheck: vi.fn() } as never,
    );
  });

  it('should filter flights by maxPrice', () => {
    component.searchResults = {
      tripType: 'one-way',
      outboundFlights: [
        { id: '1', airline: 'LATAM', price: 700, duration: '2h 0m', departure: '2026-06-01T10:00:00', arrival: '2026-06-01T12:00:00', stops: 0, origin: 'GRU', destination: 'REC' },
        { id: '2', airline: 'GOL', price: 1200, duration: '2h 30m', departure: '2026-06-01T13:00:00', arrival: '2026-06-01T15:30:00', stops: 0, origin: 'GRU', destination: 'REC' },
      ],
      returnFlights: [],
    };
    component.filters = { maxPrice: 800, maxDuration: null, airlines: [], directFlightsOnly: false };

    expect(component.filteredResults.outboundFlights.map((flight) => flight.id)).toEqual(['1']);
  });

  it('should filter flights by maxDuration', () => {
    component.searchResults = {
      tripType: 'one-way',
      outboundFlights: [
        { id: '1', airline: 'LATAM', price: 700, duration: '2h 0m', departure: '2026-06-01T10:00:00', arrival: '2026-06-01T12:00:00', stops: 0, origin: 'GRU', destination: 'REC' },
        { id: '2', airline: 'GOL', price: 900, duration: '4h 15m', departure: '2026-06-01T13:00:00', arrival: '2026-06-01T17:15:00', stops: 1, origin: 'GRU', destination: 'REC' },
      ],
      returnFlights: [],
    };
    component.filters = { maxPrice: null, maxDuration: 150, airlines: [], directFlightsOnly: false };

    expect(component.filteredResults.outboundFlights.map((flight) => flight.id)).toEqual(['1']);
  });

  it('should filter flights by airline using fuzzy matching', () => {
    component.searchResults = {
      tripType: 'one-way',
      outboundFlights: [
        { id: '1', airline: 'Azul Airlines', price: 700, duration: '2h 0m', departure: '2026-06-01T10:00:00', arrival: '2026-06-01T12:00:00', stops: 0, origin: 'GRU', destination: 'REC' },
        { id: '2', airline: 'LATAM', price: 900, duration: '2h 15m', departure: '2026-06-01T13:00:00', arrival: '2026-06-01T15:15:00', stops: 0, origin: 'GRU', destination: 'REC' },
      ],
      returnFlights: [],
    };
    component.filters = { maxPrice: null, maxDuration: null, airlines: ['Azul'], directFlightsOnly: false };

    expect(component.filteredResults.outboundFlights.map((flight) => flight.id)).toEqual(['1']);
  });

  it('should filter outbound and return flights independently', () => {
    component.searchResults = {
      tripType: 'round-trip',
      outboundFlights: [
        { id: '1', airline: 'LATAM', price: 700, duration: '2h 0m', departure: '2026-06-01T10:00:00', arrival: '2026-06-01T12:00:00', stops: 0, origin: 'GRU', destination: 'REC' },
      ],
      returnFlights: [
        { id: '2', airline: 'LATAM', price: 900, duration: '3h 15m', departure: '2026-06-10T13:00:00', arrival: '2026-06-10T16:15:00', stops: 1, origin: 'REC', destination: 'GRU' },
      ],
    };
    component.filters = { maxPrice: 800, maxDuration: null, airlines: [], directFlightsOnly: false };

    expect(component.filteredResults.outboundFlights).toHaveLength(1);
    expect(component.filteredResults.returnFlights).toHaveLength(0);
  });
});