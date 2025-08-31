
export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  totalPrecipMm: number;
  maxPrecipMmHr: number;
  maxWindMs: number;
  maxGustMs: number;
  predominantWindDeg: number;
  predominantWindCardinal: string;
}

export interface LocalThreat {
  date: string;
  type: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  detail: string;
}

export interface AIAnalysis {
  enabled: boolean;
  model: string;
  summary: string;
  structured: {
    overview: string;
    key_days: { date: string; reason: string }[];
    advisories: string[];
  };
}

export interface StationData {
  name: string;
  coords: [number, number];
  daily: DailyForecast[];
  localThreats: LocalThreat[];
  ai: AIAnalysis;
}

export interface WeatherCache {
    [key: string]: StationData;
}

export interface StationMetadata {
    name: string;
    coords: [number, number];
}

export interface HoveredStation {
    station: StationData;
    position: { x: number; y: number };
}
