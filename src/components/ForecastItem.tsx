import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MoonSenseColors } from '../constants/colors';

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  sun: 'sunny-outline',
  'sun-cloud': 'partly-sunny-outline',
  cloud: 'cloud-outline',
  rain: 'rainy-outline',
  wind: 'leaf-outline',
  moon: 'moon-outline',
};

const ForecastIcon = ({ icon }: { icon: string; }) => {
  const resolvedIcon = iconMap[icon] || 'cloud-outline';
  return <Ionicons name={resolvedIcon} size={24} color={MoonSenseColors.OnSurface} />;
};

export type ForecastItemProps = {
  time: string;
  icon: string;
  temperature: string;
  badge?: string;
  hint?: string;
};

const ForecastItem = ({ time, icon, temperature, badge, hint }: ForecastItemProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.time}>{time}</Text>
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      <ForecastIcon icon={icon} />
      <Text style={styles.temperature}>{temperature}°</Text>
      {hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: MoonSenseColors.Surface,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginHorizontal: 6,
    width: 70,
    height: 140,
  },
  time: {
    fontSize: 12,
    color: MoonSenseColors.OnSurfaceMedium,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: `rgba(187, 134, 252, 0.2)`, // Primary color with transparency
    position: 'absolute',
    top: 35,
  },
  badgeText: {
    fontSize: 10,
    color: MoonSenseColors.Primary,
    fontWeight: '700',
  },
  temperature: {
    fontSize: 16,
    fontWeight: 'bold',
    color: MoonSenseColors.OnSurface,
  },
  hint: {
    fontSize: 11,
    color: MoonSenseColors.OnSurfaceDisabled,
  },
});

export default ForecastItem;
