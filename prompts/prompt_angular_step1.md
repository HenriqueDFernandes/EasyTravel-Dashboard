# Prompt para Criar Dashboard de Passagens Aéreas em Angular

## Contexto do Projeto

Preciso criar um MVP de dashboard de passagens aéreas usando Angular e Angular Material. A aplicação deve ter interface responsiva com tons de verde (#10b981) e laranja (#fb923c), sem modo escuro.

## Arquitetura da Aplicação

### Estrutura de Pastas
```
src/
├── app/
│   ├── components/
│   │   ├── search-form/
│   │   ├── flight-results/
│   │   ├── filter-panel/
│   │   └── recent-searches/
│   ├── models/
│   │   ├── flight.model.ts
│   │   ├── search.model.ts
│   │   └── filter.model.ts
│   ├── services/
│   │   ├── flight.service.ts
│   │   └── search-history.service.ts
│   └── app.component.ts
├── styles.scss
└── theme.scss
```
# Ações:
## PARTE 1: Configuração Inicial e Models

### Passo 1.1: Criar Interfaces/Models

**src/app/models/flight.model.ts**
```typescript
export interface Flight {
  id: string;
  airline: string;
  price: number;
  duration: string;
  departure: string;
  arrival: string;
  stops: number;
  origin: string;
  destination: string;
}
```

**src/app/models/search.model.ts**
```typescript
export interface FlightSegment {
  id: string;
  origin: string;
  destination: string;
  date: Date | null;
}

export interface SearchQuery {
  tripType: 'one-way' | 'round-trip';
  segments: FlightSegment[];
  returnDate: Date | null;
}

export interface RecentSearch {
  id: string;
  origin: string;
  destination: string;
  date: string;
  timestamp: Date;
}
```

**src/app/models/filter.model.ts**
```typescript
export interface FlightFilters {
  maxPrice: number;
  maxDuration: number;
  airlines: string[];
  directFlightsOnly: boolean;
}
```

### Passo 1.2: Configurar Tema Angular Material

**src/theme.scss**
```scss
@use '@angular/material' as mat;

$primary-palette: (
  50: #ecfdf5,
  100: #d1fae5,
  200: #a7f3d0,
  300: #6ee7b7,
  400: #34d399,
  500: #10b981,
  600: #059669,
  700: #047857,
  800: #065f46,
  900: #064e3b,
  contrast: (
    50: rgba(0, 0, 0, 0.87),
    100: rgba(0, 0, 0, 0.87),
    200: rgba(0, 0, 0, 0.87),
    300: rgba(0, 0, 0, 0.87),
    400: rgba(0, 0, 0, 0.87),
    500: white,
    600: white,
    700: white,
    800: white,
    900: white,
  )
);

$secondary-palette: (
  50: #fff7ed,
  100: #ffedd5,
  200: #fed7aa,
  300: #fdba74,
  400: #fb923c,
  500: #f97316,
  600: #ea580c,
  700: #c2410c,
  800: #9a3412,
  900: #7c2d12,
  contrast: (
    50: rgba(0, 0, 0, 0.87),
    100: rgba(0, 0, 0, 0.87),
    200: rgba(0, 0, 0, 0.87),
    300: rgba(0, 0, 0, 0.87),
    400: white,
    500: white,
    600: white,
    700: white,
    800: white,
    900: white,
  )
);

$my-primary: mat.define-palette($primary-palette, 500);
$my-accent: mat.define-palette($secondary-palette, 400);
$my-warn: mat.define-palette(mat.$red-palette);

$my-theme: mat.define-light-theme((
  color: (
    primary: $my-primary,
    accent: $my-accent,
    warn: $my-warn,
  ),
  typography: mat.define-typography-config(),
  density: 0,
));

@include mat.all-component-themes($my-theme);
```

**src/styles.scss**
```scss
@import 'theme.scss';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Roboto, "Helvetica Neue", sans-serif;
  background: linear-gradient(to bottom right, #ecfdf5, #ffffff, #fff7ed);
  min-height: 100vh;
}

.gradient-button {
  background: linear-gradient(to right, #10b981, #fb923c) !important;
  color: white !important;
  
  &:hover {
    background: linear-gradient(to right, #059669, #ea580c) !important;
  }
}
```

---

## PARTE 2: Services

### Passo 2.1: Criar Flight Service

**src/app/services/flight.service.ts**
```typescript
import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Flight } from '../models/flight.model';
import { SearchQuery } from '../models/search.model';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private mockFlights: Flight[] = [
    {
      id: '1',
      airline: 'LATAM',
      price: 850,
      duration: '2h 15min',
      departure: '08:30',
      arrival: '10:45',
      stops: 0,
      origin: 'São Paulo - GRU',
      destination: 'Rio de Janeiro - GIG'
    },
    {
      id: '2',
      airline: 'GOL',
      price: 720,
      duration: '2h 30min',
      departure: '14:20',
      arrival: '16:50',
      stops: 0,
      origin: 'São Paulo - GRU',
      destination: 'Rio de Janeiro - GIG'
    },
    {
      id: '3',
      airline: 'Azul',
      price: 950,
      duration: '2h 10min',
      departure: '06:15',
      arrival: '08:25',
      stops: 0,
      origin: 'São Paulo - GRU',
      destination: 'Rio de Janeiro - GIG'
    },
    {
      id: '4',
      airline: 'LATAM',
      price: 680,
      duration: '4h 20min',
      departure: '11:00',
      arrival: '15:20',
      stops: 1,
      origin: 'São Paulo - GRU',
      destination: 'Rio de Janeiro - GIG'
    },
    {
      id: '5',
      airline: 'GOL',
      price: 790,
      duration: '2h 25min',
      departure: '18:40',
      arrival: '21:05',
      stops: 0,
      origin: 'São Paulo - GRU',
      destination: 'Rio de Janeiro - GIG'
    }
  ];

  searchFlights(query: SearchQuery): Observable<Flight[]> {
    // Simula chamada à API com delay de 1.5s
    return of(this.mockFlights).pipe(delay(1500));
  }

  getAvailableAirlines(): string[] {
    return ['LATAM', 'GOL', 'Azul', 'TAP', 'American Airlines'];
  }
}
```

### Passo 2.2: Criar Search History Service

**src/app/services/search-history.service.ts**
```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RecentSearch } from '../models/search.model';

@Injectable({
  providedIn: 'root'
})
export class SearchHistoryService {
  private readonly STORAGE_KEY = 'recent_searches';
  private searchesSubject = new BehaviorSubject<RecentSearch[]>(this.loadSearches());

  get searches$(): Observable<RecentSearch[]> {
    return this.searchesSubject.asObservable();
  }

  addSearch(search: Omit<RecentSearch, 'id' | 'timestamp'>): void {
    const newSearch: RecentSearch = {
      ...search,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    const currentSearches = this.searchesSubject.value;
    const updatedSearches = [newSearch, ...currentSearches].slice(0, 5);
    
    this.searchesSubject.next(updatedSearches);
    this.saveSearches(updatedSearches);
  }

  removeSearch(id: string): void {
    const updatedSearches = this.searchesSubject.value.filter(s => s.id !== id);
    this.searchesSubject.next(updatedSearches);
    this.saveSearches(updatedSearches);
  }

  private loadSearches(): RecentSearch[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveSearches(searches: RecentSearch[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(searches));
  }
}
```

---

## PARTE 3: Componente de Busca (SearchForm)

### Passo 3.1: Criar Componente

```bash
ng generate component components/search-form
```

### Passo 3.2: Implementar SearchForm Component

**src/app/components/search-form/search-form.component.ts**
```typescript
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { SearchQuery, FlightSegment } from '../../models/search.model';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonToggleModule,
    MatCardModule
  ],
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent {
  @Output() search = new EventEmitter<SearchQuery>();

  searchForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      tripType: ['round-trip'],
      returnDate: [null],
      segments: this.fb.array([this.createSegment()])
    });
  }

  get tripType() {
    return this.searchForm.get('tripType')?.value;
  }

  get segments(): FormArray {
    return this.searchForm.get('segments') as FormArray;
  }

  createSegment(origin = '', destination = ''): FormGroup {
    return this.fb.group({
      id: [Date.now().toString() + Math.random()],
      origin: [origin, Validators.required],
      destination: [destination, Validators.required],
      date: [null, Validators.required]
    });
  }

  addSegment(): void {
    const lastSegment = this.segments.at(this.segments.length - 1);
    const lastDestination = lastSegment.get('destination')?.value || '';
    this.segments.push(this.createSegment(lastDestination, ''));
  }

  removeSegment(index: number): void {
    if (this.segments.length > 1) {
      this.segments.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.searchForm.valid) {
      this.search.emit(this.searchForm.value as SearchQuery);
    }
  }
}
```

**src/app/components/search-form/search-form.component.html**
```html
<mat-card class="search-card">
  <mat-card-header>
    <mat-card-title>
      <div class="header-container">
        <h2>Buscar Passagens</h2>
        <mat-button-toggle-group 
          [formControl]="searchForm.get('tripType')"
          aria-label="Tipo de viagem">
          <mat-button-toggle value="round-trip">Ida e Volta</mat-button-toggle>
          <mat-button-toggle value="one-way">Somente Ida</mat-button-toggle>
        </mat-button-toggle-group>
      </div>
    </mat-card-title>
  </mat-card-header>

  <mat-card-content>
    <form [formGroup]="searchForm" (ngSubmit)="onSubmit()">
      <div class="segments-container" formArrayName="segments">
        <div *ngFor="let segment of segments.controls; let i = index" 
             [formGroupName]="i" 
             class="segment-row">
          
          <button *ngIf="segments.length > 1"
                  type="button"
                  mat-icon-button
                  color="warn"
                  class="remove-btn"
                  (click)="removeSegment(i)">
            <mat-icon>close</mat-icon>
          </button>

          <mat-form-field appearance="outline" class="field">
            <mat-label>
              <mat-icon class="icon-green">flight_takeoff</mat-icon>
              {{ i === 0 ? 'Origem' : 'Parada ' + i }}
            </mat-label>
            <input matInput 
                   formControlName="origin" 
                   placeholder="Ex: São Paulo - GRU">
          </mat-form-field>

          <mat-form-field appearance="outline" class="field">
            <mat-label>
              <mat-icon class="icon-orange">flight_land</mat-icon>
              Destino
            </mat-label>
            <input matInput 
                   formControlName="destination" 
                   placeholder="Ex: Rio de Janeiro - GIG">
          </mat-form-field>

          <mat-form-field appearance="outline" class="field">
            <mat-label>
              <mat-icon class="icon-green">calendar_today</mat-icon>
              Data de Ida
            </mat-label>
            <input matInput 
                   [matDatepicker]="picker" 
                   formControlName="date">
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </div>
      </div>

      <button type="button" 
              mat-stroked-button 
              color="primary"
              class="add-segment-btn"
              (click)="addSegment()">
        <mat-icon>add</mat-icon>
        Adicionar Cidade Intermediária
      </button>

      <mat-form-field *ngIf="tripType === 'round-trip'" 
                      appearance="outline" 
                      class="field return-date">
        <mat-label>
          <mat-icon class="icon-orange">event</mat-icon>
          Data de Volta
        </mat-label>
        <input matInput 
               [matDatepicker]="returnPicker" 
               formControlName="returnDate">
        <mat-datepicker-toggle matIconSuffix [for]="returnPicker"></mat-datepicker-toggle>
        <mat-datepicker #returnPicker></mat-datepicker>
      </mat-form-field>

      <button type="submit" 
              mat-raised-button 
              class="gradient-button submit-btn"
              [disabled]="!searchForm.valid">
        <mat-icon>search</mat-icon>
        Buscar Passagens
      </button>
    </form>
  </mat-card-content>
</mat-card>
```

**src/app/components/search-form/search-form.component.scss**
```scss
.search-card {
  margin-bottom: 1.5rem;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 1rem;
  flex-wrap: wrap;

  h2 {
    margin: 0;
  }
}

.segments-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.segment-row {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 8px;
}

.remove-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  z-index: 10;
}

.field {
  width: 100%;
}

.return-date {
  max-width: 350px;
  margin-top: 1rem;
}

.add-segment-btn {
  margin-bottom: 1rem;
  
  mat-icon {
    margin-right: 0.5rem;
  }
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  
  mat-icon {
    margin-right: 0.5rem;
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

## Instruções de Uso

**Este prompt está dividido em 3 partes para facilitar a implementação:**

1. **PARTE 1**: Configuração inicial, models e tema
2. **PARTE 2**: Services (flight.service e search-history.service)
3. **PARTE 3**: Componente SearchForm

**Próximas partes (solicite separadamente):**
- PARTE 4: Componente FlightResults
- PARTE 5: Componente FilterPanel
- PARTE 6: Componente RecentSearches
- PARTE 7: App Component (integração final)

**Como usar este prompt:**

Copie e cole cada parte sequencialmente para seu agente no VSCode. Após implementar as partes 1-3, peça: "Continue com a PARTE 4 do dashboard de passagens aéreas"

**Módulos Angular Material necessários no app.config.ts:**
```typescript
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    // outros providers
  ]
};
```