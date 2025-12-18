import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MoonSenseColors } from '../constants/colors';
import { getMoonTheme } from '../theme/moonTheme';
import { MoonType } from '../theme/moonTypography';

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  sun: 'sunny',
  'sun-cloud': 'partly-sunny-outline',
  'sun-rain': 'rainy-outline',
  cloud: 'cloud-outline',
  rain: 'umbrella-outline',
  wind: 'leaf-outline',
};

export type ListCardProps = {
  city: string;
  temperature: string;
  icon: string;
  backgroundColor: string;
  softLightMode?: boolean;
};

const ListCard = ({ city, temperature, icon, backgroundColor, softLightMode = false }: ListCardProps) => {
  const theme = getMoonTheme(softLightMode);
  const resolvedIcon = iconMap[icon] || 'cloud-outline';
  const cardBg = theme.surface;
  const textColor = theme.text;
  const borderColor = theme.border;
  const iconColor = theme.text;
  const accentColor = theme.primary;
  return (
    <View style={[styles.container, { backgroundColor: cardBg, borderColor, borderWidth: 1 }]}>
      <View>
        <Text style={[styles.city, { color: textColor }]}>{city}</Text>
        <Text style={[styles.temperature, { color: theme.textMuted }]}>{temperature}</Text>
      </View>
      <Ionicons name={resolvedIcon} size={26} color={iconColor} />
      <View style={[styles.accent, { backgroundColor: accentColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  city: {
    fontSize: 18,
    fontWeight: '800',
    color: MoonSenseColors.NightGrey,
    letterSpacing: -0.2,
  },
  temperature: {
    ...MoonType.caption,
    color: MoonSenseColors.NightGrey,
    marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    width: 4,
    borderRadius: 4,
    opacity: 0.9,
  },
});

export default ListCard;
