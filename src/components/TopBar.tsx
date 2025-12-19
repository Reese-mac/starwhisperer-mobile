import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getMoonTheme } from '@/theme/moonTheme';
import { MoonType } from '@/theme/moonTypography';
import { CITY_OPTIONS } from '@/constants/cities';
import { useSettings } from '@/context/SettingsContext';

type TopBarProps = {
  city: string;
  onCityPress: () => void;
  onSettingsPress: () => void;
  softLightMode: boolean;
};

export const TopBar = ({ city, onCityPress: _onCityPress, onSettingsPress, softLightMode }: TopBarProps) => {
  const theme = getMoonTheme(softLightMode);
  const { setCityById } = useSettings();
  const [open, setOpen] = useState(false);

  const menuOptions = useMemo(() => CITY_OPTIONS, []);

  const handleSelect = (id: string) => {
    setCityById(id);
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      {open ? (
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setOpen(false)} />
      ) : null}

      <TouchableOpacity
        onPress={() => setOpen(prev => !prev)}
        activeOpacity={0.85}
        style={[
          styles.cityButton,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <Ionicons name="location-outline" size={18} color={theme.text} />
        <Text style={[styles.cityLabel, { color: theme.text }]} numberOfLines={1}>
          {city}
        </Text>
        <Ionicons name="chevron-down" size={16} color={theme.textMuted} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View
          style={[
            styles.dropdown,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              shadowColor: '#000',
            },
          ]}
        >
          <ScrollView style={styles.dropdownScroll} showsVerticalScrollIndicator={false}>
            {menuOptions.map(option => (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleSelect(option.id)}
                activeOpacity={0.85}
                style={styles.dropdownItem}
              >
                <Text style={[styles.dropdownText, { color: theme.text }]}>
                  {option.name} · {option.country}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      <TouchableOpacity
        onPress={onSettingsPress}
        accessibilityLabel="Open settings"
        activeOpacity={0.85}
        style={[
          styles.iconButton,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <Ionicons name="settings-outline" size={18} color={theme.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
    gap: 10,
    position: 'relative',
    overflow: 'visible',
    zIndex: 10000,
  },
  cityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
  },
  cityLabel: {
    ...MoonType.bodyStrong,
    flex: 1,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  dropdown: {
    position: 'absolute',
    top: 58,
    left: 14,
    right: 56,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 2,
    paddingVertical: 6,
    zIndex: 11000,
    elevation: 24,
    maxHeight: 240,
    overflow: 'hidden',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  dropdownScroll: {
    maxHeight: 240,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownText: {
    ...MoonType.body,
  },
});

export default TopBar;
