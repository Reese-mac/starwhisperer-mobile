import React from "react";
import { Redirect } from "expo-router";

export default function HomeRedirect() {
  // Ensure navigating to "/home" stays inside the tab stack so the bottom tab bar remains visible.
  return <Redirect href="/(tabs)/home" />;
}
