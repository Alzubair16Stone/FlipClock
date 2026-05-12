export type ThemeName = 'classicDark' | 'softLight' | 'deepNavy' | 'custom';

export interface ThemeColors {
  pageBg: string;
  digitColor: string;
  cardBg: string;
}

export interface AppState {
  theme: ThemeName;
  digitColor: string;
  cardBgColor: string;
  bgImage: string | null;
  palette: string[];
}
