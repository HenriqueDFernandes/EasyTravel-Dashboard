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

