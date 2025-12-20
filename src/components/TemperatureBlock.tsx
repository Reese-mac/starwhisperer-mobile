import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getMoonTheme } from '@/theme/moonTheme';
import { MoonType } from '@/theme/moonTypography';
import CityBackground from './CityBackground';

type TemperatureBlockProps = {
  temperature: string;
  description: string;
  rangeText?: string;
  softLightMode: boolean;
  city?: string;
};

const formatTemperature = (value: string) => (value.includes('°') ? value : `${value}°`);

export const TemperatureBlock = ({ temperature, description, rangeText, softLightMode, city }: TemperatureBlockProps) => {
  const theme = getMoonTheme(softLightMode);
  const displayTemp = formatTemperature(temperature);

  const Content = () => (
    <View style={styles.content}>
      <View style={styles.tempRow}>
        <Text style={[styles.temperature, { color: '#fff' }]}>{displayTemp}</Text>
        <Ionicons name="moon-outline" size={22} color="#fff" />
      </View>
      <Text style={[styles.description, { color: '#fff' }]} numberOfLines={2}>
        {description}
      </Text>
      {rangeText ? (
        <Text style={[styles.range, { color: '#fff' }]} numberOfLines={1}>
          {rangeText}
        </Text>
      ) : null}
    </View>
  );

  // Prefer remote city background; fallback to gradient if it fails for any reason.
  if (city) {
    return (
      <View style={[styles.container, { borderColor: theme.border }]}>
        <CityBackground cityName={city}>
          <Content />
        </CityBackground>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#ffffff', '#e6e0ff', '#d4caff']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={[styles.container, { borderColor: theme.border }]}>
      <Content />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    alignSelf: 'stretch',
  },
  content: {
    gap: 6,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  temperature: {
    ...MoonType.numberMetric,
    fontSize: 42,
  },
  description: {
    ...MoonType.body,
  },
  range: {
    ...MoonType.caption,
    marginTop: 2,
  },
});

export default TemperatureBlock;
