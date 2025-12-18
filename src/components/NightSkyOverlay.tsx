import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

type Props = {
  intensity?: number; // 0..1
};

export default function NightSkyOverlay({ intensity = 1 }: Props) {
  const alpha = useMemo(() => Math.max(0, Math.min(1, intensity)), [intensity]);

  return (
    <Svg style={styles.overlay} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={`rgba(0,0,0,${0.38 * alpha})`} />
          <Stop offset="0.45" stopColor={`rgba(0,0,0,${0.08 * alpha})`} />
          <Stop offset="1" stopColor={`rgba(0,0,0,${0.22 * alpha})`} />
        </LinearGradient>
      </Defs>

      <Rect x="0" y="0" width="100" height="100" fill="url(#vignette)" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
