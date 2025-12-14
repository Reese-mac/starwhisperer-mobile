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
  onMoonPress: () => void;
  onLongMoonPress: () => void;
  onCityPress: () => void;
  onSettingsPress: () => void;
  softLightMode?: boolean;
}

const HeaderBlock = ({
  temperature,
  city,
  description,
  cosmicWhisper,
  onMoonPress,
  onLongMoonPress,
  onCityPress,
  onSettingsPress,
  softLightMode = false,
}: HeaderBlockProps) => {
  const gradientColors = softLightMode
    ? ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.04)']
    : [MoonSenseColors.CosmicPurple, MoonSenseColors.MoonLavender];
  const textColor = softLightMode ? '#fff' : '#fff';
  const badgeBg = softLightMode ? 'rgba(255,255,255,0.14)' : MoonSenseColors.MoonWhite;
  const badgeText = softLightMode ? MoonSenseColors.MoonWhite : MoonSenseColors.NightGrey;
  const containerBg = softLightMode ? 'rgba(255,255,255,0.06)' : undefined;
  const containerBorder = softLightMode ? { borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' } : null;

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, containerBg ? { backgroundColor: containerBg } : null, containerBorder]}
    >
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
        <Ionicons name="moon" size={18} color={softLightMode ? '#fff' : MoonSenseColors.CosmicPurple} />
        <Text style={[styles.moonBadgeText, { color: badgeText }]}>&nbsp;Hold for lunar whisper</Text>
      </TouchableOpacity>

      <View style={styles.whisperBox}>
        <Ionicons name="sparkles-outline" size={16} color={textColor} />
        <Text style={[styles.cosmicWhisper, { color: textColor }]}>{cosmicWhisper}</Text>
      </View>

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 30,
    padding: 24,
    marginHorizontal: 16,
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
});

export default HeaderBlock;
