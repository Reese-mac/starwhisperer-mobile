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
  const styles = useMemo(() => createStyles(softLightMode), [softLightMode]);
  useScrollToTop(scrollRef);
  useFocusEffect(
    React.useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return undefined;
    }, []),
  );

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
      <ScrollView ref={scrollRef}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Settings</Text>
          <View pointerEvents="none" style={styles.globeIcon}>
            <Ionicons name="globe-outline" size={22} color={styles.globeIconTint.color} />
          </View>
        </View>

        {/* City Selection */}
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
            scrollEnabled={false}
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

        {/* Interface Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dark Mode</Text>
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
            <Text style={styles.settingText}>Soft Light Mode</Text>
            <Switch
              trackColor={{ false: MoonSenseColors.NightGrey, true: MoonSenseColors.CosmicPurple }}
              thumbColor={MoonSenseColors.MoonWhite}
              onValueChange={setSoftLightMode}
              value={softLightMode}
            />
          </View>
        </View>

        {/* Branding Page */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.brandInfo}>Minimal Moon Weather 2.0</Text>
          <Text style={styles.brandInfo}>Version 1.0.0</Text>
          <Text style={styles.cosmicMoodPlaceholder}>My Cosmic Mood (Future Expansion)</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (softLightMode: boolean) => {
  const textColor = softLightMode ? MoonSenseColors.MoonWhite : MoonSenseColors.NightGrey;
  const borderColor = softLightMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: softLightMode ? MoonSenseColors.NightGrey : '#F7F7FF',
      paddingTop: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: textColor,
      paddingHorizontal: 24,
      marginBottom: 20,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingRight: 20,
    },
    globeIconTint: {
      color: textColor,
    },
    globeIcon: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: softLightMode ? 'rgba(255,255,255,0.08)' : 'rgba(108,74,255,0.08)',
      borderWidth: 1,
      borderColor,
    },
    section: {
      marginBottom: 30,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: textColor,
      marginBottom: 15,
    },
    subsectionTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: textColor,
      marginTop: 15,
      marginBottom: 10,
    },
    searchBarContainer: {
      backgroundColor: softLightMode ? '#5A5B68' : MoonSenseColors.MistBlue,
      borderRadius: 12,
      paddingHorizontal: 15,
      marginBottom: 10,
    },
    searchInput: {
      height: 40,
      fontSize: 16,
      color: textColor,
      borderWidth: 0,
      outlineStyle: 'none',
      backgroundColor: 'transparent',
    },
    cityItem: {
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: borderColor,
    },
    cityItemActive: {
      backgroundColor: 'rgba(108,74,255,0.08)',
      borderRadius: 10,
      paddingHorizontal: 12,
    },
    cityText: {
      fontSize: 16,
      color: textColor,
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
      borderBottomColor: borderColor,
    },
    settingText: {
      fontSize: 16,
      color: textColor,
    },
    brandInfo: {
      fontSize: 14,
      color: textColor,
      marginBottom: 5,
    },
    cosmicMoodPlaceholder: {
      fontSize: 14,
      color: textColor,
      fontStyle: 'italic',
      marginTop: 15,
    },
    loadingText: {
      color: textColor,
    },
  });
};

export default SettingsScreen;
