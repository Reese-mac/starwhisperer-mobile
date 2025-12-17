import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MoonSenseColors } from '../constants/colors';

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  drop: 'water-outline',
  thermo: 'thermometer-outline',
  wind: 'leaf-outline',
  sun: 'sunny-outline',
  leaf: 'leaf-outline',
  barometer: 'speedometer-outline',
  sunrise: 'sunny-outline',
  'sun-rain': 'rainy-outline',
};

const CardIcon = ({ icon }: { icon: string }) => (
  <View style={styles.iconContainer}>
    <Ionicons name={iconMap[icon] || 'planet-outline'} size={20} color={MoonSenseColors.OnSurfaceMedium} />
  </View>
);

export type InfoCardProps = {
  title: string;
  value: string;
  icon: string;
};

const splitValue = (raw: string) => {
  const trimmed = raw.trim();
  const match = trimmed.match(/^(-?\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { number: trimmed, unit: '' };
  return { number: match[1], unit: match[2] ?? '' };
};

const InfoCard = ({ title, value, icon }: InfoCardProps) => {
  const parsedValue = splitValue(value);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <CardIcon icon={icon} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.value}>
        <Text style={styles.valueNumber}>{parsedValue.number}</Text>
        {parsedValue.unit && <Text style={styles.valueUnit}>{parsedValue.unit}</Text>}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: MoonSenseColors.Surface,
    borderRadius: 18,
    padding: 16,
    flex: 1,
    margin: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    color: MoonSenseColors.OnSurfaceMedium,
    marginLeft: 10,
    fontWeight: '500',
  },
  value: {
    fontSize: 36,
    color: MoonSenseColors.OnSurface,
    marginTop: 4,
  },
  valueNumber: {
    fontWeight: '600',
  },
  valueUnit: {
    fontSize: 18,
    fontWeight: '500',
    color: MoonSenseColors.OnSurfaceDisabled,
    marginLeft: 2,
  },
});

export default InfoCard;
