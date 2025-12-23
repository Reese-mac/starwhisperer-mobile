import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, Modal } from 'react-native';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MoonSenseColors } from '@/constants/colors';
import { useSettings } from '@/context/SettingsContext';
import { fetchMoonPhases, MoonPhaseEntry } from '@/services/weatherAPI';

const MoonScreen = () => {
  const { softLightMode, city } = useSettings();
  const styles = useMemo(() => createStyles(softLightMode), [softLightMode]);
  const scrollRef = useRef<ScrollView>(null);
  const [phaseCards, setPhaseCards] = useState<MoonPhaseEntry[]>([]);
  const [loadingPhases, setLoadingPhases] = useState(true);
  const [phaseError, setPhaseError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<MoonPhaseEntry | null>(null);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  const moonStory = useMemo(() => {
    const phaseWords = [
      { label: 'New Moon', story: 'The sky resets—perfect for a quiet restart and gentle intentions.' },
      { label: 'Waxing Crescent', story: 'Small aligned actions start to stack; nurture one tiny habit today.' },
      { label: 'First Quarter', story: 'Half-lit focus—choose one decision and move it forward.' },
      { label: 'Waxing Gibbous', story: 'Momentum grows; refine details and keep the rhythm steady.' },
      { label: 'Full Moon', story: 'Everything feels louder—name what you want to release after this round.' },
      { label: 'Waning Gibbous', story: 'Harvest and edit; keep what serves you, lighten what does not.' },
      { label: 'Last Quarter', story: 'A gentle check-in—adjust course before the next cycle begins.' },
      { label: 'Waning Crescent', story: 'Rest and integrate; softness now seeds the next reset.' },
    ];
    const day = new Date().getDate() % 29;
    const bucket = Math.min(Math.floor((day / 29) * phaseWords.length), phaseWords.length - 1);
    return phaseWords[bucket];
  }, []);

  const phaseImages: Record<string, string> = useMemo(
    () => ({
      'New Moon': 'https://svs.gsfc.nasa.gov/vis/a000000/a005000/a005048/frames/730x730_1x1_30p/moon.0001.jpg',
      'Waxing Crescent': 'https://svs.gsfc.nasa.gov/vis/a000000/a005000/a005048/frames/730x730_1x1_30p/moon.0200.jpg',
      'First Quarter': 'https://svs.gsfc.nasa.gov/vis/a000000/a005000/a005048/frames/730x730_1x1_30p/moon.0450.jpg',
      'Waxing Gibbous': 'https://svs.gsfc.nasa.gov/vis/a000000/a005000/a005048/frames/730x730_1x1_30p/moon.0650.jpg',
      'Full Moon': 'https://svs.gsfc.nasa.gov/vis/a000000/a005000/a005048/frames/730x730_1x1_30p/moon.0750.jpg',
      'Waning Gibbous': 'https://svs.gsfc.nasa.gov/vis/a000000/a005000/a005048/frames/730x730_1x1_30p/moon.0950.jpg',
      'Last Quarter': 'https://svs.gsfc.nasa.gov/vis/a000000/a005000/a005048/frames/730x730_1x1_30p/moon.1150.jpg',
      'Waning Crescent': 'https://svs.gsfc.nasa.gov/vis/a000000/a005000/a005048/frames/730x730_1x1_30p/moon.1350.jpg',
    }),
    [],
  );

  useEffect(() => {
    const loadPhases = async () => {
      setLoadingPhases(true);
      setPhaseError(null);
      try {
        const data = await fetchMoonPhases(city);
        setPhaseCards(data);
      } catch (error) {
        console.warn('Failed to load moon phases', error);
        setPhaseError('Moon data is temporarily unavailable.');
      } finally {
        setLoadingPhases(false);
      }
    };
    loadPhases();
  }, [city]);

  const handleOpenCard = (item: MoonPhaseEntry) => {
    setSelectedCard(item);
    setSelectedImageUri(phaseImages[item.name] ?? phaseImages['Full Moon']);
  };

  useScrollToTop(scrollRef);
  useFocusEffect(
    React.useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
      return undefined;
    }, []),
  );

  const renderDetailModal = () => {
    if (!selectedCard) return null;
    const imageUri = selectedImageUri ?? phaseImages[selectedCard.name] ?? phaseImages['Full Moon'];
    return (
      <Modal visible transparent animationType="fade" onRequestClose={() => setSelectedCard(null)}>
        <View style={styles.detailOverlay}>
          <TouchableOpacity style={styles.detailBackdrop} onPress={() => setSelectedCard(null)} />
          <View style={styles.detailCard}>
            <ImageBackground
              source={{ uri: imageUri }}
              style={styles.detailImage}
              resizeMode="contain"
              onError={() => setSelectedImageUri(phaseImages['Full Moon'])}
            />
            <View style={styles.detailContent}>
              <Text style={styles.detailTitle}>{selectedCard.name}</Text>
              <Text style={styles.detailMeta}>Illumination {selectedCard.illumination}</Text>
              <Text style={styles.detailMeta}>Rise {selectedCard.riseTime} · Set {selectedCard.setTime}</Text>
              <Text style={styles.detailDescription}>{selectedCard.description} {selectedCard.energySuggestion}</Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{ uri: phaseImages['Full Moon'] }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient colors={['rgba(8,8,20,0.5)', 'rgba(8,8,20,0.85)']} style={styles.overlay} />

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ paddingTop: 40, paddingBottom: 40 }}
        >
          <View style={styles.storyPanel}>
            <Text style={styles.label}>Moon story</Text>
            <Text style={styles.title}>{moonStory.label}</Text>
            <Text style={styles.text}>{moonStory.story}</Text>
          </View>

          <View style={styles.collectionPanel}>
            <Text style={styles.collectionTitle}>Collectible phases</Text>
            {phaseError ? <Text style={styles.hint}>{phaseError}</Text> : null}
            {loadingPhases ? (
              <Text style={styles.hint}>Syncing moon data...</Text>
            ) : (
              phaseCards.map(item => (
                <TouchableOpacity key={`${item.name}-${item.riseTime}`} style={styles.cardRow} onPress={() => handleOpenCard(item)}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardName}>{item.name}</Text>
                    <Text style={styles.cardMeta}>Illumination: {item.illumination}</Text>
                    <Text style={styles.cardMeta}>Rise {item.riseTime} · Set {item.setTime}</Text>
                    <Text style={styles.cardDescription}>{item.description} {item.energySuggestion}</Text>
                  </View>
                  <Text style={styles.viewText}>View</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      </ImageBackground>

      <StatusBar style="light" />
      {renderDetailModal()}
    </SafeAreaView>
  );
};

const createStyles = (softLightMode: boolean) => {
  const surfaceBg = softLightMode ? MoonSenseColors.NightGrey : MoonSenseColors.LunarGlow;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: surfaceBg,
    },
    backgroundImage: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
    },
    storyPanel: {
      margin: 20,
      padding: 20,
      borderRadius: 22,
      backgroundColor: 'rgba(255,255,255,0.18)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.22)',
      backdropFilter: 'blur(8px)',
      gap: 8,
    },
    label: {
      color: '#eef',
      textTransform: 'uppercase',
      letterSpacing: 2,
      fontSize: 12,
    },
    title: {
      fontSize: 28,
      fontWeight: '800',
      color: '#fff',
    },
    text: {
      fontSize: 16,
      lineHeight: 23,
      color: '#f4f4ff',
    },
    collectionPanel: {
      marginHorizontal: 20,
      marginBottom: 20,
      padding: 16,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.18)',
    },
    collectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#fff',
      marginBottom: 12,
    },
    hint: {
      color: '#e8e8ff',
      fontSize: 12,
      marginBottom: 8,
    },
    cardRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: 14,
      borderRadius: 16,
      backgroundColor: 'rgba(255,255,255,0.12)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.18)',
      marginBottom: 10,
      gap: 10,
    },
    cardName: {
      fontSize: 16,
      fontWeight: '800',
      color: '#fff',
      marginBottom: 4,
    },
    cardMeta: {
      fontSize: 12,
      color: '#e8e8ff',
      marginBottom: 2,
    },
    cardDescription: {
      fontSize: 13,
      lineHeight: 18,
      color: '#f4f4ff',
      marginTop: 4,
    },
    viewText: {
      color: '#e8e8ff',
      fontWeight: '700',
      fontSize: 13,
      alignSelf: 'center',
    },
    detailOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    detailBackdrop: {
      ...StyleSheet.absoluteFillObject,
    },
    detailCard: {
      width: '100%',
      maxWidth: 380,
      borderRadius: 20,
      overflow: 'hidden',
      backgroundColor: '#0c0d1c',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
    },
    detailImage: {
      width: '100%',
      aspectRatio: 1,
      backgroundColor: '#000',
    },
    detailContent: {
      padding: 16,
      gap: 4,
    },
    detailTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: '#fff',
    },
    detailMeta: {
      fontSize: 12,
      color: '#e8e8ff',
    },
    detailDescription: {
      fontSize: 14,
      lineHeight: 20,
      color: '#f4f4ff',
      marginTop: 6,
    },
  });
};

export default MoonScreen;
