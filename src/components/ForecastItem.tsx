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

const ForecastIcon = ({ icon, color }: { icon: string; color: string }) => {
  const resolvedIcon = iconMap[icon] || 'cloud-outline';
  return <Ionicons name={resolvedIcon} size={22} color={color} />;
};

export type ForecastItemProps = {
  time: string;
  icon: string;
  temperature: string;
  badge?: string;
  hint?: string;
  softLightMode?: boolean;
};

const ForecastItem = ({ time, icon, temperature, badge, hint, softLightMode = false }: ForecastItemProps) => {
  const cardBg = softLightMode ? 'rgba(255,255,255,0.08)' : MoonSenseColors.MistBlue;
  const textColor = softLightMode ? '#fff' : MoonSenseColors.NightGrey;
  const badgeBg = softLightMode ? 'rgba(255,255,255,0.15)' : '#ffffff';
  const hintColor = softLightMode ? 'rgba(255,255,255,0.7)' : MoonSenseColors.NightGrey;
  const borderColor = softLightMode ? 'rgba(255,255,255,0.2)' : 'transparent';
  const iconColor = softLightMode ? '#FFFFFF' : MoonSenseColors.NightGrey;
  return (
    <View style={[styles.container, { backgroundColor: cardBg, borderColor, borderWidth: softLightMode ? 1 : 0 }]}>
      <Text style={[styles.time, { color: textColor }]}>{time}</Text>
      {badge ? (
        <View style={[styles.badge, { backgroundColor: badgeBg }]}>
          <Text style={[styles.badgeText, { color: textColor }]}>{badge}</Text>
        </View>
      ) : null}
      <ForecastIcon icon={icon} color={iconColor} />
      <Text style={[styles.temperature, { color: textColor }]}>{temperature}°</Text>
      {hint ? <Text style={[styles.hint, { color: hintColor }]}>{hint}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 70,
    height: 134,
    borderRadius: 32,
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
