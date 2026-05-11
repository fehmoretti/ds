/**
 * WCAG 2.1 contrast utilities.
 *
 * References:
 * - https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 * - https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 * - SC 1.4.3 (Minimum) AA: 4.5:1 normal, 3:1 large
 * - SC 1.4.6 (Enhanced) AAA: 7:1 normal, 4.5:1 large
 * - SC 1.4.11 (Non-text Contrast) AA: 3:1 for UI components/borders/icons
 */

export type WcagLevel = 'AAA' | 'AA' | 'AA-Large' | 'Fail';
export type WcagTarget = 'AA' | 'AAA';
export type TextSize = 'normal' | 'large';

/** Minimum required contrast ratio per WCAG 2.1. */
export const WCAG_THRESHOLDS = {
  AA: { normal: 4.5, large: 3, ui: 3 },
  AAA: { normal: 7, large: 4.5, ui: 3 },
} as const;

/** sRGB channel linearization per WCAG. */
function channelToLinear(c: number): number {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/** Parse a hex color (#RRGGBB or #RRGGBBAA) into rgba in [0,1]. */
function parseHex(hex: string): { r: number; g: number; b: number; a: number } {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.slice(0, 2), 16) / 255;
  const g = parseInt(cleaned.slice(2, 4), 16) / 255;
  const b = parseInt(cleaned.slice(4, 6), 16) / 255;
  const a = cleaned.length >= 8 ? parseInt(cleaned.slice(6, 8), 16) / 255 : 1;
  return { r, g, b, a };
}

function toHex2(v: number): string {
  return Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0');
}

/** Composite a (possibly translucent) foreground over an opaque background. Returns opaque #RRGGBB. */
export function composite(fg: string, bg: string): string {
  const f = parseHex(fg);
  const b = parseHex(bg);
  const r = f.r * f.a + b.r * (1 - f.a);
  const g = f.g * f.a + b.g * (1 - f.a);
  const bl = f.b * f.a + b.b * (1 - f.a);
  return `#${toHex2(r)}${toHex2(g)}${toHex2(bl)}`;
}

