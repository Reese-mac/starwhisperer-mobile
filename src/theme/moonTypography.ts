import { TextStyle } from 'react-native';

type TypographyScale = {
  screenTitle: TextStyle;
  sectionTitle: TextStyle;
  cardTitle: TextStyle;
  body: TextStyle;
  bodyStrong: TextStyle;
  labelCaps: TextStyle;
  caption: TextStyle;
  numberSmall: TextStyle;
  numberMetric: TextStyle;
};

const baseNumber: TextStyle = { fontVariant: ['tabular-nums'] };

export const MoonType: TypographyScale = {
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  bodyStrong: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  labelCaps: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
  numberSmall: {
    ...baseNumber,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  numberMetric: {
    ...baseNumber,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
};

export default MoonType;

