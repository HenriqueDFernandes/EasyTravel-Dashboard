import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { SearchQuery, FlightSegment } from '../../models/search.model';
import { AirportOption, BRAZILIAN_AIRPORTS } from '../../data/brazilian-airports';

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
    MatAutocompleteModule,
    MatCardModule
  ],
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent {
  @Output() search = new EventEmitter<SearchQuery>();

  readonly airportOptions = BRAZILIAN_AIRPORTS;

  searchForm: FormGroup;
  private readonly airportCodeSet = new Set(this.airportOptions.map((airport) => airport.code));

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group(
      {
        tripType: ['round-trip'],
        returnDate: [null],
        segments: this.fb.array([this.createSegment()])
      },
      {
        validators: [this.returnDateRangeValidator()]
      }
    );

    this.updateReturnDateValidation(this.tripType);
    this.tripTypeControl.valueChanges.subscribe((tripType) => {
      this.updateReturnDateValidation(tripType);
    });
  }

  get tripType() {
    return this.searchForm.get('tripType')?.value;
  }

  get tripTypeControl(): AbstractControl {
    return this.searchForm.get('tripType')!;
  }

  get returnDateControl(): AbstractControl {
    return this.searchForm.get('returnDate')!;
  }

  get segments(): FormArray {
    return this.searchForm.get('segments') as FormArray;
  }

  createSegment(origin = '', destination = ''): FormGroup {
    return this.fb.group(
      {
        id: [Date.now().toString() + Math.random()],
        origin: [origin, [Validators.required, this.airportCodeValidator()]],
        destination: [destination, [Validators.required, this.airportCodeValidator()]],
        date: [null, Validators.required]
      },
      {
        validators: [this.distinctAirportsValidator()]
      }
    );
  }

  distinctAirportsValidator(): ValidatorFn {
    return (control) => {
      const origin = control.get('origin')?.value?.toString().trim().toUpperCase();
      const destinationControl = control.get('destination');
      const destination = destinationControl?.value?.toString().trim().toUpperCase();

      if (!origin || !destination) {
        this.setControlError(destinationControl, 'sameAirport', false);
        return null;
      }

      const hasSameAirport = origin === destination;
      this.setControlError(destinationControl, 'sameAirport', hasSameAirport);

      return hasSameAirport ? { sameAirport: true } : null;
    };
  }

  private setControlError(control: AbstractControl | null, errorKey: string, enabled: boolean): void {
    if (!control) {
      return;
    }

    const currentErrors = control.errors ?? {};
    const hasError = Boolean(currentErrors[errorKey]);

    if (enabled && !hasError) {
      control.setErrors({ ...currentErrors, [errorKey]: true });
      return;
    }

    if (!enabled && hasError) {
      const { [errorKey]: _, ...remainingErrors } = currentErrors;
      control.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
    }
  }

  airportCodeValidator(): ValidatorFn {
    return (control) => {
      const value = (control.value ?? '').toString().trim().toUpperCase();

      if (!value) {
        return null;
      }

      return this.airportCodeSet.has(value) ? null : { airportInvalid: true };
    };
  }

  normalizeAirportCode(index: number, controlName: 'origin' | 'destination'): void {
    const control = this.segments.at(index).get(controlName);
    const normalizedValue = (control?.value ?? '').toString().trim().toUpperCase();

    if (control && control.value !== normalizedValue) {
      control.setValue(normalizedValue);
    }
  }

  getFilteredAirports(index: number, controlName: 'origin' | 'destination'): AirportOption[] {
    const controlValue = this.segments.at(index).get(controlName)?.value ?? '';
    const searchTerm = controlValue.toString().trim().toLowerCase();

    return this.airportOptions
      .filter((airport) => {
        if (!searchTerm) {
          return true;
        }

        return airport.code.toLowerCase().includes(searchTerm)
          || airport.city.toLowerCase().includes(searchTerm)
          || airport.name.toLowerCase().includes(searchTerm)
          || airport.state.toLowerCase().includes(searchTerm);
      })
      .slice(0, 8);
  }

  getAirportHint(index: number, controlName: 'origin' | 'destination'): string | null {
    const controlValue = this.segments.at(index).get(controlName)?.value ?? '';
    const airport = this.airportOptions.find((item) => item.code === controlValue);

    if (!airport) {
      return null;
    }

    return `${airport.city} - ${airport.name}/${airport.state}`;
  }

  updateReturnDateValidation(tripType: SearchQuery['tripType']): void {
    if (tripType === 'round-trip') {
      this.returnDateControl.setValidators([Validators.required]);
    } else {
      this.returnDateControl.clearValidators();
      this.returnDateControl.setValue(null);
      this.setControlError(this.returnDateControl, 'returnBeforeDeparture', false);
    }

    this.returnDateControl.updateValueAndValidity();
    this.searchForm.updateValueAndValidity();
  }

  returnDateRangeValidator(): ValidatorFn {
    return (control) => {
      const tripType = control.get('tripType')?.value as SearchQuery['tripType'];
      const returnDateControl = control.get('returnDate');
      const firstSegmentDate = control.get('segments.0.date')?.value as Date | null;
      const returnDate = returnDateControl?.value as Date | null;

      if (tripType !== 'round-trip' || !firstSegmentDate || !returnDate) {
        this.setControlError(returnDateControl, 'returnBeforeDeparture', false);
        return null;
      }

      const departureTime = new Date(firstSegmentDate).getTime();
      const returnTime = new Date(returnDate).getTime();
      const hasInvalidRange = returnTime < departureTime;

      this.setControlError(returnDateControl, 'returnBeforeDeparture', hasInvalidRange);

      return hasInvalidRange ? { returnBeforeDeparture: true } : null;
    };
  }

  onSubmit(): void {
    if (this.searchForm.valid) {
      this.search.emit(this.searchForm.value as SearchQuery);
    }
  }
}

