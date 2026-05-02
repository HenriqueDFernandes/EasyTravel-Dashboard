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
    if (typeof localStorage === 'undefined') return [];
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveSearches(searches: RecentSearch[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(searches));
  }
}
