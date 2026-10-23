import { I18nManager } from 'react-native';
import { physicalRowDirection } from './physical-row';

export const colors = {
  background: '#f7f8ef',
  paper: '#ffffff',
  ink: '#203b30',
  muted: '#65736b',
  primary: '#14654c',
  primaryEdge: '#104e3b',
  wash: '#eaf4df',
  mint: '#eef6ee',
  lime: '#d8ed9b',
  border: '#dbe5d5',
  edge: '#cbd9c4',
  white: '#ffffff',
  transparent: 'transparent',
  gold: '#b57a22',
  amber: '#80601c',
  amberWash: '#fbf5e6',
  blue: '#42648b',
  blueWash: '#edf2f9',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 10, md: 16, lg: 24, pill: 999 } as const;
export const shadows = { floating: '0 8px 28px rgba(32,59,48,0.13)' } as const;

export const type = {
  body: {
    fontFamily: 'Naskh',
    fontSize: 18,
    lineHeight: 32,
    color: colors.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  small: {
    fontFamily: 'Naskh',
    fontSize: 15,
    lineHeight: 26,
    color: colors.muted,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  heading: {
    fontFamily: 'Naskh',
    fontSize: 22,
    lineHeight: 38,
    color: colors.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  arabic: {
    fontFamily: 'AmiriQuran',
    fontSize: 29,
    lineHeight: 66,
    color: colors.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
} as const;

export const row = {
  flexDirection: physicalRowDirection(true, I18nManager.isRTL),
  alignItems: 'center',
  gap: 10,
} as const;
export const card = {
  backgroundColor: colors.paper,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: radius.lg,
  borderCurve: 'continuous',
  padding: spacing.lg,
  gap: 10,
} as const;
