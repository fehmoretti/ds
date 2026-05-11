/**
 * Mantine variant token resolver — replicates the EXACT algorithm Mantine v7 uses to
 * derive `--mantine-color-{name}-{slot}` CSS variables from a 10-shade palette.
 *
 * Source of truth (so the contrast checker, the Figma export, and the Preview matrix
 * all produce the same values rendered by real Mantine components):
 *   node_modules/@mantine/core/esm/core/MantineProvider/MantineCssVariables/
 *     get-css-color-variables.mjs
 *
 * Active state is NOT a Mantine slot — Mantine renders `:active` as `translateY(1px)`
 * with the same hover background. We expose `bgActive` for completeness but it always
 * mirrors `bgHover`.
 */

export type MantineMode = 'light' | 'dark';

export interface MantineButtonVariantTokens {
  background: string;
  backgroundHover: string;
  backgroundActive: string; // mirrors backgroundHover (Mantine has no separate active bg)
  color: string;
  border: string;
}

export interface MantineColorTokens {
  filled: MantineButtonVariantTokens;
  light: MantineButtonVariantTokens;
  outline: MantineButtonVariantTokens;
  subtle: MantineButtonVariantTokens;
}

const TRANSPARENT = 'transparent';
const WHITE = '#FFFFFF';

/** Mantine's `darken(color, alpha)` — multiplies each RGB channel by `1 - alpha`.
 *  Returns a 6-digit hex (alpha is preserved only as 1 since palette inputs are opaque). */
export function mantineDarken(hex: string, amount: number): string {
  const cleaned = hex.replace('#', '');
  if (cleaned.length < 6) return hex;
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  const f = 1 - amount;
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n * f))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Mantine's `alpha(hex, value)` — produces a CSS rgba() string with the given alpha. */
export function mantineAlpha(hex: string, value: number): string {
  const cleaned = hex.replace('#', '');
  if (cleaned.length < 6) return hex;
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${value})`;
}

/** Returns the same 8-digit hex Figma can ingest for the alpha overlay. */
export function mantineAlphaHex(hex: string, value: number): string {
  const cleaned = hex.replace('#', '');
  if (cleaned.length < 6) return hex;
  const a = Math.round(Math.max(0, Math.min(1, value)) * 255).toString(16).padStart(2, '0');
  return `#${cleaned.slice(0, 6)}${a}`;
}

/**
 * Resolves the four Mantine button variants for a given palette and mode.
 * Mirrors `getCSSColorVariables()` and `defaultVariantColorsResolver` exactly.
 */
export function getMantineButtonTokens(
  shades: string[],
  mode: MantineMode,
  primaryShade = 5,
): MantineColorTokens {
  if (shades.length < 10) {
    throw new Error('getMantineButtonTokens: expected a 10-shade palette');
  }
  const ps = Math.max(0, Math.min(9, primaryShade));
  const psHover = ps === 9 ? 8 : ps + 1;
  const filledBg = shades[ps]!;
  const filledHover = shades[psHover]!;

  if (mode === 'light') {
    const lightBg = shades[1]!;
    const lightHover = shades[2]!;
    const lightColor = shades[9]!;
    const outlineColor = shades[ps]!;
    return {
      filled: {
        background: filledBg,
        backgroundHover: filledHover,
        backgroundActive: filledHover,
        color: WHITE,
        border: filledBg,
      },
      light: {
        background: lightBg,
        backgroundHover: lightHover,
        backgroundActive: lightHover,
        color: lightColor,
        border: TRANSPARENT,
      },
      outline: {
        background: TRANSPARENT,
        backgroundHover: mantineAlpha(outlineColor, 0.05),
        backgroundActive: mantineAlpha(outlineColor, 0.05),
        color: outlineColor,
        border: outlineColor,
      },
      subtle: {
        background: TRANSPARENT,
        backgroundHover: lightHover,
        backgroundActive: lightHover,
        color: lightColor,
        border: TRANSPARENT,
      },
    };
  }

  // dark
  const darkLightBg = mantineDarken(shades[9]!, 0.5);
  const darkLightHover = mantineDarken(shades[9]!, 0.3);
  const darkLightColor = shades[0]!;
  const outlineShadeIndex = Math.max(ps - 4, 0);
  const outlineColor = shades[outlineShadeIndex]!;

  return {
    filled: {
      background: filledBg,
      backgroundHover: filledHover,
      backgroundActive: filledHover,
      color: WHITE,
      border: filledBg,
    },
    light: {
      background: darkLightBg,
      backgroundHover: darkLightHover,
      backgroundActive: darkLightHover,
      color: darkLightColor,
      border: TRANSPARENT,
    },
    outline: {
      background: TRANSPARENT,
      backgroundHover: mantineAlpha(outlineColor, 0.05),
      backgroundActive: mantineAlpha(outlineColor, 0.05),
      color: outlineColor,
      border: outlineColor,
    },
    subtle: {
      background: TRANSPARENT,
      backgroundHover: darkLightHover,
      backgroundActive: darkLightHover,
      color: darkLightColor,
      border: TRANSPARENT,
    },
  };
}
