import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { SettingsProvider } from "../src/context/SettingsContext";

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const done = await AsyncStorage.getItem("onboarding_done");
        setShowOnboarding(done !== "true");
      } catch (error) {
        console.error("Failed to load onboarding status from AsyncStorage:", error);
        // Default to showing onboarding if AsyncStorage fails
        setShowOnboarding(true);
      } finally {
        setReady(true);
      }
    }
    load();
  }, []);

  if (!ready) return null;

  console.log("Initial Route Name:", showOnboarding ? "onboarding" : "(tabs)");

  return (
    <SettingsProvider>
      <Stack
        screenOptions={{ headerShown: false }}
        initialRouteName={showOnboarding ? "onboarding" : "(tabs)"}
      />
    </SettingsProvider>
  );
}
