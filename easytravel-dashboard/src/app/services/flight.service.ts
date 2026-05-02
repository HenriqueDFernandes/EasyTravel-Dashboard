import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Flight } from '../models/flight.model';
import { FlightSegment, SearchQuery } from '../models/search.model';
import { environment } from '../../environments/environment';

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

  constructor(private http: HttpClient) {}

  searchFlights(query: SearchQuery): Observable<Flight[]> {
    const segments = query.segments.filter(
      (segment) => segment.origin && segment.destination && segment.date
    );

    if (segments.length === 0) {
      return of([]);
    }

    const segmentRequests = segments.map((segment) => this.searchBySegment(segment));

    return forkJoin(segmentRequests).pipe(
      map((segmentResults) => segmentResults.flat())
    );
  }

  private searchBySegment(segment: FlightSegment): Observable<Flight[]> {
    const params = new HttpParams()
      .set('origin', segment.origin)
      .set('destination', segment.destination)
      .set('date', this.formatDate(segment.date))
      .set('limit', environment.requestLimit.toString());

    return this.http
      .get<Flight[]>(`${environment.apiBaseUrl}/flights`, { params })
      .pipe(
        map((flights) => flights ?? []),
        catchError(() => of(this.getMockFlightsBySegment(segment)))
      );
  }

  private getMockFlightsBySegment(segment: FlightSegment): Flight[] {
    return this.mockFlights.filter(
      (flight) => flight.origin === segment.origin && flight.destination === segment.destination
    );
  }

  private formatDate(date: Date | null): string {
    if (!date) {
      return '';
    }

    const safeDate = new Date(date);
    const year = safeDate.getFullYear();
    const month = `${safeDate.getMonth() + 1}`.padStart(2, '0');
    const day = `${safeDate.getDate()}`.padStart(2, '0');

    return `${year}-${month}-${day}`;
  }


  getAvailableAirlines(): string[] {
    return ['LATAM', 'GOL', 'Azul', 'TAP', 'American Airlines'];
  }
}
