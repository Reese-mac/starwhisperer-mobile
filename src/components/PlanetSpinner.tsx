import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

type Props = {
  size?: number;
};

const PlanetSpinner = ({ size = 120 }: Props) => {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 9000,
        useNativeDriver: true,
      }),
    ).start();
  }, [spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <AnimatedGradient
        colors={['#8C6CFF', '#5B2CE0', '#9F7BFF', '#6C4AFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.planet,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ rotate }],
          },
        ]}
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.28)', 'rgba(255,255,255,0)']}
        start={{ x: 0.2, y: 0.1 }}
        end={{ x: 0.8, y: 0.9 }}
        style={[
          styles.highlight,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.rim,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
  },
  planet: {
    position: 'absolute',
  },
  highlight: {
    position: 'absolute',
  },
  rim: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
});

export default PlanetSpinner;
