import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMoonTheme } from '../theme/moonTheme';
import { MoonType } from '../theme/moonTypography';

type Props = {
  message: string;
  softLightMode: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
};

export default function StatusBanner({ message, softLightMode, icon = 'information-circle-outline' }: Props) {
  const theme = useMemo(() => getMoonTheme(softLightMode), [softLightMode]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.surface, borderColor: theme.border, borderRadius: theme.radiusMd },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: theme.primary }]} />
      <Ionicons name={icon} size={16} color={theme.textMuted} style={styles.icon} />
      <Text style={[styles.text, { color: theme.textMuted }]} numberOfLines={2}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
    opacity: 0.8,
  },
  icon: {
    marginRight: 8,
    opacity: 0.9,
  },
  text: {
    ...MoonType.body,
    flex: 1,
    lineHeight: 18,
  },
});
