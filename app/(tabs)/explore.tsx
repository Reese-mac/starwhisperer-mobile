import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ListCard from '@/components/ListCard';
import { MoonSenseColors } from '@/constants/colors';
import { CITY_OPTIONS, CityOption } from '@/constants/cities';
import { fetchCitySnapshot } from '@/services/weatherAPI';
import { searchCity } from '../../api/WeatherService';
import { getCities as getMockCities } from '@/services/mockAPI';
import { useSettings } from '@/context/SettingsContext';
import { getMoonTheme } from '@/theme/moonTheme';
import { MoonType } from '@/theme/moonTypography';

const CARD_COLORS = [MoonSenseColors.MoonLavender, MoonSenseColors.MistBlue, MoonSenseColors.SoftIndigo];

const ExploreScreen = () => {
  const { unit, softLightMode } = useSettings();
  const listRef = useRef<FlatList<any>>(null);
  const theme = useMemo(() => getMoonTheme(softLightMode), [softLightMode]);
  const styles = useMemo(() => createStyles(softLightMode, theme), [softLightMode, theme]);
  useScrollToTop(listRef);
  useFocusEffect(
    React.useCallback(() => {
      setActiveFilter('all');
      setQuery('');
      try {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
      } catch {
        /* ignore scroll errors */
      }
      return undefined;
    }, []),
  );
  const [cities, setCities] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const quickFilters = ['all', 'sunny', 'rainy'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const mapMock = (items: any[]) =>
        items.map((item, index) => ({
          id: `mock-${index}-${item.city}`,
          city: item.city,
          temp: item.temp,
          icon: item.icon,
          color: item.color ?? CARD_COLORS[index % CARD_COLORS.length],
        }));
      try {
        const snapshots = await Promise.all(
          CITY_OPTIONS.map(async (city, index) => {
            try {
              const snapshot = await fetchCitySnapshot(city, unit);
              return {
                id: city.id,
                city: city.name,
                temp: snapshot.temperature,
                icon: snapshot.icon,
                color: CARD_COLORS[index % CARD_COLORS.length],
              };
            } catch (error) {
              console.warn('Failed to fetch snapshot for', city.name, error);
              return {
                id: city.id,
                city: city.name,
                temp: '--',
                icon: 'cloud',
                color: CARD_COLORS[index % CARD_COLORS.length],
              };
            }
          }),
        );
        const hasLiveData = snapshots.some(item => item.temp !== '--');
        if (hasLiveData) {
          setCities(snapshots);
        } else {
          const mockCities = mapMock(await getMockCities());
          setCities(mockCities);
        }
      } catch (error) {
        console.warn('Explore city snapshots failed, showing mock data instead.', error);
        const mockCities = mapMock(await getMockCities());
        setCities(mockCities);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [unit]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      setStatusMessage(null);
      return;
    }

    let cancelled = false;
    const handleSearch = async () => {
      setSearchLoading(true);
      setStatusMessage(null);
      try {
        const results = await searchCity(trimmed);
        const enriched = await Promise.all(
          results.map(async (item: any, index: number) => {
            const pseudoCity: CityOption = {
              id: `${item.lat}-${item.lon}`,
              name: item.name,
              country: item.country ?? 'Unknown',
              latitude: item.lat,
              longitude: item.lon,
              timezone: 'UTC',
            };
            try {
              const snapshot = await fetchCitySnapshot(pseudoCity, unit);
              return {
                id: pseudoCity.id,
                city: `${item.name}${item.country ? `, ${item.country}` : ''}`,
                temp: snapshot.temperature,
                icon: snapshot.icon,
                color: CARD_COLORS[index % CARD_COLORS.length],
              };
            } catch {
              return {
                id: pseudoCity.id,
                city: `${item.name}${item.country ? `, ${item.country}` : ''}`,
                temp: '--',
                icon: 'cloud',
                color: CARD_COLORS[index % CARD_COLORS.length],
              };
            }
          }),
        );
        if (!cancelled) {
          setSearchResults(enriched);
          setStatusMessage(null);
        }
      } catch (error) {
        console.warn('City search is unavailable right now.', error);
        if (!cancelled) {
          setSearchResults([]);
          setStatusMessage(prev => prev ?? 'Search is offline until weather service reconnects.');
        }
      } finally {
        if (!cancelled) {
          setSearchLoading(false);
        }
      }
    };

    const timeout = setTimeout(handleSearch, 400);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query, unit]);

  const filteredCities = useMemo(() => {
    return cities.filter(item => {
      const matchesQuery = item.city.toLowerCase().includes(query.toLowerCase());
      if (activeFilter === 'sunny') {
        return matchesQuery && ['sun', 'sun-cloud'].includes(item.icon);
      }
      if (activeFilter === 'rainy') {
        return matchesQuery && ['rain', 'sun-rain'].includes(item.icon);
      }
      return matchesQuery;
    });
  }, [cities, query, activeFilter]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Explore</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={styles.searchIconColor.color} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a city..."
          placeholderTextColor={styles.placeholderColor.color}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <View style={styles.filterRow}>
      {quickFilters.map(filter => {
        const isActive = activeFilter === filter;
        return (
          <TouchableOpacity
            key={filter}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterLabel, isActive && styles.filterLabelActive]}>
                {filter === 'all' ? 'All' : filter === 'sunny' ? 'Sun windows' : 'Rain watch'}
              </Text>
          </TouchableOpacity>
        );
      })}
      </View>
      {statusMessage ? (
        <Text style={[styles.statusLabel, { marginHorizontal: 16, marginBottom: 8 }]}>
          {statusMessage}
        </Text>
      ) : null}

      {query.trim().length >= 2 ? (
        searchLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={theme.primary} />
            <Text style={styles.loadingLabel}>Searching cities...</Text>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={searchResults}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ListCard city={item.city} temperature={item.temp} icon={item.icon} backgroundColor={item.color} softLightMode={softLightMode} />
            )}
            ListEmptyComponent={
              <Text style={[styles.loadingLabel, { textAlign: 'center', marginTop: 20 }]}>
                No cities found. Try another search.
              </Text>
            }
            contentContainerStyle={styles.listContainer}
          />
        )
      ) : loading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator color={theme.primary} />
          <Text style={styles.loadingLabel}>Syncing cities...</Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={filteredCities}
          keyExtractor={item => item.city}
            renderItem={({ item }) => (
              <ListCard city={item.city} temperature={item.temp} icon={item.icon} backgroundColor={item.color} softLightMode={softLightMode} />
            )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

const createStyles = (softLightMode: boolean, theme: ReturnType<typeof getMoonTheme>) => {
  const textColor = theme.text;
  const mutedColor = theme.textMuted;
  const borderColor = theme.border;
  const searchBg = theme.surface;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    title: {
      ...MoonType.screenTitle,
      color: textColor,
      paddingHorizontal: 24,
      paddingTop: 40,
      paddingBottom: 10,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingRight: 20,
    },
    cityIcon: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: softLightMode ? 'rgba(255,255,255,0.08)' : 'rgba(108,74,255,0.08)',
      borderWidth: 1,
      borderColor,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: searchBg,
      borderRadius: theme.radiusLg,
      marginHorizontal: 16,
      paddingHorizontal: 16,
      marginVertical: 10,
      height: 50,
      borderWidth: 1,
      borderColor,
    },
    searchIcon: {
      marginRight: 10,
    },
    searchIconColor: { color: mutedColor },
    placeholderColor: { color: mutedColor },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: textColor,
      borderWidth: 0,
      outlineStyle: 'none',
      backgroundColor: 'transparent',
    },
    filterRow: {
      flexDirection: 'row',
      gap: 10,
      paddingHorizontal: 16,
      marginBottom: 10,
    },
    filterChip: {
      borderRadius: theme.radiusMd,
      borderWidth: 1,
      borderColor,
      paddingHorizontal: 14,
      paddingVertical: 6,
    },
    filterChipActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    filterLabel: {
      ...MoonType.labelCaps,
      color: mutedColor,
    },
    filterLabelActive: {
      color: '#fff',
    },
    listContainer: {
      paddingTop: 10,
      paddingBottom: 130,
    },
    loadingState: {
      marginTop: 40,
      alignItems: 'center',
    },
    loadingLabel: {
      marginTop: 8,
      color: mutedColor,
    },
    statusLabel: {
      flex: 1,
      fontSize: 13,
      color: textColor,
    },
  });
};

export default ExploreScreen;
