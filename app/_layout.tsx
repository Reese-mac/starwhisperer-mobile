import 'react-native-reanimated';

import { Stack } from 'expo-router';
import { SettingsProvider } from '@/context/SettingsContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform } from 'react-native';
import { useEffect } from 'react';

export default function RootLayout() {
  useEffect(() => {
    // Guard for web to avoid crashes in Expo Go.
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.body.style.overflowY = 'auto';
      document.body.style.height = 'auto';
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, ...(Platform.OS === 'web' && { minHeight: '100vh', overflowY: 'auto' }) }}>
      <SettingsProvider>
        <Stack screenOptions={{ headerShown: false }} initialRouteName="landing">
          <Stack.Screen name="landing" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false }} />
        </Stack>
      </SettingsProvider>
    </GestureHandlerRootView>
  );
}
