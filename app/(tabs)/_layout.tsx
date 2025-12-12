import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const TAB_ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  home: { active: "home", inactive: "home-outline" },
  explore: { active: "compass", inactive: "compass-outline" },
  moon: { active: "moon", inactive: "moon-outline" },
  forecast: { active: "calendar", inactive: "calendar-outline" },
  settings: { active: "settings", inactive: "settings-outline" },
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#6C4AFF",
        tabBarInactiveTintColor: "#9EA1B4",
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ color, focused }) => {
          const config = TAB_ICONS[route.name] ?? { active: "ellipse", inactive: "ellipse-outline" };
          const iconName = focused ? config.active : config.inactive;
          return <Ionicons name={iconName} size={20} color={color} />;
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
