import { CityOption } from '../constants/cities';
import {
  DailyForecastItem,
  EmotionalAdviceData,
  HeaderData,
  HourlyForecastItem,
  TempTrendData,
  WaterTempData,
  WeatherDataBundle,
  WeatherDetail,
} from '../types/weather';
import { getWeather, WeatherServiceResponse } from '../../api/WeatherService';

export type CitySnapshot = {
  city: string;
  temperature: string;
  icon: string;
};

export type MoonPhaseEntry = {
  name: string;
  illumination: string;
  description: string;
  energySuggestion: string;
  riseTime: string;
  setTime: string;
};

export type MoonDetails = {
  phaseName: string;
  illumination: string;
  riseTime: string;
  setTime: string;
  mantra: string;
};

type TemperatureUnit = 'celsius' | 'fahrenheit';

const COSMIC_WHISPERS = [
  'Today, the universe invites you to breathe deeply.',
  'A day for calm reflection and quiet moments.',
  'Let the rhythm of the cosmos guide your pace.',
  'Find stillness in the gentle lunar light.',
];

const MOON_PHASE_MAP = [
  { limit: 0.03, name: 'New Moon', description: 'A new cycle stirs.', energy: 'Set fresh intentions.' },
  { limit: 0.22, name: 'Waxing Crescent', description: 'Hope flickers awake.', energy: 'Take small aligned actions.' },
  { limit: 0.28, name: 'First Quarter', description: 'Momentum builds.', energy: 'Make decisions boldly.' },
  { limit: 0.47, name: 'Waxing Gibbous', description: 'Refinement time.', energy: 'Polish and perfect.' },
  { limit: 0.53, name: 'Full Moon', description: 'Peak illumination.', energy: 'Celebrate and release.' },
  { limit: 0.72, name: 'Waning Gibbous', description: 'Gratitude window.', energy: 'Share and express.' },
  { limit: 0.78, name: 'Last Quarter', description: 'Simplify gently.', energy: 'Let go of what is spent.' },
  { limit: 0.97, name: 'Waning Crescent', description: 'Restful hush.', energy: 'Restore and dream.' },
  { limit: 1.1, name: 'New Moon', description: 'Circle completes.', energy: 'Renew intentions.' },
];

const resolveDescription = (condition: string) => {
  switch (condition) {
    case 'Clear':
      return 'Clear sky';
    case 'Rain':
      return 'Rain showers';
    case 'Drizzle':
      return 'Soft drizzle';
    case 'Thunderstorm':
      return 'Thunder rumblings';
    case 'Snow':
      return 'Snow whispers';
    case 'Clouds':
      return 'Moody clouds';
    case 'Mist':
    case 'Fog':
      return 'Fog-wrapped morning';
    default:
      return condition || 'Sky in motion';
  }
};

const estimateWaterTemp = (temperature: number, humidity: number) => {
  const dewPoint = temperature - (100 - humidity) / 5;
  return Math.round(dewPoint);
};

const buildAdvice = (temp: number): EmotionalAdviceData => {
  if (temp >= 30) return { advice: 'Fire energy high, remember to hydrate and slow your steps.' };
  if (temp >= 22) return { advice: 'Bright warmth invites confident strides.' };
  if (temp >= 15) return { advice: 'Gentle air, perfect for reflective walks.' };
  return { advice: 'Bundle up; today favors cozy rituals indoors.' };
};

const formatUnixTime = (value?: number) =>
  value
    ? new Date(value * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : '--';

const formatDayLabel = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return {
    day: date.toLocaleDateString('en-US', { weekday: 'short' }),
    dateLabel: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  };
};

const iconFromCondition = (condition: string, pop?: number) => {
  if (condition === 'Thunderstorm') return 'rain';
  if (condition === 'Rain' || condition === 'Drizzle') return 'rain';
  if (condition === 'Snow') return 'moon';
  if (condition === 'Clouds') return pop && pop > 0.4 ? 'sun-rain' : 'sun-cloud';
  if (condition === 'Mist' || condition === 'Fog') return 'moon';
  return 'sun';
};

