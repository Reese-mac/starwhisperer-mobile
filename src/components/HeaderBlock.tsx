import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MoonSenseColors } from '../constants/colors';

interface HeaderBlockProps {
  temperature: string;
  city: string;
  description: string;
  cosmicWhisper: string;
  lastUpdated?: string;
  onMoonPress: () => void;
  onLongMoonPress: () => void;
  onCityPress: () => void;
  onSettingsPress: () => void;
  softLightMode?: boolean;
}

const HEADER_HEIGHT = 320;
const DAY_GRADIENT = ['#F4F1FF', '#E8E2FF'] as const;
const NIGHT_GRADIENT = ['#2C2A6F', '#4B3FA6'] as const;

const HeaderBlock = ({
  temperature,
  city,
  description,
  cosmicWhisper,
  lastUpdated,
  onMoonPress,
  onLongMoonPress,
  onCityPress,
  onSettingsPress,
  softLightMode = false,
}: HeaderBlockProps) => {
  const isNight = softLightMode;
  const gradientColors = isNight ? NIGHT_GRADIENT : DAY_GRADIENT;
  const primaryTextColor = isNight ? '#fff' : MoonSenseColors.CosmicPurple;
  const secondaryTextColor = isNight ? 'rgba(255,255,255,0.78)' : MoonSenseColors.NightGrey;
  const badgeBg = isNight ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.92)';
  const badgeText = isNight ? MoonSenseColors.MoonWhite : MoonSenseColors.CosmicPurple;

  return (
    <View style={styles.headerWrapper}>
      <LinearGradient colors={gradientColors} style={styles.headerBackground} />

      <View style={styles.headerContent}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onCityPress} activeOpacity={0.8}>
            <Text style={[styles.locationLabel, { color: secondaryTextColor }]}>Observing</Text>
            <View style={styles.cityRow}>
              <Ionicons name="location-outline" size={18} color={primaryTextColor} />
              <Text style={[styles.city, { color: primaryTextColor }]}>{city}</Text>
            </View>
            {lastUpdated && (
              <Text style={[styles.updatedAt, { color: secondaryTextColor }]}>
                Updated at {lastUpdated}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={onSettingsPress} accessibilityRole="button">
            <Ionicons name="settings-outline" size={22} color={primaryTextColor} />
          </TouchableOpacity>
        </View>

        <View style={styles.tempRow}>
          <Text style={[styles.temperature, { color: primaryTextColor }]}>{temperature}°</Text>
          <Text style={[styles.description, { color: secondaryTextColor }]}>{description}</Text>
        </View>

        <TouchableOpacity
          style={[styles.moonBadge, { backgroundColor: badgeBg }]}
          onPress={onMoonPress}
          onLongPress={onLongMoonPress}
          delayLongPress={240}
          accessibilityRole="button"
        >
          <Ionicons name="moon" size={18} color={isNight ? '#fff' : MoonSenseColors.CosmicPurple} />
          <Text style={[styles.moonBadgeText, { color: badgeText }]}>&nbsp;Hold for lunar whisper</Text>
        </TouchableOpacity>

        <View style={styles.whisperBox}>
          <Ionicons name="sparkles-outline" size={16} color={secondaryTextColor} />
          <Text style={[styles.cosmicWhisper, { color: secondaryTextColor }]}>{cosmicWhisper}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    position: 'relative',
    width: '100%',
    minHeight: HEADER_HEIGHT,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 56,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationLabel: {
    color: '#fff',
    opacity: 0.7,
    fontSize: 12,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  city: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  tempRow: {
    marginTop: 24,
  },
  temperature: {
    fontSize: 72,
    color: '#fff',
    fontWeight: '200',
    letterSpacing: 2,
  },
  description: {
    color: '#fff',
    fontSize: 16,
    marginTop: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  moonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MoonSenseColors.MoonWhite,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 20,
    gap: 8,
  },
  moonBadgeText: {
    fontSize: 13,
    color: MoonSenseColors.NightGrey,
    fontWeight: '600',
  },
  whisperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  cosmicWhisper: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  updatedAt: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.8,
  },
});

export default HeaderBlock;
