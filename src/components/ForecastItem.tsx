import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMoonTheme } from '../theme/moonTheme';
import { MoonType } from '../theme/moonTypography';

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  sun: 'sunny-outline',
  'sun-cloud': 'partly-sunny-outline',
  cloud: 'cloud-outline',
  rain: 'rainy-outline',
  wind: 'leaf-outline',
  moon: 'moon-outline',
};

const ForecastIcon = ({ icon, color }: { icon: string; color: string }) => {
  const resolvedIcon = iconMap[icon] || 'cloud-outline';
  return <Ionicons name={resolvedIcon} size={24} color={color} />;
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
  const theme = getMoonTheme(softLightMode);
  const [timeTop, timeBottom] = time.split(' ');
  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {badge ? (
        <View style={[styles.badge, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
          <Text style={[styles.badgeText, { color: theme.primary }]}>{badge}</Text>
        </View>
      ) : null}
      <View style={styles.timeBlock}>
        <Text style={[styles.timeTop, { color: theme.textMuted }]}>{timeTop}</Text>
        {timeBottom ? <Text style={[styles.timeBottom, { color: theme.textMuted }]}>{timeBottom}</Text> : null}
      </View>
      <ForecastIcon icon={icon} color={theme.text} />
      <Text style={[styles.temperature, { color: theme.text }]}>{temperature}°</Text>
      {hint && <Text style={[styles.hint, { color: theme.textMuted }]}>{hint}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginHorizontal: 6,
    width: 70,
    height: 140,
    borderWidth: 1,
  },
  time: {
    ...MoonType.caption,
    fontWeight: '600',
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'center',
  },
  timeBlock: {
    alignItems: 'center',
    gap: 2,
  },
  timeTop: {
    ...MoonType.caption,
    fontWeight: '600',
  },
  timeBottom: {
    ...MoonType.caption,
    fontWeight: '600',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  temperature: {
    ...MoonType.numberSmall,
  },
  hint: {
    ...MoonType.caption,
  },
});

export default ForecastItem;