/** Relative luminance L of an opaque sRGB color in [0,1] per WCAG 2.1. */
export function relativeLuminance(hex: string): number {
  const { r, g, b } = parseHex(hex);
  const R = channelToLinear(r);
  const G = channelToLinear(g);
  const B = channelToLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Contrast ratio between two colors per WCAG 2.1, in [1, 21].
 * If either color has alpha < 1, it is composited over the other (foreground over background).
 */
export function contrastRatio(fg: string, bg: string): number {
  const bgOpaque = parseHex(bg).a < 1 ? composite(bg, '#FFFFFF') : bg;
  const fgEffective = parseHex(fg).a < 1 ? composite(fg, bgOpaque) : fg;
  const L1 = relativeLuminance(fgEffective);
  const L2 = relativeLuminance(bgOpaque);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Classify a ratio against WCAG thresholds for given text size. */
export function classifyContrast(ratio: number, size: TextSize = 'normal'): WcagLevel {
  if (size === 'normal') {
    if (ratio >= WCAG_THRESHOLDS.AAA.normal) return 'AAA';
    if (ratio >= WCAG_THRESHOLDS.AA.normal) return 'AA';
    if (ratio >= WCAG_THRESHOLDS.AA.large) return 'AA-Large';
    return 'Fail';
  }
  if (ratio >= WCAG_THRESHOLDS.AAA.large) return 'AAA';
  if (ratio >= WCAG_THRESHOLDS.AA.large) return 'AA';
  return 'Fail';
}

export function passesContrast(
  ratio: number,
  target: WcagTarget,
  size: TextSize = 'normal',
): boolean {
  return ratio >= WCAG_THRESHOLDS[target][size];
}

/**
 * Pick the shade from a palette that best satisfies a minimum contrast against `background`.
 * Strategy: iterate from `preferIndex` outward; return the first shade whose ratio >= minRatio.
 * If none meets the target, return the shade with the highest ratio.
 */
export function pickShadeForContrast(
  palette: readonly string[],
  background: string,
  minRatio: number,
  preferIndex = 5,
  direction: 'auto' | 'darker' | 'lighter' = 'auto',
): { hex: string; index: number; ratio: number; passed: boolean } {
  const order: number[] = [];
  if (direction === 'darker') {
    for (let i = preferIndex; i < palette.length; i++) order.push(i);
    for (let i = preferIndex - 1; i >= 0; i--) order.push(i);
  } else if (direction === 'lighter') {
    for (let i = preferIndex; i >= 0; i--) order.push(i);
    for (let i = preferIndex + 1; i < palette.length; i++) order.push(i);
  } else {
    // auto: pick search direction based on background luminance
    const bgL = relativeLuminance(background);
    const goDarker = bgL > 0.5;
    if (goDarker) {
      for (let i = preferIndex; i < palette.length; i++) order.push(i);
      for (let i = preferIndex - 1; i >= 0; i--) order.push(i);
    } else {
      for (let i = preferIndex; i >= 0; i--) order.push(i);
      for (let i = preferIndex + 1; i < palette.length; i++) order.push(i);
    }
  }

  let best = { hex: palette[preferIndex]!, index: preferIndex, ratio: 0, passed: false };
  for (const i of order) {
    const hex = palette[i]!;
    const ratio = contrastRatio(hex, background);
    if (ratio > best.ratio) best = { hex, index: i, ratio, passed: false };
    if (ratio >= minRatio) {
      return { hex, index: i, ratio, passed: true };
    }
  }
  return best;
}

/**
 * Pick the best foreground color (white or black) for the given background.
 * Returns whichever yields the higher contrast ratio.
 */
export function pickReadableForeground(background: string, light = '#FFFFFF', dark = '#0B0B0F'): string {
  return contrastRatio(light, background) >= contrastRatio(dark, background) ? light : dark;
}

/** Format ratio for UI display (e.g. "4.52:1"). */
export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}

// --- Hex adjustment ---------------------------------------------------------
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from './color-utils';

/**
 * Adjust a hex color's lightness in HSL until its contrast ratio against `background`
 * meets or exceeds `minRatio`. Hue and saturation are preserved.
 *
 * @param direction 'auto' picks the side that improves contrast based on bg luminance.
 *                  'lighten' / 'darken' force the side. Returns the original color if
 *                  no adjustment within the search range can satisfy the target.
 */
export function adjustForContrast(
  hex: string,
  background: string,
  minRatio: number,
  direction: 'auto' | 'lighten' | 'darken' = 'auto',
): { hex: string; ratio: number; passed: boolean; adjusted: boolean; deltaL: number } {
  const initialRatio = contrastRatio(hex, background);
  if (initialRatio >= minRatio) {
    return { hex, ratio: initialRatio, passed: true, adjusted: false, deltaL: 0 };
  }

  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);

  let dir = direction;
  if (dir === 'auto') {
    const bgL = relativeLuminance(background);
    dir = bgL > 0.5 ? 'darken' : 'lighten';
  }

  const step = 0.01;
  let bestHex = hex;
  let bestRatio = initialRatio;
  let bestDelta = 0;

  for (let i = 1; i <= 100; i++) {
    const newL = dir === 'lighten' ? Math.min(1, l + i * step) : Math.max(0, l - i * step);
    if (newL === l) break;
    const rgb = hslToRgb(h, s, newL);
    const candidate = rgbToHex(rgb.r, rgb.g, rgb.b);
    const ratio = contrastRatio(candidate, background);
    if (ratio > bestRatio) {
      bestRatio = ratio;
      bestHex = candidate;
      bestDelta = newL - l;
    }
    if (ratio >= minRatio) {
      return { hex: candidate, ratio, passed: true, adjusted: true, deltaL: newL - l };
    }
    if (newL === 0 || newL === 1) break;
  }

  return { hex: bestHex, ratio: bestRatio, passed: bestRatio >= minRatio, adjusted: bestHex !== hex, deltaL: bestDelta };
}

/**
 * Lift a hex color toward white (mix in HSL by increasing lightness toward 1).
 * Used to derive a "light tint" background slot from a base color (Mantine `light` variant convention).
 */
export function lightenToward(hex: string, targetL: number): string {
  const { r, g, b } = hexToRgb(hex);
  const { h, s } = rgbToHsl(r, g, b);
  const rgb = hslToRgb(h, Math.min(s, 0.6), Math.max(0, Math.min(1, targetL)));
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}