const buildTempTrend = (temperatures: number[], unitSymbol: string): TempTrendData => {
  if (!temperatures.length) {
    return {
      current: `--${unitSymbol}`,
      hourly: [],
      indicator: 'No data available.',
    };
  }
  const trendSlice = temperatures.slice(0, 4);
  const current = trendSlice[0];
  const difference = trendSlice[trendSlice.length - 1] - trendSlice[0];
  const indicator =
    difference > 1
      ? 'Rising through the next hours.'
      : difference < -1
        ? 'Cooling slowly, plan layers.'
        : 'Temperature holding steady.';

  return {
    current: `${Math.round(current)}${unitSymbol}`,
    hourly: trendSlice.map(value => `${Math.round(value)}°`),
    indicator,
  };
};

const buildWaterData = (waterTemp: number, trend: string): WaterTempData => ({
  current: `${waterTemp}°`,
  suggestion: waterTemp > 20 ? 'Invites shoreline walks.' : 'Chilly touch, keep layers handy.',
  trend,
});

const buildDetails = (weather: WeatherServiceResponse, unitSymbol: string): WeatherDetail[] => {
  const waterTempValue = estimateWaterTemp(weather.current.temp, weather.current.humidity);

  return [
    { title: 'Air Temperature', value: `${Math.round(weather.current.temp)}${unitSymbol}`, icon: 'thermo', color: '#BFB3FF', type: 'airTemp' },
    { title: 'Feels Like', value: `${Math.round(weather.current.feels)}${unitSymbol}`, icon: 'thermo', color: '#E9F0FF', type: 'feelsLike' },
    { title: 'Humidity', value: `${Math.round(weather.current.humidity)}%`, icon: 'drop', color: '#BFB3FF', type: 'humidity' },
    { title: 'Wind', value: `${weather.current.wind} km/h`, icon: 'wind', color: '#E9F0FF', type: 'wind' },
    { title: 'UV Index', value: weather.current.uvi?.toFixed(1) ?? '--', icon: 'sun', color: '#BFB3FF', type: 'uvIndex' },
    { title: 'Sunrise & Sunset', value: `${formatUnixTime(weather.current.sunrise)} / ${formatUnixTime(weather.current.sunset)}`, icon: 'sunrise', color: '#E4E0FF', type: 'sunriseSunset' },
    {
      title: 'Water Temperature',
      value: `${waterTempValue}${unitSymbol}`,
      icon: 'sun-rain',
      color: '#E9F0FF',
      type: 'waterTemp',
    },
    {
      title: 'City Pulse',
      value: weather.city,
      icon: 'leaf',
      color: '#FFFFFF',
      type: 'airQuality',
    },
  ];
};

const buildHourly = (weather: WeatherServiceResponse): HourlyForecastItem[] => {
  return weather.hourly.slice(0, 8).map(entry => ({
    time: formatUnixTime(entry.time),
    icon: iconFromCondition(entry.description, entry.pop),
    temp: Math.round(entry.temp).toString(),
    uv: entry.uvi !== undefined ? entry.uvi.toFixed(1) : undefined,
  }));
};

const buildDaily = (weather: WeatherServiceResponse): DailyForecastItem[] => {
  return weather.daily.slice(0, 6).map((day, index) => {
    const { day: dayLabel, dateLabel } = formatDayLabel(day.date);
    const summary =
      day.weather === 'Rain'
        ? 'Rain invites deeper reflection.'
        : day.weather === 'Snow'
          ? 'Snow hush urges calm rituals.'
          : day.uvi > 6
            ? 'Sun-drenched hours to celebrate.'
            : 'Gentle day to stay curious.';
    return {
      day: index === 0 ? 'Today' : dayLabel,
      date: dateLabel,
      high: `${Math.round(day.temp_max)}°`,
      low: `${Math.round(day.temp_min)}°`,
      icon: iconFromCondition(day.weather),
      humidity: day.humidity ? `${day.humidity}%` : '--',
      uv: day.uvi !== undefined ? day.uvi.toFixed(1) : '--',
      summary,
    };
  });
};

