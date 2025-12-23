import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { getMoonTheme } from '../theme/moonTheme';
import { MoonType } from '../theme/moonTypography';

const theme = getMoonTheme(false);

const WeatherHeaderScreen = () => {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const primaryImage =
    'https://svs.gsfc.nasa.gov/vis/a000000/a005000/a005048/frames/5760x3240_16x9_30p/fancy/comp.8568.tif';

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: imageError
            ? 'https://svs.gsfc.nasa.gov/vis/a000000/a005000/a005048/frames/730x730_1x1_30p/moon.0750.jpg'
            : primaryImage,
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
        onError={() => setImageError(true)}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.45)', 'rgba(0,0,0,0.65)']}
          style={styles.gradientOverlay}
        >
          <View style={styles.content}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>MinimalMoon Weather</Text>
              <Text style={styles.subtitle}>Your cosmic weather companion</Text>
            </View>
          </View>

          <View style={styles.ctaContainer}>
            <Text style={[styles.subtitle, { textAlign: 'center', marginBottom: 12 }]}>
              Step into the forecast
            </Text>
            <Text style={styles.ctaHint}>
              Tap to open the full experience.
            </Text>
            <View style={{ height: 14 }} />
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/home')}
              activeOpacity={0.9}
              style={[styles.ctaButton, { backgroundColor: theme.primary }]}
            >
              <Text style={styles.ctaButtonText}>Enter app</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  gradientOverlay: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  textContainer: {
    flex: 1,
  },
  illustrationContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    ...MoonType.screenTitle,
    color: '#fff',
    fontSize: 48,
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    ...MoonType.sectionTitle,
    color: '#fff',
    fontSize: 24,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  ctaContainer: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  ctaHint: {
    fontSize: 14,
    textAlign: 'center',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  ctaButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default WeatherHeaderScreen;
