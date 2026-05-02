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
