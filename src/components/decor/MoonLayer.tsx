import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

export function MoonLayer({ visible }: { visible: boolean }) {
  const glow = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [visible]);

  const animatedOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.12, 0.18],
  });

  return (
    <Animated.Image
      source={require('../../assets/moon.png')}
      style={[
        styles.moon,
        {
          opacity: Animated.multiply(opacity, animatedOpacity),
        },
      ]}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  moon: {
    position: 'absolute',
    right: -10,
    top: 30,
    width: 140,
    height: 140,
    resizeMode: 'contain',
    zIndex: 1,
  },
});
