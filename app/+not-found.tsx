import React from 'react';
import { Redirect } from 'expo-router';

// Fallback for any unmatched route: send users to the tabbed home so the UI stays intact.
export default function NotFound() {
  return <Redirect href="/landing" />;
}
