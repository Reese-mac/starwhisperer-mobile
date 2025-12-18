import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import AnimatedCard from '../components/AnimatedCard';
import StatusBanner from '../components/StatusBanner';
import { useSettings } from '../context/SettingsContext';
import { getMoonPhases as getMockMoonPhases } from '../services/mockAPI';
import { fetchMoonPhases as fetchLiveMoonPhases, MoonPhaseEntry } from '../services/weatherAPI';
import { getMoonTheme } from '../theme/moonTheme';
import { MoonType } from '../theme/moonTypography';
import { MoonSenseColors } from '../constants/colors';

const rituals = [
  { title: 'Intentions', detail: 'Write one line of gratitude before bed.' },
  { title: 'Breathwork', detail: '4 cycles of lunar breath to reset.' },
  { title: 'Connection', detail: 'Send a note or audio to someone you miss.' },
];

const PhaseItem = ({
  phase,
  active,
  onSelect,
  styles,
}: {
  phase: any;
  active: boolean;
  onSelect: () => void;
  styles: ReturnType<typeof createStyles>;
}) => (
  <TouchableOpacity
    style={[styles.phaseItem, active && styles.phaseItemActive]}
    onPress={onSelect}
    activeOpacity={0.85}
  >
    <View style={[styles.phaseDot, active && styles.phaseDotActive]} />
    <Text style={[styles.phaseName, active && styles.phaseNameActive]}>{phase.name}</Text>
    <Text style={[styles.phaseSub, active && styles.phaseNameActive]}>{phase.illumination}</Text>
  </TouchableOpacity>
);

const MoonScreen = () => {
  const { city, softLightMode } = useSettings();
  const theme = useMemo(() => getMoonTheme(softLightMode), [softLightMode]);
  const styles = useMemo(() => createStyles(softLightMode, theme), [softLightMode, theme]);
  const [phases, setPhases] = useState<MoonPhaseEntry[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);
  useFocusEffect(
    React.useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return undefined;
    }, []),
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchLiveMoonPhases(city);
        setPhases(data);
        setSelectedIndex(0);
        setStatusMessage(null);
      } catch {
        const mockData = await getMockMoonPhases();
        setPhases(mockData);
        setSelectedIndex(0);
        setStatusMessage('Showing sample moon cycles while live data reconnects.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [city]);

  const selectedPhase = phases[selectedIndex];

  if (loading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Aligning with lunar calendar...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView ref={scrollRef} style={[styles.scroll, { backgroundColor: theme.background }]} contentContainerStyle={styles.contentContainer}>
        {statusMessage ? <StatusBanner message={statusMessage} softLightMode={softLightMode} /> : null}

        {selectedPhase && (
          <AnimatedCard index={0}>
            <View style={styles.hero}>
              <Text style={styles.heroLabel}>Current phase</Text>
              <View style={styles.heroTitleRow}>
                <Text style={styles.heroTitle}>{selectedPhase.name}</Text>
              </View>
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
        )}

      <AnimatedCard index={1}>
        <View style={styles.phaseListWrapper}>
          <Text style={styles.sectionTitle}>Lunar parade</Text>
          <FlatList
            data={phases}
            keyExtractor={(_, i) => `phase-${i}`}
            renderItem={({ item, index }) => (
              <PhaseItem
                phase={item}
                active={index === selectedIndex}
                onSelect={() => setSelectedIndex(index)}
                styles={styles}
              />
            )}
            scrollEnabled={false}
          />
        </View>
      </AnimatedCard>

      <AnimatedCard index={2}>
        <View style={styles.ritualCard}>
          <Text style={styles.sectionTitle}>Tonight&apos;s ritual kit</Text>
          {rituals.map((ritual, i) => (
            <View key={ritual.title} style={styles.ritualRow}>
              <View style={styles.ritualIndex}>
                <Text style={styles.ritualIndexText}>{i + 1}</Text>
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
    </View>
  );
};

const createStyles = (softLightMode: boolean, theme: ReturnType<typeof getMoonTheme>) => {
  // Align styling with other pages: white cards with themed text/borders
  const textPrimary = theme.text;
  const textSecondary = theme.textMuted;
  const cardBg = theme.surface;
  const pillBg = theme.surfaceAlt;
  const borderColor = theme.border;
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: 'transparent' },
    scroll: { backgroundColor: 'transparent' },
    contentContainer: { paddingTop: 60, paddingBottom: 130 },
    center: { justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, color: textPrimary },

    statusText: { color: textPrimary, fontSize: 13 },

    hero: {
      marginHorizontal: 16,
      borderRadius: theme.radiusLg,
      padding: theme.spaceLg,
      backgroundColor: cardBg,
      overflow: 'hidden',
      position: 'relative',
      borderWidth: 1,
      borderColor,
    },

    heroLabel: { ...MoonType.labelCaps, color: textSecondary, zIndex: 1 },
    heroTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12, zIndex: 1 },
    heroTitle: {
      ...MoonType.cardTitle,
      color: textPrimary,
      fontSize: 32,
      zIndex: 1,
    },
    heroTitleIcon: { marginTop: 2 },
    heroDescription: {
      ...MoonType.body,
      color: textSecondary,
      marginTop: 6,
      zIndex: 1,
    },

    heroMetaRow: { flexDirection: 'row', gap: 14, marginTop: theme.spaceLg, zIndex: 1 },
    metaBlock: {
      flex: 1,
      borderRadius: theme.radiusMd,
      backgroundColor: cardBg,
      padding: theme.spaceSm,
      borderWidth: 1,
      borderColor,
    },
    metaLabel: { ...MoonType.labelCaps, color: textSecondary },
    metaValue: {
      ...MoonType.bodyStrong,
      color: textPrimary,
      fontSize: 16,
      marginTop: 6,
      fontVariant: ['tabular-nums'],
    },

    phaseListWrapper: {
      margin: 16,
      borderRadius: theme.radiusLg,
      padding: theme.spaceMd,
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor,
    },
    sectionTitle: { ...MoonType.sectionTitle, marginBottom: 12, color: textPrimary },

    phaseItem: {
      borderRadius: theme.radiusMd,
      padding: theme.spaceSm,
      borderWidth: 1,
      borderColor,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      marginBottom: 10,
      backgroundColor: cardBg,
    },
    phaseItemActive: {
      backgroundColor: cardBg,
      borderColor: theme.primary,
    },
    phaseDot: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: theme.primary,
      marginLeft: 2,
      marginRight: 2,
      opacity: 0.9,
    },
    phaseDotActive: {
      opacity: 1,
    },
    phaseName: { ...MoonType.bodyStrong, flex: 1, color: textPrimary },
    phaseSub: { ...MoonType.caption, color: textSecondary },
    phaseNameActive: { color: theme.primary },

    ritualCard: {
      margin: 16,
      borderRadius: theme.radiusLg,
      padding: theme.spaceMd,
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor,
    },
    ritualRow: { flexDirection: 'row', gap: 14, marginTop: 16 },
    ritualIndex: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: cardBg,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor,
    },
    ritualIndexText: { ...MoonType.bodyStrong, color: textPrimary },
    ritualTitle: { ...MoonType.bodyStrong, color: textPrimary },
    ritualDetail: { ...MoonType.body, color: textSecondary },
  });
};

export default MoonScreen;
