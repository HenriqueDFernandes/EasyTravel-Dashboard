export type TripType = 'one-way' | 'round-trip';

export interface FlightApiPrice {
  price?: {
    amount?: number | string;
    value?: number | string;
  };
}

export interface FlightApiPricingOption extends FlightApiPrice {}

export interface CheapestPrice {
  amount?: number | string;
  value?: number | string;
}

export interface FlightApiItinerary {
  id?: string;
  leg_ids?: string[];
  pricing_options?: FlightApiPricingOption[];
  cheapest_price?: CheapestPrice;
}

export interface FlightApiLeg {
  id?: string;
  departure?: string;
  arrival?: string;
  duration?: number;
  stop_count?: number;
  marketing_carrier_ids?: number[];
}

export interface FlightApiCarrier {
  id?: number;
  name?: string;
}

export interface FlightApiError {
  message?: string;
}

export interface FlightApiResponse {
  itineraries?: FlightApiItinerary[];
  legs?: FlightApiLeg[];
  carriers?: FlightApiCarrier[];
  error?: FlightApiError | string;
}

export interface ApiFlight {
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

export interface ApiFlightSearchResults {
  tripType: TripType;
  outboundFlights: ApiFlight[];
  returnFlights: ApiFlight[];
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  date: string;
  returnDate?: string;
  tripType: TripType;
  limit: number;
}

export interface ValidationError {
  status: number;
  message: string;
}

export interface WriteRawFlightApiResponseEntry {
  tripType: TripType;
  origin: string;
  destination: string;
  date: string;
  returnDate?: string;
  status: number;
  payload: string;
}

export interface CreateApiFlightOptions {
  id: string;
  price: number;
  origin: string;
  destination: string;
  fallbackDate: string;
}
