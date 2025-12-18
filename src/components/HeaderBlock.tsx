import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TopBar } from './TopBar';
import { TemperatureBlock } from './TemperatureBlock';

interface HeaderBlockProps {
  city: string;
  temperature: string;
  description: string;
  rangeText?: string;
  softLightMode: boolean;
  onCityPress: () => void;
  onSettingsPress: () => void;
}

export const HeaderBlock = ({
  city,
  temperature,
  description,
  rangeText,
  softLightMode,
  onCityPress,
  onSettingsPress,
}: HeaderBlockProps) => {
  return (
    <View style={styles.container}>
      <TopBar city={city} onCityPress={onCityPress} onSettingsPress={onSettingsPress} softLightMode={softLightMode} />
      <TemperatureBlock
        temperature={temperature}
        description={description}
        rangeText={rangeText}
        softLightMode={softLightMode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // This container is now just for layout, not for background/decorations.
    // Spacing will be handled internally by child components and HomeScreen.
  },
});

export default HeaderBlock;
