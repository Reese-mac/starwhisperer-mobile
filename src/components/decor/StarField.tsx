import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type Variant = 'home' | 'forecast' | 'moon' | 'settings';

type Star = {
  x: number;
  y: number;
  r: number;
  o?: number;
};

const starSets: Record<Variant, Star[]> = {
  home: [
    { x: 8, y: 12, r: 0.9 },
    { x: 24, y: 18, r: 1.1 },
    { x: 40, y: 10, r: 0.7 },
    { x: 76, y: 16, r: 1.2 },
    { x: 92, y: 28, r: 0.8 },
    { x: 18, y: 36, r: 1 },
    { x: 88, y: 48, r: 0.9 },
    { x: 12, y: 70, r: 0.6 },
    { x: 44, y: 76, r: 0.7 },
    { x: 72, y: 82, r: 0.6 },
  ],
  forecast: [
    { x: 12, y: 14, r: 0.8 },
    { x: 34, y: 10, r: 1.1 },
    { x: 70, y: 18, r: 0.7 },
    { x: 88, y: 12, r: 0.9 },
    { x: 16, y: 32, r: 0.9 },
    { x: 86, y: 44, r: 1.1 },
    { x: 28, y: 60, r: 0.7 },
    { x: 64, y: 64, r: 0.9 },
    { x: 82, y: 76, r: 0.6 },
  ],
  moon: [
    { x: 16, y: 16, r: 1 },
    { x: 34, y: 10, r: 0.7 },
    { x: 78, y: 18, r: 1 },
    { x: 90, y: 30, r: 0.8 },
    { x: 18, y: 42, r: 0.9 },
    { x: 70, y: 46, r: 0.7 },
    { x: 84, y: 62, r: 0.8 },
    { x: 30, y: 72, r: 0.6 },
    { x: 64, y: 82, r: 0.6 },
  ],
  settings: [
    { x: 10, y: 14, r: 0.8 },
    { x: 28, y: 8, r: 0.6 },
    { x: 72, y: 14, r: 0.8 },
    { x: 88, y: 22, r: 0.7 },
    { x: 18, y: 32, r: 0.6 },
    { x: 54, y: 42, r: 0.7 },
    { x: 82, y: 54, r: 0.6 },
    { x: 34, y: 70, r: 0.5 },
    { x: 72, y: 78, r: 0.5 },
  ],
};

const StarField = ({ variant = 'home' }: { variant?: Variant }) => {
  const stars = starSets[variant] ?? starSets.home;

  return (
    <View pointerEvents="none" style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {stars.map((star, index) => (
          <Circle
            key={`${variant}-star-${index}`}
            cx={star.x}
            cy={star.y}
            r={star.r}
            fill="#FFFFFF"
            opacity={star.o ?? 0.9}
          />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.08,
    zIndex: 0,
  },
});

export default StarField;
