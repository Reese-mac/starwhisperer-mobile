import { MoonSenseColors } from '../constants/colors';

export type MoonTheme = {
  primary: string;
  primarySoft: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  border: string;
  tabBarBg: string;
  tabBarBorder: string;
  radiusMd: number;
  radiusLg: number;
  spaceSm: number;
  spaceMd: number;
  spaceLg: number;
};

const lightTheme: MoonTheme = {
  primary: MoonSenseColors.Primary,
  primarySoft: 'rgba(108, 74, 255, 0.12)',
  background: '#F3EDFF',
  surface: '#FFFFFF',
  surfaceAlt: '#F6F2FF',
  text: '#2B2D42',
  textMuted: 'rgba(43,45,66,0.72)',
  border: 'rgba(43,45,66,0.12)',
  tabBarBg: 'rgba(255,255,255,0.95)',
  tabBarBorder: 'rgba(43,45,66,0.14)',
  radiusMd: 14,
  radiusLg: 20,
  spaceSm: 10,
  spaceMd: 14,
  spaceLg: 18,
};

const softLightTheme: MoonTheme = {
  primary: '#C7C2FF',
  primarySoft: 'rgba(199,194,255,0.16)',
  background: '#12131A',
  surface: '#1B1C26',
  surfaceAlt: '#232430',
  text: '#F6F4FF',
  textMuted: 'rgba(246,244,255,0.7)',
  border: 'rgba(255,255,255,0.12)',
  tabBarBg: 'rgba(27,28,38,0.92)',
  tabBarBorder: 'rgba(255,255,255,0.12)',
  radiusMd: 14,
  radiusLg: 20,
  spaceSm: 10,
  spaceMd: 14,
  spaceLg: 18,
};

export const getMoonTheme = (softLightMode: boolean): MoonTheme =>
  softLightMode ? softLightTheme : lightTheme;

