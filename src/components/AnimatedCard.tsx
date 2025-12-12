import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet } from 'react-native';

type AnimatedCardProps = {
  children: React.ReactNode;
  index: number;
};

const AnimatedCard = ({ children, index }: AnimatedCardProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500, // Fade in duration
      delay: index * 100, // Stagger the animation
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200, // Slide in duration
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, slideAnim, index]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    // The component that uses AnimatedCard should provide flex, margin, etc.
  },
});

export default AnimatedCard;
