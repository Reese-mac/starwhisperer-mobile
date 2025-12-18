import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMoonTheme } from '../theme/moonTheme';
import { MoonType } from '../theme/moonTypography';

interface TopBarProps {
  city: string;
  onCityPress: () => void;
  onSettingsPress: () => void;
  softLightMode: boolean;
}

export function TopBar({ city, onCityPress, onSettingsPress, softLightMode }: TopBarProps) {
  const theme = getMoonTheme(softLightMode);
  return (
    <View style={styles.headerRow}>
      <TouchableOpacity onPress={onCityPress} activeOpacity={0.8} style={styles.cityBlock}>
        <Text style={[styles.locationLabel, { color: theme.textMuted }]}>Observing</Text>
        <View style={styles.cityRow}>
          <Text style={[styles.city, { color: theme.text }]}>{city}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onSettingsPress}
        accessibilityRole="button"
        style={[styles.iconPill, styles.settingsButton, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}
      >
        <Ionicons name="settings-outline" size={20} color={theme.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  cityBlock: {
    alignItems: 'center',
    gap: 4,
  },
  locationLabel: {
    ...MoonType.labelCaps,
    letterSpacing: 1,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  city: {
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  iconPill: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  settingsButton: {
    position: 'absolute',
    right: 20,
    top: 16,
  },
});
