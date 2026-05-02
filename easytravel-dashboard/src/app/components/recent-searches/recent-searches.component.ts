import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RecentSearch } from '../../models/search.model';

@Component({
  selector: 'app-recent-searches',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
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
}
