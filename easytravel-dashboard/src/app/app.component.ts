import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, finalize, takeUntil } from 'rxjs';

import { SearchFormComponent } from './components/search-form/search-form.component';
import { FlightResultsComponent } from './components/flight-results/flight-results.component';
import { FilterPanelComponent } from './components/filter-panel/filter-panel.component';
import { RecentSearchesComponent } from './components/recent-searches/recent-searches.component';

import { FlightService } from './services/flight.service';
import { SearchHistoryService } from './services/search-history.service';

import { Flight } from './models/flight.model';
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

  flights: Flight[] = [];
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
    cdr: ChangeDetectorRef
  ) {
    this.cdr = cdr;
  }

  ngOnInit(): void {
    this.availableAirlines = this.flightService.getAvailableAirlines();
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
        next: (flights) => {
          this.flights = flights;
          this.availableAirlines = this.getAvailableAirlineOptions(flights);
        },
        error: (error) => {
          console.error('Erro ao buscar voos:', error);
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

  get filteredFlights(): Flight[] {
    const stages = this.getFilterDebugStages(this.flights);

    return stages.afterDirectFilter
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

  private getFilterDebugStages(sourceFlights: Flight[]): {
    total: number;
    afterPriceCount: number;
    afterDurationCount: number;
    afterAirlineCount: number;
    afterDirectCount: number;
    filters: FlightFilters;
    sampleAfterDirect: Flight | null;
    afterDirectFilter: Flight[];
  } {
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

    return {
      total: sourceFlights.length,
      afterPriceCount: afterPrice.length,
      afterDurationCount: afterDuration.length,
      afterAirlineCount: afterAirline.length,
      afterDirectCount: afterDirectFilter.length,
      filters: { ...this.filters },
      sampleAfterDirect: afterDirectFilter[0] ?? null,
      afterDirectFilter,
    };
  }

  private getAvailableAirlineOptions(flights: Flight[]): string[] {
    const merged = [...this.flightService.getAvailableAirlines(), ...flights.map((flight) => flight.airline)];
    return Array.from(new Set(merged)).sort((a, b) => a.localeCompare(b));
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
}
