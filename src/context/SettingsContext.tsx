import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { CITY_OPTIONS, CityOption } from '@/constants/cities';

type TemperatureUnit = 'celsius' | 'fahrenheit';

type SettingsState = {
  ready: boolean;
  city: CityOption;
  unit: TemperatureUnit;
  autoLocate: boolean;
  softLightMode: boolean;
  setCityById: (id: string) => void;
  setUnit: (unit: TemperatureUnit) => void;
  setAutoLocate: (value: boolean) => void;
  setSoftLightMode: (value: boolean) => void;
};

const defaultCity = CITY_OPTIONS[0];

const SettingsContext = createContext<SettingsState | undefined>(undefined);

const STORAGE_KEYS = {
  CITY: 'settings_city_id',
  UNIT: 'settings_unit',
  AUTO_LOCATION: 'settings_auto_location',
  SOFT_LIGHT_MODE: 'settings_soft_light_mode',
};

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(false);
  const [cityId, setCityId] = useState(defaultCity.id);
  const [unit, setUnitState] = useState<TemperatureUnit>('celsius');
  const [autoLocate, setAutoLocateState] = useState(true);
  const [softLightMode, setSoftLightModeState] = useState(false);
  const [locationCity, setLocationCity] = useState<CityOption | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [storedCity, storedUnit, storedAuto, storedSoft] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.CITY),
          AsyncStorage.getItem(STORAGE_KEYS.UNIT),
          AsyncStorage.getItem(STORAGE_KEYS.AUTO_LOCATION),
          AsyncStorage.getItem(STORAGE_KEYS.SOFT_LIGHT_MODE),
        ]);

        if (storedCity && CITY_OPTIONS.some(option => option.id === storedCity)) {
          setCityId(storedCity);
        }
        if (storedUnit === 'celsius' || storedUnit === 'fahrenheit') {
          setUnitState(storedUnit);
        }
        if (storedAuto !== null) {
          setAutoLocateState(storedAuto === 'true');
        }
        if (storedSoft !== null) {
          setSoftLightModeState(storedSoft === 'true');
        }
      } finally {
        setReady(true);
      }
    };
    loadSettings();
  }, []);

  const persist = useCallback(async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to persist setting', key, error);
    }
  }, []);

  const setCityById = useCallback((id: string) => {
    if (!CITY_OPTIONS.some(option => option.id === id)) return;
    // If the user manually selects a city, turn off auto-locate so the choice sticks.
    setAutoLocateState(false);
    persist(STORAGE_KEYS.AUTO_LOCATION, 'false');
    setCityId(id);
    persist(STORAGE_KEYS.CITY, id);
  }, [persist]);

  const setUnit = useCallback((value: TemperatureUnit) => {
    setUnitState(value);
    persist(STORAGE_KEYS.UNIT, value);
  }, [persist]);

  const setAutoLocate = useCallback((value: boolean) => {
    setAutoLocateState(value);
    persist(STORAGE_KEYS.AUTO_LOCATION, value.toString());
  }, [persist]);

  const setSoftLightMode = useCallback((value: boolean) => {
    setSoftLightModeState(value);
    persist(STORAGE_KEYS.SOFT_LIGHT_MODE, value.toString());
  }, [persist]);

  const value = useMemo<SettingsState>(
   () => ({
      ready,
      city:
        (autoLocate && locationCity) || CITY_OPTIONS.find(option => option.id === cityId) || defaultCity,
      unit,
      autoLocate,
      softLightMode,
      setCityById,
      setUnit,
      setAutoLocate,
      setSoftLightMode,
    }),
    [ready, cityId, unit, autoLocate, softLightMode, locationCity, setCityById, setUnit, setAutoLocate, setSoftLightMode],
  );

  useEffect(() => {
    if (!autoLocate) {
      setLocationCity(null);
      return;
    }

    let cancelled = false;
    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Location permission denied, falling back to selected city.');
          setAutoLocate(false);
          return;
        }
        const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Lowest });
        const geocode = await Location.reverseGeocodeAsync({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        if (cancelled) return;
        const first = geocode?.[0];
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
        setLocationCity({
          id: 'auto-location',
          name: first?.city || first?.subregion || 'Current Location',
          country: first?.country || '',
          latitude: coords.latitude,
          longitude: coords.longitude,
          timezone: tz,
        });
      } catch (error) {
        console.warn('Failed to get current location, using selected city.', error);
      }
    };

    fetchLocation();
    return () => {
      cancelled = true;
    };
  }, [autoLocate, setAutoLocate]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};
