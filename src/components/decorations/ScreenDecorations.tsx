import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Rect, Stop } from 'react-native-svg';
import { CloudLayer } from '../decor/CloudLayer';
import { minimalMoonPalette } from '../../theme/moonTheme';

type Variant = 'home' | 'forecast' | 'moon' | 'settings';

const starsByVariant: Record<Variant, { x: number; y: number; r: number }[]> = {
  home: [
    { x: 28, y: 46, r: 1.2 }, { x: 82, y: 30, r: 1.1 }, { x: 140, y: 58, r: 1.4 },
    { x: 206, y: 34, r: 1.0 }, { x: 270, y: 64, r: 1.2 }, { x: 40, y: 120, r: 1.0 },
    { x: 112, y: 108, r: 1.2 }, { x: 186, y: 126, r: 1.1 }, { x: 260, y: 110, r: 1.0 },
    { x: 320, y: 96, r: 1.1 }, { x: 68, y: 168, r: 1.1 }, { x: 146, y: 176, r: 1.0 },
    { x: 224, y: 170, r: 1.1 }, { x: 296, y: 182, r: 1.0 }, { x: 340, y: 40, r: 0.9 },
  ],
  forecast: [{ x: 20, y: 40, r: 1 }, { x: 80, y: 120, r: 1.2 }],
  moon: [{ x: 24, y: 32, r: 1.1 }, { x: 90, y: 60, r: 1.3 }],
  settings: [],
};

const StarField = ({ variant }: { variant: Variant }) => {
  const stars = starsByVariant[variant] ?? [];
  return (
    <G opacity={0.12}>
      {stars.map((s, i) => (
        <Circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" />
      ))}
    </G>
  );
};

export function ScreenDecorations({ variant = 'home', softLightMode }: { variant?: Variant, softLightMode?: boolean }) {
  const { width } = useWindowDimensions();
  const gradientHeight = 520;
  const isDaytime = !softLightMode;
  const showStars = false; // 移除星點與漸層
  const palette = minimalMoonPalette;
  const fillColor = softLightMode ? palette.nightGrey : palette.softIndigo;

  return (
    <View style={[StyleSheet.absoluteFill, styles.clip]} pointerEvents="none">
      <CloudLayer visible={isDaytime} />

      <Svg width={width} height={gradientHeight} viewBox={`0 0 ${width} ${gradientHeight}`} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="headerGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={fillColor} stopOpacity="1" />
            <Stop offset="100%" stopColor={fillColor} stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="footerFade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={fillColor} stopOpacity="1" />
            <Stop offset="100%" stopColor={fillColor} stopOpacity="1" />
          </LinearGradient>
        </Defs>

        <Rect x="0" y="0" width={width} height={gradientHeight} fill="url(#headerGradient)" />
        <Rect x="0" y={gradientHeight - 220} width={width} height={220} fill="url(#footerFade)" />
        {showStars ? <StarField variant={variant} /> : null}
      </Svg>

    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
  },
});
