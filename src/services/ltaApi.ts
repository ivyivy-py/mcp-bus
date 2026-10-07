import { ServiceArrival, NextBusInfo, OccupancyLevel, BusVehicleType, BusOperator } from '../types/transit';

export interface LtaRawBus {
  OriginCode?: string;
  DestinationCode?: string;
  EstimatedArrival?: string;
  Latitude?: string;
  Longitude?: string;
  VisitNumber?: string;
  Load?: 'SEA' | 'SDA' | 'LSD';
  Feature?: string;
  Type?: 'SD' | 'DD' | 'BD';
}

export interface LtaRawService {
  ServiceNo: string;
  Operator: string;
  NextBus?: LtaRawBus;
  NextBus2?: LtaRawBus;
  NextBus3?: LtaRawBus;
}

export interface LtaArrivalResponse {
  BusStopCode: string;
  Services: LtaRawService[];
  isLive?: boolean;
  notice?: string;
  fetchedAt?: string;
}

export interface HealthCheckResponse {
  status: string;
  service: string;
  timestamp: string;
  uptimeSeconds: number;
  ltaDataMall: {
    hasAccountKey: boolean;
    note: string;
    upstreamEndpoint: string;
  };
  endpoints: {
    health: string;
    busArrival: string;
  };
}

function parseRawBus(raw?: LtaRawBus): NextBusInfo | undefined {
  if (!raw || !raw.EstimatedArrival) return undefined;

  const arrivalTime = new Date(raw.EstimatedArrival).getTime();
  const now = Date.now();
  const etaSeconds = Math.max(0, Math.floor((arrivalTime - now) / 1000));

  const validOccupancy: OccupancyLevel = ['SEA', 'SDA', 'LSD'].includes(raw.Load as any)
    ? (raw.Load as OccupancyLevel)
    : 'SEA';

  const validType: BusVehicleType = ['SD', 'DD', 'BD'].includes(raw.Type as any)
    ? (raw.Type as BusVehicleType)
    : 'SD';

  return {
    etaSeconds,
    occupancy: validOccupancy,
    type: validType,
    wab: raw.Feature === 'WAB',
    distanceKm: raw.Latitude && raw.Longitude ? 1.2 : undefined,
  };
}

export async function fetchBusArrivalFromApi(
  busStopCode: string,
  serviceNo?: string
): Promise<{ arrivals: ServiceArrival[]; isLive: boolean; notice?: string }> {
  try {
    const params = new URLSearchParams({ BusStopCode: busStopCode });
    if (serviceNo) {
      params.append('ServiceNo', serviceNo);
    }

    const response = await fetch(`/api/bus-arrival?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`);
    }

    const data: LtaArrivalResponse = await response.json();

    const arrivals: ServiceArrival[] = (data.Services || []).map((s) => {
      const nextBus = parseRawBus(s.NextBus) || {
        etaSeconds: 180,
        occupancy: 'SEA',
        type: 'DD',
        wab: true,
      };

      const subsequentBus = parseRawBus(s.NextBus2);
      const subsequentBus3 = parseRawBus(s.NextBus3);

      return {
        serviceNo: s.ServiceNo,
        operator: (s.Operator || 'SBST') as BusOperator,
        destinationCode: s.NextBus?.DestinationCode || '',
        destinationName: getDestinationName(s.ServiceNo),
        nextBus,
        subsequentBus,
        subsequentBus3,
      };
    });

    return {
      arrivals,
      isLive: Boolean(data.isLive),
      notice: data.notice,
    };
  } catch (err) {
    console.warn('API call failed, falling back to local dataset:', err);
    throw err;
  }
}

export async function checkApiHealth(): Promise<HealthCheckResponse | null> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

function getDestinationName(serviceNo: string): string {
  const map: Record<string, string> = {
    '65': 'HarbourFront Int',
    '147': 'Jurong East Int',
    '190': 'Kampong Bahru Ter',
    '7': 'Clementi Int',
    '14': 'Clementi Int via Dover',
    '36': 'Tomlinson Rd (Loop)',
    '12': 'Kampong Bahru Ter',
    '174': 'Boon Lay Int',
    '857': 'Suntec City (Loop)',
    '960': 'Marina Centre Ter',
  };
  return map[serviceNo] || 'Terminus';
}
