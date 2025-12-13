import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MoonSenseColors } from '../constants/colors';

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  drop: 'water-outline',
  thermo: 'thermometer-outline',
  wind: 'leaf-outline',
  sun: 'sunny-outline',
  leaf: 'leaf-outline',
  barometer: 'speedometer-outline',
  sunrise: 'sunny-outline',
  'sun-rain': 'rainy-outline',
};

const CardIcon = ({ icon }: { icon: string }) => (
  <View style={styles.iconPlaceholder}>
    <Ionicons name={iconMap[icon] || 'planet-outline'} size={20} color={MoonSenseColors.NightGrey} />
  </View>
);

export type InfoCardProps = {
  title: string;
  value: string;
  icon: string;
  backgroundColor: string;
  type: 'humidity' | 'feelsLike' | 'wind' | 'uvIndex' | 'airQuality' | 'pressure' | 'sunriseSunset' | 'airTemp' | 'waterTemp'; // Added new types
  expandedData?: any; // To pass the expanded content from API
};

const InfoCard = ({ title, value, icon, backgroundColor, type, expandedData }: InfoCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(120)).current; // Start with a sane default height
  const [initialHeight, setInitialHeight] = useState(0);
  const [expandedContentHeight, setExpandedContentHeight] = useState(0);

  useEffect(() => {
    if (isExpanded) {
      Animated.timing(animatedHeight, {
        toValue: initialHeight + expandedContentHeight, // Animate to content height + padding
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedHeight, {
        toValue: initialHeight, // Animate back to initial height
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isExpanded, animatedHeight, initialHeight, expandedContentHeight]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const renderExpandedContent = () => {
    if (!isExpanded || !expandedData) return null;

    switch (type) {
      case 'airTemp':
        return (
          <View style={styles.expandedContent}>
            <Text style={styles.expandedTitle}>Today&apos;s Temperature Trend:</Text>
            <Text style={styles.expandedText}>{expandedData.indicator}</Text>
            <Text style={styles.expandedText}>Hourly: {expandedData.hourly.join(', ')}</Text>
          </View>
        );
      case 'waterTemp':
        return (
          <View style={styles.expandedContent}>
            <Text style={styles.expandedTitle}>Water Temperature:</Text>
            <Text style={styles.expandedText}>Current: {expandedData.current}</Text>
            <Text style={styles.expandedText}>Trend: {expandedData.trend}</Text>
            <Text style={styles.expandedText}>Suggestion: {expandedData.suggestion}</Text>
          </View>
        );
      case 'feelsLike':
        return (
          <View style={styles.expandedContent}>
            <Text style={styles.expandedTitle}>Today&apos;s Emotional Advice:</Text>
            <Text style={styles.expandedText}>{expandedData.advice}</Text>
          </View>
        );
      default:
        return (
          <View style={styles.expandedContent}>
            <Text style={styles.expandedTitle}>More Details:</Text>
            <Text style={styles.expandedText}>No expanded content for this type yet.</Text>
          </View>
        );
    }
  };

  return (
    <TouchableOpacity 
      onPress={toggleExpand} 
      activeOpacity={0.9}
      onLayout={(event) => {
        if (initialHeight === 0) {
          setInitialHeight(event.nativeEvent.layout.height);
          animatedHeight.setValue(event.nativeEvent.layout.height); // Set initial animated value
        }
      }}
      style={[styles.baseContainer, { backgroundColor }]}
    >
      <Animated.View style={[styles.animatedContainer, { height: animatedHeight }]}>
        <View style={styles.header}>
          <CardIcon icon={icon} />
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.value}>{value}</Text>
        <View onLayout={(event) => {
          if (expandedContentHeight === 0) {
            setExpandedContentHeight(event.nativeEvent.layout.height);
          }
        }}>
          {renderExpandedContent()}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    borderRadius: 18,
    margin: 8,
    flex: 1,
    minWidth: 120,
    overflow: 'hidden', // Clip content outside rounded borders
  },
  animatedContainer: {
    padding: 16,
    // minHeight is not good with Animated.Value
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    color: MoonSenseColors.NightGrey,
    marginLeft: 8,
    fontWeight: '500',
  },
  value: {
    fontSize: 36,
    fontWeight: 'bold',
    color: MoonSenseColors.NightGrey,
    marginTop: 4,
    textAlign: 'center',
  },
  expandedContent: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  expandedTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: MoonSenseColors.NightGrey,
    marginBottom: 5,
  },
  expandedText: {
    fontSize: 12,
    color: MoonSenseColors.NightGrey,
    marginBottom: 3,
  },
});

export default InfoCard;
