import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { moonTheme } from '../theme/moonTheme';
import { moonTypography } from '../theme/moonTypography';
import { Svg, Path } from 'react-native-svg';

const WeatherHeaderScreen = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[moonTheme.colors.background, '#1a1a2e']}
        style={styles.background}
      />
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>MinimalMoon Weather</Text>
          <Text style={styles.subtitle}>Your cosmic weather companion</Text>
        </View>
        <View style={styles.illustrationContainer}>
          <Svg height="200" width="200" viewBox="0 0 100 100">
            <Path
              d="M 50 10 A 40 40 0 1 1 50 90 A 40 40 0 1 1 50 10 Z"
              fill={moonTheme.colors.primary}
            />
            <Path
              d="M 40 20 A 30 30 0 1 0 40 80 A 30 30 0 1 0 40 20 Z"
              fill={moonTheme.colors.background}
            />
          </Svg>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  textContainer: {
    flex: 1,
  },
  illustrationContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    ...moonTypography.heading,
    color: moonTheme.colors.text,
    fontSize: 48,
    marginBottom: 10,
  },
  subtitle: {
    ...moonTypography.subheading,
    color: moonTheme.colors.text,
    fontSize: 24,
  },
});

export default WeatherHeaderScreen;
