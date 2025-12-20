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
import AnimatedCard from '@/components/AnimatedCard';
import ForecastItem from '@/components/ForecastItem';
import { useSettings } from '@/context/SettingsContext';
import { useWeatherData } from '@/hooks/useWeatherData';
import { getMoonTheme } from '@/theme/moonTheme';
import { MoonType } from '@/theme/moonTypography';

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
  const theme = useMemo(() => getMoonTheme(softLightMode), [softLightMode]);
  const { data, refreshing, refetch } = useWeatherData();
  const styles = useMemo(() => createStyles(softLightMode, theme), [softLightMode, theme]);
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
  const hourly = useMemo(() => data?.hourly ?? [], [data]);
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
        <ActivityIndicator color={theme.primary} size="large" />
        <Text style={{ color: theme.textMuted, marginTop: 12 }}>Calling the weather oracles...</Text>
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        ref={scrollRef}
        style={[styles.scroll, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.primary} />}
      >
        <AnimatedCard index={0}>
          <View style={styles.heroCard}>
            <View style={styles.heroTitleRow}>
              <Text style={styles.heroTitle}>Weekly outlook</Text>
            </View>
            <Text style={styles.heroSubtitle}>Tap a day to reveal rituals and conditions.</Text>
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
            <Text style={[styles.sectionTitle, styles.sectionTitleIndented]}>Hourly alignment</Text>
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
                  badge={undefined}
                  softLightMode={softLightMode}
                />
              )}
            contentContainerStyle={[styles.forecastList, { paddingHorizontal: LIST_SIDE_PADDING }]}
          />
        </View>
      </AnimatedCard>
      </ScrollView>
    </View>
  );
};

const createStyles = (softLightMode: boolean, theme: ReturnType<typeof getMoonTheme>) => {
  const textPrimary = theme.text;
  const textMuted = theme.textMuted;
  const cardBg = theme.surface;
  const surfaceBg = theme.background;
  const borderColor = theme.border;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    scroll: {
      backgroundColor: 'transparent',
    },
    contentContainer: {
      paddingTop: 60,
      paddingBottom: 130,
    },
    loadingState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: surfaceBg,
    },
    heroCard: {
      marginHorizontal: 16,
      borderRadius: theme.radiusLg,
      padding: theme.spaceMd,
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor,
    },
    heroTitle: {
      ...MoonType.cardTitle,
      color: textPrimary,
    },
    heroTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    heroSubtitle: {
      color: textMuted,
      marginTop: 4,
    },
    dayList: {
      marginTop: theme.spaceMd,
      paddingRight: 16,
    },
    dayCard: {
      width: 140,
      borderRadius: theme.radiusMd,
      padding: theme.spaceSm,
      marginRight: 12,
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor,
    },
    dayCardActive: {
      backgroundColor: theme.primarySoft,
      borderColor: theme.primary,
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
      ...MoonType.numberSmall,
      fontSize: 18,
      marginTop: theme.spaceSm,
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
      borderRadius: theme.radiusLg,
      backgroundColor: theme.surface,
      padding: theme.spaceMd,
      borderWidth: 1,
      borderColor,
    },
    sectionTitle: {
      ...MoonType.sectionTitle,
      color: textPrimary,
    },
    sectionTitleIndented: {
      marginLeft: 12,
    },
    detailSummary: {
      color: textMuted,
      marginTop: 4,
    },
    pillRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: theme.spaceSm,
    },
    detailPill: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: theme.radiusMd,
      paddingHorizontal: theme.spaceSm,
      paddingVertical: 10,
      gap: 8,
      borderWidth: 1,
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
      marginLeft: 'auto',
    },
  hourlyContainer: {
    marginHorizontal: 16,
    marginTop: 32,
    paddingVertical: 12,
    borderRadius: theme.radiusLg,
    borderWidth: 1,
    borderColor,
    backgroundColor: cardBg,
  },
  hourlyContainerDark: {
    backgroundColor: cardBg,
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
