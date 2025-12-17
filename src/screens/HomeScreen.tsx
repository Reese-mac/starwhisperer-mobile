import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
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

  /** ⭐ 核心：每次回到 Home，自動把 Today 小時列表拉回最左 */
  useFocusEffect(
    React.useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });

      requestAnimationFrame(() => {
        hourlyListRef.current?.scrollToOffset({
          offset: 0,
          animated: false,
        });
      });

      return undefined;
    }, []),
  );

  const handleRefresh = () => {
    refetch();

    requestAnimationFrame(() => {
      hourlyListRef.current?.scrollToOffset({
        offset: 0,
        animated: false,
      });
    });
  };

  const hourlySnapOffsets = useMemo(
    () => (data?.hourly ?? []).map((_, index) => LIST_SIDE_PADDING + HOURLY_SNAP_INTERVAL * index),
    [data?.hourly],
  );

  const weatherDetailsWithExpanded = useMemo(() => {
    if (!data) return [];
    return data.details.map(item => {
      let expandedData;
      switch (item.type) {
        case 'airTemp':
          expandedData = data.tempTrend;
          break;
        case 'waterTemp':
          expandedData = data.waterTemp;
          break;
        case 'feelsLike':
          expandedData = data.advice;
          break;
        default:
          expandedData = undefined;
      }
      return { ...item, expandedData };
    });
  }, [data]);

  if (!data) {
    return (
      <View style={styles.loadingState}>
        <ActivityIndicator color={MoonSenseColors.CosmicPurple} size="large" />
        <Text style={styles.loadingText}>Preparing lunar briefing...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: softLightMode ? MoonSenseColors.NightGrey : MoonSenseColors.LunarGlow }}>
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={MoonSenseColors.CosmicPurple}
          />
        }
      >
        {/* Header */}
        <AnimatedCard index={0}>
          <HeaderBlock
            temperature={data.header.temperature}
            city={data.header.city}
            description={data.header.description}
            cosmicWhisper={data.header.cosmicWhisper}
            lastUpdated={lastUpdated}
            onMoonPress={() => router.push('/modal')}
            onLongMoonPress={() => setIsPopupVisible(true)}
            onCityPress={() => router.push('/(tabs)/settings')}
            onSettingsPress={() => router.push('/(tabs)/settings')}
            softLightMode={softLightMode}
          />

          {error && (
            <View
              style={[
                styles.statusBanner,
                isInfoBanner ? styles.statusBannerInfo : styles.statusBannerError,
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  isInfoBanner ? styles.statusDotInfo : styles.statusDotError,
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  isInfoBanner ? styles.statusTextInfo : styles.statusTextError,
                ]}
              >
                {error}
              </Text>
            </View>
          )}
        </AnimatedCard>

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
              snapToOffsets={hourlySnapOffsets}
              snapToAlignment="start"
              decelerationRate="fast"
              disableIntervalMomentum
              getItemLayout={(_, index) => ({
                length: HOURLY_SNAP_INTERVAL,
                offset: LIST_SIDE_PADDING + HOURLY_SNAP_INTERVAL * index,
                index,
              })}
              renderItem={({ item, index }) => {
                const badge = index === 0 ? 'Now' : index === 1 ? '+1h' : undefined;
                const hint = item.uv ? 'UV' : item.icon?.includes('rain') ? 'Rain' : undefined;

                return (
                  <ForecastItem
                    time={item.time}
                    icon={item.icon}
                    temperature={item.temp}
                    badge={badge}
                    hint={hint}
                    softLightMode={softLightMode}
                  />
                );
              }}
              contentContainerStyle={{
                paddingHorizontal: LIST_SIDE_PADDING,
              }}
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
          <View
            style={[
              styles.moonSummaryCard,
              softLightMode && {
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.25)',
              },
            ]}
          >
            <Text style={[styles.sectionTitle, softLightMode && { color: '#fff' }]}>Moon Energy</Text>
            <Text style={[styles.summaryText, softLightMode && { color: 'rgba(255,255,255,0.85)' }]}>
              {data.advice?.advice || 'Tune into lunar calm.'}
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/moon')}
              style={[styles.summaryCta, softLightMode && { backgroundColor: '#7C68FF' }]}
            >
              <Text style={styles.summaryCtaText}>See more</Text>
            </TouchableOpacity>
          </View>
        </AnimatedCard>
      </ScrollView>

      <MoonEnergyPopup
        isVisible={isPopupVisible}
        onClose={() => setIsPopupVisible(false)}
        message={data.advice?.advice ?? 'Embrace the cosmic vibes.'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    // Removed paddingVertical to allow dynamic paddingTop from safe area insets
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MoonSenseColors.LunarGlow,
  },
  loadingText: {
    marginTop: 12,
    color: MoonSenseColors.NightGrey,
  },
  sectionContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: MoonSenseColors.NightGrey,
    marginBottom: 12,
    marginLeft: 24,
  },
  infoCardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  updatedAt: {
    marginTop: 8,
    textAlign: 'center',
    color: MoonSenseColors.NightGrey,
    opacity: 0.7,
  },
  statusBanner: {
    marginTop: 10,
    marginHorizontal: 24,
    padding: 10,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBannerInfo: {
    backgroundColor: '#F3EDFF',
    borderWidth: 1,
    borderColor: '#DDD0FF',
  },
  statusBannerError: {
    backgroundColor: '#FCEDEA',
    borderWidth: 1,
    borderColor: '#F5B7A6',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusDotInfo: {
    backgroundColor: MoonSenseColors.CosmicPurple,
  },
  statusDotError: {
    backgroundColor: '#C0392B',
  },
  statusText: {
    flex: 1,
    fontSize: 13,
  },
  statusTextInfo: {
    color: MoonSenseColors.NightGrey,
  },
  statusTextError: {
    color: '#C0392B',
  },
  moonSummaryCard: {
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 18,
    backgroundColor: MoonSenseColors.MoonLavender,
    borderWidth: 0,
  },
  summaryText: {
    fontSize: 14,
    color: MoonSenseColors.NightGrey,
    marginVertical: 8,
  },
  summaryCta: {
    alignSelf: 'flex-start',
    backgroundColor: MoonSenseColors.CosmicPurple,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  summaryCtaText: {
    color: '#fff',
    fontWeight: '600',
  },
});
