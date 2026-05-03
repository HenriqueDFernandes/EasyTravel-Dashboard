import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, TimeoutError, of, throwError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { Flight, FlightSearchResults } from '../models/flight.model';
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

  // Escolhe o tipo de busca suportado pelo frontend atual: so ida ou ida e volta.
  searchFlights(query: SearchQuery): Observable<FlightSearchResults> {
    const segments = query.segments.filter(
      (segment) => segment.origin && segment.destination && segment.date
    );

    if (segments.length === 0) {
      return of(this.createEmptyResults(query.tripType));
    }

    if (query.tripType === 'round-trip' && query.returnDate) {
      const segment = segments[0];
      return this.searchRoundTrip(segment, query.returnDate);
    }

    return this.searchOneWay(segments[0]);
  }

  // Busca ida e volta em um unico request e recebe as duas listas separadas.
  private searchRoundTrip(segment: FlightSegment, returnDate: Date): Observable<FlightSearchResults> {
    const params = new HttpParams()
      .set('origin', segment.origin)
      .set('destination', segment.destination)
      .set('date', this.formatDate(segment.date))
      .set('returnDate', this.formatDate(returnDate))
      .set('tripType', 'round-trip')
      .set('limit', environment.requestLimit.toString());

    const endpoint = `${environment.apiBaseUrl}/flights`;
    const requestUrl = `${endpoint}?${params.toString()}`;

    return this.http
      .get<FlightSearchResults>(endpoint, { params })
      .pipe(
        timeout(30000),
        map((results) => results ?? this.createEmptyResults('round-trip')),
        catchError((error: unknown) => {
          if (error instanceof TimeoutError) {
            console.log('[FlightService] Timeout de 30s na busca round-trip. Requisição cancelada:', requestUrl);
          } else {
            console.log('[FlightService] Erro na busca round-trip. Requisição interrompida:', requestUrl, error);
          }

          return throwError(() => error);
        })
      );
  }

  // Busca apenas os voos de ida e normaliza a resposta para o contrato agrupado.
  private searchOneWay(segment: FlightSegment): Observable<FlightSearchResults> {
    const params = new HttpParams()
      .set('origin', segment.origin)
      .set('destination', segment.destination)
      .set('date', this.formatDate(segment.date))
      .set('limit', environment.requestLimit.toString());

    const endpoint = `${environment.apiBaseUrl}/flights`;
    const requestUrl = `${endpoint}?${params.toString()}`;

    return this.http
      .get<FlightSearchResults>(endpoint, { params })
      .pipe(
        timeout(30000),
        map((results) => results ?? this.createEmptyResults('one-way')),
        catchError((error: unknown) => {
          if (error instanceof TimeoutError) {
            console.log('[FlightService] Timeout de 30s na busca de voos. Requisição cancelada:', requestUrl);
          } else {
            console.log('[FlightService] Erro na busca de voos. Requisição interrompida:', requestUrl, error);
          }

          return throwError(() => error);
        })
      );
  }

  // Cria a estrutura vazia usada pelo frontend quando nao ha resultados.
  private createEmptyResults(tripType: SearchQuery['tripType']): FlightSearchResults {
    return {
      tripType,
      outboundFlights: [],
      returnFlights: [],
    };
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
