/**
 * Semantic token derivation engine.
 *
 * Mirrors the same slot mapping that Mantine (and the project's Preview) uses to render
 * components — `primaryShade: 5`, `filled` = palette[5], `light` = tint of palette[5],
 * `outline` = transparent + palette[5] border, etc. Then, for each (foreground, background)
 * pair, the system **adjusts the hex value** of the color (preserving hue and saturation,
 * shifting only HSL lightness) until it satisfies the WCAG 2.1 contrast target.
 *
 * Output:
 * - A flat semantic token map (background / text / border / icon / feedback / button slots).
 * - A contrast report listing each pair (fg / bg / required ratio / actual / passed / adjusted).
 * - Adjusted palette overrides that the Preview / Mantine theme can consume so the rendered UI
 *   matches the validated tokens.
 */

import type { ColorPalette, ColorShade, DesignTokenColors } from '@/types';
import {
  WCAG_THRESHOLDS,
  type WcagTarget,
  adjustForContrast,
  composite,
  contrastRatio,
  pickReadableForeground,
} from './contrast';
import { getMantineButtonTokens } from './mantine-tokens';

export type SemanticMode = 'light' | 'dark';
export type FeedbackKey = 'error' | 'success' | 'warning' | 'info';
export type ButtonVariant = 'filled' | 'light' | 'outline' | 'subtle';
export type ColorFamily = 'brand' | 'accent' | 'tertiary' | FeedbackKey;

/** Mantine-aligned slot indexes. Replicates `getCSSColorVariables()` so the contrast
 *  checker validates the SAME pixels real Mantine components render in the Preview. */
const SLOTS = {
  filledLight: 5,
  filledDark: 5,
  /** Mantine's filled-hover = primaryShade + 1 in BOTH modes. */
  filledHoverLight: 6,
  filledHoverDark: 6,
  /** Mantine has no separate active background — mirrors hover. */
  filledActiveLight: 6,
  filledActiveDark: 6,
  /** Mantine `--{name}-light-color`: palette[9] light, palette[0] dark. */
  lightTextLight: 9,
  lightTextDark: 0,
  /** Outline border (Mantine `--{name}-outline`): palette[primaryShade] light, palette[max(primaryShade-4, 0)] dark. */
  outlineBorderLight: 5,
  outlineBorderDark: 1,
  outlineTextLight: 5,
  outlineTextDark: 1,
} as const;

export interface ContrastCheck {
  fg: string;
  bg: string;
  bgEffective: string;
  fgEffective: string;
  ratio: number;
  required: number;
  passed: boolean;
  adjusted: boolean;
  usage: 'text' | 'large' | 'ui';
}

export interface SemanticContrastReport {
  checks: Record<string, ContrastCheck>;
  passed: number;
  failed: number;
  adjusted: number;
}

export interface DerivedSemanticTokens {
  mode: SemanticMode;
  target: WcagTarget;

  background: {
    body: string;
    surface: string;
    subtle: string;
    elevated: string;
    muted: string;
    strong: string;
    inverse: string;
    selected: string;
    light: string;
    brand: { default: string; soft: string; subtle: string; muted: string };
    accent: { default: string; soft: string; subtle: string; muted: string };
    tertiary: { default: string; soft: string; subtle: string; muted: string };
  };

  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    muted: string;
    disabled: string;
    inverse: string;
    brand: string;
    accent: string;
  };

  border: {
    default: string;
    subtle: string;
    strong: string;
    focus: string;
    brand: string;
    accent: string;
    tertiary: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };

  icon: {
    primary: string;
    secondary: string;
    tertiary: string;
    muted: string;
    disabled: string;
    inverse: string;
    brand: string;
    accent: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };

  feedback: Record<FeedbackKey, { background: string; border: string; icon: string; text: string }>;

  buttons: Record<
    ColorFamily,
    Record<
      ButtonVariant,
      {
        background: string;
        backgroundHover: string;
        backgroundActive: string;
        border: string;
        text: string;
        icon: string;
      }
    >
  >;

  /**
   * Adjusted palettes — the same 10-shade structure as the input, but with individual shades
   * nudged in lightness when needed to satisfy the contrast target. Consume this in the
   * Preview / Mantine theme so the rendered UI reflects the validated tokens.
   */
  adjustedPalettes: {
    brand: ColorShade;
    accent: ColorShade;
    tertiary: ColorShade;
    gray: ColorShade;
    error: ColorShade;
    success: ColorShade;
    warning: ColorShade;
    info: ColorShade;
  };

  report: SemanticContrastReport;
}

