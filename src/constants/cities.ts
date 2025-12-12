export type CityOption = {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

export const CITY_OPTIONS: CityOption[] = [
  { id: 'taipei', name: 'Taipei', country: 'Taiwan', latitude: 25.033, longitude: 121.5654, timezone: 'Asia/Taipei' },
  { id: 'new_york', name: 'New York', country: 'USA', latitude: 40.7128, longitude: -74.006, timezone: 'America/New_York' },
  { id: 'london', name: 'London', country: 'UK', latitude: 51.5072, longitude: -0.1276, timezone: 'Europe/London' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' },
  { id: 'paris', name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' },
  { id: 'los_angeles', name: 'Los Angeles', country: 'USA', latitude: 34.0522, longitude: -118.2437, timezone: 'America/Los_Angeles' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore' },
];
