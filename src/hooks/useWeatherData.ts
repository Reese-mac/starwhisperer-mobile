import { useCallback, useEffect, useState } from 'react';
import { fetchWeatherBundle } from '../services/weatherAPI';
import { getMockWeatherBundle } from '../services/mockAPI';
import { WeatherDataBundle, WeatherDetail, WeatherDetailType } from '../types/weather';
import { useSettings } from '../context/SettingsContext';

export const SAMPLE_DATA_NOTICE = 'Using sample data until live weather is available.';
const RETRY_MESSAGE = 'Update failed, pull to retry';

const detailPriority: Record<WeatherDetailType, number> = {
  feelsLike: 1,
  wind: 2,
  uvIndex: 3,
  humidity: 4,
  airTemp: 5,
  waterTemp: 6,
  airQuality: 7,
  pressure: 8,
  sunriseSunset: 9,
  unknown: 99,
};

const resolveDetailType = (title: string): WeatherDetailType => {
  switch (title) {
    case 'Humidity':
      return 'humidity';
    case 'Feels Like':
      return 'feelsLike';
    case 'Wind':
      return 'wind';
    case 'UV Index':
      return 'uvIndex';
    case 'Air Temperature':
      return 'airTemp';
    case 'Water Temperature':
      return 'waterTemp';
    default:
      return 'unknown';
  }
};

const toOrderedDetails = (details: WeatherDetail[]): WeatherDetail[] =>
  details
    .map(detail => ({
      ...detail,
      type: detail.type ?? resolveDetailType(detail.title),
    }))
    .sort((a, b) => (detailPriority[a.type] || 99) - (detailPriority[b.type] || 99));

export const useWeatherData = () => {
  const { ready, city, unit } = useSettings();
  const [data, setData] = useState<WeatherDataBundle | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const applyBundle = useCallback((bundle: WeatherDataBundle) => {
    setData({
      ...bundle,
      details: toOrderedDetails(bundle.details as WeatherDetail[]),
    });
    setLastUpdated(
      new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    );
  }, []);

  const convertTemp = (value: string) => Math.round((parseInt(value, 10) * 9) / 5 + 32);
  const withUnitSymbol = (value: number) => `${value}°`;
  const convertBundleUnits = useCallback(
    (bundle: WeatherDataBundle): WeatherDataBundle => {
      if (unit === 'celsius') return bundle;

      const header = {
        ...bundle.header,
        temperature: convertTemp(bundle.header.temperature).toString(),
      };

      const hourly = bundle.hourly.map(item => ({
        ...item,
        temp: withUnitSymbol(convertTemp(item.temp)),
      }));

      const details = bundle.details.map(detail => {
        if (!detail.value.includes('°')) return detail;
        const numeric = parseInt(detail.value, 10);
        if (Number.isNaN(numeric)) return detail;
        return { ...detail, value: withUnitSymbol(convertTemp(numeric.toString())) };
      });

      const daily = bundle.daily.map(entry => {
        const high = withUnitSymbol(convertTemp(entry.high));
        const low = withUnitSymbol(convertTemp(entry.low));
        return { ...entry, high, low };
      });

      const tempTrend = bundle.tempTrend
        ? {
            ...bundle.tempTrend,
            current: withUnitSymbol(convertTemp(bundle.tempTrend.current)),
            hourly: bundle.tempTrend.hourly.map(temp => withUnitSymbol(convertTemp(temp))),
          }
        : undefined;

      const waterTemp = bundle.waterTemp
        ? {
            ...bundle.waterTemp,
            current: withUnitSymbol(convertTemp(bundle.waterTemp.current)),
          }
        : undefined;

      return {
        ...bundle,
        header,
        hourly,
        details,
        daily,
        tempTrend,
        waterTemp,
      };
    },
    [unit],
  );

  const fetchData = useCallback(async () => {
    if (!ready) return;
    setRefreshing(true);
    setError(null);
    try {
      const bundle = await fetchWeatherBundle(city, unit);
      applyBundle(bundle);
    } catch (err) {
      console.warn('useWeatherData fetch error (handled by fallback)', err);
      try {
        const mockBundle = await getMockWeatherBundle();
        const cityName = city?.name ?? mockBundle.header.city;
        applyBundle(
          convertBundleUnits({
            ...mockBundle,
            header: { ...mockBundle.header, city: cityName },
          }),
        );
        setError(SAMPLE_DATA_NOTICE);
      } catch (mockErr) {
        console.error('useWeatherData mock fallback error', mockErr);
        setError(RETRY_MESSAGE);
      }
    } finally {
      setRefreshing(false);
    }
  }, [city, unit, ready, applyBundle]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    refreshing,
    error,
    lastUpdated,
    refetch: fetchData,
  };
};

export type UseWeatherDataReturn = ReturnType<typeof useWeatherData>;
