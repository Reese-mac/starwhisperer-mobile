import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

export function CloudLayer({ visible }: { visible: boolean }) {
  const float = useRef(new Animated.Value(0)).current;
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
        Animated.timing(float, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [visible]);

  const translateY = float.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -4],
  });

  return (
    <Animated.Image
      // Note: The asset 'cloud.png' was not found in the project.
      // Assuming it will be added at 'src/assets/cloud.png'.
      source={require('../../assets/cloud.png')}
      style={[
        styles.cloud,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  cloud: {
    position: 'absolute',
    right: -20,
    bottom: 40,
    width: '45%',
    height: 120,
    opacity: 0.1,
    resizeMode: 'contain',
    zIndex: 1,
  },
});
