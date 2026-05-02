# Dashboard de Passagens Aéreas - Partes 4, 5 e 6

## PARTE 4: Componente Flight Results

### Passo 4.1: Gerar Componente
```bash
ng generate component components/flight-results
```

### Passo 4.2: Implementar FlightResults Component

**src/app/components/flight-results/flight-results.component.ts**
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Flight } from '../../models/flight.model';

@Component({
  selector: 'app-flight-results',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './flight-results.component.html',
  styleUrls: ['./flight-results.component.scss']
})
export class FlightResultsComponent {
  @Input() flights: Flight[] = [];
  @Input() sortBy: string = 'price';
  @Output() sortByChange = new EventEmitter<string>();

  onSortChange(value: string): void {
    this.sortByChange.emit(value);
  }
}
```

**src/app/components/flight-results/flight-results.component.html**
```html
<div class="results-container">
  <div class="results-header">
    <h3>{{ flights.length }} voos encontrados</h3>
    
    <mat-form-field appearance="outline" class="sort-select">
      <mat-label>Ordenar por</mat-label>
      <mat-select [value]="sortBy" (selectionChange)="onSortChange($event.value)">
        <mat-option value="price">Menor Preço</mat-option>
        <mat-option value="duration">Menor Duração</mat-option>
        <mat-option value="departure">Horário de Partida</mat-option>
      </mat-select>
    </mat-form-field>
  </div>

  <div class="flights-list">
    <mat-card *ngFor="let flight of flights" class="flight-card">
      <mat-card-content>
        <div class="flight-info">
          <!-- Airline Info -->
          <div class="airline-section">
            <div class="airline-name">
              <mat-icon class="icon-green">flight</mat-icon>
              <strong>{{ flight.airline }}</strong>
            </div>
            <div class="origin-city">{{ flight.origin }}</div>
          </div>

          <!-- Flight Times -->
          <div class="time-section">
            <div class="times">
              <span class="time">{{ flight.departure }}</span>
              <mat-icon class="arrow">arrow_forward</mat-icon>
              <span class="time">{{ flight.arrival }}</span>
            </div>
            <div class="duration">
              <mat-icon class="icon-small">schedule</mat-icon>
              {{ flight.duration }}
            </div>
            <div class="stops">
              {{ flight.stops === 0 ? 'Direto' : flight.stops + ' parada' + (flight.stops > 1 ? 's' : '') }}
            </div>
          </div>

          <!-- Destination Info -->
          <div class="destination-section">
            <div class="label">Destino</div>
            <div class="destination-city">{{ flight.destination }}</div>
          </div>

          <!-- Price Section -->
          <div class="price-section">
            <div class="price">
              <mat-icon class="icon-orange">monetization_on</mat-icon>
              <span class="amount">R$ {{ flight.price.toLocaleString('pt-BR') }}</span>
            </div>
            <button mat-raised-button class="gradient-button details-btn">
              Ver Detalhes
            </button>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  </div>
</div>
```

**src/app/components/flight-results/flight-results.component.scss**
```scss
.results-container {
  margin-bottom: 1.5rem;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;

  h3 {
    margin: 0;
    color: #1a1a1a;
  }

  .sort-select {
    width: 200px;
  }
}

.flights-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.flight-card {
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
}

.flight-info {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.airline-section {
  .airline-name {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #10b981;
    margin-bottom: 0.25rem;
  }

  .origin-city {
    font-size: 0.875rem;
    color: #6b7280;
  }
}

.time-section {
  text-align: center;

  .times {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;

    .time {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1a1a1a;
    }

    .arrow {
      color: #9ca3af;
    }
  }

  .duration {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.25rem;

    .icon-small {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }
  }

  .stops {
    font-size: 0.75rem;
    color: #9ca3af;
  }
}

.destination-section {
  .label {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.25rem;
  }

  .destination-city {
    font-weight: 600;
    color: #1a1a1a;
  }
}

.price-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
  border-left: 1px solid #e5e7eb;
  padding-left: 1.5rem;

  @media (max-width: 968px) {
    border-left: none;
    border-top: 1px solid #e5e7eb;
    padding-left: 0;
    padding-top: 1rem;
    align-items: stretch;
  }

  .price {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .amount {
      font-size: 1.875rem;
      font-weight: 700;
      color: #10b981;
    }
  }

  .details-btn {
    padding: 0.5rem 1.5rem;
  }
}

