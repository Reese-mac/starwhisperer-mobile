import { MoonSenseColors } from '../constants/colors';
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

// --- Mock Data ---

const COSMIC_WHISPERS_DATA = [
  'Today, the universe invites you to breathe deeply.',
  'A day for calm reflection and quiet moments.',
  'Let the rhythm of the cosmos guide your pace.',
  'Find stillness in the gentle lunar light.',
];

const HEADER_DATA: HeaderData = {
  temperature: '26',
  city: 'Taipei',
  description: 'Today - Partly Cloudy',
  cosmicWhisper: 'Let the rhythm of the cosmos guide your pace.',
};

const HOURLY_FORECAST_DATA: HourlyForecastItem[] = [
  { time: '9 AM',  icon: 'sun-cloud', temp: '24' },
  { time: '10 AM', icon: 'sun-cloud', temp: '25' },
  { time: '11 AM', icon: 'cloud', temp: '25' },
  { time: '12 PM', icon: 'cloud', temp: '26' },
  { time: '1 PM',  icon: 'rain', temp: '24' },
  { time: '2 PM',  icon: 'rain', temp: '23' },
  { time: '3 PM',  icon: 'cloud', temp: '23' },
  { time: '4 PM',  icon: 'sun-cloud', temp: '24' },
];

const WEATHER_DETAILS_DATA: WeatherDetail[] = [
  { title: 'Humidity',    value: '75%',     icon: 'drop',      color: MoonSenseColors.MoonLavender, type: 'humidity' },
  { title: 'Feels Like',  value: '28°',     icon: 'thermo',    color: MoonSenseColors.MistBlue,     type: 'feelsLike' },
  { title: 'Wind',        value: '12 km/h', icon: 'wind',      color: MoonSenseColors.MistBlue,     type: 'wind' },
  { title: 'UV Index',    value: 'High',    icon: 'sun',       color: MoonSenseColors.MoonLavender, type: 'uvIndex' },
];

const DAILY_FORECAST_DATA: DailyForecastItem[] = [
  { day: 'Today', date: 'Thu, 12 Dec', high: '27°', low: '22°', icon: 'sun-cloud', humidity: '68%', uv: 'High', summary: 'Soft breeze with a bright midday window.' },
  { day: 'Fri',   date: '13 Dec',      high: '25°', low: '21°', icon: 'cloud',     humidity: '72%', uv: 'Moderate', summary: 'Cloudier morning, ideal for focus.' },
  { day: 'Sat',   date: '14 Dec',      high: '24°', low: '20°', icon: 'rain',      humidity: '80%', uv: 'Low', summary: 'Light rain invites a slower pace.' },
  { day: 'Sun',   date: '15 Dec',      high: '26°', low: '21°', icon: 'sun',       humidity: '60%', uv: 'High', summary: 'Golden afternoon perfect for rituals.' },
  { day: 'Mon',   date: '16 Dec',      high: '23°', low: '18°', icon: 'wind',      humidity: '65%', uv: 'Moderate', summary: 'Crisp winds clear the mind.' },
  { day: 'Tue',   date: '17 Dec',      high: '22°', low: '18°', icon: 'moon',      humidity: '70%', uv: 'Low', summary: 'Cool twilight great for stargazing.' },
];

const INSIGHT_DETAILS_DATA = {
  row1: [
    { title: 'Air Quality', value: 'Good',     icon: 'leaf',   color: MoonSenseColors.MistBlue,     type: 'airQuality' },
    { title: 'UV Index',    value: 'Low',      icon: 'sun',    color: MoonSenseColors.MoonLavender, type: 'uvIndex' },
  ],
  row2: [
    { title: 'Wind Speed',  value: '15 km/h',  icon: 'wind',   color: MoonSenseColors.MoonLavender, type: 'wind' },
    { title: 'Pressure',    value: '1012 hPa', icon: 'barometer', color: MoonSenseColors.MistBlue,  type: 'pressure' },
  ],
  fullWidth: { title: 'Sunrise & Sunset', value: '6:05 AM / 7:30 PM', icon: 'sunrise', color: MoonSenseColors.SoftIndigo, type: 'sunriseSunset' },
};

const CITIES_DATA = [
  { city: 'New York', temp: '18', icon: 'sun-cloud', color: MoonSenseColors.MoonLavender },
  { city: 'London',   temp: '15', icon: 'sun-rain',  color: MoonSenseColors.MistBlue },
  { city: 'Tokyo',    temp: '22', icon: 'cloud',     color: MoonSenseColors.MoonLavender },
  { city: 'Sydney',   temp: '25', icon: 'sun',       color: MoonSenseColors.MistBlue },
  { city: 'Paris',    temp: '17', icon: 'rain',      color: MoonSenseColors.MoonLavender },
];

