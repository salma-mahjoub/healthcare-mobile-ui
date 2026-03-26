import { ColorSchemeName } from 'react-native';

const sharedColors = {
  gradientStart: '#2563EB',
  gradientMid: '#0EA5E9',
  gradientEnd: '#10B981',
  primary: '#2563EB',
  primaryLight: '#DBEAFE',
  teal: '#10B981',
  tealLight: '#D1FAE5',
  urgent: '#F97316',
  urgentLight: '#FEF3C7',
  textWhite: '#FFFFFF',
};

export const lightColors = {
  ...sharedColors,
  background: '#EFF6FF',
  cardBg: '#FFFFFF',
  inputBg: '#F1F5F9',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textLight: '#94A3B8',
  border: '#E2E8F0',
  shadow: '#64748B',
  glassWhite: 'rgba(255,255,255,0.15)',
  glassBorder: 'rgba(255,255,255,0.3)',
  surfaceMuted: '#F8FAFC',
  overlay: 'rgba(15,23,42,0.04)',
};

export const darkColors = {
  ...sharedColors,
  background: '#0B1220',
  cardBg: '#111827',
  inputBg: '#1F2937',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textLight: '#94A3B8',
  border: '#334155',
  shadow: '#020617',
  glassWhite: 'rgba(15,23,42,0.22)',
  glassBorder: 'rgba(255,255,255,0.14)',
  surfaceMuted: '#172033',
  overlay: 'rgba(255,255,255,0.05)',
};

export type ThemeColors = typeof lightColors;

export const Colors = lightColors;

export function getThemeColors(colorScheme: ColorSchemeName): ThemeColors {
  return colorScheme === 'dark' ? darkColors : lightColors;
}
