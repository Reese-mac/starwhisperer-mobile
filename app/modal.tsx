import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ModalInfoBlock from '../src/components/ModalInfoBlock';
import { MoonSenseColors } from '../src/constants/colors';
import { fetchMoonDetails, MoonDetails } from '../src/services/weatherAPI';
import { getMoonDetails as getMockMoonDetails } from '../src/services/mockAPI';
import { useSettings } from '../src/context/SettingsContext';

const ModalScreen = () => {
  const router = useRouter();
  const { city } = useSettings();
  const [moonDetails, setMoonDetails] = useState<MoonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadDetails = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    setStatusMessage(null);
    try {
      const details = await fetchMoonDetails(city);
      setMoonDetails(details);
    } catch (error) {
      console.warn('Failed to fetch moon details', error);
      try {
        const fallbackDetails = await getMockMoonDetails();
        setMoonDetails(fallbackDetails);
        setStatusMessage('Showing sample moon details while live data reconnects.');
        return;
      } catch (mockError) {
        console.warn('Failed to load fallback moon details', mockError);
        const message = error instanceof Error ? error.message : 'Unable to reach moon data service.';
        setErrorMessage(message);
        setMoonDetails(null);
      }
    } finally {
      setLoading(false);
    }
  }, [city]);

  useEffect(() => {
    loadDetails();
  }, [city, loadDetails]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator color={MoonSenseColors.CosmicPurple} size="large" />
      </SafeAreaView>
    );
  }

  if (errorMessage) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{errorMessage}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadDetails}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!moonDetails) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {statusMessage && (
        <View style={styles.statusBanner}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{statusMessage}</Text>
        </View>
      )}
      <LinearGradient colors={[MoonSenseColors.MidnightIndigo, '#2E2447']} style={styles.hero}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.phaseLabel}>Phase</Text>
        <Text style={styles.phaseName}>{moonDetails.phaseName}</Text>
        <Text style={styles.mantra}>{moonDetails.mantra}</Text>
      </LinearGradient>

      <View style={styles.infoContainer}>
        <ModalInfoBlock label="Illumination" value={moonDetails.illumination} icon="sparkles-outline" />
        <ModalInfoBlock label="Moonrise" value={moonDetails.riseTime} icon="arrow-up-outline" />
        <ModalInfoBlock label="Moonset" value={moonDetails.setTime} icon="arrow-down-outline" />
      </View>

      <StatusBar style="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MoonSenseColors.LunarGlow,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBanner: {
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: -8,
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#F3EDFF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: MoonSenseColors.CosmicPurple,
    marginRight: 8,
  },
  statusText: {
    color: MoonSenseColors.NightGrey,
    fontSize: 13,
    flex: 1,
  },
  hero: {
    margin: 24,
    borderRadius: 30,
    padding: 30,
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseLabel: {
    color: '#C6C3FF',
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  phaseName: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
    marginTop: 12,
  },
  mantra: {
    color: '#E4E0FF',
    marginTop: 6,
    fontSize: 16,
  },
  infoContainer: {
    alignSelf: 'stretch',
  },
  errorText: {
    color: MoonSenseColors.NightGrey,
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 32,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: MoonSenseColors.CosmicPurple,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ModalScreen;
