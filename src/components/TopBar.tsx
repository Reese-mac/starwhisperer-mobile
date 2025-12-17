import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MoonSenseColors } from '../constants/colors';

interface TopBarProps {
  city: string;
  onCityPress: () => void;
  onSettingsPress: () => void;
}

export function TopBar({ city, onCityPress, onSettingsPress }: TopBarProps) {
  return (
    <View style={styles.headerRow}>
      <TouchableOpacity onPress={onCityPress} activeOpacity={0.8}>
        <Text style={styles.locationLabel}>Observing</Text>
        <View style={styles.cityRow}>
          <Ionicons name="location-outline" size={18} color={MoonSenseColors.OnSurface} />
          <Text style={styles.city}>{city}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSettingsPress} accessibilityRole="button">
        <Ionicons name="settings-outline" size={22} color={MoonSenseColors.OnSurface} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  locationLabel: {
    color: MoonSenseColors.OnSurfaceMedium,
    fontSize: 12,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  city: {
    color: MoonSenseColors.OnSurface,
    fontWeight: '600',
    fontSize: 16,
  },
});
