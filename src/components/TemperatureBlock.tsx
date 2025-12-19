import React from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getMoonTheme } from '@/theme/moonTheme';
import { MoonType } from '@/theme/moonTypography';

type TemperatureBlockProps = {
  temperature: string;
  description: string;
  rangeText?: string;
  softLightMode: boolean;
  city?: string;
};

const formatTemperature = (value: string) => (value.includes('°') ? value : `${value}°`);

const cityBackgrounds: Record<string, any> = {
  sydney: require('../../assets/images/hero-sydney.jpg'),
  taipei: require('../../assets/images/hero-taipei.jpg'),
  banqiao: require('../../assets/images/hero-banqiao.jpg'),
  panchiao: require('../../assets/images/hero-banqiao.jpg'),
  los_angeles: require('../../assets/images/hero-losangeles.jpg'),
  'los angeles': require('../../assets/images/hero-losangeles.jpg'),
  london: require('../../assets/images/hero-london.jpg'),
  singapore: require('../../assets/images/hero-singapore.jpg'),
  tokyo: require('../../assets/images/hero-tokyo.jpg'),
  paris: require('../../assets/images/hero-paris.jpg'),
  usa: require('../../assets/images/hero-usa.jpg'),
  new_york: require('../../assets/images/hero-newyork.jpg'),
  'new york': require('../../assets/images/hero-newyork.jpg'),
};

const cityImageStyles: Record<string, any> = {
  taipei: { transform: [{ translateY: -200 }, { translateX: -150 }] },
  banqiao: { transform: [{ translateY: -200 }, { translateX: -150 }] },
  panchiao: { transform: [{ translateY: -200 }, { translateX: -150 }] },
  sydney: { transform: [{ translateY: -200 }, { translateX: -150 }] },
  los_angeles: { transform: [{ translateY: -200 }, { translateX: -150 }] },
  'los angeles': { transform: [{ translateY: -200 }, { translateX: -150 }] },
  london: { transform: [{ translateY: -200 }, { translateX: -150 }] },
  singapore: { transform: [{ translateY: -200 }, { translateX: -150 }] },
  tokyo: { transform: [{ translateY: -200 }, { translateX: -150 }] },
  paris: { transform: [{ translateY: -200 }, { translateX: -150 }] },
  usa: { transform: [{ translateY: -200 }, { translateX: -150 }] },
  new_york: { transform: [{ translateY: -200 }, { translateX: -150 }] },
  'new york': { transform: [{ translateY: -200 }, { translateX: -150 }] },
};

export const TemperatureBlock = ({ temperature, description, rangeText, softLightMode, city }: TemperatureBlockProps) => {
  const theme = getMoonTheme(softLightMode);
  const displayTemp = formatTemperature(temperature);
  const backgroundSource = city ? cityBackgrounds[city.toLowerCase()] : undefined;
  const imageAdjust = city ? cityImageStyles[city.toLowerCase()] : undefined;

  if (backgroundSource) {
    return (
      <ImageBackground
        source={backgroundSource}
        imageStyle={[styles.image, imageAdjust]}
        style={[styles.container, { borderColor: theme.border }]}
      >
        <View style={styles.overlay} />
        <View style={styles.content}>
          <View style={styles.tempRow}>
            <Text style={[styles.temperature, { color: '#fff' }]}>{displayTemp}</Text>
            <Ionicons name="moon-outline" size={22} color="#fff" />
          </View>
          <Text style={[styles.description, { color: '#fff' }]} numberOfLines={2}>
            {description}
          </Text>
          {rangeText ? (
            <Text style={[styles.range, { color: '#fff' }]} numberOfLines={1}>
              {rangeText}
            </Text>
          ) : null}
        </View>
      </ImageBackground>
    );
  }

  return (
    <LinearGradient colors={['#ffffff', '#e6e0ff', '#d4caff']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={[styles.container, { borderColor: theme.border }]}>
      <View style={styles.overlay} />
      <View style={styles.content}>
        <View style={styles.tempRow}>
          <Text style={[styles.temperature, { color: '#fff' }]}>{displayTemp}</Text>
          <Ionicons name="moon-outline" size={22} color="#fff" />
        </View>
        <Text style={[styles.description, { color: '#fff' }]} numberOfLines={2}>
          {description}
        </Text>
        {rangeText ? (
          <Text style={[styles.range, { color: '#fff' }]} numberOfLines={1}>
            {rangeText}
          </Text>
        ) : null}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 6,
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
    opacity: 0.9,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  content: {
    gap: 6,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  temperature: {
    ...MoonType.numberMetric,
    fontSize: 42,
  },
  description: {
    ...MoonType.body,
  },
  range: {
    ...MoonType.caption,
    marginTop: 2,
  },
});

export default TemperatureBlock;
