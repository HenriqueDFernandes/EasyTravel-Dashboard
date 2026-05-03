import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, TimeoutError, finalize, takeUntil } from 'rxjs';

import { SearchFormComponent } from './components/search-form/search-form.component';
import { FlightResultsComponent } from './components/flight-results/flight-results.component';
import { FilterPanelComponent } from './components/filter-panel/filter-panel.component';
import { RecentSearchesComponent } from './components/recent-searches/recent-searches.component';

import { FlightService } from './services/flight.service';
import { SearchHistoryService } from './services/search-history.service';

import { Flight, FlightSearchResults } from './models/flight.model';
import { SearchQuery, RecentSearch } from './models/search.model';
import { FlightFilters } from './models/filter.model';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    SearchFormComponent,
    FlightResultsComponent,
    FilterPanelComponent,
    RecentSearchesComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private activeSearchRequests = 0;
  private cdr: ChangeDetectorRef;

  searchResults: FlightSearchResults = {
    tripType: 'one-way',
    outboundFlights: [],
    returnFlights: [],
  };
  recentSearches: RecentSearch[] = [];
  isLoading = false;
  sortBy = 'price';
  availableAirlines: string[] = [];

  filters: FlightFilters = {
    maxPrice: null,
    maxDuration: null,
    airlines: [],
    directFlightsOnly: false
  };

  constructor(
    private flightService: FlightService,
    private searchHistoryService: SearchHistoryService,
    private snackBar: MatSnackBar,
    cdr: ChangeDetectorRef
  ) {
    this.cdr = cdr;
  }

  ngOnInit(): void {
    this.searchHistoryService.searches$
      .pipe(takeUntil(this.destroy$))
      .subscribe(searches => {
        this.recentSearches = searches;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(query: SearchQuery): void {
    this.activeSearchRequests += 1;
    this.isLoading = this.activeSearchRequests > 0;

    // Adicionar ao histórico
    const firstSegment = query.segments[0];
    const lastSegment = query.segments[query.segments.length - 1];

    this.searchHistoryService.addSearch({
      origin: firstSegment.origin,
      destination: lastSegment.destination,
      date: format(firstSegment.date!, 'dd/MM/yyyy', { locale: ptBR })
    });

    // Buscar voos
    this.flightService.searchFlights(query)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.activeSearchRequests = Math.max(0, this.activeSearchRequests - 1);
          this.isLoading = this.activeSearchRequests > 0;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (results) => {
          this.searchResults = results;
          
          // Alerta se os dados são fictícios
          if (results.isMockData) {
            this.snackBar.open(
              '⚠️ Dados fictícios: A API de voos está indisponível. Exibindo dados de exemplo.',
              'Fechar',
              { duration: 8000, panelClass: 'warning-snackbar' }
            );
          }
          
          const availableAirlines = this.getAvailableAirlineOptions([
            ...results.outboundFlights,
            ...results.returnFlights,
          ]);

          this.availableAirlines = availableAirlines;
          this.filters = {
            ...this.filters,
            airlines: this.filters.airlines.filter((airline) =>
              availableAirlines.some((available) => this.matchesSelectedAirline(available, [airline]))
            ),
          };
        },
        error: (error) => {
          console.error('Erro ao buscar voos:', error);
          this.showSearchError(error);
        }
      });
  }

  onSortChange(sortBy: string): void {
    this.sortBy = sortBy;
  }

  onFiltersChange(filters: FlightFilters): void {
    this.filters = filters;
  }

  onSelectRecentSearch(search: RecentSearch): void {
    console.log('Busca selecionada:', search);
    // Implementar lógica para preencher o formulário com a busca selecionada
  }

  onRemoveRecentSearch(id: string): void {
    this.searchHistoryService.removeSearch(id);
  }

  // Aplica os filtros atuais em cada direcao sem misturar ida e volta na interface.
  get filteredResults(): FlightSearchResults {
    return {
      tripType: this.searchResults.tripType,
      outboundFlights: this.filterAndSortFlights(this.searchResults.outboundFlights),
      returnFlights: this.filterAndSortFlights(this.searchResults.returnFlights),
    };
  }

  // Reaproveita a mesma regra de filtros e ordenacao para cada bloco de resultados.
  private filterAndSortFlights(sourceFlights: Flight[]): Flight[] {
    const afterPrice = sourceFlights.filter(
      (flight) => this.filters.maxPrice == null || flight.price <= this.filters.maxPrice
    );

    const afterDuration = afterPrice.filter(
      (flight) => this.filters.maxDuration == null || this.getDurationInMinutes(flight.duration) <= this.filters.maxDuration
    );

    const afterAirline = afterDuration.filter(
      (flight) => this.filters.airlines.length === 0 || this.matchesSelectedAirline(flight.airline, this.filters.airlines)
    );

    const afterDirectFilter = afterAirline.filter(
      (flight) => !this.filters.directFlightsOnly || flight.stops === 0
    );

    return afterDirectFilter
      .slice()
      .sort((a, b) => {
        switch (this.sortBy) {
          case 'price':
            return a.price - b.price;
          case 'duration':
            return this.getDurationInMinutes(a.duration) - this.getDurationInMinutes(b.duration);
          case 'departure':
            return a.departure.localeCompare(b.departure);
          default:
            return 0;
        }
      });
  }

  private getAvailableAirlineOptions(flights: Flight[]): string[] {
    return Array.from(new Set(flights.map((flight) => flight.airline))).sort((a, b) => a.localeCompare(b));
  }

  private matchesSelectedAirline(flightAirline: string, selectedAirlines: string[]): boolean {
    const normalizedFlight = this.normalizeAirline(flightAirline);

    return selectedAirlines.some((selected) => {
      const normalizedSelected = this.normalizeAirline(selected);
      return normalizedFlight.includes(normalizedSelected) || normalizedSelected.includes(normalizedFlight);
    });
  }

  private normalizeAirline(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  private getDurationInMinutes(duration: string): number {
    const normalized = duration.toLowerCase().replace(/min/g, 'm').trim();
    const hourMatch = normalized.match(/(\d+)\s*h/);
    const minuteMatch = normalized.match(/(\d+)\s*m/);

    const hours = hourMatch ? Number.parseInt(hourMatch[1], 10) : 0;
    const minutes = minuteMatch ? Number.parseInt(minuteMatch[1], 10) : 0;

    return (hours * 60) + minutes;
  }

  private showSearchError(error: unknown): void {
    const statusCode = this.getErrorStatusCode(error);
    const statusMessage = this.getErrorMessage(error, statusCode);

    this.snackBar.open(`Erro ${statusCode}: ${statusMessage}`, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['app-error-snackbar'],
    });
  }

  private getErrorStatusCode(error: unknown): number {
    if (error instanceof TimeoutError) {
      return 408;
    }

    if (error instanceof HttpErrorResponse) {
      return error.status || 500;
    }

    return 500;
  }

  private getErrorStatusMessage(statusCode: number): string {
    switch (statusCode) {
      case 0:
        return 'Sem resposta do servidor';
      case 400:
        return 'Requisição inválida';
      case 401:
        return 'Não autorizado';
      case 403:
        return 'Acesso negado';
      case 404:
        return 'Recurso não encontrado';
      case 408:
        return 'Tempo de resposta esgotado';
      case 429:
        return 'Limite de requisições excedido';
      case 500:
        return 'Erro interno do servidor';
      case 502:
        return 'Falha no provedor de voos';
      case 503:
        return 'Serviço indisponível';
      case 504:
        return 'Tempo limite do servidor';
      default:
        return 'Falha ao buscar voos';
    }
  }

  private getErrorMessage(error: unknown, statusCode: number): string {
    if (error instanceof HttpErrorResponse) {
      const backendMessage = this.extractBackendMessage(error.error);

      if (backendMessage) {
        return backendMessage;
      }
    }

    return this.getErrorStatusMessage(statusCode);
  }

  private extractBackendMessage(payload: unknown): string | null {
    if (!payload) {
      return null;
    }

    if (typeof payload === 'string') {
      return payload.trim() || null;
    }

    if (typeof payload === 'object' && 'message' in payload) {
      const message = payload.message;
      return typeof message === 'string' && message.trim() ? message.trim() : null;
    }

    return null;
  }
}