// --- Helpers ---------------------------------------------------------------

function withAlpha(hex: string, alpha: number): string {
  const cleaned = hex.replace('#', '');
  const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255).toString(16).padStart(2, '0');
  return `#${cleaned}${a}`;
}

function clonePalette(palette: ColorPalette): ColorShade {
  return [...palette.shades] as ColorShade;
}

// --- Derivation core -------------------------------------------------------

/**
 * Derives the full semantic token set for a given mode and WCAG target, mutating individual
 * palette shade hex values when needed to satisfy contrast — without changing the slot
 * mapping (filled = shade 5, etc.) that Mantine and the Preview already use.
 */
export function deriveSemanticTokens(
  colors: DesignTokenColors,
  mode: SemanticMode,
  target: WcagTarget = 'AA',
): DerivedSemanticTokens {
  const isLight = mode === 'light';
  const thresholds = WCAG_THRESHOLDS[target];
  const textRatio = thresholds.normal;
  const largeRatio = thresholds.large;
  const uiRatio = thresholds.ui;

  // Working copies of every palette so we can adjust shades without mutating input.
  const adjusted = {
    brand: clonePalette(colors.brand),
    accent: clonePalette(colors.accent),
    tertiary: clonePalette(colors.tertiary),
    gray: clonePalette(colors.gray),
    error: clonePalette(colors.feedback.error),
    success: clonePalette(colors.feedback.success),
    warning: clonePalette(colors.feedback.warning),
    info: clonePalette(colors.feedback.info),
  };

  type AdjKey = keyof typeof adjusted;

  // --- Neutral surfaces (gray) ---
  const body = isLight ? '#FFFFFF' : adjusted.gray[9]!;
  const surface = isLight ? adjusted.gray[0]! : adjusted.gray[8]!;
  const subtle = isLight ? adjusted.gray[1]! : adjusted.gray[8]!;
  const elevated = isLight ? '#FFFFFF' : adjusted.gray[7]!;
  const muted = isLight ? adjusted.gray[2]! : adjusted.gray[7]!;
  const strong = isLight ? adjusted.gray[3]! : adjusted.gray[6]!;
  const inverse = isLight ? adjusted.gray[9]! : '#FFFFFF';
  const selected = isLight ? withAlpha(adjusted.brand[5]!, 0.08) : withAlpha(adjusted.brand[5]!, 0.18);
  const light = isLight ? adjusted.gray[0]! : adjusted.gray[7]!;

  // --- Report tracking ---
  const checks: SemanticContrastReport['checks'] = {};
  let adjustedCount = 0;

  /**
   * Adjust `palette[shadeIndex]` against the given background to satisfy `minRatio`.
   * Mutates the working `adjusted[*]` palette, records a contrast check, and returns the
   * (possibly-updated) hex value at that slot.
   */
  function adjustSlot(
    paletteKey: AdjKey,
    shadeIndex: number,
    bg: string,
    minRatio: number,
    path: string,
    usage: 'text' | 'large' | 'ui' = 'text',
    direction: 'auto' | 'lighten' | 'darken' = 'auto',
  ): string {
    const original = adjusted[paletteKey][shadeIndex]!;
    const bgEffective = bg.length > 7 ? composite(bg, body) : bg;
    const result = adjustForContrast(original, bgEffective, minRatio, direction);
    if (result.adjusted) {
      adjusted[paletteKey][shadeIndex] = result.hex;
      adjustedCount++;
    }
    checks[path] = {
      fg: result.hex,
      bg,
      bgEffective,
      fgEffective: result.hex,
      ratio: result.ratio,
      required: minRatio,
      passed: result.passed,
      adjusted: result.adjusted,
      usage,
    };
    return result.hex;
  }

  /** Record a check without adjusting (e.g. for white/black on filled bg, or static neutrals). */
  function recordCheck(
    path: string,
    fg: string,
    bg: string,
    minRatio: number,
    usage: 'text' | 'large' | 'ui' = 'text',
  ) {
    const bgEffective = bg.length > 7 ? composite(bg, body) : bg;
    const fgEffective = fg.length > 7 ? composite(fg, bgEffective) : fg;
    const ratio = contrastRatio(fgEffective, bgEffective);
    checks[path] = {
      fg,
      bg,
      bgEffective,
      fgEffective,
      ratio,
      required: minRatio,
      passed: ratio >= minRatio,
      adjusted: false,
      usage,
    };
  }

  // --- Text slots on body (gray palette) ---
  const primaryText = isLight ? adjusted.gray[9]! : '#FFFFFF';
  recordCheck('text/primary', primaryText, body, textRatio);

  const secondaryText = adjustSlot('gray', isLight ? 7 : 3, body, textRatio, 'text/secondary');
  const tertiaryText = adjustSlot('gray', isLight ? 6 : 4, body, largeRatio, 'text/tertiary', 'large');
  const mutedText = adjustSlot('gray', 5, body, largeRatio, 'text/muted', 'large');

  const disabledText = isLight ? adjusted.gray[3]! : adjusted.gray[6]!;
  const inverseText = isLight ? '#FFFFFF' : adjusted.gray[9]!;
  recordCheck('text/inverse', inverseText, inverse, textRatio);

  // --- Branded text on body (uses Mantine slot for branded text = primaryShade) ---
  const brandTextShade = isLight ? SLOTS.filledLight : SLOTS.filledDark;
  const brandText = adjustSlot('brand', brandTextShade, body, textRatio, 'text/brand');
  const accentText = adjustSlot('accent', brandTextShade, body, textRatio, 'text/accent');

  // --- Borders / icons (3:1 on body) ---
  const borderDefault = adjustSlot('gray', isLight ? 3 : 6, body, uiRatio, 'border/default', 'ui');
  const borderSubtle = adjustSlot('gray', isLight ? 2 : 7, body, 1.5, 'border/subtle', 'ui');
  const borderStrong = adjustSlot('gray', 5, body, uiRatio + 1, 'border/strong', 'ui');
  const borderBrand = adjustSlot('brand', SLOTS.outlineBorderLight, body, uiRatio, 'border/brand', 'ui');
  const borderAccent = adjustSlot('accent', SLOTS.outlineBorderLight, body, uiRatio, 'border/accent', 'ui');
  const borderTertiary = adjustSlot('tertiary', SLOTS.outlineBorderLight, body, uiRatio, 'border/tertiary', 'ui');
  const borderFocus = borderBrand;

  const iconBrand = adjustSlot('brand', isLight ? 6 : 4, body, uiRatio, 'icon/brand', 'ui');
  const iconAccent = adjustSlot('accent', isLight ? 6 : 4, body, uiRatio, 'icon/accent', 'ui');

  // --- Tinted backgrounds (brand/accent/tertiary) — matches Figma SEMANTIC_MAP ---
  // background/{family}/ : default=5/5, soft=2/7, subtle=0/9, muted=1/8
  const tintedBg = (paletteKey: 'brand' | 'accent' | 'tertiary') => {
    const palette = adjusted[paletteKey];
    if (isLight) {
      return {
        default: palette[SLOTS.filledLight]!,
        soft: palette[2]!,
        subtle: palette[0]!,
        muted: palette[1]!,
      };
    }
    return {
      default: palette[SLOTS.filledDark]!,
      soft: palette[7]!,
      subtle: palette[9]!,
      muted: palette[8]!,
    };
  };

  const brandBg = tintedBg('brand');
  const accentBg = tintedBg('accent');
  const tertiaryBg = tintedBg('tertiary');

  // --- Feedback (matches Figma: bg=0/9, text=6/3, border=5/5, icon=text) ---
  const feedback = {} as DerivedSemanticTokens['feedback'];
  const borderFeedback: Record<FeedbackKey, string> = { error: '', success: '', warning: '', info: '' };
  const iconFeedback: Record<FeedbackKey, string> = { error: '', success: '', warning: '', info: '' };
  (['error', 'success', 'warning', 'info'] as FeedbackKey[]).forEach((key) => {
    const palette = adjusted[key];
    const bg = isLight ? palette[0]! : palette[9]!;
    const textShade = isLight ? SLOTS.lightTextLight : SLOTS.lightTextDark;
    const text = adjustSlot(key, textShade, bg, textRatio, `feedback/${key}/text`);
    const border = adjustSlot(key, SLOTS.outlineBorderLight, body, uiRatio, `feedback/${key}/border`, 'ui');
    feedback[key] = { background: bg, border, icon: text, text };
    borderFeedback[key] = border;
    iconFeedback[key] = text;
  });

  // --- Buttons (per family × variant) — derived via Mantine's exact algorithm ---
  // We first nudge the relevant palette shades for contrast (filled bg=5, light text=9/0,
  // outline border=5/1) and THEN feed the adjusted palette into `getMantineButtonTokens`,
  // which mirrors `getCSSColorVariables()` from @mantine/core. This guarantees the contrast
  // checker validates the SAME pixels Mantine renders in the Preview and the Figma export
  // emits.
  const buttons = {} as DerivedSemanticTokens['buttons'];
  (['brand', 'accent', 'tertiary', 'error', 'success', 'warning', 'info'] as ColorFamily[]).forEach((family) => {
    const key = family as AdjKey;
    const palette = adjusted[key];

    // Adjust the few shades Mantine actually consumes for buttons.
    const filledIdx = isLight ? SLOTS.filledLight : SLOTS.filledDark;
    adjustSlot(key, filledIdx, '#FFFFFF', textRatio, `button/${family}/filled/bg`);

    const lightTextIdx = isLight ? SLOTS.lightTextLight : SLOTS.lightTextDark;
    // Light variant bg in dark mode is `darken(palette[9], 0.5)` — a computed solid; in
    // light mode it's palette[1]. We adjust the corresponding fg index against that bg below.
    const lightBgForCheck = isLight ? palette[1]! : palette[9]!; // approx for adjust pass
    adjustSlot(key, lightTextIdx, lightBgForCheck, textRatio, `button/${family}/light/text`);

    const outlineIdx = isLight ? SLOTS.outlineTextLight : SLOTS.outlineTextDark;
    adjustSlot(key, outlineIdx, body, textRatio, `button/${family}/outline/text`);
    adjustSlot(key, outlineIdx, body, uiRatio, `button/${family}/outline/border`, 'ui');

    // Re-resolve through Mantine's algorithm with the (potentially) adjusted palette.
    const mantine = getMantineButtonTokens(palette, mode);

    const filledBg = mantine.filled.background;
    const filledText = pickReadableForeground(filledBg);
    recordCheck(`button/${family}/filled/text`, filledText, filledBg, textRatio);

    recordCheck(`button/${family}/light/text`, mantine.light.color, mantine.light.background, textRatio);
    recordCheck(`button/${family}/subtle/text`, mantine.subtle.color, body, textRatio);

    buttons[family] = {
      filled: {
        background: mantine.filled.background,
        backgroundHover: mantine.filled.backgroundHover,
        backgroundActive: mantine.filled.backgroundActive,
        border: mantine.filled.border,
        text: filledText,
        icon: filledText,
      },
      light: {
        background: mantine.light.background,
        backgroundHover: mantine.light.backgroundHover,
        backgroundActive: mantine.light.backgroundActive,
        border: mantine.light.border,
        text: mantine.light.color,
        icon: mantine.light.color,
      },
      outline: {
        background: mantine.outline.background,
        backgroundHover: mantine.outline.backgroundHover,
        backgroundActive: mantine.outline.backgroundActive,
        border: mantine.outline.border,
        text: mantine.outline.color,
        icon: mantine.outline.color,
      },
      subtle: {
        background: mantine.subtle.background,
        backgroundHover: mantine.subtle.backgroundHover,
        backgroundActive: mantine.subtle.backgroundActive,
        border: mantine.subtle.border,
        text: mantine.subtle.color,
        icon: mantine.subtle.color,
      },
    };
  });

  // --- Report tally ---
  let passed = 0;
  let failed = 0;
  for (const c of Object.values(checks)) {
    if (c.passed) passed++;
    else failed++;
  }

  return {
    mode,
    target,
    background: {
      body,
      surface,
      subtle,
      elevated,
      muted,
      strong,
      inverse,
      selected,
      light,
      brand: brandBg,
      accent: accentBg,
      tertiary: tertiaryBg,
    },
    text: {
      primary: primaryText,
      secondary: secondaryText,
      tertiary: tertiaryText,
      muted: mutedText,
      disabled: disabledText,
      inverse: inverseText,
      brand: brandText,
      accent: accentText,
    },
    border: {
      default: borderDefault,
      subtle: borderSubtle,
      strong: borderStrong,
      focus: borderFocus,
      brand: borderBrand,
      accent: borderAccent,
      tertiary: borderTertiary,
      error: borderFeedback.error,
      success: borderFeedback.success,
      warning: borderFeedback.warning,
      info: borderFeedback.info,
    },
    icon: {
      primary: primaryText,
      secondary: secondaryText,
      tertiary: tertiaryText,
      muted: mutedText,
      disabled: disabledText,
      inverse: inverseText,
      brand: iconBrand,
      accent: iconAccent,
      error: iconFeedback.error,
      success: iconFeedback.success,
      warning: iconFeedback.warning,
      info: iconFeedback.info,
    },
    feedback,
    buttons,
    adjustedPalettes: adjusted,
    report: { checks, passed, failed, adjusted: adjustedCount },
  };
}

