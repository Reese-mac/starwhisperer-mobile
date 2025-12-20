import React, { useMemo } from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSettings } from '@/context/SettingsContext';
import { getMoonTheme } from '@/theme/moonTheme';

const TAB_ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  home: { active: "home", inactive: "home-outline" },
  explore: { active: "compass", inactive: "compass-outline" },
  moon: { active: "moon", inactive: "moon-outline" },
  forecast: { active: "calendar", inactive: "calendar-outline" },
  settings: { active: "settings", inactive: "settings-outline" },
};

export default function TabsLayout() {
  const { softLightMode } = useSettings();
  const theme = useMemo(() => getMoonTheme(softLightMode), [softLightMode]);

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: softLightMode ? 'rgba(255,255,255,0.55)' : 'rgba(43,45,66,0.48)',
        tabBarLabelStyle: { fontSize: 12, marginTop: 2 },
        tabBarStyle: {
          position: 'absolute',
          left: 12,
          right: 12,
          bottom: 12,
          height: 64,
          paddingTop: 6,
          paddingBottom: Platform.OS === 'ios' ? 12 : 10,
          borderTopWidth: 1,
          borderRadius: 20,
          backgroundColor: theme.tabBarBg,
          borderWidth: 1,
          borderColor: theme.tabBarBorder,
          shadowColor: 'transparent',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarIcon: ({ color, focused }) => {
          const config = TAB_ICONS[route.name] ?? { active: "ellipse", inactive: "ellipse-outline" };
          const iconName = focused ? config.active : config.inactive;
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="explore" options={{ title: "Explore" }} />
      <Tabs.Screen name="moon" options={{ title: "Moon" }} />
      <Tabs.Screen name="forecast" options={{ title: "Forecast" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
