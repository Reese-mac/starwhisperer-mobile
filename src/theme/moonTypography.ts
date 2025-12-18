import { TextStyle } from 'react-native';

export type MoonTypography = {
  screenTitle: TextStyle;
  cardTitle: TextStyle;
  sectionTitle: TextStyle;
  labelCaps: TextStyle;
  body: TextStyle;
  bodyStrong: TextStyle;
  caption: TextStyle;
  numberHero: TextStyle;
  numberMetric: TextStyle;
  numberSmall: TextStyle;
  unit: TextStyle;
};

export const MoonType: MoonTypography = {
  screenTitle: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  labelCaps: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
  },
  bodyStrong: {
    fontSize: 14,
    fontWeight: '600',
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
  },
  numberHero: {
    fontSize: 82,
    fontWeight: '200',
    letterSpacing: -1.2,
    lineHeight: 92,
    fontVariant: ['tabular-nums'],
  },
  numberMetric: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.6,
    lineHeight: 38,
    fontVariant: ['tabular-nums'],
  },
  numberSmall: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
    fontVariant: ['tabular-nums'],
  },
  unit: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
};
