import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MoonSenseColors } from '../constants/colors';

interface TemperatureBlockProps {
  temperature: string;
  description: string;
  rangeText?: string; // e.g., "28° / 16° Feels like 22°"
}

export function TemperatureBlock({ temperature, description, rangeText }: TemperatureBlockProps) {
  return (
    <View style={styles.tempRow}>
      <Text style={styles.temperature}>{temperature}°</Text>
      <Text style={styles.description}>{description}</Text>
      {rangeText && <Text style={styles.rangeText}>{rangeText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  tempRow: {
    marginTop: 24,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  temperature: {
    fontSize: 80,
    color: MoonSenseColors.OnSurface,
    fontWeight: '200',
    letterSpacing: 2,
  },
  description: {
    color: MoonSenseColors.OnSurfaceMedium,
    fontSize: 20,
    marginTop: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '400',
  },
  rangeText: {
    color: MoonSenseColors.OnSurfaceDisabled,
    fontSize: 14,
    marginTop: 12,
  },
});
