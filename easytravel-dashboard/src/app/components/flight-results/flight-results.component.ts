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

  get sortedFlights(): Flight[] {
    return [...this.flights].sort((a, b) => {
      if (this.sortBy === 'price') return a.price - b.price;
      if (this.sortBy === 'duration') return a.duration.localeCompare(b.duration);
      return 0;
    });
  }

  onSortChange(value: string) {
    this.sortByChange.emit(value);
  }
}

