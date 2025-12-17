/**
 * Refined Color Palette for a Calm, Night-Friendly UI
 * Based on the user's UI Layout Specification.
 */
export const MoonSenseColors = {
  // Core Palette
  Background: '#121212',       // A deep, near-black for the main background to create a calm, night-friendly mood.
  Surface: '#1E1E1E',         // A slightly lighter shade for card backgrounds and surfaces.
  Primary: '#BB86FC',         // A vibrant yet soft purple for primary actions and accents.
  Secondary: '#03DAC6',       // A contrasting teal for secondary accents.

  // Text Colors
  OnPrimary: '#000000',      // Text on primary-colored surfaces.
  OnSurface: '#FFFFFF',        // High-emphasis text on dark surfaces.
  OnSurfaceMedium: 'rgba(255, 255, 255, 0.87)', // Medium-emphasis text.
  OnSurfaceDisabled: 'rgba(255, 255, 255, 0.38)', // Disabled/tertiary text.

  // Legacy/Compatibility Colors (to be phased out)
  CosmicPurple: '#BB86FC',    // Re-mapped to Primary
  MoonLavender: '#333333',    // A darker card background
  SoftIndigo: '#1E1E1E',      // Re-mapped to Surface
  MistBlue: '#1E1E1E',        // Re-mapped to Surface
  MoonWhite: '#FFFFFF',       // Re-mapped to OnSurface
  NightGrey: 'rgba(255, 255, 255, 0.6)', // A lighter grey for secondary text on dark bg
  MidnightIndigo: '#121212',  // Re-mapped to Background
  LunarGlow: '#121212',       // Re-mapped to Background
  AuroraPink: '#FFB8D2',      // Accent gradient (DEPRECATED)
  TideBlue: '#6EC6FF',        // Accent gradient (DEPRECATED)
  OrbitGrey: 'rgba(255, 255, 255, 0.6)', // Re-mapped to NightGrey
};

export default MoonSenseColors;