import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedCard from '../components/AnimatedCard';
import ForecastItem from '../components/ForecastItem';
import { MoonSenseColors } from '../constants/colors';
import { useSettings } from '../context/SettingsContext';
import { useWeatherData } from '../hooks/useWeatherData';

const HOURLY_CARD_WIDTH = 70;
const HOURLY_CARD_MARGIN = 6;
const HOURLY_SNAP_INTERVAL = HOURLY_CARD_WIDTH + HOURLY_CARD_MARGIN * 2;
const LIST_SIDE_PADDING = 16;

const DetailPill = ({
  icon,
  label,
  value,
  styles,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  styles: ReturnType<typeof createStyles>;
}) => (
  <View style={styles.detailPill}>
    <Ionicons name={icon} size={16} color={styles.detailValue.color} />
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const DayCard = ({
  item,
  isActive,
  onSelect,
  styles,
}: {
  item: any;
  isActive: boolean;
  onSelect: () => void;
  styles: ReturnType<typeof createStyles>;
}) => (
  <TouchableOpacity
    onPress={onSelect}
    style={[styles.dayCard, isActive && styles.dayCardActive]}
    activeOpacity={0.85}
  >
    <Text style={[styles.dayLabel, isActive && styles.dayLabelActive]}>{item.day}</Text>
    <Text style={[styles.dayDate, isActive && styles.dayLabelActive]}>{item.date}</Text>
    <Text style={[styles.dayTemp, isActive && styles.dayLabelActive]}>
      {item.high}/{item.low}
    </Text>
    <Text style={[styles.daySummary, isActive && styles.daySummaryActive]}>{item.summary}</Text>
  </TouchableOpacity>
);

const ForecastScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { softLightMode } = useSettings();
  const { data, refreshing, refetch } = useWeatherData();
  const styles = useMemo(() => createStyles(softLightMode), [softLightMode]);
  const scrollRef = useRef<ScrollView>(null);
  const dayListRef = useRef<FlatList<any>>(null);
  const hourlyListRef = useRef<FlatList<any>>(null);
  useScrollToTop(scrollRef);

  useFocusEffect(
    React.useCallback(() => {
      setSelectedIndex(0);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      try {
        dayListRef.current?.scrollToIndex({ index: 0, animated: true });
      } catch {
        /* ignore scroll errors */
      }
      requestAnimationFrame(() => {
        hourlyListRef.current?.scrollToOffset({ offset: 0, animated: false });
      });
      return undefined;
    }, []),
  );

  const daily = useMemo(() => data?.daily ?? [], [data]);
  const hourly = data?.hourly ?? [];
  const hasDailyData = daily.length > 0;
  const safeDaily = useMemo(() => {
    if (daily.length) return daily;
    if (!hourly.length) return [];
    const temps = hourly
      .map(item => parseInt(item.temp, 10))
      .filter(value => Number.isFinite(value)) as number[];
    const baseline = temps.length
      ? Math.round(temps.reduce((sum, value) => sum + value, 0) / temps.length)
      : 0;
    const makeEntry = (label: string, delta: number) => ({
      day: label,
      date: '',
      high: `${baseline + delta}°`,
      low: `${baseline + delta - 2}°`,
      icon: 'sun-cloud',
      humidity: '--',
      uv: '--',
      summary: 'Daily forecast unavailable; showing an hourly snapshot.',
    });
    return ['Today', 'Soon', 'Later'].map((label, index) => makeEntry(label, index - 1));
  }, [daily, hourly]);

  const hourlySnapOffsets = useMemo(
    () => hourly.map((_, index) => LIST_SIDE_PADDING + HOURLY_SNAP_INTERVAL * index),
    [hourly],
  );

  const selectedDay = useMemo(() => safeDaily[selectedIndex], [safeDaily, selectedIndex]);

  if (!data) {
    return (
      <View style={styles.loadingState}>
        <ActivityIndicator color={MoonSenseColors.CosmicPurple} size="large" />
        <Text style={{ color: MoonSenseColors.NightGrey, marginTop: 12 }}>Calling the weather oracles...</Text>
      </View>
    );
  }

  const handleRefresh = () => {
    setSelectedIndex(0);
    refetch();
    requestAnimationFrame(() => {
      hourlyListRef.current?.scrollToOffset({ offset: 0, animated: false });
      try {
        dayListRef.current?.scrollToIndex({ index: 0, animated: false });
      } catch {
        /* ignore scroll errors */
      }
    });
  };

  return (
    <ScrollView
      ref={scrollRef}
      style={[styles.container, { backgroundColor: softLightMode ? MoonSenseColors.NightGrey : MoonSenseColors.LunarGlow }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={MoonSenseColors.CosmicPurple} />}
    >
      <AnimatedCard index={0}>
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Weekly outlook</Text>
          <Text style={styles.heroSubtitle}>Tap a day to reveal rituals and conditions.</Text>
          {!hasDailyData ? <Text style={styles.fallbackNote}>Daily forecast not available; using an hourly snapshot.</Text> : null}
          <FlatList
            ref={dayListRef}
            data={safeDaily}
            keyExtractor={item => item.day}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dayList}
            renderItem={({ item, index }) => (
              <DayCard
                item={item}
                isActive={selectedIndex === index}
                onSelect={() => setSelectedIndex(index)}
                styles={styles}
              />
            )}
          />
        </View>
      </AnimatedCard>

      {selectedDay ? (
        <AnimatedCard index={1}>
          <View style={styles.detailCard}>
              <Text style={styles.sectionTitle}>{selectedDay.day} Ritual Brief</Text>
              <Text style={styles.detailSummary}>{selectedDay.summary}</Text>
              <View style={styles.pillRow}>
                <DetailPill icon="flame-outline" label="Feels like" value={selectedDay.high} styles={styles} />
                <DetailPill icon="snow-outline" label="Low" value={selectedDay.low} styles={styles} />
              </View>
              <View style={styles.pillRow}>
                <DetailPill icon="water-outline" label="Humidity" value={selectedDay.humidity} styles={styles} />
                <DetailPill icon="sunny-outline" label="UV" value={selectedDay.uv} styles={styles} />
              </View>
            </View>
          </AnimatedCard>
      ) : null}

      <AnimatedCard index={2}>
        <View style={[styles.hourlyContainer, softLightMode && styles.hourlyContainerDark]}>
          <View style={styles.hourlyHeader}>
            <Text style={styles.sectionTitle}>Hourly alignment</Text>
            <Text style={styles.sectionHint}>Best windows to step outside</Text>
          </View>
          <FlatList
            ref={hourlyListRef}
            horizontal
            data={hourly}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.time}
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
                  badge={index === 0 ? 'Now' : undefined}
                  softLightMode={softLightMode}
                />
              )}
            contentContainerStyle={[styles.forecastList, { paddingHorizontal: LIST_SIDE_PADDING }]}
          />
        </View>
      </AnimatedCard>
    </ScrollView>
  );
};

