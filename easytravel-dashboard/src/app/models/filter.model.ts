export interface FlightFilters {
  maxPrice: number | null;
  maxDuration: number | null;
  airlines: string[];
  directFlightsOnly: boolean;
}