const TEMP_TREND_DATA: TempTrendData = {
  current: '26°C',
  hourly: ['25°', '24°', '23°', '22°'],
  indicator: 'Temperature layer: Stable',
};

const WATER_TEMP_DATA: WaterTempData = {
  current: '20°C',
  suggestion: 'Suitable for walking, water is a bit cool',
  trend: 'Slightly decreasing',
};

const EMOTIONAL_ADVICE_DATA: EmotionalAdviceData = {
  advice: 'Your pace can be a bit slower; calmly feel the flow of the universe.',
};

const MOON_DETAILS = {
  phaseName: 'Waxing Gibbous',
  illumination: '76%',
  riseTime: '17:58',
  setTime: '05:51',
  mantra: 'Refine what is growing.',
};

const MOON_PHASES_DATA = [
  { name: 'New Moon',        icon: 'moon-new',               illumination: '0%',   energySuggestion: 'Set fresh intentions.', description: 'A new cycle begins.',    riseTime: '06:00 AM', setTime: '06:00 PM' },
  { name: 'Waxing Crescent', icon: 'moon-waxing-crescent',   illumination: '25%',  energySuggestion: 'Take small actions.',   description: 'Momentum slowly grows.', riseTime: '09:00 AM', setTime: '09:00 PM' },
  { name: 'First Quarter',   icon: 'moon-first-quarter',     illumination: '50%',  energySuggestion: 'Make clear decisions.', description: 'Energy pushes forward.', riseTime: '12:00 PM', setTime: '12:00 AM' },
  { name: 'Waxing Gibbous',  icon: 'moon-waxing-gibbous',    illumination: '75%',  energySuggestion: 'Refine and polish.',    description: 'Approach fullness.',     riseTime: '03:00 PM', setTime: '03:00 AM' },
  { name: 'Full Moon',       icon: 'moon-full',              illumination: '100%', energySuggestion: 'Celebrate and release.', description: 'Peak brightness.',       riseTime: '06:00 PM', setTime: '06:00 AM' },
  { name: 'Waning Gibbous',  icon: 'moon-waning-gibbous',    illumination: '75%',  energySuggestion: 'Share and reflect.',    description: 'Begin to soften.',       riseTime: '09:00 PM', setTime: '09:00 AM' },
  { name: 'Last Quarter',    icon: 'moon-last-quarter',      illumination: '50%',  energySuggestion: 'Let go of what is spent.', description: 'Clear and simplify.', riseTime: '12:00 AM', setTime: '12:00 PM' },
  { name: 'Waning Crescent', icon: 'moon-waning-crescent',   illumination: '25%',  energySuggestion: 'Rest and recover.',     description: 'Prepare for renewal.',   riseTime: '03:00 AM', setTime: '03:00 PM' },
];

// --- Mock API Functions ---

const fakeApiCall = <T>(data: T) =>
  new Promise<T>(resolve => {
    setTimeout(() => resolve(data), 300);
  });

export const getHeaderData = () => fakeApiCall(HEADER_DATA);
export const getCosmicWhisper = () => fakeApiCall(COSMIC_WHISPERS_DATA[Math.floor(Math.random() * COSMIC_WHISPERS_DATA.length)]);
export const getHourlyForecast = () => fakeApiCall(HOURLY_FORECAST_DATA);
export const getWeatherDetails = () => fakeApiCall(WEATHER_DETAILS_DATA);
export const getDailyForecast = () => fakeApiCall(DAILY_FORECAST_DATA);
export const getInsightDetails = () => fakeApiCall(INSIGHT_DETAILS_DATA);
export const getCities = () => fakeApiCall(CITIES_DATA);
export const getTempTrend = () => fakeApiCall(TEMP_TREND_DATA);
export const getWaterTemp = () => fakeApiCall(WATER_TEMP_DATA);
export const getEmotionalAdvice = () => fakeApiCall(EMOTIONAL_ADVICE_DATA);
export const getMoonPhases = () => fakeApiCall(MOON_PHASES_DATA);
export const getMoonDetails = () => fakeApiCall(MOON_DETAILS);

export const getMockWeatherBundle = async (): Promise<WeatherDataBundle> => {
  const [header, hourly, details, tempTrend, waterTemp, advice, daily] = await Promise.all([
    getHeaderData(),
    getHourlyForecast(),
    getWeatherDetails(),
    getTempTrend(),
    getWaterTemp(),
    getEmotionalAdvice(),
    getDailyForecast(),
  ]);

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
