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
};

const ListCard = ({ city, temperature, icon, backgroundColor }: ListCardProps) => {
  const resolvedIcon = iconMap[icon] || 'cloud-outline';
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View>
        <Text style={styles.city}>{city}</Text>
        <Text style={styles.temperature}>{temperature}</Text>
      </View>
      <Ionicons name={resolvedIcon} size={26} color={MoonSenseColors.NightGrey} />
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
