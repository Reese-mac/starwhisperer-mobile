import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, Switch, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MoonSenseColors } from '../constants/colors';
import { CITY_OPTIONS } from '../constants/cities';
import { useSettings } from '../context/SettingsContext';

const SettingsScreen = () => {
  const {
    ready,
    city,
    unit,
    autoLocate,
    softLightMode,
    setCityById,
    setUnit,
    setAutoLocate,
    setSoftLightMode,
  } = useSettings();
  const [searchText, setSearchText] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);
  useFocusEffect(
    React.useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return undefined;
    }, []),
  );

  const filteredCities = useMemo(() => {
    const query = searchText.toLowerCase();
    if (!query) return CITY_OPTIONS;
    return CITY_OPTIONS.filter(option => option.name.toLowerCase().includes(query));
  }, [searchText]);

  if (!ready) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.loadingText}>Loading your preferences...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.searchBarContainer}>
            <Ionicons name="search" size={18} color={MoonSenseColors.OnSurfaceDisabled} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a city"
              placeholderTextColor={MoonSenseColors.OnSurfaceDisabled}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <FlatList
            data={filteredCities}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.cityItem, city.id === item.id && styles.cityItemActive]}
                onPress={() => setCityById(item.id)}
              >
                <Text style={[styles.cityText, city.id === item.id && styles.cityTextActive]}>
                  {item.name} · {item.country}
                </Text>
                {city.id === item.id && <Ionicons name="checkmark-circle" size={20} color={MoonSenseColors.Primary} />}
              </TouchableOpacity>
            )}
            scrollEnabled={false}
          />
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Auto-locate</Text>
            <Switch
              trackColor={{ false: MoonSenseColors.Surface, true: MoonSenseColors.Primary }}
              thumbColor={MoonSenseColors.OnSurface}
              ios_backgroundColor={MoonSenseColors.Surface}
              onValueChange={setAutoLocate}
              value={autoLocate}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interface</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Units (°C / °F)</Text>
            <Switch
              trackColor={{ false: MoonSenseColors.Surface, true: MoonSenseColors.Primary }}
              thumbColor={MoonSenseColors.OnSurface}
              ios_backgroundColor={MoonSenseColors.Surface}
              onValueChange={value => setUnit(value ? 'celsius' : 'fahrenheit')}
              value={unit === 'celsius'}
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Night Mode</Text>
            <Switch
              trackColor={{ false: MoonSenseColors.Surface, true: MoonSenseColors.Primary }}
              thumbColor={MoonSenseColors.OnSurface}
              ios_backgroundColor={MoonSenseColors.Surface}
              onValueChange={setSoftLightMode}
              value={softLightMode}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.brandInfo}>Minimal Moon Weather 2.0</Text>
          <Text style={styles.brandInfo}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MoonSenseColors.Background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  titleRow: {
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: MoonSenseColors.OnSurface,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: MoonSenseColors.OnSurface,
    marginBottom: 15,
  },
  searchBarContainer: {
    backgroundColor: MoonSenseColors.Surface,
    borderRadius: 12,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: MoonSenseColors.OnSurface,
  },
  cityItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: `rgba(255, 255, 255, 0.08)`,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cityItemActive: {
    // Active state is now just the checkmark icon
  },
  cityText: {
    fontSize: 16,
    color: MoonSenseColors.OnSurfaceMedium,
  },
  cityTextActive: {
    color: MoonSenseColors.Primary,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: `rgba(255, 255, 255, 0.08)`,
  },
  settingText: {
    fontSize: 16,
    color: MoonSenseColors.OnSurfaceMedium,
  },
  brandInfo: {
    fontSize: 14,
    color: MoonSenseColors.OnSurfaceDisabled,
    marginBottom: 5,
  },
  loadingText: {
    color: MoonSenseColors.OnSurfaceMedium,
  },
});

export default SettingsScreen;
