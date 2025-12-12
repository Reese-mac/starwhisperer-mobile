import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import AnimatedCard from '../components/AnimatedCard';
import { MoonSenseColors } from '../constants/colors';
import { fetchMoonPhases as fetchLiveMoonPhases, MoonPhaseEntry } from '../services/weatherAPI';
import { getMoonPhases as getMockMoonPhases } from '../services/mockAPI';
import { useSettings } from '../context/SettingsContext';

const rituals = [
  { title: 'Intentions', detail: 'Write one line of gratitude before bed.' },
  { title: 'Breathwork', detail: '4 cycles of lunar breath to reset.' },
  { title: 'Connection', detail: 'Send a note or audio to someone you miss.' },
];

const PhaseItem = ({
  phase,
  active,
  onSelect,
}: {
  phase: any;
  active: boolean;
  onSelect: () => void;
}) => (
  <TouchableOpacity
    style={[styles.phaseItem, active && styles.phaseItemActive]}
    onPress={onSelect}
    activeOpacity={0.85}
  >
    <View style={[styles.phaseIcon, active && styles.phaseIconActive]} />
    <Text style={[styles.phaseName, active && styles.phaseNameActive]}>{phase.name}</Text>
    <Text style={[styles.phaseSub, active && styles.phaseNameActive]}>{phase.illumination}</Text>
  </TouchableOpacity>
);

const MoonScreen = () => {
  const { city } = useSettings();
  const [phases, setPhases] = useState<MoonPhaseEntry[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchLiveMoonPhases(city);
        setPhases(data);
        setSelectedIndex(0);
        setStatusMessage(null);
      } catch (error) {
        console.warn('Failed to load moon phases, falling back to sample data', error);
        try {
          const mockData = await getMockMoonPhases();
          setPhases(mockData);
          setSelectedIndex(0);
          setStatusMessage('Showing sample moon cycles while live data reconnects.');
        } catch (mockErr) {
          console.error('Moon phase mock fallback error', mockErr);
          setStatusMessage('Moon insights unavailable right now. Please pull to refresh soon.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [city]);

  const selectedPhase = phases[selectedIndex];

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={MoonSenseColors.CosmicPurple} size="large" />
        <Text style={{ color: MoonSenseColors.NightGrey, marginTop: 12 }}>Aligning with lunar calendar...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {statusMessage ? (
        <View style={styles.statusBanner}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{statusMessage}</Text>
        </View>
      ) : null}
      {selectedPhase ? (
        <AnimatedCard index={0}>
          <View style={styles.hero}>
            <Text style={styles.heroLabel}>Current phase</Text>
            <Text style={styles.heroTitle}>{selectedPhase.name}</Text>
            <Text style={styles.heroDescription}>{selectedPhase.description}</Text>
            <View style={styles.heroMetaRow}>
              <View style={styles.metaBlock}>
                <Text style={styles.metaLabel}>Rise</Text>
                <Text style={styles.metaValue}>{selectedPhase.riseTime}</Text>
              </View>
              <View style={styles.metaBlock}>
                <Text style={styles.metaLabel}>Set</Text>
                <Text style={styles.metaValue}>{selectedPhase.setTime}</Text>
              </View>
              <View style={styles.metaBlock}>
                <Text style={styles.metaLabel}>Illumination</Text>
                <Text style={styles.metaValue}>{selectedPhase.illumination}</Text>
              </View>
            </View>
          </View>
        </AnimatedCard>
      ) : null}

      <AnimatedCard index={1}>
        <View style={styles.phaseListWrapper}>
          <Text style={styles.sectionTitle}>Lunar parade</Text>
          <FlatList
            data={phases}
            keyExtractor={(_, index) => `phase-${index}`}
            renderItem={({ item, index }) => (
              <PhaseItem phase={item} active={index === selectedIndex} onSelect={() => setSelectedIndex(index)} />
            )}
            scrollEnabled={false}
          />
        </View>
      </AnimatedCard>

      <AnimatedCard index={2}>
        <View style={styles.ritualCard}>
          <Text style={styles.sectionTitle}>Tonight&apos;s ritual kit</Text>
          {rituals.map((ritual, index) => (
            <View key={ritual.title} style={styles.ritualRow}>
              <View style={styles.ritualIndex}>
                <Text style={styles.ritualIndexText}>{index + 1}</Text>
              </View>
              <View>
                <Text style={styles.ritualTitle}>{ritual.title}</Text>
                <Text style={styles.ritualDetail}>{ritual.detail}</Text>
              </View>
            </View>
          ))}
        </View>
      </AnimatedCard>
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
    paddingBottom: 80,
  },
  statusBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
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
    flex: 1,
    color: MoonSenseColors.NightGrey,
    fontSize: 13,
  },
  hero: {
    marginHorizontal: 16,
    borderRadius: 28,
    padding: 26,
    backgroundColor: MoonSenseColors.MidnightIndigo,
  },
  heroLabel: {
    color: '#B8B7D6',
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 2,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
    marginTop: 12,
  },
  heroDescription: {
    color: '#F4F0FF',
    marginTop: 6,
    fontSize: 14,
  },
  heroMetaRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 24,
  },
  metaBlock: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
  },
  metaLabel: {
    color: '#B8B7D6',
    fontSize: 12,
  },
  metaValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 6,
  },
  phaseListWrapper: {
    marginHorizontal: 16,
    marginTop: 28,
    borderRadius: 24,
    padding: 18,
    backgroundColor: MoonSenseColors.MoonWhite,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: MoonSenseColors.NightGrey,
    marginBottom: 12,
  },
  phaseItem: {
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(73,74,87,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
  },
  phaseItemActive: {
    backgroundColor: MoonSenseColors.CosmicPurple,
    borderColor: MoonSenseColors.CosmicPurple,
  },
  phaseIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: MoonSenseColors.NightGrey,
  },
  phaseIconActive: {
    borderColor: '#fff',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  phaseName: {
    fontWeight: '600',
    color: MoonSenseColors.NightGrey,
    flex: 1,
  },
  phaseSub: {
    color: MoonSenseColors.OrbitGrey,
    fontSize: 12,
  },
  phaseNameActive: {
    color: '#fff',
  },
  ritualCard: {
    marginHorizontal: 16,
    marginTop: 28,
    borderRadius: 24,
    padding: 22,
    backgroundColor: MoonSenseColors.MistBlue,
  },
  ritualRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 16,
  },
  ritualIndex: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: MoonSenseColors.MoonWhite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ritualIndexText: {
    fontWeight: '700',
    color: MoonSenseColors.NightGrey,
  },
  ritualTitle: {
    fontWeight: '600',
    color: MoonSenseColors.NightGrey,
  },
  ritualDetail: {
    color: MoonSenseColors.OrbitGrey,
  },
});

export default MoonScreen;
