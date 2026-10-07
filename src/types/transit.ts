export type OccupancyLevel = 'SEA' | 'SDA' | 'LSD'; // Seats Available, Standing Available, Limited Standing
export type BusVehicleType = 'SD' | 'DD' | 'BD'; // Single Decker, Double Decker, Bendy
export type BusOperator = 'SBST' | 'SMRT' | 'TTS' | 'GAS';

export interface NextBusInfo {
  etaSeconds: number; // remaining seconds
  occupancy: OccupancyLevel;
  type: BusVehicleType;
  wab: boolean; // Wheelchair accessible
  vehiclePlate?: string;
  distanceKm?: number;
}

export interface ServiceArrival {
  serviceNo: string;
  operator: BusOperator;
  destinationCode: string;
  destinationName: string;
  nextBus: NextBusInfo;
  subsequentBus?: NextBusInfo;
  subsequentBus3?: NextBusInfo;
  isFavorite?: boolean;
}

export interface BusStop {
  code: string;
  roadName: string;
  description: string;
  landmark?: string;
  coordinates: { x: number; y: number; lat: number; lng: number };
  services: string[];
  mrtLines?: string[];
  distanceMeters?: number;
}

export interface BusRouteStop {
  stopCode: string;
  stopName: string;
  roadName: string;
  distanceKm: number;
  seq: number;
  hasMrtTransfer?: string[];
}

export interface BusServiceDetail {
  serviceNo: string;
  operator: BusOperator;
  category: 'Trunk' | 'Feeder' | 'Express' | 'City Direct';
  origin: string;
  destination: string;
  originCode: string;
  destinationCode: string;
  frequencyPeak: string;
  frequencyOffPeak: string;
  firstBus: string;
  lastBus: string;
  direction1Stops: BusRouteStop[];
  direction2Stops?: BusRouteStop[];
}

export interface MRTLine {
  code: string;
  name: string;
  colorHex: string;
  textColorHex: string;
  status: 'Normal Service' | 'Minor Delay' | 'Service Disrupted';
  statusDescription: string;
  peakFrequency: string;
  offPeakFrequency: string;
  firstTrain: string;
  lastTrain: string;
  stationsCount: number;
}

export interface TransitAlert {
  id: string;
  title: string;
  lineOrService: string;
  type: 'Disruption' | 'Advisory' | 'Bus Diversion' | 'Maintenance';
  affectedRoute: string;
  message: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'info';
}

export interface JourneyStep {
  type: 'walk' | 'bus' | 'mrt';
  instruction: string;
  detail: string;
  durationMinutes: number;
  lineOrService?: string;
  fromStopOrStation?: string;
  toStopOrStation?: string;
  stopsCount?: number;
}

export interface JourneyItinerary {
  id: string;
  title: string;
  tag: 'Fastest' | 'Least Transfers' | 'Direct Bus' | 'Rail Priority';
  totalDurationMin: number;
  adultFareSGD: number;
  concessionFareSGD: number;
  transfers: number;
  walkDistanceMeters: number;
  steps: JourneyStep[];
}
