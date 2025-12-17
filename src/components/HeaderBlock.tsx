import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MoonSenseColors } from '../constants/colors';

interface HeaderBlockProps {
  temperature: string;
  city: string;
  description: string;
  cosmicWhisper: string;
  lastUpdated?: string;
  statusMessage?: string;
  statusVariant?: 'info' | 'error';
  onMoonPress: () => void;
  onLongMoonPress: () => void;
  onCityPress: () => void;
  onSettingsPress: () => void;
  softLightMode?: boolean;
}

const HEADER_HEIGHT = 360;

const DAY_GRADIENT = [MoonSenseColors.CosmicPurple, MoonSenseColors.MoonLavender] as const;
const NIGHT_GRADIENT = ['#2C2A6F', '#4B3FA6'] as const;

const HeaderBlock = ({
  temperature,
  city,
  description,
  cosmicWhisper,
  lastUpdated,
  statusMessage,
  statusVariant = 'info',
  onMoonPress,
  onLongMoonPress,
  onCityPress,
  onSettingsPress,
  softLightMode = false,
}: HeaderBlockProps) => {
  const isNight = softLightMode;
  const gradientColors = isNight ? NIGHT_GRADIENT : DAY_GRADIENT;
  const textColor = '#fff';
  const badgeBg = MoonSenseColors.MoonWhite;
  const badgeText = MoonSenseColors.NightGrey;

  return (
    <View style={styles.headerWrapper}>
      <LinearGradient colors={gradientColors} style={styles.headerBackground} />

      <View style={styles.headerContent}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onCityPress} activeOpacity={0.8}>
            <Text style={[styles.locationLabel, { color: textColor, opacity: 0.7 }]}>Observing</Text>
            <View style={styles.cityRow}>
              <Ionicons name="location-outline" size={18} color={textColor} />
              <Text style={[styles.city, { color: textColor }]}>{city}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSettingsPress} accessibilityRole="button">
            <Ionicons name="settings-outline" size={22} color={textColor} />
          </TouchableOpacity>
        </View>

        <View style={styles.tempRow}>
          <Text style={[styles.temperature, { color: textColor }]}>{temperature}°</Text>
          <Text style={[styles.description, { color: textColor }]}>{description}</Text>
        </View>

        <TouchableOpacity
          style={[styles.moonBadge, { backgroundColor: badgeBg }]}
          onPress={onMoonPress}
          onLongPress={onLongMoonPress}
          delayLongPress={240}
          accessibilityRole="button"
        >
          <Ionicons name="moon" size={18} color={MoonSenseColors.CosmicPurple} />
          <Text style={[styles.moonBadgeText, { color: badgeText }]}>&nbsp;Hold for lunar whisper</Text>
        </TouchableOpacity>

        <View style={styles.whisperBox}>
          <Ionicons name="sparkles-outline" size={16} color={textColor} />
          <Text style={[styles.cosmicWhisper, { color: textColor }]}>{cosmicWhisper}</Text>
        </View>

        {(lastUpdated || statusMessage) && (
          <View style={styles.footer}>
            {lastUpdated ? <Text style={styles.footerUpdatedAt}>Updated at {lastUpdated}</Text> : null}
            {statusMessage ? (
              <View style={[styles.statusBanner, statusVariant === 'error' && styles.statusBannerError]}>
                <View style={[styles.statusDot, statusVariant === 'error' && styles.statusDotError]} />
                <Text style={styles.statusText}>{statusMessage}</Text>
              </View>
            ) : null}
          </View>
        )}
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
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
    zIndex: 2,
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
    zIndex: 3,
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
  footer: {
    marginTop: 18,
    zIndex: 3,
  },
  footerUpdatedAt: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
  },
  statusBanner: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  statusBannerError: {
    backgroundColor: 'rgba(255, 90, 90, 0.16)',
    borderColor: 'rgba(255, 160, 160, 0.28)',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  statusDotError: {
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  statusText: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255,255,255,0.92)',
  },
});

export default HeaderBlock;
