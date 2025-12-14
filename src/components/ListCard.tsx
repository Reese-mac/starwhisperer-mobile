import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MoonSenseColors } from '../constants/colors';

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
  const resolvedIcon = iconMap[icon] || 'cloud-outline';
  const cardBg = softLightMode ? 'rgba(255,255,255,0.08)' : backgroundColor;
  const textColor = softLightMode ? '#fff' : MoonSenseColors.NightGrey;
  const borderColor = softLightMode ? 'rgba(255,255,255,0.16)' : 'transparent';
  const iconColor = textColor;
  return (
    <View style={[styles.container, { backgroundColor: cardBg, borderColor, borderWidth: softLightMode ? 1 : 0 }]}>
      <View>
        <Text style={[styles.city, { color: textColor }]}>{city}</Text>
        <Text style={[styles.temperature, { color: textColor }]}>{temperature}</Text>
      </View>
      <Ionicons name={resolvedIcon} size={26} color={iconColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginVertical: 6,
    marginHorizontal: 16,
  },
  city: {
    fontSize: 20,
    fontWeight: 'bold',
    color: MoonSenseColors.NightGrey,
  },
  temperature: {
    fontSize: 14,
    color: MoonSenseColors.NightGrey,
    marginTop: 4,
  },
});

export default ListCard;
