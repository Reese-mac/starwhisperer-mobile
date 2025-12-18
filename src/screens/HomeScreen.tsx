import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import AnimatedCard from '../components/AnimatedCard';
import ForecastItem from '../components/ForecastItem';
import { HeaderBlock } from '../components/HeaderBlock';
import InfoCard from '../components/InfoCard';
import MoonEnergyPopup from '../components/MoonEnergyPopup';

import { MoonSenseColors } from '../constants/colors';
import { useWeatherData } from '../hooks/useWeatherData';
import { useSettings } from '../context/SettingsContext';
import { getMoonTheme } from '../theme/moonTheme';
import { MoonType } from '../theme/moonTypography';

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
                  hint={item.uv ? 'UV' : item.icon?.includes('rain') ? 'Rain' : undefined}
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
    overflow: 'hidden',
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
    marginLeft: 24,
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
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 18,
  },
  summaryText: {
    fontSize: 14,
    marginVertical: 8,
  },
  summaryCta: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  summaryCtaText: {
    fontWeight: '600',
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
});
