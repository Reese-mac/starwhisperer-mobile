import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ListCard from '../../src/components/ListCard';
import { MoonSenseColors } from '../../src/constants/colors';
import { CITY_OPTIONS, CityOption } from '../../src/constants/cities';
import { fetchCitySnapshot } from '../../src/services/weatherAPI';
import { searchCity } from '../../api/WeatherService';
import { getCities as getMockCities } from '../../src/services/mockAPI';
import { useSettings } from '../../src/context/SettingsContext';

const CARD_COLORS = [MoonSenseColors.MoonLavender, MoonSenseColors.MistBlue, MoonSenseColors.SoftIndigo];

const ExploreScreen = () => {
  const { unit } = useSettings();
  const [cities, setCities] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
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
          setStatusMessage(null);
        } else {
          const mockCities = mapMock(await getMockCities());
          setCities(mockCities);
          setStatusMessage('Showing sample city moods until live data reconnects.');
        }
      } catch (error) {
        console.warn('Explore city snapshots failed, showing mock data instead.', error);
        const mockCities = mapMock(await getMockCities());
        setCities(mockCities);
        setStatusMessage('Showing sample city moods until live data reconnects.');
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
      return;
    }

    let cancelled = false;
    const handleSearch = async () => {
      setSearchLoading(true);
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
      <Text style={styles.title}>Explore</Text>

      {statusMessage ? (
        <View style={styles.statusBanner}>
          <View style={styles.statusDot} />
          <Text style={styles.statusLabel}>{statusMessage}</Text>
        </View>
      ) : null}

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={MoonSenseColors.OrbitGrey} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a city..."
          placeholderTextColor={MoonSenseColors.OrbitGrey}
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

      {query.trim().length >= 2 ? (
        searchLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={MoonSenseColors.CosmicPurple} />
            <Text style={styles.loadingLabel}>Searching cities...</Text>
          </View>
        ) : (
          <FlatList
            data={searchResults}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ListCard city={item.city} temperature={item.temp} icon={item.icon} backgroundColor={item.color} />
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
          <ActivityIndicator color={MoonSenseColors.CosmicPurple} />
          <Text style={styles.loadingLabel}>Syncing cities...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredCities}
          keyExtractor={item => item.city}
          renderItem={({ item }) => (
            <ListCard city={item.city} temperature={item.temp} icon={item.icon} backgroundColor={item.color} />
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MoonSenseColors.LunarGlow,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: MoonSenseColors.NightGrey,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MoonSenseColors.MistBlue,
    borderRadius: 18,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    marginVertical: 10,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: MoonSenseColors.NightGrey,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  filterChip: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(73,74,87,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  filterChipActive: {
    backgroundColor: MoonSenseColors.CosmicPurple,
    borderColor: MoonSenseColors.CosmicPurple,
  },
  filterLabel: {
    fontSize: 12,
    color: MoonSenseColors.OrbitGrey,
    textTransform: 'uppercase',
  },
  filterLabelActive: {
    color: '#fff',
  },
  listContainer: {
    paddingTop: 10,
    paddingBottom: 40,
  },
  loadingState: {
    marginTop: 40,
    alignItems: 'center',
  },
  loadingLabel: {
    marginTop: 8,
    color: MoonSenseColors.OrbitGrey,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 10,
    borderRadius: 14,
    backgroundColor: '#F3EDFF',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: MoonSenseColors.CosmicPurple,
    marginRight: 8,
  },
  statusLabel: {
    flex: 1,
    fontSize: 13,
    color: MoonSenseColors.NightGrey,
  },
});

export default ExploreScreen;
