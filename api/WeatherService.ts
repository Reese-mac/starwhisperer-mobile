const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY ?? 'YOUR_API_KEY_HERE';
const ONECALL_URL = 'https://api.openweathermap.org/data/2.5/onecall';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct';
const REV_GEO_URL = 'https://api.openweathermap.org/geo/1.0/reverse';

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

// 🌙 月亮光照率計算（從 moon_phase 得到百分比）
export function getIllumination(phase: number): number {
  if (phase <= 0.5) {
    return phase * 2 * 100;
  }
  return (1 - phase) * 2 * 100;
}

const ensureApiKey = () => {
  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
    console.warn(
      '[WeatherService] Missing OpenWeather API key. Set EXPO_PUBLIC_OPENWEATHER_API_KEY or update WeatherService.ts.',
    );
  }
};

// 📍 用搜尋字串找城市座標（Explore 頁）
export async function searchCity(query: string) {
  ensureApiKey();
  if (!query.trim()) return [];
  const url = `${GEO_URL}?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to search city');
  }
  return res.json();
}

// 📍 反查城市（Home GPS → city name）
export async function reverseGeocode(lat: number, lon: number) {
  ensureApiKey();
  const url = `${REV_GEO_URL}?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to reverse geocode');
  }
  const json = await res.json();
  return json[0]?.name || 'Unknown';
}

// 🌤 主天氣資料（current, hourly, daily）
export async function getWeather(lat: number, lon: number, units: OpenWeatherUnits = 'metric') {
  ensureApiKey();
  const url = `${ONECALL_URL}?lat=${lat}&lon=${lon}&units=${units}&exclude=minutely,alerts&appid=${API_KEY}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('Failed to fetch weather data');
    }
    const json = await res.json();

    const illumination = getIllumination(json.daily[0].moon_phase);

    const city = await reverseGeocode(lat, lon);

    const response: WeatherServiceResponse = {
      city,
      timezoneOffset: json.timezone_offset ?? 0,
      current: {
        temp: json.current.temp,
        feels: json.current.feels_like,
        humidity: json.current.humidity,
        wind: Number((json.current.wind_speed * 3.6).toFixed(1)),
        uvi: json.current.uvi,
        weather: json.current.weather?.[0]?.main ?? 'Unknown',
        sunrise: json.current.sunrise,
        sunset: json.current.sunset,
        dewPoint: json.current.dew_point ?? json.current.temp,
      },
      hourly: (json.hourly ?? []).slice(0, 24).map((h: any) => ({
        time: h.dt,
        temp: h.temp,
        icon: h.weather?.[0]?.icon ?? '01d',
        description: h.weather?.[0]?.main ?? 'Clear',
        pop: h.pop,
        uvi: h.uvi,
      })),
      daily: (json.daily ?? []).map((d: any) => ({
        date: d.dt,
        temp_min: d.temp?.min,
        temp_max: d.temp?.max,
        weather: d.weather?.[0]?.main ?? 'Clear',
        moon_phase: d.moon_phase,
        moon_illumination: getIllumination(d.moon_phase),
        sunrise: d.sunrise,
        sunset: d.sunset,
        uvi: d.uvi,
        humidity: d.humidity,
        moonrise: d.moonrise,
        moonset: d.moonset,
      })),
      moon: {
        phase: json.daily[0].moon_phase,
        illumination,
        moonrise: json.daily[0].moonrise,
        moonset: json.daily[0].moonset,
      },
    };

    return response;
  } catch (e) {
    console.warn('Weather API ERROR (handled):', e);
    return null;
  }
}
