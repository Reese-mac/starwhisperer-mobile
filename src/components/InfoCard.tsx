import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMoonTheme } from '@/theme/moonTheme';
import { MoonType } from '@/theme/moonTypography';

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  drop: 'water-outline',
  thermo: 'thermometer-outline',
  wind: 'navigate-outline',
  sun: 'sunny-outline',
  leaf: 'leaf-outline',
  barometer: 'speedometer-outline',
  sunrise: 'time-outline',
  time: 'time-outline',
  'sun-rain': 'rainy-outline',
};

export type InfoCardProps = {
  title: string;
  value: string;
  icon: string;
  backgroundColor?: string;
  softLightMode?: boolean;
  variant?: 'primary' | 'secondary';
};

const InfoCard = ({ title, value, icon, backgroundColor, softLightMode = false, variant = 'secondary' }: InfoCardProps) => {
  const theme = useMemo(() => getMoonTheme(softLightMode), [softLightMode]);
  const cardBg = theme.surface;
  const iconFill = backgroundColor ?? theme.primarySoft;
  const iconSize = icon === 'sunrise' ? 16 : 20;
  const resolvedIcon = icon === 'sunrise' ? 'time' : icon;

  return (
    <View style={[styles.cardContainer, { backgroundColor: cardBg, borderColor: theme.border }]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: iconFill, borderColor: theme.border }]}>
          <Ionicons name={iconMap[resolvedIcon] || 'planet-outline'} size={iconSize} color={theme.text} />
        </View>
        <Text style={[styles.title, { color: theme.textMuted }]}>{title}</Text>
      </View>
      <Text style={[styles.valueNumber, { color: theme.text }]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    padding: 16,
    flex: 1,
    margin: 8,
    borderWidth: 1,
    overflow: 'hidden',
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
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  title: {
    marginLeft: 10,
    fontWeight: '500',
    ...MoonType.labelCaps,
    textTransform: 'none',
    letterSpacing: 0.6,
  },
  valueNumber: {
    ...MoonType.numberMetric,
  },
});

export default InfoCard;
