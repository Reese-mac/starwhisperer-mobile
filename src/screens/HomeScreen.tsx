import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import HeaderBlock from '../components/HeaderBlock';
import InfoCard from '../components/InfoCard';
import ForecastItem from '../components/ForecastItem';
import AnimatedCard from '../components/AnimatedCard';
import MoonEnergyPopup from '../components/MoonEnergyPopup';
import { MoonSenseColors } from '../constants/colors';
import { SAMPLE_DATA_NOTICE, useWeatherData } from '../hooks/useWeatherData';

export default function HomeScreen() {
  const router = useRouter();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { data, refreshing, refetch, error, lastUpdated } = useWeatherData();
  const isInfoBanner = error === SAMPLE_DATA_NOTICE;
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);
  useFocusEffect(
    React.useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return undefined;
    }, []),
  );

  const handleMoonPress = () => {
    router.push('/modal');
  };

  const handleLongMoonPress = () => {
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const handleCityPress = () => {
    router.push('/(tabs)/settings'); // Navigate to the tabbed settings screen for city selection
  };

  const handleSettingsPress = () => {
    router.push('/(tabs)/settings'); // Navigate to the tabbed settings screen
  };


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
      <View style={styles.container}>
        <ActivityIndicator color={MoonSenseColors.CosmicPurple} size="large" />
        <Text style={styles.sectionTitle}>Preparing lunar briefing...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refetch} tintColor={MoonSenseColors.CosmicPurple} />
        }
      >
        <AnimatedCard index={0}>
          <HeaderBlock
            temperature={data.header.temperature}
            city={data.header.city}
            description={data.header.description}
            cosmicWhisper={data.header.cosmicWhisper}
            onMoonPress={handleMoonPress}
            onLongMoonPress={handleLongMoonPress}
            onCityPress={handleCityPress}
            onSettingsPress={handleSettingsPress}
          />
          {lastUpdated ? <Text style={styles.updatedAt}>Updated at {lastUpdated}</Text> : null}
          {error ? (
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
          ) : null}
        </AnimatedCard>
        
        <AnimatedCard index={1}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Today</Text>
            <FlatList
              data={data.hourly}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item: any) => item.time}
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
                  />
                );
              }}
              contentContainerStyle={styles.forecastList}
            />
          </View>
        </AnimatedCard>

        <View style={styles.sectionContainer}>
          <View style={styles.infoCardGrid}>
            {weatherDetailsWithExpanded.map((item: any, index) => (
              <AnimatedCard key={item.title} index={index + 2}>
                <InfoCard
                  title={item.title}
                  value={item.value}
                  icon={item.icon}
                  backgroundColor={item.color}
                  type={item.type}
                  expandedData={item.expandedData}
                />
              </AnimatedCard>
            ))}
          </View>
        </View>

        <AnimatedCard index={weatherDetailsWithExpanded.length + 3}>
          <View style={styles.moonSummaryCard}>
            <Text style={styles.sectionTitle}>Moon Energy</Text>
            <Text style={styles.summaryText}>{data.advice?.advice || 'Tune into lunar calm.'}</Text>
            <TouchableOpacity onPress={() => router.push('/moon')} style={styles.summaryCta}>
              <Text style={styles.summaryCtaText}>See more</Text>
            </TouchableOpacity>
          </View>
        </AnimatedCard>
      </ScrollView>

      <MoonEnergyPopup
        isVisible={isPopupVisible}
        onClose={handleClosePopup}
        message={data.advice?.advice ?? 'Embrace the cosmic vibes.'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MoonSenseColors.LunarGlow,
  },
  contentContainer: {
    paddingVertical: 60,
  },
  sectionContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: MoonSenseColors.NightGrey,
    marginBottom: 12,
    marginLeft: 24,
  },
  forecastList: {
    paddingLeft: 18,
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
