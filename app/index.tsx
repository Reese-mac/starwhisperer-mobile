import React from 'react';
import { Redirect } from 'expo-router';

// Ensure the root "/" route lands in the tab stack so the bottom bar stays visible.
export default function Index() {
  return <Redirect href="/landing" />;
}