.icon-green {
  color: #10b981;
}

.icon-orange {
  color: #fb923c;
}
```

---

## PARTE 5: Componente Filter Panel

### Passo 5.1: Gerar Componente
```bash
ng generate component components/filter-panel
```

### Passo 5.2: Implementar FilterPanel Component

**src/app/components/filter-panel/filter-panel.component.ts**
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlightFilters } from '../../models/filter.model';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSliderModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss']
})
export class FilterPanelComponent {
  @Input() filters!: FlightFilters;
  @Input() availableAirlines: string[] = [];
  @Output() filtersChange = new EventEmitter<FlightFilters>();

  onFilterUpdate(): void {
    this.filtersChange.emit({ ...this.filters });
  }

  toggleAirline(airline: string): void {
    const index = this.filters.airlines.indexOf(airline);
    if (index > -1) {
      this.filters.airlines.splice(index, 1);
    } else {
      this.filters.airlines.push(airline);
    }
    this.onFilterUpdate();
  }

  isAirlineSelected(airline: string): boolean {
    return this.filters.airlines.includes(airline);
  }

  clearFilters(): void {
    this.filters = {
      maxPrice: 5000,
      maxDuration: 24,
      airlines: [],
      directFlightsOnly: false
    };
    this.filtersChange.emit(this.filters);
  }
}
```

**src/app/components/filter-panel/filter-panel.component.html**
```html
<mat-card class="filter-card">
  <mat-card-header>
    <mat-card-title>
      <div class="title-container">
        <mat-icon class="icon-green">filter_list</mat-icon>
        <h3>Filtros</h3>
      </div>
    </mat-card-title>
  </mat-card-header>

  <mat-card-content>
    <div class="filter-section">
      <!-- Price Filter -->
      <div class="filter-group">
        <label class="filter-label">
          <mat-icon class="icon-orange">monetization_on</mat-icon>
          Preço Máximo: R$ {{ filters.maxPrice.toLocaleString('pt-BR') }}
        </label>
        <mat-slider
          min="0"
          max="5000"
          step="100"
          discrete
          [displayWith]="formatPrice">
          <input matSliderThumb [(ngModel)]="filters.maxPrice" (ngModelChange)="onFilterUpdate()">
        </mat-slider>
      </div>

      <!-- Duration Filter -->
      <div class="filter-group">
        <label class="filter-label">
          <mat-icon class="icon-green">schedule</mat-icon>
          Duração Máxima: {{ filters.maxDuration }}h
        </label>
        <mat-slider
          min="1"
          max="24"
          step="1"
          discrete>
          <input matSliderThumb [(ngModel)]="filters.maxDuration" (ngModelChange)="onFilterUpdate()">
        </mat-slider>
      </div>

      <!-- Airlines Filter -->
      <div class="filter-group">
        <label class="filter-label">
          <mat-icon class="icon-green">flight</mat-icon>
          Companhias Aéreas
        </label>
        <div class="checkbox-list">
          <mat-checkbox
            *ngFor="let airline of availableAirlines"
            [checked]="isAirlineSelected(airline)"
            (change)="toggleAirline(airline)"
            color="primary">
            {{ airline }}
          </mat-checkbox>
        </div>
      </div>

      <!-- Direct Flights Filter -->
      <div class="filter-group">
        <mat-checkbox
          [(ngModel)]="filters.directFlightsOnly"
          (ngModelChange)="onFilterUpdate()"
          color="primary">
          Apenas voos diretos
        </mat-checkbox>
      </div>

      <!-- Clear Filters Button -->
      <button
        mat-stroked-button
        class="clear-btn"
        (click)="clearFilters()">
        Limpar Filtros
      </button>
    </div>
  </mat-card-content>
</mat-card>
```