const createStyles = (softLightMode: boolean) => {
  const textPrimary = softLightMode ? MoonSenseColors.MoonWhite : MoonSenseColors.NightGrey;
  const textMuted = softLightMode ? 'rgba(255,255,255,0.7)' : MoonSenseColors.OrbitGrey;
  const cardBg = softLightMode ? 'rgba(255,255,255,0.08)' : MoonSenseColors.MistBlue;
  const surfaceBg = softLightMode ? MoonSenseColors.NightGrey : MoonSenseColors.LunarGlow;
  const detailBg = softLightMode ? 'rgba(255,255,255,0.08)' : MoonSenseColors.MoonWhite;
  const borderColor = softLightMode ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.08)';
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    contentContainer: {
      paddingTop: 60,
      paddingBottom: 60,
    },
    loadingState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: surfaceBg,
    },
    heroCard: {
      marginHorizontal: 16,
      borderRadius: 24,
      padding: 22,
      backgroundColor: cardBg,
      borderWidth: softLightMode ? 1 : 0,
      borderColor,
    },
    heroTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: textPrimary,
    },
    heroSubtitle: {
      color: textMuted,
      marginTop: 4,
    },
    fallbackNote: {
      marginTop: 8,
      color: textMuted,
    },
    dayList: {
      marginTop: 16,
      paddingRight: 16,
    },
    dayCard: {
      width: 140,
      borderRadius: 20,
      padding: 14,
      marginRight: 12,
      backgroundColor: detailBg,
      borderWidth: softLightMode ? 1 : 0,
      borderColor,
    },
    dayCardActive: {
      backgroundColor: MoonSenseColors.CosmicPurple,
      borderColor: MoonSenseColors.CosmicPurple,
    },
    dayLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: textPrimary,
    },
    dayLabelActive: {
      color: '#fff',
    },
    dayDate: {
      fontSize: 12,
      color: textMuted,
      marginTop: 2,
    },
    dayTemp: {
      fontSize: 18,
      fontWeight: '700',
      marginTop: 12,
      color: textPrimary,
    },
    daySummary: {
      fontSize: 12,
      marginTop: 8,
      color: textMuted,
    },
    daySummaryActive: {
      color: 'rgba(255,255,255,0.9)',
    },
    detailCard: {
      marginHorizontal: 16,
      marginTop: 24,
      borderRadius: 24,
      backgroundColor: detailBg,
      padding: 22,
      borderWidth: softLightMode ? 1 : 0,
      borderColor,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: textPrimary,
    },
    detailSummary: {
      color: textMuted,
      marginTop: 4,
    },
    pillRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 12,
    },
    detailPill: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: cardBg,
      borderRadius: 18,
      paddingHorizontal: 12,
      paddingVertical: 10,
      gap: 8,
      borderWidth: softLightMode ? 1 : 0,
      borderColor,
    },
    detailLabel: {
      fontSize: 12,
      color: textMuted,
      textTransform: 'uppercase',
    },
    detailValue: {
      fontSize: 14,
      fontWeight: '600',
      color: textPrimary,
    },
  hourlyContainer: {
    marginHorizontal: 16,
    marginTop: 32,
    paddingVertical: 12,
  },
  hourlyContainerDark: {
    backgroundColor: 'transparent',
  },
    hourlyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 12,
      paddingHorizontal: 8,
    },
    sectionHint: {
      color: textMuted,
    },
    forecastList: {
    },
  });
};

export default ForecastScreen;
