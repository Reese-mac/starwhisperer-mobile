export type WeatherDetailType =
  | 'humidity'
  | 'feelsLike'
  | 'wind'
  | 'uvIndex'
  | 'airQuality'
  | 'pressure'
  | 'sunriseSunset'
  | 'airTemp'
  | 'waterTemp'
  | 'unknown';

export type HeaderData = {
  temperature: string;
  city: string;
  description: string;
  cosmicWhisper: string;
};

export type HourlyForecastItem = {
  time: string;
  icon: string;
  temp: string;
  uv?: string;
};

export type DailyForecastItem = {
  day: string;
  date: string;
  high: string;
  low: string;
  icon: string;
  humidity: string;
  uv: string;
  summary: string;
};

export type WeatherDetail = {
  title: string;
  value: string;
  icon: string;
  color: string;
  type?: WeatherDetailType;
  expandedData?: unknown;
};

export type TempTrendData = {
  current: string;
  hourly: string[];
  indicator: string;
};

export type WaterTempData = {
  current: string;
  suggestion: string;
  trend: string;
};

export type EmotionalAdviceData = {
  advice: string;
};

export type WeatherDataBundle = {
  header: HeaderData;
  hourly: HourlyForecastItem[];
  details: WeatherDetail[];
  tempTrend: TempTrendData;
  waterTemp: WaterTempData;
  advice: EmotionalAdviceData;
  daily: DailyForecastItem[];
};