**src/app/components/filter-panel/filter-panel.component.scss**
```scss
.filter-card {
  margin-bottom: 1.5rem;
}

.title-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  h3 {
    margin: 0;
  }
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.filter-group {
  .filter-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
    color: #1a1a1a;
  }

  mat-slider {
    width: 100%;
  }
}

.checkbox-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  mat-checkbox {
    font-size: 0.875rem;
  }
}

.clear-btn {
  width: 100%;
  margin-top: 0.5rem;
}

.icon-green {
  color: #10b981;
}

.icon-orange {
  color: #fb923c;
}
```

**Adicione este método no component.ts:**
```typescript
formatPrice(value: number): string {
  return `R$ ${value.toLocaleString('pt-BR')}`;
}
```

---

## PARTE 6: Componente Recent Searches

### Passo 6.1: Gerar Componente
```bash
ng generate component components/recent-searches
```

### Passo 6.2: Implementar RecentSearches Component

**src/app/components/recent-searches/recent-searches.component.ts**
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RecentSearch } from '../../models/search.model';

@Component({
  selector: 'app-recent-searches',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './recent-searches.component.html',
  styleUrls: ['./recent-searches.component.scss']
})
export class RecentSearchesComponent {
  @Input() searches: RecentSearch[] = [];
  @Output() selectSearch = new EventEmitter<RecentSearch>();
  @Output() removeSearch = new EventEmitter<string>();

  onSelect(search: RecentSearch): void {
    this.selectSearch.emit(search);
  }

  onRemove(event: Event, id: string): void {
    event.stopPropagation();
    this.removeSearch.emit(id);
  }
}
```

**src/app/components/recent-searches/recent-searches.component.html**
```html
<mat-card *ngIf="searches.length > 0" class="searches-card">
  <mat-card-header>
    <mat-card-title>
      <div class="title-container">
        <mat-icon class="icon-green">history</mat-icon>
        <h3>Buscas Recentes</h3>
      </div>
    </mat-card-title>
  </mat-card-header>

  <mat-card-content>
    <div class="searches-list">
      <div
        *ngFor="let search of searches"
        class="search-item"
        (click)="onSelect(search)">
        <div class="search-info">
          <mat-icon class="location-icon">location_on</mat-icon>
          <div class="search-details">
            <div class="route">{{ search.origin }} → {{ search.destination }}</div>
            <div class="date">{{ search.date }}</div>
          </div>
        </div>
        <button
          mat-icon-button
          class="delete-btn"
          (click)="onRemove($event, search.id)">
          <mat-icon>delete</mat-icon>
        </button>
      </div>
    </div>
  </mat-card-content>
</mat-card>
```

**src/app/components/recent-searches/recent-searches.component.scss**
```scss
.searches-card {
  margin-bottom: 1.5rem;
}

.title-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  h3 {
    margin: 0;
  }
}

.searches-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.search-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f3f4f6;

    .delete-btn {
      opacity: 1;
    }
  }
}

.search-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;

  .location-icon {
    color: #10b981;
  }
}

.search-details {
  .route {
    font-weight: 500;
    color: #1a1a1a;
    margin-bottom: 0.125rem;
  }

  .date {
    font-size: 0.875rem;
    color: #6b7280;
  }
}

.delete-btn {
  opacity: 0;
  transition: opacity 0.2s ease;
  color: #ef4444;

  &:hover {
    background-color: rgba(239, 68, 68, 0.1);
  }
}

.icon-green {
  color: #10b981;
}
```

---

## Próxima Etapa

Após implementar as partes 4, 5 e 6, solicite a **PARTE 7** (App Component - integração final) para completar a aplicação.

**Comando para continuar:**
"Continue com a PARTE 7 do dashboard de passagens aéreas - App Component"
