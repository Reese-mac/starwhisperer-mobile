import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getMoonTheme } from '@/theme/moonTheme';
import { MoonType } from '@/theme/moonTypography';

type StatusBannerProps = {
  message: string;
  softLightMode?: boolean;
};

const StatusBanner = ({ message, softLightMode = false }: StatusBannerProps) => {
  const theme = getMoonTheme(softLightMode);
  return (
    <View style={[styles.container, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
      <Ionicons name="sparkles-outline" size={16} color={theme.primary} style={styles.icon} />
      <Text style={[styles.text, { color: theme.text }]} numberOfLines={2}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    gap: 10,
  },
  icon: {
    marginTop: 1,
  },
  text: {
    flex: 1,
    ...MoonType.body,
  },
});

export default StatusBanner;

