import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, Switch, FlatList, TouchableOpacity } from 'react-native';
import { MoonSenseColors } from '../src/constants/colors';
import { CITY_OPTIONS } from '../src/constants/cities';
import { useSettings } from '../src/context/SettingsContext';

const SettingsScreen = () => {
  const {
    ready,
    city,
    unit,
    autoLocate,
    backgroundSound,
    softLightMode,
    setCityById,
    setUnit,
    setAutoLocate,
    setBackgroundSound,
    setSoftLightMode,
  } = useSettings();
  const [searchText, setSearchText] = useState('');

  const filteredCities = useMemo(() => {
    const query = searchText.toLowerCase();
    return CITY_OPTIONS.filter(option => option.name.toLowerCase().includes(query));
  }, [searchText]);

  if (!ready) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.loadingText}>Loading your ritual preferences...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Settings</Text>

        {/* E1 — City Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>City Selection</Text>
          <View style={styles.searchBarContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a city..."
              placeholderTextColor={MoonSenseColors.NightGrey}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <Text style={styles.subsectionTitle}>Frequently Used Cities</Text>
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
              </TouchableOpacity>
            )}
            scrollEnabled={false} // Disable scrolling within this FlatList
          />
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Auto-locate</Text>
            <Switch
              trackColor={{ false: MoonSenseColors.NightGrey, true: MoonSenseColors.CosmicPurple }}
              thumbColor={MoonSenseColors.MoonWhite}
              onValueChange={setAutoLocate}
              value={autoLocate}
            />
          </View>
        </View>

        {/* E2 — Interface Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interface Settings</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Units (°C / °F)</Text>
            <Switch
              trackColor={{ false: MoonSenseColors.NightGrey, true: MoonSenseColors.CosmicPurple }}
              thumbColor={MoonSenseColors.MoonWhite}
              onValueChange={value => setUnit(value ? 'celsius' : 'fahrenheit')}
              value={unit === 'celsius'}
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Background Sound</Text>
            <Switch
              trackColor={{ false: MoonSenseColors.NightGrey, true: MoonSenseColors.CosmicPurple }}
              thumbColor={MoonSenseColors.MoonWhite}
              onValueChange={setBackgroundSound}
              value={backgroundSound}
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Soft Light Mode</Text>
            <Switch
              trackColor={{ false: MoonSenseColors.NightGrey, true: MoonSenseColors.CosmicPurple }}
              thumbColor={MoonSenseColors.MoonWhite}
              onValueChange={setSoftLightMode}
              value={softLightMode}
            />
          </View>
        </View>

        {/* E3 — Branding Page */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.brandInfo}>Star Whisperer - Minimal Moon Weather 2.0</Text>
          <Text style={styles.brandInfo}>Version 1.0.0</Text>
          <Text style={styles.cosmicMoodPlaceholder}>My Cosmic Mood (Future Expansion)</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FF',
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: MoonSenseColors.NightGrey,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: MoonSenseColors.NightGrey,
    marginBottom: 15,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: MoonSenseColors.NightGrey,
    marginTop: 15,
    marginBottom: 10,
  },
  searchBarContainer: {
    backgroundColor: MoonSenseColors.MistBlue,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    fontSize: 16,
    color: MoonSenseColors.NightGrey,
  },
  cityItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  cityItemActive: {
    backgroundColor: 'rgba(108,74,255,0.08)',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  cityText: {
    fontSize: 16,
    color: MoonSenseColors.NightGrey,
  },
  cityTextActive: {
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  settingText: {
    fontSize: 16,
    color: MoonSenseColors.NightGrey,
  },
  brandInfo: {
    fontSize: 14,
    color: MoonSenseColors.NightGrey,
    marginBottom: 5,
  },
  cosmicMoodPlaceholder: {
    fontSize: 14,
    color: MoonSenseColors.NightGrey,
    fontStyle: 'italic',
    marginTop: 15,
  },
  loadingText: {
    color: MoonSenseColors.NightGrey,
  },
});

export default SettingsScreen;
