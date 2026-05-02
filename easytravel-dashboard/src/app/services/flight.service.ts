import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Flight } from '../models/flight.model';
import { SearchQuery } from '../models/search.model';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private mockFlights: Flight[] = [
    {
      id: '1',
      airline: 'Azul',
      price: 1200,
      duration: '3h 20m',
      departure: '2026-06-01T08:00:00',
      arrival: '2026-06-01T11:20:00',
      stops: 0,
      origin: 'GRU',
      destination: 'REC'
    },
    {
      id: '2',
      airline: 'Gol',
      price: 950,
      duration: '2h 50m',
      departure: '2026-06-02T09:00:00',
      arrival: '2026-06-02T11:50:00',
      stops: 1,
      origin: 'GRU',
      destination: 'SSA'
    }
  ];

  searchFlights(query: SearchQuery): Observable<Flight[]> {
    // Aqui você pode filtrar os voos mock conforme o query
    return of(this.mockFlights).pipe(delay(800));
  }

  getAvailableAirlines(): string[] {
    return ['LATAM', 'GOL', 'Azul', 'TAP', 'American Airlines'];
  }
}