// --- Public helpers --------------------------------------------------------

import type { DesignTokens } from '@/types';

/**
 * Returns a `DesignTokens` object whose color palettes have been adjusted to satisfy the
 * given WCAG target across BOTH light and dark modes. The light pass runs first, then the
 * dark pass uses the light-adjusted palettes as input — so the resulting palettes carry
 * the union of all per-mode adjustments. Non-color tokens are passed through unchanged.
 */
export function applyContrastAdjustments(
  tokens: DesignTokens,
  target: WcagTarget,
): DesignTokens {
  const lightPass = deriveSemanticTokens(tokens.colors, 'light', target);
  const lightAdjustedColors: DesignTokenColors = {
    brand: { ...tokens.colors.brand, baseHex: lightPass.adjustedPalettes.brand[5]!, shades: lightPass.adjustedPalettes.brand },
    accent: { ...tokens.colors.accent, baseHex: lightPass.adjustedPalettes.accent[5]!, shades: lightPass.adjustedPalettes.accent },
    tertiary: { ...tokens.colors.tertiary, baseHex: lightPass.adjustedPalettes.tertiary[5]!, shades: lightPass.adjustedPalettes.tertiary },
    gray: { ...tokens.colors.gray, baseHex: lightPass.adjustedPalettes.gray[5]!, shades: lightPass.adjustedPalettes.gray },
    feedback: {
      error: { ...tokens.colors.feedback.error, baseHex: lightPass.adjustedPalettes.error[5]!, shades: lightPass.adjustedPalettes.error },
      success: { ...tokens.colors.feedback.success, baseHex: lightPass.adjustedPalettes.success[5]!, shades: lightPass.adjustedPalettes.success },
      warning: { ...tokens.colors.feedback.warning, baseHex: lightPass.adjustedPalettes.warning[5]!, shades: lightPass.adjustedPalettes.warning },
      info: { ...tokens.colors.feedback.info, baseHex: lightPass.adjustedPalettes.info[5]!, shades: lightPass.adjustedPalettes.info },
    },
  };

  const darkPass = deriveSemanticTokens(lightAdjustedColors, 'dark', target);
  const finalColors: DesignTokenColors = {
    brand: { ...tokens.colors.brand, baseHex: darkPass.adjustedPalettes.brand[5]!, shades: darkPass.adjustedPalettes.brand },
    accent: { ...tokens.colors.accent, baseHex: darkPass.adjustedPalettes.accent[5]!, shades: darkPass.adjustedPalettes.accent },
    tertiary: { ...tokens.colors.tertiary, baseHex: darkPass.adjustedPalettes.tertiary[5]!, shades: darkPass.adjustedPalettes.tertiary },
    gray: { ...tokens.colors.gray, baseHex: darkPass.adjustedPalettes.gray[5]!, shades: darkPass.adjustedPalettes.gray },
    feedback: {
      error: { ...tokens.colors.feedback.error, baseHex: darkPass.adjustedPalettes.error[5]!, shades: darkPass.adjustedPalettes.error },
      success: { ...tokens.colors.feedback.success, baseHex: darkPass.adjustedPalettes.success[5]!, shades: darkPass.adjustedPalettes.success },
      warning: { ...tokens.colors.feedback.warning, baseHex: darkPass.adjustedPalettes.warning[5]!, shades: darkPass.adjustedPalettes.warning },
      info: { ...tokens.colors.feedback.info, baseHex: darkPass.adjustedPalettes.info[5]!, shades: darkPass.adjustedPalettes.info },
    },
  };

  return { ...tokens, colors: finalColors };
}

/** Counts how many shades differ between two `DesignTokens` palettes. */
export function countPaletteAdjustments(original: DesignTokens, adjusted: DesignTokens): number {
  const pairs: [ColorShade, ColorShade][] = [
    [original.colors.brand.shades, adjusted.colors.brand.shades],
    [original.colors.accent.shades, adjusted.colors.accent.shades],
    [original.colors.tertiary.shades, adjusted.colors.tertiary.shades],
    [original.colors.gray.shades, adjusted.colors.gray.shades],
    [original.colors.feedback.error.shades, adjusted.colors.feedback.error.shades],
    [original.colors.feedback.success.shades, adjusted.colors.feedback.success.shades],
    [original.colors.feedback.warning.shades, adjusted.colors.feedback.warning.shades],
    [original.colors.feedback.info.shades, adjusted.colors.feedback.info.shades],
  ];
  let count = 0;
  for (const [a, b] of pairs) {
    for (let i = 0; i < a.length; i++) {
      if (a[i]!.toUpperCase() !== b[i]!.toUpperCase()) count++;
    }
  }
  return count;
}

