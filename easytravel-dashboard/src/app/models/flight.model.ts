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

export interface FlightSearchResults {
  tripType: 'one-way' | 'round-trip';
  outboundFlights: Flight[];
  returnFlights: Flight[];
  isMockData?: boolean;
}
