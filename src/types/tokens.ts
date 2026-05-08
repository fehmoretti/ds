// Design Token Types — Core data model

// === COLOR TYPES ===
export interface RgbaColor {
  r: number; // 0-1
  g: number; // 0-1
  b: number; // 0-1
  a: number; // 0-1
}

export type ColorShade = [string, string, string, string, string, string, string, string, string, string];

export interface ColorPalette {
  name: string;
  baseHex: string;
  shades: ColorShade; // 10 shades (0-9), hex values
}

export interface DesignTokenColors {
  brand: ColorPalette;
  accent: ColorPalette;
  tertiary: ColorPalette;
  gray: ColorPalette;
  feedback: {
    error: ColorPalette;
    success: ColorPalette;
    warning: ColorPalette;
    info: ColorPalette;
  };
}

// === RADIUS TYPES ===
export interface RadiusScale {
  none: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface RadiusComponents {
  button: keyof RadiusScale;
  input: keyof RadiusScale;
  card: keyof RadiusScale;
  modal: keyof RadiusScale;
  badge: keyof RadiusScale;
  pill: keyof RadiusScale;
}

export interface DesignTokenRadius {
  scale: RadiusScale;
  components: RadiusComponents;
}

// === TYPOGRAPHY TYPES ===
export interface TypographyFonts {
  base: string;
  mono: string;
}

export interface TypographySizes {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  '4xl': number;
  '5xl': number;
  '6xl': number;
}

export interface TypographyWeights {
  regular: number;
  medium: number;
  bold: number;
}

export interface DesignTokenTypography {
  fonts: TypographyFonts;
  sizes: TypographySizes;
  weights: TypographyWeights;
}

// === SPACING TYPES ===
export interface DesignTokenSpacing {
  none: number;
  '2xs': number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

// === SHADOW TYPES ===
export interface ShadowLevel {
  x: number;
  y: number;
  blur: number;
  spread: number;
}

export interface DesignTokenShadows {
  xs: ShadowLevel;
  sm: ShadowLevel;
  md: ShadowLevel;
  lg: ShadowLevel;
  xl: ShadowLevel;
}

// === COMPLETE TOKEN SET ===
export interface DesignTokens {
  colors: DesignTokenColors;
  radius: DesignTokenRadius;
  typography: DesignTokenTypography;
  spacing: DesignTokenSpacing;
  shadows: DesignTokenShadows;
}
