import React from 'react';
import { View, StyleSheet } from 'react-native';

export function MoonDecoration() {
  return (
    <View style={styles.moon} />
  );
}

const styles = StyleSheet.create({
  moon: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#FFFFFF',

    // Edge darkening, like the lunar surface
    shadowColor: '#B9B3FF',
    shadowOffset: { width: -30, height: 20 },
    shadowOpacity: 0.35,
    shadowRadius: 120,

    elevation: 14,
  },
});
