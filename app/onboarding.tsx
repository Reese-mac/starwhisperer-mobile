import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MoonSenseColors } from '../src/constants/colors';

const { width } = Dimensions.get('window');

const ONBOARDING_PAGES = [
  {
    key: '1',
    title: 'Welcome to your\nMoon Weather Ritual.',
    logo: 'Star Whisperer',
  },
  {
    key: '2',
    title: 'In each moment, you can feel:',
    features: [
      { icon: 'moon-outline', name: 'The Moon' },
      { icon: 'thermometer-outline', name: 'Air Temperature' },
      { icon: 'water-outline', name: 'Water Temperature' },
      { icon: 'sparkles-outline', name: 'Cosmic Whisper' },
    ],
  },
  {
    key: '3',
    title: 'A calmer way\nto feel the day.',
  },
] as const;

type OnboardingPageType = (typeof ONBOARDING_PAGES)[number];

const OnboardingPage = ({ item, onStart }: { item: OnboardingPageType; onStart: () => void }) => {
  const glowAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (item.key === '1') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0.5, duration: 1500, useNativeDriver: true }),
        ]),
      ).start();
    }
  }, [glowAnim, item.key]);

  return (
    <View style={styles.pageContainer}>
      {item.logo && (
        <View style={styles.logoContainer}>
          <Animated.View style={[styles.glow, { opacity: glowAnim }]} />
          <Text style={styles.logo}>{item.logo}</Text>
        </View>
      )}
      <Text style={styles.title}>{item.title}</Text>
      {item.features && (
        <View style={styles.featureList}>
          {item.features.map(feature => (
            <View key={feature.name} style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name={feature.icon as keyof typeof Ionicons.glyphMap} size={20} color="#fff" />
              </View>
              <Text style={styles.featureName}>{feature.name}</Text>
            </View>
          ))}
        </View>
      )}
      {item.key === '3' && (
        <TouchableOpacity style={styles.startButton} onPress={onStart}>
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOnComplete = async () => {
    try {
      await AsyncStorage.setItem('onboarding_done', 'true');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Failed to save onboarding status.', error);
      router.replace('/(tabs)');
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleOnComplete}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
      <FlatList
        data={ONBOARDING_PAGES}
        renderItem={({ item }) => <OnboardingPage item={item} onStart={handleOnComplete} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        keyExtractor={item => item.key}
      />
      <View style={styles.pagination}>
        {ONBOARDING_PAGES.map((_, index) => (
          <View
            key={index.toString()}
            style={[styles.dot, currentIndex === index ? styles.dotActive : undefined]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MoonSenseColors.SoftIndigo },
  pageContainer: { width, flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  logoContainer: { alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 120 },
  glow: { width: 200, height: 200, borderRadius: 100, backgroundColor: MoonSenseColors.MoonLavender, position: 'absolute' },
  logo: { fontSize: 28, fontWeight: 'bold', color: MoonSenseColors.CosmicPurple },
  title: { fontSize: 32, fontWeight: '700', color: MoonSenseColors.NightGrey, textAlign: 'center', marginBottom: 40 },
  featureList: { alignItems: 'flex-start' },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureName: { fontSize: 18, color: MoonSenseColors.NightGrey },
  startButton: { backgroundColor: MoonSenseColors.CosmicPurple, paddingHorizontal: 40, paddingVertical: 16, borderRadius: 30, position: 'absolute', bottom: 80 },
  startButtonText: { color: MoonSenseColors.MoonWhite, fontSize: 18, fontWeight: 'bold' },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 40,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    backgroundColor: MoonSenseColors.CosmicPurple,
    width: 20,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 24,
    zIndex: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  skipText: {
    color: MoonSenseColors.MoonWhite,
    fontWeight: '600',
  },
});
