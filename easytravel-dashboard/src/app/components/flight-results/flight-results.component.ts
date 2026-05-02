import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Flight } from '../../models/flight.model';

@Component({
  selector: 'app-flight-results',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './flight-results.component.html',
  styleUrls: ['./flight-results.component.scss']
})
export class FlightResultsComponent {
  @Input() flights: Flight[] = [];
}

