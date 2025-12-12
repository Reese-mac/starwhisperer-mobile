import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MoonSenseColors } from '../constants/colors';

export type ModalInfoBlockProps = {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const ModalInfoBlock = ({ label, value, icon }: ModalInfoBlockProps) => {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={24} color={MoonSenseColors.NightGrey} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
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
