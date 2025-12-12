import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CITY_OPTIONS, CityOption } from '../constants/cities';

type TemperatureUnit = 'celsius' | 'fahrenheit';

type SettingsState = {
  ready: boolean;
  city: CityOption;
  unit: TemperatureUnit;
  autoLocate: boolean;
  backgroundSound: boolean;
  softLightMode: boolean;
  setCityById: (id: string) => void;
  setUnit: (unit: TemperatureUnit) => void;
  setAutoLocate: (value: boolean) => void;
  setBackgroundSound: (value: boolean) => void;
  setSoftLightMode: (value: boolean) => void;
};

const defaultCity = CITY_OPTIONS[0];

const SettingsContext = createContext<SettingsState | undefined>(undefined);

const STORAGE_KEYS = {
  CITY: 'settings_city_id',
  UNIT: 'settings_unit',
  AUTO_LOCATION: 'settings_auto_location',
  BACKGROUND_SOUND: 'settings_background_sound',
  SOFT_LIGHT_MODE: 'settings_soft_light_mode',
};

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(false);
  const [cityId, setCityId] = useState(defaultCity.id);
  const [unit, setUnitState] = useState<TemperatureUnit>('celsius');
  const [autoLocate, setAutoLocateState] = useState(true);
  const [backgroundSound, setBackgroundSoundState] = useState(false);
  const [softLightMode, setSoftLightModeState] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [storedCity, storedUnit, storedAuto, storedBg, storedSoft] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.CITY),
          AsyncStorage.getItem(STORAGE_KEYS.UNIT),
          AsyncStorage.getItem(STORAGE_KEYS.AUTO_LOCATION),
          AsyncStorage.getItem(STORAGE_KEYS.BACKGROUND_SOUND),
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
        if (storedBg !== null) {
          setBackgroundSoundState(storedBg === 'true');
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

  const persist = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to persist setting', key, error);
    }
  };

  const setCityById = (id: string) => {
    if (!CITY_OPTIONS.some(option => option.id === id)) return;
    setCityId(id);
    persist(STORAGE_KEYS.CITY, id);
  };

  const setUnit = (value: TemperatureUnit) => {
    setUnitState(value);
    persist(STORAGE_KEYS.UNIT, value);
  };

  const setAutoLocate = (value: boolean) => {
    setAutoLocateState(value);
    persist(STORAGE_KEYS.AUTO_LOCATION, value.toString());
  };

  const setBackgroundSound = (value: boolean) => {
    setBackgroundSoundState(value);
    persist(STORAGE_KEYS.BACKGROUND_SOUND, value.toString());
  };

  const setSoftLightMode = (value: boolean) => {
    setSoftLightModeState(value);
    persist(STORAGE_KEYS.SOFT_LIGHT_MODE, value.toString());
  };

  const value = useMemo<SettingsState>(
    () => ({
      ready,
      city: CITY_OPTIONS.find(option => option.id === cityId) ?? defaultCity,
      unit,
      autoLocate,
      backgroundSound,
      softLightMode,
      setCityById,
      setUnit,
      setAutoLocate,
      setBackgroundSound,
      setSoftLightMode,
    }),
    [ready, cityId, unit, autoLocate, backgroundSound, softLightMode],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};
