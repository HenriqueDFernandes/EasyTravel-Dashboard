import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RecentSearch } from '../../models/search.model';

@Component({
  selector: 'app-recent-searches',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './recent-searches.component.html',
  styleUrls: ['./recent-searches.component.scss']
})
export class RecentSearchesComponent {
  @Input() searches: RecentSearch[] = [];
  @Output() selectSearch = new EventEmitter<RecentSearch>();
  @Output() removeSearch = new EventEmitter<string>();

  selectedSearchId: string | null = null;

  onSelectSearch(searchId: string | null): void {
    this.selectedSearchId = searchId;

    if (!searchId) {
      return;
    }

    const search = this.searches.find((item) => item.id === searchId);

    if (search) {
      this.selectSearch.emit(search);
    }
  }

  removeSelectedSearch(): void {
    if (!this.selectedSearchId) {
      return;
    }

    this.removeSearch.emit(this.selectedSearchId);
    this.selectedSearchId = null;
  }

  formatSearch(search: RecentSearch): string {
    return `${search.origin} -> ${search.destination} (${search.date})`;
  }
}
