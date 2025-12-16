import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

type MoonDecorationProps = {
  position?: 'topRight' | 'topLeft';
  size?: number;
  opacity?: number;
  style?: ViewStyle;
};

const MoonDecoration = ({
  position = 'topRight',
  size = 220,
  opacity = 0.1,
  style,
}: MoonDecorationProps) => {
  const alignment = position === 'topLeft' ? { top: -50, left: -30 } : { top: -50, right: -30 };

  return (
    <View
      pointerEvents="none"
      style={[styles.container, alignment, { width: size, height: size, opacity }, style]}
    >
      <Svg width="100%" height="100%" viewBox="0 0 200 200">
        <Defs>
          <LinearGradient id="moonGlow" x1="0%" y1="0%" x2="80%" y2="80%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.9} />
            <Stop offset="60%" stopColor="#E9E6FF" stopOpacity={0.7} />
            <Stop offset="100%" stopColor="#BFB3FF" stopOpacity={0.4} />
          </LinearGradient>
        </Defs>

        <Circle cx="100" cy="100" r="90" fill="url(#moonGlow)" />
        <Circle cx="70" cy="82" r="12" fill="rgba(255,255,255,0.32)" />
        <Circle cx="132" cy="70" r="10" fill="rgba(255,255,255,0.24)" />
        <Circle cx="118" cy="128" r="8" fill="rgba(255,255,255,0.2)" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 0,
  },
});

export default MoonDecoration;
