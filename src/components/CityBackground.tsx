import React, { useMemo, useState } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { cityBackgrounds, sceneryFallbacks } from '../constants/cityBackgrounds';
import { normalizeCityKey } from '../utils/normalizeCityKey';

type Props = {
  cityName?: string;
  children?: React.ReactNode;
};

export function CityBackground({ cityName, children }: Props) {
  const cityKey = normalizeCityKey(cityName);
  const [failed, setFailed] = useState(false);

  const fallbackIndex = useMemo(() => {
    const key = cityKey || 'fallback';
    const sum = key.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return sum % sceneryFallbacks.length;
  }, [cityKey]);

  const bg = useMemo(() => {
    if (failed) return sceneryFallbacks[fallbackIndex] || cityBackgrounds.fallback;
    return cityBackgrounds[cityKey] ?? sceneryFallbacks[fallbackIndex] ?? cityBackgrounds.fallback;
  }, [cityKey, failed, fallbackIndex]);

  return (
    <ImageBackground
      source={{ uri: bg.uri }}
      style={[styles.image, { aspectRatio: bg.ratio }]}
      resizeMode="cover"
      onError={() => setFailed(true)}
    >
      <View style={styles.overlay} />
      <View style={styles.content}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#7B6CFF',
    opacity: 0.12,
  },
  content: {
    padding: 16,
  },
});

export default CityBackground;
