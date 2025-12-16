import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

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

const Moon = ({ size }: { size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 200 200" pointerEvents="none">
    <Defs>
      <RadialGradient id="moonGlow" cx="32%" cy="32%" r="65%">
        <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
        <Stop offset="45%" stopColor="#F4F3FF" stopOpacity="0.85" />
        <Stop offset="80%" stopColor="#DAD4FF" stopOpacity="0.6" />
        <Stop offset="100%" stopColor="#CFC8FF" stopOpacity="0.25" />
      </RadialGradient>
      <LinearGradient id="moonTerminator" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0%" stopColor="#000000" stopOpacity="0.16" />
        <Stop offset="45%" stopColor="#000000" stopOpacity="0.1" />
        <Stop offset="70%" stopColor="#000000" stopOpacity="0.06" />
        <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </LinearGradient>
    </Defs>
    <Circle cx="100" cy="100" r="90" fill="url(#moonGlow)" />
    <Circle cx="100" cy="100" r="90" fill="url(#moonTerminator)" />
    <Circle cx="72" cy="74" r="12" fill="rgba(255,255,255,0.22)" />
    <Circle cx="128" cy="66" r="10" fill="rgba(255,255,255,0.16)" />
    <Circle cx="118" cy="118" r="9" fill="rgba(255,255,255,0.14)" />
    <Circle cx="84" cy="122" r="7" fill="rgba(225,220,255,0.18)" />
    <Circle cx="140" cy="106" r="6" fill="rgba(220,215,255,0.12)" />
  </Svg>
);

export function ScreenDecorations({ variant = 'home' }: { variant?: Variant }) {
  const { width } = useWindowDimensions();
  const scale = width / 390;
  const gradientHeight = 520;

  return (
    <View style={[StyleSheet.absoluteFill, styles.clip]} pointerEvents="none">
      <Svg width={width} height={gradientHeight} viewBox={`0 0 ${width} ${gradientHeight}`} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="headerGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#7C78FF" stopOpacity="0.8" />
            <Stop offset="45%" stopColor="#7FA4FF" stopOpacity="0.65" />
            <Stop offset="80%" stopColor="#C6D4FF" stopOpacity="0.4" />
            <Stop offset="100%" stopColor="#F4EEFF" stopOpacity="0.2" />
          </LinearGradient>
          <LinearGradient id="footerFade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#F4EEFF" stopOpacity="0" />
            <Stop offset="100%" stopColor="#F6F1FF" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        <Rect x="0" y="0" width={width} height={gradientHeight} fill="url(#headerGradient)" />
        <Rect x="0" y={gradientHeight - 220} width={width} height={220} fill="url(#footerFade)" />
        <StarField variant={variant} />
      </Svg>

      {variant !== 'settings' && (
        <View
          style={{
            position: 'absolute',
            top: -36 * scale,
            right: -28 * scale,
            opacity: 0.14,
          }}
        >
          <Moon size={220 * scale} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
  },
});
