const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY ?? '';
const BASE_URL = 'https://api.weatherapi.com/v1';

export type OpenWeatherUnits = 'metric' | 'imperial';

export type WeatherServiceResponse = {
  city: string;
  timezoneOffset: number;
  current: {
    temp: number;
    feels: number;
    humidity: number;
    wind: number;
    uvi: number;
    pressure: number;
    aqi?: number;
    weather: string;
    sunrise: number;
    sunset: number;
    dewPoint: number;
  };
  hourly: {
    time: number;
    temp: number;
    icon: string;
    pop: number;
    uvi: number;
    description: string;
  }[];
  daily: {
    date: number;
    temp_min: number;
    temp_max: number;
    weather: string;
    moon_phase: number;
    moon_illumination: number;
    sunrise: number;
    sunset: number;
    uvi: number;
    humidity: number;
    moonrise: number;
    moonset: number;
  }[];
  moon: {
    phase: number;
    illumination: number;
    moonrise: number;
    moonset: number;
  };
};

export type CitySearchResult = {
  name: string;
  country: string;
  lat: number;
  lon: number;
};

const ensureApiKey = () => {
  if (!API_KEY) {
    console.warn('[WeatherService] Missing OpenWeather API key. Set EXPO_PUBLIC_OPENWEATHER_API_KEY in .env.');
    return false;
  }
  return true;
};

const phaseMap: Record<string, number> = {
  'New Moon': 0,
  'Waxing Crescent': 0.125,
  'First Quarter': 0.25,
  'Waxing Gibbous': 0.375,
  'Full Moon': 0.5,
  'Waning Gibbous': 0.625,
  'Last Quarter': 0.75,
  'Third Quarter': 0.75,
  'Waning Crescent': 0.875,
};

const toPhaseFraction = (name: string) => phaseMap[name] ?? 0;

const toSecondsFromMidnight = (timeStr: string) => {
  // WeatherAPI returns "07:59 AM" style strings
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return 0;
  let [_, hh, mm, ampm] = match;
  let hour = Number(hh);
  const minute = Number(mm);
  const upper = ampm.toUpperCase();
  if (upper === 'PM' && hour !== 12) hour += 12;
  if (upper === 'AM' && hour === 12) hour = 0;
  return hour * 3600 + minute * 60;
};

const toEpochFromLocal = (dateEpoch: number, timeStr: string) =>
  dateEpoch + toSecondsFromMidnight(timeStr);

export async function getWeather(
  lat: number,
  lon: number,
  units: OpenWeatherUnits = 'metric',
): Promise<WeatherServiceResponse | null> {
  if (!ensureApiKey()) return null;

  try {
    const query = `${lat},${lon}`;
    const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(
      query,
    )}&days=7&aqi=yes&alerts=no`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('WeatherAPI request failed');

    const json = await res.json();
    const location = json.location;
    const current = json.current;
    const forecast = json.forecast?.forecastday ?? [];
    const today = forecast[0];

    const useImperial = units === 'imperial';
    const tempField = useImperial ? 'temp_f' : 'temp_c';
    const feelsField = useImperial ? 'feelslike_f' : 'feelslike_c';
    const minField = useImperial ? 'mintemp_f' : 'mintemp_c';
    const maxField = useImperial ? 'maxtemp_f' : 'maxtemp_c';
    const windValueKph = useImperial ? current.wind_mph * 1.609 : current.wind_kph;

    const city = location?.name ?? 'Unknown';

    const daily = forecast.map((d: any) => ({
      date: d.date_epoch,
      temp_min: d.day?.[minField],
      temp_max: d.day?.[maxField],
      weather: d.day?.condition?.text ?? 'Clear',
      moon_phase: toPhaseFraction(d.astro?.moon_phase ?? ''),
      moon_illumination: Number(d.astro?.moon_illumination ?? 0),
      sunrise: toEpochFromLocal(d.date_epoch, d.astro?.sunrise ?? '00:00 AM'),
      sunset: toEpochFromLocal(d.date_epoch, d.astro?.sunset ?? '00:00 PM'),
      uvi: d.day?.uv ?? 0,
      humidity: d.day?.avghumidity ?? 0,
      moonrise: toEpochFromLocal(d.date_epoch, d.astro?.moonrise ?? '00:00 AM'),
      moonset: toEpochFromLocal(d.date_epoch, d.astro?.moonset ?? '00:00 AM'),
    }));

    const response: WeatherServiceResponse = {
      city,
      timezoneOffset: 0,
      current: {
        temp: current?.[tempField],
        feels: current?.[feelsField],
        humidity: current?.humidity,
        wind: Number(windValueKph.toFixed(1)),
        uvi: current?.uv ?? 0,
        pressure: current?.pressure_mb ?? 0,
        aqi: current?.air_quality?.['us-epa-index'] ?? current?.air_quality?.pm2_5 ?? null,
        weather: current?.condition?.text ?? 'Unknown',
        sunrise: daily[0]?.sunrise ?? 0,
        sunset: daily[0]?.sunset ?? 0,
        dewPoint: useImperial ? current?.dewpoint_f : current?.dewpoint_c,
      },
      hourly: (today?.hour ?? []).slice(0, 24).map((h: any) => ({
        time: h.time_epoch,
        temp: h[tempField],
        icon: h.condition?.icon ?? '',
        description: h.condition?.text ?? 'Clear',
        pop: (h.chance_of_rain ?? 0) / 100,
        uvi: h.uv ?? 0,
      })),
      daily,
      moon: {
        phase: toPhaseFraction(today?.astro?.moon_phase ?? ''),
        illumination: Number(today?.astro?.moon_illumination ?? 0),
        moonrise: toEpochFromLocal(today?.date_epoch ?? 0, today?.astro?.moonrise ?? '00:00 AM'),
        moonset: toEpochFromLocal(today?.date_epoch ?? 0, today?.astro?.moonset ?? '00:00 AM'),
      },
    };

    return response;
  } catch (e) {
    console.warn('[WeatherAPI] ERROR:', e);
    return null;
  }
}

export async function searchCity(query: string): Promise<CitySearchResult[]> {
  if (!ensureApiKey()) return [];
  const trimmed = query.trim();
  if (!trimmed) return [];

  try {
    const url = `${BASE_URL}/search.json?key=${API_KEY}&q=${encodeURIComponent(trimmed)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('WeatherAPI search failed');

    const json = await res.json();
    if (!Array.isArray(json)) return [];
    return json.map((item: any) => ({
      name: item.name ?? 'Unknown',
      country: item.country ?? '',
      lat: item.lat,
      lon: item.lon,
    }));
  } catch (e) {
    console.warn('[WeatherAPI] city search error:', e);
    return [];
  }
}
