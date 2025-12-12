import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MoonSenseColors } from '../constants/colors';

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  sun: 'sunny',
  'sun-cloud': 'partly-sunny-outline',
  cloud: 'cloud-outline',
  rain: 'rainy-outline',
  wind: 'leaf-outline',
  moon: 'moon-outline',
};

const ForecastIcon = ({ icon }: { icon: string }) => {
  const resolvedIcon = iconMap[icon] || 'cloud-outline';
  return <Ionicons name={resolvedIcon} size={22} color={MoonSenseColors.NightGrey} />;
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
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
      <ForecastIcon icon={icon} />
      <Text style={styles.temperature}>{temperature}°</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 70,
    height: 134,
    borderRadius: 32,
    backgroundColor: MoonSenseColors.MistBlue,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    marginHorizontal: 6,
  },
  time: {
    fontSize: 12,
    color: MoonSenseColors.NightGrey,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  badgeText: {
    fontSize: 10,
    color: MoonSenseColors.NightGrey,
    fontWeight: '600',
  },
  temperature: {
    fontSize: 16,
    fontWeight: 'bold',
    color: MoonSenseColors.NightGrey,
  },
  hint: {
    fontSize: 11,
    color: MoonSenseColors.NightGrey,
    opacity: 0.7,
  },
});

export default ForecastItem;
