import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedCard from '../components/AnimatedCard';
import ForecastItem from '../components/ForecastItem';
import { MoonSenseColors } from '../constants/colors';
import { useWeatherData } from '../hooks/useWeatherData';

const DetailPill = ({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) => (
  <View style={styles.detailPill}>
    <Ionicons name={icon} size={16} color={MoonSenseColors.NightGrey} />
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const DayCard = ({
  item,
  isActive,
  onSelect,
}: {
  item: any;
  isActive: boolean;
  onSelect: () => void;
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
  const { data, refreshing, refetch } = useWeatherData();

  const daily = data?.daily ?? [];
  const hourly = data?.hourly ?? [];

  const selectedDay = useMemo(() => daily[selectedIndex], [daily, selectedIndex]);

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
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={MoonSenseColors.CosmicPurple} />}
    >
      <>
        <AnimatedCard index={0}>
          <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>Weekly outlook</Text>
            <Text style={styles.heroSubtitle}>Tap a day to reveal rituals and conditions.</Text>
            <FlatList
              data={daily}
              keyExtractor={item => item.day}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dayList}
              renderItem={({ item, index }) => (
                <DayCard item={item} isActive={selectedIndex === index} onSelect={() => setSelectedIndex(index)} />
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
                <DetailPill icon="flame-outline" label="Feels like" value={selectedDay.high} />
                <DetailPill icon="snow-outline" label="Low" value={selectedDay.low} />
              </View>
              <View style={styles.pillRow}>
                <DetailPill icon="water-outline" label="Humidity" value={selectedDay.humidity} />
                <DetailPill icon="sunny-outline" label="UV" value={selectedDay.uv} />
              </View>
            </View>
          </AnimatedCard>
        ) : null}

        <AnimatedCard index={2}>
          <View style={styles.hourlyContainer}>
            <View style={styles.hourlyHeader}>
              <Text style={styles.sectionTitle}>Hourly alignment</Text>
              <Text style={styles.sectionHint}>Best windows to step outside</Text>
            </View>
            <FlatList
              horizontal
              data={hourly}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.time}
              renderItem={({ item, index }) => (
                <ForecastItem
                  time={item.time}
                  icon={item.icon}
                  temperature={item.temp}
                  badge={index === 0 ? 'Now' : undefined}
                  hint={index === 1 ? 'Next' : undefined}
                />
              )}
              contentContainerStyle={styles.forecastList}
            />
          </View>
        </AnimatedCard>
      </>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MoonSenseColors.LunarGlow,
  },
  contentContainer: {
    paddingTop: 60,
    paddingBottom: 60,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MoonSenseColors.LunarGlow,
  },
  heroCard: {
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 22,
    backgroundColor: MoonSenseColors.MistBlue,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: MoonSenseColors.NightGrey,
  },
  heroSubtitle: {
    color: MoonSenseColors.OrbitGrey,
    marginTop: 4,
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
    backgroundColor: MoonSenseColors.MoonWhite,
  },
  dayCardActive: {
    backgroundColor: MoonSenseColors.CosmicPurple,
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: MoonSenseColors.NightGrey,
  },
  dayLabelActive: {
    color: '#fff',
  },
  dayDate: {
    fontSize: 12,
    color: MoonSenseColors.OrbitGrey,
    marginTop: 2,
  },
  dayTemp: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
    color: MoonSenseColors.NightGrey,
  },
  daySummary: {
    fontSize: 12,
    marginTop: 8,
    color: MoonSenseColors.OrbitGrey,
  },
  daySummaryActive: {
    color: 'rgba(255,255,255,0.9)',
  },
  detailCard: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 24,
    backgroundColor: MoonSenseColors.MoonWhite,
    padding: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: MoonSenseColors.NightGrey,
  },
  detailSummary: {
    color: MoonSenseColors.OrbitGrey,
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
    backgroundColor: MoonSenseColors.MistBlue,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: MoonSenseColors.OrbitGrey,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: MoonSenseColors.NightGrey,
  },
  hourlyContainer: {
    marginHorizontal: 16,
    marginTop: 32,
    paddingVertical: 12,
  },
  hourlyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  sectionHint: {
    color: MoonSenseColors.OrbitGrey,
  },
  forecastList: {
    paddingLeft: 8,
    paddingRight: 16,
  },
});

export default ForecastScreen;
