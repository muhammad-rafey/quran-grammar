export const colors = {
  background: '#f5f7f3',
  paper: '#ffffff',
  ink: '#1b332a',
  muted: '#65736b',
  primary: '#1f6550',
  wash: '#eaf3ed',
  border: '#dce5dc',
  amber: '#80601c',
  amberWash: '#fbf5e6',
  blue: '#42648b',
  blueWash: '#edf2f9',
};

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

export const row = { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 } as const;
export const card = {
  backgroundColor: colors.paper,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 18,
  borderCurve: 'continuous',
  padding: 18,
  gap: 10,
} as const;
