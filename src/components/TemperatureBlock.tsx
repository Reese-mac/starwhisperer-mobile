import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getMoonTheme } from '../theme/moonTheme';
import { MoonType } from '../theme/moonTypography';

interface TemperatureBlockProps {
  temperature: string;
  description: string;
  rangeText?: string; // e.g., "28° / 16° Feels like 22°"
  softLightMode: boolean;
}

export function TemperatureBlock({ temperature, description, rangeText, softLightMode }: TemperatureBlockProps) {
  const theme = getMoonTheme(softLightMode);
  return (
    <View style={styles.tempRow}>
      <Text style={[styles.temperature, { color: theme.text }]}>{temperature}°</Text>
      <Text style={[styles.description, { color: theme.textMuted }]}>{description}</Text>
      {rangeText && <Text style={[styles.rangeText, { color: theme.textMuted }]}>{rangeText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  tempRow: {
    marginTop: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  temperature: {
    ...MoonType.numberHero,
  },
  description: {
    fontSize: 18,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 24,
  },
  rangeText: {
    ...MoonType.body,
    marginTop: 10,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});
