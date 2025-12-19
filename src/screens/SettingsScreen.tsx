import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, Switch, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { CITY_OPTIONS } from '@/constants/cities';
import { useSettings } from '@/context/SettingsContext';
import { getMoonTheme } from '@/theme/moonTheme';
import { MoonType } from '@/theme/moonTypography';

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
  const theme = useMemo(() => getMoonTheme(softLightMode), [softLightMode]);
  const styles = useMemo(() => createStyles(theme), [theme]);
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
            <Ionicons name="search" size={18} color={styles.searchIconTint.color} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a city"
              placeholderTextColor={styles.placeholderTint.color}
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
                {city.id === item.id && <Ionicons name="checkmark-circle" size={20} color={theme.primary} />}
              </TouchableOpacity>
            )}
            scrollEnabled={false}
          />
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Auto-locate</Text>
            <Switch
              trackColor={{ false: styles.switchTrackOff.color, true: styles.switchTrackOn.color }}
              thumbColor={styles.switchThumb.color}
              ios_backgroundColor={styles.switchTrackOff.color}
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
              trackColor={{ false: styles.switchTrackOff.color, true: styles.switchTrackOn.color }}
              thumbColor={styles.switchThumb.color}
              ios_backgroundColor={styles.switchTrackOff.color}
              onValueChange={value => setUnit(value ? 'celsius' : 'fahrenheit')}
              value={unit === 'celsius'}
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Night Mode</Text>
            <Switch
              trackColor={{ false: styles.switchTrackOff.color, true: styles.switchTrackOn.color }}
              thumbColor={styles.switchThumb.color}
              ios_backgroundColor={styles.switchTrackOff.color}
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

const createStyles = (theme: ReturnType<typeof getMoonTheme>) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    paddingBottom: 130,
  },
  titleRow: {
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    ...MoonType.screenTitle,
    color: theme.text,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    ...MoonType.sectionTitle,
    color: theme.text,
    marginBottom: 15,
  },
  searchBarContainer: {
    backgroundColor: theme.surface,
    borderRadius: theme.radiusMd,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 0,
  },
  searchIconTint: {
    color: theme.textMuted,
  },
  placeholderTint: {
    color: theme.textMuted,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: theme.text,
    borderWidth: 0,
    borderColor: 'transparent',
    outlineStyle: 'none',
  },
  cityItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cityItemActive: {
    // Active state is now just the checkmark icon
  },
  cityText: {
    fontSize: 16,
    color: theme.textMuted,
  },
  cityTextActive: {
    color: theme.primary,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  settingText: {
    fontSize: 16,
    color: theme.textMuted,
  },
  brandInfo: {
    ...MoonType.body,
    color: theme.textMuted,
    marginBottom: 5,
  },
  loadingText: {
    color: theme.textMuted,
  },
  switchTrackOff: {
    color: theme.surfaceAlt,
  },
  switchTrackOn: {
    color: theme.primary,
  },
  switchThumb: {
    color: theme.text,
  },
});

export default SettingsScreen;
