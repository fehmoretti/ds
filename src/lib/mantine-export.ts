/**
 * Generates a Mantine theme object from design tokens.
 */
import type { DesignTokens } from '@/types';

interface ComponentDefaultProps {
  radius: string;
}

export interface MantineThemeExport {
  primaryColor: string;
  fontFamily: string;
  fontFamilyMonospace: string;
  defaultRadius: string;
  colors: Record<string, string[]>;
  spacing: Record<string, string>;
  radius: Record<string, string>;
  shadows: Record<string, string>;
  fontSizes: Record<string, string>;
  headings: {
    fontFamily: string;
    fontWeight: string;
  };
  components: Record<string, { defaultProps: ComponentDefaultProps }>;
}

export function exportToMantineTheme(tokens: DesignTokens): MantineThemeExport {
  const { colors, radius, typography, spacing, shadows } = tokens;

  return {
    primaryColor: 'brand',
    fontFamily: `${typography.fonts.base}, sans-serif`,
    fontFamilyMonospace: `${typography.fonts.mono}, monospace`,
    defaultRadius: 'md',
    colors: {
      brand: [...colors.brand.shades],
      accent: [...colors.accent.shades],
      tertiary: [...colors.tertiary.shades],
      gray: [...colors.gray.shades],
      error: [...colors.feedback.error.shades],
      success: [...colors.feedback.success.shades],
      warning: [...colors.feedback.warning.shades],
      info: [...colors.feedback.info.shades],
    },
    spacing: {
      '2xs': `${spacing['2xs']}px`,
      xs: `${spacing.xs}px`,
      sm: `${spacing.sm}px`,
      md: `${spacing.md}px`,
      lg: `${spacing.lg}px`,
      xl: `${spacing.xl}px`,
      '2xl': `${spacing['2xl']}px`,
    },
    radius: {
      none: `${radius.scale.none}px`,
      xs: `${radius.scale.xs}px`,
      sm: `${radius.scale.sm}px`,
      md: `${radius.scale.md}px`,
      lg: `${radius.scale.lg}px`,
      xl: `${radius.scale.xl}px`,
      full: `${radius.scale.full}px`,
    },
    shadows: {
      xs: `${shadows.xs.x}px ${shadows.xs.y}px ${shadows.xs.blur}px ${shadows.xs.spread}px rgba(0,0,0,0.05)`,
      sm: `${shadows.sm.x}px ${shadows.sm.y}px ${shadows.sm.blur}px ${shadows.sm.spread}px rgba(0,0,0,0.08)`,
      md: `${shadows.md.x}px ${shadows.md.y}px ${shadows.md.blur}px ${shadows.md.spread}px rgba(0,0,0,0.12)`,
      lg: `${shadows.lg.x}px ${shadows.lg.y}px ${shadows.lg.blur}px ${shadows.lg.spread}px rgba(0,0,0,0.16)`,
      xl: `${shadows.xl.x}px ${shadows.xl.y}px ${shadows.xl.blur}px ${shadows.xl.spread}px rgba(0,0,0,0.20)`,
    },
    fontSizes: {
      xs: `${typography.sizes.xs}px`,
      sm: `${typography.sizes.sm}px`,
      md: `${typography.sizes.md}px`,
      lg: `${typography.sizes.lg}px`,
      xl: `${typography.sizes.xl}px`,
    },
    headings: {
      fontFamily: `${typography.fonts.base}, sans-serif`,
      fontWeight: String(typography.weights.bold),
    },
    components: {
      Button: { defaultProps: { radius: `${radius.scale[radius.components.button]}px` } },
      TextInput: { defaultProps: { radius: `${radius.scale[radius.components.input]}px` } },
      PasswordInput: { defaultProps: { radius: `${radius.scale[radius.components.input]}px` } },
      Textarea: { defaultProps: { radius: `${radius.scale[radius.components.input]}px` } },
      NumberInput: { defaultProps: { radius: `${radius.scale[radius.components.input]}px` } },
      Select: { defaultProps: { radius: `${radius.scale[radius.components.input]}px` } },
      MultiSelect: { defaultProps: { radius: `${radius.scale[radius.components.input]}px` } },
      Card: { defaultProps: { radius: `${radius.scale[radius.components.card]}px` } },
      Paper: { defaultProps: { radius: `${radius.scale[radius.components.card]}px` } },
      Modal: { defaultProps: { radius: `${radius.scale[radius.components.modal]}px` } },
      Badge: { defaultProps: { radius: `${radius.scale[radius.components.badge]}px` } },
      Pill: { defaultProps: { radius: `${radius.scale[radius.components.pill]}px` } },
      ActionIcon: { defaultProps: { radius: `${radius.scale[radius.components.button]}px` } },
    },
  };
}

/**
 * Generates a ready-to-use Mantine createTheme() code string.
 */
export function exportToMantineCode(tokens: DesignTokens): string {
  const theme = exportToMantineTheme(tokens);

  return `import { createTheme, type MantineColorsTuple } from '@mantine/core';

const brand: MantineColorsTuple = ${JSON.stringify(tokens.colors.brand.shades, null, 2)} as unknown as MantineColorsTuple;

const accent: MantineColorsTuple = ${JSON.stringify(tokens.colors.accent.shades, null, 2)} as unknown as MantineColorsTuple;

const tertiary: MantineColorsTuple = ${JSON.stringify(tokens.colors.tertiary.shades, null, 2)} as unknown as MantineColorsTuple;

export const theme = createTheme({
  primaryColor: '${theme.primaryColor}',
  fontFamily: '${theme.fontFamily}',
  fontFamilyMonospace: '${theme.fontFamilyMonospace}',
  defaultRadius: '${theme.defaultRadius}',
  colors: {
    brand,
    accent,
    tertiary,
  },
  spacing: ${JSON.stringify(theme.spacing, null, 4)},
  radius: ${JSON.stringify(theme.radius, null, 4)},
  shadows: ${JSON.stringify(theme.shadows, null, 4)},
  fontSizes: ${JSON.stringify(theme.fontSizes, null, 4)},
  headings: {
    fontFamily: '${theme.headings.fontFamily}',
    fontWeight: '${theme.headings.fontWeight}',
  },
  components: {
    Button: { defaultProps: { radius: '${theme.components.Button.defaultProps.radius}' } },
    TextInput: { defaultProps: { radius: '${theme.components.TextInput.defaultProps.radius}' } },
    PasswordInput: { defaultProps: { radius: '${theme.components.PasswordInput.defaultProps.radius}' } },
    Textarea: { defaultProps: { radius: '${theme.components.Textarea.defaultProps.radius}' } },
    NumberInput: { defaultProps: { radius: '${theme.components.NumberInput.defaultProps.radius}' } },
    Select: { defaultProps: { radius: '${theme.components.Select.defaultProps.radius}' } },
    MultiSelect: { defaultProps: { radius: '${theme.components.MultiSelect.defaultProps.radius}' } },
    Card: { defaultProps: { radius: '${theme.components.Card.defaultProps.radius}' } },
    Paper: { defaultProps: { radius: '${theme.components.Paper.defaultProps.radius}' } },
    Modal: { defaultProps: { radius: '${theme.components.Modal.defaultProps.radius}' } },
    Badge: { defaultProps: { radius: '${theme.components.Badge.defaultProps.radius}' } },
    Pill: { defaultProps: { radius: '${theme.components.Pill.defaultProps.radius}' } },
    ActionIcon: { defaultProps: { radius: '${theme.components.ActionIcon.defaultProps.radius}' } },
  },
});
`;
}
