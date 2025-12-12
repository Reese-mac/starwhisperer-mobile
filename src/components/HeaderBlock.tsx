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
}: HeaderBlockProps) => {
  return (
    <LinearGradient
      colors={[MoonSenseColors.CosmicPurple, MoonSenseColors.MoonLavender]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onCityPress} activeOpacity={0.8}>
          <Text style={styles.locationLabel}>Observing</Text>
          <View style={styles.cityRow}>
            <Ionicons name="location-outline" size={18} color="#fff" />
            <Text style={styles.city}>{city}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSettingsPress} accessibilityRole="button">
          <Ionicons name="settings-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.tempRow}>
        <Text style={styles.temperature}>{temperature}°</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <TouchableOpacity
        style={styles.moonBadge}
        onPress={onMoonPress}
        onLongPress={onLongMoonPress}
        delayLongPress={240}
        accessibilityRole="button"
      >
        <Ionicons name="moon" size={18} color={MoonSenseColors.CosmicPurple} />
        <Text style={styles.moonBadgeText}>Hold for lunar whisper</Text>
      </TouchableOpacity>

      <View style={styles.whisperBox}>
        <Ionicons name="sparkles-outline" size={16} color="#fff" />
        <Text style={styles.cosmicWhisper}>{cosmicWhisper}</Text>
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