const resolveMoonPhaseMeta = (value: number) => MOON_PHASE_MAP.find(entry => value <= entry.limit) ?? MOON_PHASE_MAP[0];

const formatPhaseTime = (timestamp?: number) => formatUnixTime(timestamp);

const getUnitsParam = (unit: TemperatureUnit): 'metric' | 'imperial' => (unit === 'celsius' ? 'metric' : 'imperial');

export const fetchWeatherBundle = async (city: CityOption, unit: TemperatureUnit): Promise<WeatherDataBundle> => {
  const weather = await getWeather(city.latitude, city.longitude, getUnitsParam(unit));
  if (!weather) {
    throw new Error('Failed to fetch weather data');
  }

  const unitSymbol = unit === 'celsius' ? '°C' : '°F';
  const header: HeaderData = {
    temperature: Math.round(weather.current.temp).toString(),
    city: weather.city,
    description: resolveDescription(weather.current.weather),
    cosmicWhisper: COSMIC_WHISPERS[Math.floor(Math.random() * COSMIC_WHISPERS.length)],
  };

  const hourly = buildHourly(weather);
  const details = buildDetails(weather, unitSymbol);
  const tempTrend = buildTempTrend(weather.hourly.map(item => item.temp), unitSymbol);
  const waterTempValue = estimateWaterTemp(weather.current.temp, weather.current.humidity);
  const waterTrend =
    weather.daily[1] && weather.daily[1].humidity !== undefined
      ? weather.daily[1].humidity > weather.daily[0].humidity
        ? 'Moisture rising'
        : 'Drying out'
      : 'Steady tides';
  const waterTemp = buildWaterData(waterTempValue, waterTrend);
  const advice = buildAdvice(weather.current.temp);
  const daily = buildDaily(weather);

  return {
    header,
    hourly,
    details,
    tempTrend,
    waterTemp,
    advice,
    daily,
  };
};

export const fetchCitySnapshot = async (city: CityOption, unit: TemperatureUnit): Promise<CitySnapshot> => {
  const weather = await getWeather(city.latitude, city.longitude, getUnitsParam(unit));
  if (!weather) {
    throw new Error('Failed to fetch city snapshot');
  }
  const unitSymbol = unit === 'celsius' ? '°C' : '°F';
  return {
    city: weather.city,
    temperature: `${Math.round(weather.current.temp)}${unitSymbol}`,
    icon: iconFromCondition(weather.current.weather),
  };
};

export const fetchMoonPhases = async (city: CityOption): Promise<MoonPhaseEntry[]> => {
  const weather = await getWeather(city.latitude, city.longitude);
  if (!weather) {
    throw new Error('Failed to fetch moon data');
  }
  return weather.daily.slice(0, 8).map(day => {
    const meta = resolveMoonPhaseMeta(day.moon_phase);
    return {
      name: meta.name,
      illumination: `${Math.round(day.moon_illumination)}%`,
      description: meta.description,
      energySuggestion: meta.energy,
      riseTime: formatPhaseTime(day.moonrise),
      setTime: formatPhaseTime(day.moonset),
    };
  });
};

export const fetchMoonDetails = async (city: CityOption): Promise<MoonDetails> => {
  const weather = await getWeather(city.latitude, city.longitude);
  if (!weather) {
    throw new Error('Failed to fetch moon details');
  }
  const meta = resolveMoonPhaseMeta(weather.moon.phase);
  return {
    phaseName: meta.name,
    illumination: `${Math.round(weather.moon.illumination)}%`,
    riseTime: formatPhaseTime(weather.moon.moonrise),
    setTime: formatPhaseTime(weather.moon.moonset),
    mantra: meta.energy,
  };
};
