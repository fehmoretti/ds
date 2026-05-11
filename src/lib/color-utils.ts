/**
 * Color utility functions for generating Mantine-compatible 10-shade palettes
 * from a single base color.
 */

interface HslColor {
  h: number;
  s: number;
  l: number;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.slice(0, 2), 16) / 255;
  const g = parseInt(cleaned.slice(2, 4), 16) / 255;
  const b = parseInt(cleaned.slice(4, 6), 16) / 255;
  return { r, g, b };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (v: number) =>
    Math.round(Math.min(1, Math.max(0, v)) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHsl(r: number, g: number, b: number): HslColor {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h: number;
  if (max === r) {
    h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  } else if (max === g) {
    h = ((b - r) / d + 2) / 6;
  } else {
    h = ((r - g) / d + 4) / 6;
  }

  return { h, s, l };
}

export function hslToRgb(
  h: number,
  s: number,
  l: number,
): { r: number; g: number; b: number } {
  if (s === 0) {
    return { r: l, g: l, b: l };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: hue2rgb(p, q, h + 1 / 3),
    g: hue2rgb(p, q, h),
    b: hue2rgb(p, q, h - 1 / 3),
  };
}

/**
 * Generate a 10-shade palette from a base hex color.
 * Shade 0 is lightest, shade 9 is darkest.
 * The base color is placed at shade 5 (primary shade in Mantine).
 */
export function generatePalette(baseHex: string): [string, string, string, string, string, string, string, string, string, string] {
  const { r, g, b } = hexToRgb(baseHex);
  const { h, s, l } = rgbToHsl(r, g, b);

  // Lightness targets for 10 shades (0=lightest, 9=darkest)
  const lightnessSteps = [
    0.95, // 0 - very light
    0.87, // 1 - light
    0.77, // 2 - light-medium
    0.67, // 3 - medium-light
    0.57, // 4 - medium
    l,    // 5 - base color (original lightness)
    Math.max(0.15, l * 0.7),  // 6 - darker
    Math.max(0.12, l * 0.5),  // 7 - much darker
    Math.max(0.09, l * 0.35), // 8 - very dark
    Math.max(0.06, l * 0.22), // 9 - darkest
  ];

  // Adjust saturation slightly across shades
  const saturationSteps = [
    Math.min(1, s * 0.6),  // 0
    Math.min(1, s * 0.7),  // 1
    Math.min(1, s * 0.8),  // 2
    Math.min(1, s * 0.9),  // 3
    Math.min(1, s * 0.95), // 4
    s,                      // 5
    Math.min(1, s * 1.05), // 6
    Math.min(1, s * 1.05), // 7
    Math.min(1, s * 1.0),  // 8
    Math.min(1, s * 0.95), // 9
  ];

  return lightnessSteps.map((targetL, i) => {
    const targetS = saturationSteps[i] ?? s;
    const rgb = hslToRgb(h, targetS, targetL);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  }) as [string, string, string, string, string, string, string, string, string, string];
}

/**
 * Generate a gray palette from a base hue (to give warm/cool grays)
 */
export function generateGrayPalette(hue: number = 220): [string, string, string, string, string, string, string, string, string, string] {
  const lightnessSteps = [0.97, 0.93, 0.88, 0.78, 0.65, 0.50, 0.40, 0.30, 0.20, 0.12];
  const saturation = 0.05; // Very low saturation for grays

  return lightnessSteps.map((l) => {
    const rgb = hslToRgb(hue / 360, saturation, l);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  }) as [string, string, string, string, string, string, string, string, string, string];
}

/**
 * Convert hex to Figma RGBA format (0-1 range). Accepts 6-char (#RRGGBB) or
 * 8-char (#RRGGBBAA) hex; defaults alpha to 1 when not provided.
 */
export function hexToFigmaRgba(hex: string): { r: number; g: number; b: number; a: number } {
  const { r, g, b } = hexToRgb(hex);
  const cleaned = hex.replace('#', '');
  const a = cleaned.length >= 8 ? parseInt(cleaned.slice(6, 8), 16) / 255 : 1;
  return { r, g, b, a };
}
