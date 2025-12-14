import React from "react";
import { Redirect } from "expo-router";

export default function SettingsRedirect() {
  // Keep the settings screen inside the tab navigator so the bottom tab bar stays visible.
  return <Redirect href="/(tabs)/settings" />;
}
