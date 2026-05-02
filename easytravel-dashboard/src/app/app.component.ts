import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';

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

  flights: Flight[] = [];
  recentSearches: RecentSearch[] = [];
  isLoading = false;
  sortBy = 'price';
  availableAirlines: string[] = [];

  filters: FlightFilters = {
    maxPrice: 5000,
    maxDuration: 24,
    airlines: [],
    directFlightsOnly: false
  };

  constructor(
    private flightService: FlightService,
    private searchHistoryService: SearchHistoryService
  ) {
    this.availableAirlines = this.flightService.getAvailableAirlines();
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
    this.isLoading = true;

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
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (flights) => {
          this.flights = flights;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao buscar voos:', error);
          this.isLoading = false;
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
    return this.flights
      .filter(f => f.price <= this.filters.maxPrice)
      .filter(f => {
        const durationHours = parseFloat(f.duration.split('h')[0]);
        return durationHours <= this.filters.maxDuration;
      })
      .filter(f => 
        this.filters.airlines.length === 0 || 
        this.filters.airlines.includes(f.airline)
      )
      .filter(f => !this.filters.directFlightsOnly || f.stops === 0)
      .sort((a, b) => {
        switch (this.sortBy) {
          case 'price':
            return a.price - b.price;
          case 'duration':
            return parseFloat(a.duration) - parseFloat(b.duration);
          case 'departure':
            return a.departure.localeCompare(b.departure);
          default:
            return 0;
        }
      });
  }
}
