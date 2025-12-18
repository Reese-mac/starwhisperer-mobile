export type MoonTheme = {
  background: string;
  backgroundGradient: string[];
  headerGradient: string[];
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  primarySoft: string;
  accentCyan: string;
  tabBarBg: string;
  tabBarBorder: string;
  tabBarShadow: string;
  radiusLg: number;
  radiusMd: number;
  radiusSm: number;
  spaceLg: number;
  spaceMd: number;
  spaceSm: number;
};

export const minimalMoonPalette = {
  cosmicPurple: '#6C4AFF',
  moonLavender: '#BFB3FF',
  softIndigo: '#E4E0FF',
  moonWhite: '#FFFFFF',
  nightGrey: '#494A57',
};

export const getMoonTheme = (softLightMode: boolean): MoonTheme => {
  const palette = minimalMoonPalette;

  if (softLightMode) {
    const deepWater = '#1F3B58';
    return {
      background: deepWater,
      backgroundGradient: [deepWater, deepWater, deepWater],
      headerGradient: [deepWater, deepWater, deepWater],
      surface: 'rgba(255,255,255,0.06)',
      surfaceAlt: 'rgba(255,255,255,0.10)',
      text: palette.moonWhite,
      textMuted: 'rgba(255,255,255,0.74)',
      border: 'rgba(255,255,255,0.12)',
      primary: palette.cosmicPurple,
      primarySoft: 'rgba(108,74,255,0.24)',
      accentCyan: palette.moonLavender,
      tabBarBg: 'rgba(31,59,88,0.92)',
      tabBarBorder: 'rgba(255,255,255,0.10)',
      tabBarShadow: 'rgba(0,0,0,0.35)',
      radiusLg: 26,
      radiusMd: 20,
      radiusSm: 14,
      spaceLg: 24,
      spaceMd: 16,
      spaceSm: 10,
    };
  }

  return {
    background: palette.softIndigo,
    backgroundGradient: [palette.softIndigo, palette.softIndigo, palette.softIndigo],
    headerGradient: [palette.moonLavender, palette.moonLavender, palette.moonLavender],
    surface: palette.moonWhite,
    surfaceAlt: '#D7CCFF',
    text: palette.nightGrey,
    textMuted: 'rgba(73,74,87,0.72)',
    border: 'rgba(73,74,87,0.14)',
    primary: palette.cosmicPurple,
    primarySoft: 'rgba(108,74,255,0.16)',
    accentCyan: palette.cosmicPurple,
    tabBarBg: 'rgba(255,255,255,0.96)',
    tabBarBorder: 'rgba(73,74,87,0.10)',
    tabBarShadow: 'rgba(73,74,87,0.14)',
    radiusLg: 26,
    radiusMd: 20,
    radiusSm: 14,
    spaceLg: 24,
    spaceMd: 16,
    spaceSm: 10,
  };
};
