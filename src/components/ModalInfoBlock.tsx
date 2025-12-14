import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MoonSenseColors } from '../constants/colors';

export type ModalInfoBlockProps = {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  softLightMode?: boolean;
};

const ModalInfoBlock = ({ label, value, icon, softLightMode = false }: ModalInfoBlockProps) => {
  const cardBg = softLightMode ? 'rgba(255,255,255,0.08)' : MoonSenseColors.MistBlue;
  const textColor = softLightMode ? '#EDECF7' : MoonSenseColors.NightGrey;
  const iconColor = softLightMode ? '#EDECF7' : MoonSenseColors.NightGrey;
  return (
    <View style={[styles.container, { backgroundColor: cardBg }]}>
      <Ionicons name={icon} size={24} color={iconColor} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={[styles.label, { color: textColor, opacity: softLightMode ? 0.85 : 0.7 }]}>{label}</Text>
        <Text style={[styles.value, { color: textColor }]}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MoonSenseColors.MistBlue,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  icon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: MoonSenseColors.NightGrey,
    opacity: 0.7,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: MoonSenseColors.NightGrey,
    marginTop: 2,
  },
});

export default ModalInfoBlock;
