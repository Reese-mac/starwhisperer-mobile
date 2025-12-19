import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Modal,
  Easing,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import AnimatedCard from '@/components/AnimatedCard';
import ForecastItem from '@/components/ForecastItem';
import { HeaderBlock } from '@/components/HeaderBlock';
import InfoCard from '@/components/InfoCard';
import MoonEnergyPopup from '@/components/MoonEnergyPopup';

import { MoonSenseColors } from '@/constants/colors';
import { useWeatherData } from '@/hooks/useWeatherData';
import { useSettings } from '@/context/SettingsContext';
import { getMoonTheme } from '@/theme/moonTheme';
import { MoonType } from '@/theme/moonTypography';

const HOURLY_CARD_WIDTH = 70;
const HOURLY_CARD_MARGIN = 6;
const HOURLY_SNAP_INTERVAL = HOURLY_CARD_WIDTH + HOURLY_CARD_MARGIN * 2;
const LIST_SIDE_PADDING = 16;
const MOOD_LINES = [
  'Slow your pace and listen to your breath.',
  'Leave a minute tonight for moonlight and yourself.',
  'Stay gentle; the world will feel softer too.',
];

export default function HomeScreen() {
  const router = useRouter();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const { softLightMode } = useSettings();
  const theme = useMemo(() => getMoonTheme(softLightMode), [softLightMode]);
  const { data, refreshing, refetch, lastUpdated } = useWeatherData();
  const moodLine = useMemo(() => {
    const dayIndex = new Date().getDate() % MOOD_LINES.length;
    return MOOD_LINES[dayIndex];
  }, []);

  const scrollRef = useRef<ScrollView>(null);
  const hourlyListRef = useRef<FlatList<any>>(null);

  useScrollToTop(scrollRef);
  const insets = useSafeAreaInsets();

  useFocusEffect(
    React.useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      requestAnimationFrame(() => {
        hourlyListRef.current?.scrollToOffset({ offset: 0, animated: false });
      });
      return undefined;
    }, []),
  );

  const handleRefresh = () => {
    refetch();
    requestAnimationFrame(() => {
      hourlyListRef.current?.scrollToOffset({ offset: 0, animated: false });
    });
  };

  const hourlySnapOffsets = useMemo(
    () => (data?.hourly ?? []).map((_, index) => LIST_SIDE_PADDING + HOURLY_SNAP_INTERVAL * index),
    [data?.hourly],
  );

  const { rangeText, weatherDetailsWithExpanded } = useMemo(() => {
    if (!data) return { rangeText: '', weatherDetailsWithExpanded: [] };

    const feelsLike = data.details.find(d => d.type === 'feelsLike');
    const range = data.daily?.[0]
      ? `${data.daily[0].high} / ${data.daily[0].low}`
      : '';
    const feelsValue = feelsLike?.value ?? '';
    const constructedRangeText = feelsValue ? `${range}  Feels like ${feelsValue}` : range;

    const details = data.details.map(item => {
      let expandedData;
      switch (item.type) {
        case 'airTemp': expandedData = data.tempTrend; break;
        case 'waterTemp': expandedData = data.waterTemp; break;
        case 'feelsLike': expandedData = data.advice; break;
        default: expandedData = undefined;
      }
      return { ...item, expandedData };
    });

    return { rangeText: constructedRangeText, weatherDetailsWithExpanded: details };
  }, [data]);

  const primaryMetrics = useMemo(
    () => weatherDetailsWithExpanded.filter((item: any) => item.type === 'feelsLike' || item.type === 'wind'),
    [weatherDetailsWithExpanded],
  );

  const secondaryMetrics = useMemo(
    () => weatherDetailsWithExpanded.filter((item: any) => item.type !== 'feelsLike' && item.type !== 'wind'),
    [weatherDetailsWithExpanded],
  );

  const [showWelcome, setShowWelcome] = useState(true);
  const welcomeOpacity = useRef(new Animated.Value(0)).current;
  const welcomeText = 'WELCOME TO MINIMAL MOON WEATHER';
  const letterAnims = useRef(welcomeText.split('').map(() => new Animated.Value(0))).current;
  const [welcomeColors, setWelcomeColors] = useState<string[]>([]);
  const blackFade = useRef(new Animated.Value(1)).current;
  const trailX = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;
  const welcomeSound = useRef<any>(null);
  const [skipping, setSkipping] = useState(false);

  const handleDismiss = React.useCallback(() => {
    if (skipping) return;
    setSkipping(true);
    Animated.timing(welcomeOpacity, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => setShowWelcome(false));
  }, [skipping, welcomeOpacity]);

  useEffect(() => {
    const compute = () => welcomeText.split('').map(() => '#FFFFFF');
    setWelcomeColors(compute());
    return undefined;
  }, [welcomeText]);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      (async () => {
        try {
          const { Audio } = await import('expo-av');
          const { sound } = await Audio.Sound.createAsync({
            uri: 'https://cdn.pixabay.com/download/audio/2022/10/09/audio_d5602aacb6.mp3?filename=sparkles-7180.mp3',
          });
          welcomeSound.current = sound;
          await sound.playAsync();
        } catch (err) {
          console.warn('welcome sound failed', err);
        }
      })();
    }

    if (!showWelcome) return undefined;
    Animated.timing(welcomeOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    Animated.stagger(
      40,
      letterAnims.map(anim =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ),
    ).start();
    Animated.timing(blackFade, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
    const trailLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(trailX, {
          toValue: screenWidth + 200,
          duration: 2400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(trailX, {
          toValue: -200,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    trailLoop.start();
    const timeout = setTimeout(() => handleDismiss(), 5000);
    return () => {
      clearTimeout(timeout);
      trailLoop.stop();
      if (Platform.OS !== 'web') {
        (async () => {
          try {
            await welcomeSound.current?.unloadAsync();
          } catch {
            /* ignore sound unload errors */
          }
          welcomeSound.current = null;
        })();
      }
    };
  }, [showWelcome, welcomeOpacity, letterAnims, blackFade, trailX, screenWidth, handleDismiss]);

  if (!data) {
    return (
      <View style={[styles.loadingState, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.primary} size="large" />
        <Text style={[styles.loadingText, { color: theme.textMuted }]}>Preparing lunar briefing...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        ref={scrollRef}
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 120 + insets.bottom }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.primary}
          />
        }
      >
        <View style={[styles.topArc, { backgroundColor: theme.surface }]}>
          <View style={styles.headerWrapper}>
            <HeaderBlock
              city={data.header.city}
              temperature={data.header.temperature}
              description={data.header.description}
              rangeText={rangeText}
              softLightMode={softLightMode}
              onCityPress={() => router.push('/(tabs)/settings')}
              onSettingsPress={() => router.push('/(tabs)/settings')}
            />
          </View>
          <AnimatedCard index={0.5}>
            <View style={[styles.moodCard, { backgroundColor: 'transparent', borderColor: 'transparent' }]}>
              <Text style={[styles.moodTitle, { color: theme.text }]}>Moon note</Text>
              <Text style={[styles.moodLine, { color: theme.textMuted }]}>{moodLine}</Text>
              {lastUpdated ? (
                <Text style={[styles.moodTimestamp, { color: theme.textMuted }]}>Updated at {lastUpdated}</Text>
              ) : null}
            </View>
          </AnimatedCard>
        </View>

        {/* Today - Hourly */}
        <AnimatedCard index={1}>
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Today</Text>

            <FlatList
              ref={hourlyListRef}
              data={data.hourly}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item: any) => item.time}
              snapToOffsets={hourlySnapOffsets}
              snapToAlignment="start"
              decelerationRate="fast"
              disableIntervalMomentum
              getItemLayout={(_, index) => ({
                length: HOURLY_SNAP_INTERVAL,
                offset: LIST_SIDE_PADDING + HOURLY_SNAP_INTERVAL * index,
                index,
              })}
              renderItem={({ item, index }) => (
                <ForecastItem
                  time={item.time}
                  icon={item.icon}
                  temperature={item.temp}
                  badge={undefined}
                  hint={item.icon?.includes('rain') ? 'Rain' : undefined}
                  softLightMode={softLightMode}
                />
              )}
              contentContainerStyle={{ paddingHorizontal: LIST_SIDE_PADDING }}
            />
          </View>
        </AnimatedCard>

        {/* Info Cards */}
        <View style={styles.sectionContainer}>
          <View style={styles.infoCardGrid}>
            <View style={styles.primaryMetricRow}>
              {primaryMetrics.map((item: any, index: number) => (
                <View key={item.title} style={styles.primaryMetricWrap}>
                  <AnimatedCard index={index + 2}>
                    <InfoCard {...item} softLightMode={softLightMode} variant="primary" />
                  </AnimatedCard>
                </View>
              ))}
            </View>

            <View style={styles.secondaryMetricRow}>
              {secondaryMetrics.map((item: any, index: number) => (
                <View key={item.title} style={styles.secondaryMetricWrap}>
                  <AnimatedCard index={index + 2 + primaryMetrics.length}>
                    <InfoCard {...item} softLightMode={softLightMode} variant="secondary" />
                  </AnimatedCard>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Moon Energy */}
        <AnimatedCard index={weatherDetailsWithExpanded.length + 3}>
          <View style={[styles.moonSummaryCard, { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Moon Energy</Text>
            <Text style={[styles.summaryText, { color: theme.textMuted }]}>
              {data.advice?.advice || 'Tune into lunar calm.'}
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/moon')}
              style={[styles.summaryCta, { backgroundColor: theme.primary }]}
            >
              <Text style={[styles.summaryCtaText, { color: '#fff' }]}>See more</Text>
            </TouchableOpacity>
          </View>
        </AnimatedCard>
      </ScrollView>

      <MoonEnergyPopup
        isVisible={isPopupVisible}
        onClose={() => setIsPopupVisible(false)}
        message={data.advice?.advice ?? 'Embrace the cosmic vibes.'}
      />
      {showWelcome ? (
        <Modal visible transparent={false} animationType="fade" onRequestClose={handleDismiss}>
          <Animated.View style={[styles.welcomeOverlay, { opacity: welcomeOpacity }]}>
            <LinearGradient
              colors={['#ffffff', '#e6e0ff', '#d4caff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.welcomeOverlay}
            >
              <View style={styles.welcomeLetters}>
                {welcomeText.split('').map((char, idx) => (
                  <Animated.Text
                    key={`${char}-${idx}`}
                    style={[
                      styles.welcomeText,
                      {
                        color: welcomeColors[idx],
                        opacity: letterAnims[idx],
                        transform: [
                          {
                            translateY: letterAnims[idx].interpolate({
                              inputRange: [0, 1],
                              outputRange: [10, 0],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    {char}
                  </Animated.Text>
                ))}
              </View>
              <Animated.View
                style={[
                  styles.trail,
                  {
                    transform: [{ translateX: trailX }],
                  },
                ]}
              />
              <Animated.View style={[styles.blackFade, { opacity: blackFade }]} />
              <TouchableOpacity style={styles.skipButton} onPress={handleDismiss}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        </Modal>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MoonSenseColors.Background,
  },
  loadingText: {
    marginTop: 12,
    color: MoonSenseColors.OnSurfaceMedium,
  },
  sectionContainer: {
    marginTop: 24,
  },
  topArc: {
    borderBottomLeftRadius: 56,
    borderBottomRightRadius: 56,
    overflow: 'visible',
    paddingBottom: 32,
  },
  headerWrapper: {
    position: 'relative',
    paddingBottom: 10,
  },
  headerArt: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 110,
    height: 110,
    borderRadius: 12,
    opacity: 0.9,
  },
  sectionTitle: {
    ...MoonType.sectionTitle,
    marginBottom: 12,
    marginLeft: 16,
    textAlign: 'left',
  },
  infoCardGrid: {
    marginHorizontal: 16,
  },
  primaryMetricRow: {
    flexDirection: 'column',
    gap: 10,
  },
  primaryMetricWrap: {
    width: '100%',
  },
  secondaryMetricRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  secondaryMetricWrap: {
    flexBasis: '48%',
    maxWidth: '48%',
  },
  moonSummaryCard: {
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E5FF',
    gap: 8,
    alignItems: 'flex-start',
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 22,
    marginVertical: 4,
    textAlign: 'left',
    width: '100%',
  },
  summaryCta: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },
  summaryCtaText: {
    fontWeight: '700',
  },
  moodCard: {
    marginTop: 6,
    marginHorizontal: 0,
    marginBottom: 18,
    padding: 16,
    borderRadius: 22,
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: '92%',
    alignSelf: 'center',
  },
  moodLeft: {},
  envelopeCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  moodTitle: {
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.2,
  },
  moodLine: {
    fontSize: 13,
    marginTop: 6,
    maxWidth: 240,
    textAlign: 'center',
    lineHeight: 19,
  },
  moodTimestamp: {
    marginTop: 10,
    fontSize: 12,
    letterSpacing: 0.1,
  },
  welcomeOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    gap: 16,
  },
  welcomeText: {
    ...MoonType.sectionTitle,
    color: '#FFFFFF',
    letterSpacing: 1.4,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  welcomeLetters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  trail: {
    position: 'absolute',
    top: '45%',
    left: -200,
    width: 200,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  blackFade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  skipButton: {
    position: 'absolute',
    bottom: 36,
    right: 24,
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
    shadowColor: 'transparent',
  },
  skipText: {
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: 0.6,
  },
});
