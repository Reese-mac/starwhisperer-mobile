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

import AnimatedCard from '../components/AnimatedCard';
import ForecastItem from '../components/ForecastItem';
import HeaderBlock from '../components/HeaderBlock';
import InfoCard from '../components/InfoCard';
import MoonEnergyPopup from '../components/MoonEnergyPopup';
import { ScreenDecorations } from '../components/decorations/ScreenDecorations';

import { MoonSenseColors } from '../constants/colors';
import { SAMPLE_DATA_NOTICE, useWeatherData } from '../hooks/useWeatherData';
import { useSettings } from '../context/SettingsContext';

const HOURLY_CARD_WIDTH = 70;
const HOURLY_CARD_MARGIN = 6;
const HOURLY_SNAP_INTERVAL = HOURLY_CARD_WIDTH + HOURLY_CARD_MARGIN * 2;
const LIST_SIDE_PADDING = 16;

export default function HomeScreen() {
  const router = useRouter();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const { softLightMode } = useSettings();
  const { data, refreshing, refetch, error, lastUpdated } = useWeatherData();
  const isInfoBanner = error === SAMPLE_DATA_NOTICE;

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

  const { rangeText, weatherDetailsWithExpanded } = useMemo(() => {
    if (!data) return { rangeText: '', weatherDetailsWithExpanded: [] };

    const feelsLike = data.details.find(d => d.type === 'feelsLike');
    const range = data.daily?.[0]
      ? `${data.daily[0].high}° / ${data.daily[0].low}°`
      : '';
    const constructedRangeText = `${range}  Feels like ${feelsLike?.value ?? ''}°`;

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

  if (!data) {
    return (
      <View style={styles.loadingState}>
        <ActivityIndicator color={MoonSenseColors.Primary} size="large" />
        <Text style={styles.loadingText}>Preparing lunar briefing...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: MoonSenseColors.Background }}>
      <ScreenDecorations softLightMode={softLightMode} />
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={{ paddingTop: insets.top }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={MoonSenseColors.Primary}
          />
        }
      >
        <HeaderBlock
          city={data.header.city}
          temperature={data.header.temperature}
          description={data.header.description}
          rangeText={rangeText}
          onCityPress={() => router.push('/(tabs)/settings')}
          onSettingsPress={() => router.push('/(tabs)/settings')}
        />

        {/* Today - Hourly */}
        <AnimatedCard index={1}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Today</Text>

            <FlatList
              ref={hourlyListRef}
              data={data.hourly}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item: any) => item.time}
              snapToOffsets={useMemo(() => (data.hourly ?? []).map((_, index) => LIST_SIDE_PADDING + HOURLY_SNAP_INTERVAL * index), [data.hourly])}
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
                  badge={index === 0 ? 'Now' : undefined}
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
            {weatherDetailsWithExpanded.map((item: any, index) => (
              <AnimatedCard key={item.title} index={index + 2}>
                <InfoCard {...item} softLightMode={softLightMode} />
              </AnimatedCard>
            ))}
          </View>
        </View>

        {/* Moon Energy */}
        <AnimatedCard index={weatherDetailsWithExpanded.length + 3}>
          <View style={[styles.moonSummaryCard, { backgroundColor: MoonSenseColors.Surface }]}>
            <Text style={[styles.sectionTitle, { color: MoonSenseColors.OnSurface }]}>Moon Energy</Text>
            <Text style={[styles.summaryText, { color: MoonSenseColors.OnSurfaceMedium }]}>
              {data.advice?.advice || 'Tune into lunar calm.'}
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/moon')}
              style={[styles.summaryCta, { backgroundColor: MoonSenseColors.Primary }]}
            >
              <Text style={[styles.summaryCtaText, { color: MoonSenseColors.OnPrimary }]}>See more</Text>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: MoonSenseColors.OnSurface,
    marginBottom: 12,
    marginLeft: 24,
  },
  infoCardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: 8,
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
});
