import { useState, useRef, useMemo } from 'react';
import {
  MantineProvider,
  createTheme,
  Stack,
  Paper,
  Text,
  Title,
  Group,
  Box,
  Button,
  ActionIcon,
  SegmentedControl,
  Badge,
} from '@mantine/core';
import type { MantineColorsTuple } from '@mantine/core';
import {
  IconSun,
  IconMoon,
  IconHeart,
  IconStar,
  IconSettings,
  IconBell,
  IconCheck,
  IconTrash,
  IconEdit,
  IconPlus,
  IconArrowRight,
  IconDots,
  IconWand,
} from '@tabler/icons-react';
import { useTokens, useWcagMode } from '@/providers';
import { applyContrastAdjustments, countPaletteAdjustments } from '@/lib/semantic-tokens';
import { getMantineButtonTokens } from '@/lib/mantine-tokens';
import type { WcagTarget } from '@/lib/contrast';
import { PreviewFormElements, PreviewContent, PreviewDataAndLayout } from './preview';
import type { PreviewStyleProps } from './preview';

function ColorSwatchPreview({ color, label }: { color: string; label: string }) {
  return (
    <Stack gap={2} align="center">
      <Box
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          backgroundColor: color,
          border: '1px solid var(--mantine-color-gray-3)',
        }}
      />
      <Text size="xs" c="dimmed">
        {label}
      </Text>
    </Stack>
  );
}

// --- Button States Matrix --------------------------------------------------
// Renders a static matrix of variants (rows) x states (columns) using the
// SAME CSS custom properties Mantine generates for the active color scheme,
// so each cell matches the real Button output 1:1. Active state reuses the
// hover token (Mantine does not differentiate active background by default).
type ButtonStateStyle = {
  background: string;
  color: string;
  borderColor: string;
};

function buttonStateStyles(
  isLight: boolean,
  brandShades: string[],
): Record<'filled' | 'light' | 'outline' | 'subtle', Record<'default' | 'hover' | 'active' | 'disabled', ButtonStateStyle>> {
  // Single source of truth: `getMantineButtonTokens` mirrors @mantine/core's
  // `getCSSColorVariables` + `defaultVariantColorsResolver`. The same helper feeds the
  // contrast checker (semantic-tokens.ts) and the Figma export (figma-color-export.ts),
  // so what you see here is exactly what real Mantine renders, what gets validated for
  // contrast, and what ships to Figma.
  const m = getMantineButtonTokens(brandShades, isLight ? 'light' : 'dark');

  const transparent = 'transparent';
  const disabledBg = isLight ? 'var(--mantine-color-gray-1)' : 'var(--mantine-color-gray-8)';
  const disabledFg = 'var(--mantine-color-gray-5)';
  const disabledBorder = isLight ? 'var(--mantine-color-gray-2)' : 'var(--mantine-color-gray-7)';

  return {
    filled: {
      default:  { background: m.filled.background,        color: m.filled.color,    borderColor: m.filled.border },
      hover:    { background: m.filled.backgroundHover,   color: m.filled.color,    borderColor: m.filled.backgroundHover },
      active:   { background: m.filled.backgroundActive,  color: m.filled.color,    borderColor: m.filled.backgroundActive },
      disabled: { background: disabledBg,                 color: disabledFg,        borderColor: disabledBorder },
    },
    light: {
      default:  { background: m.light.background,         color: m.light.color,     borderColor: transparent },
      hover:    { background: m.light.backgroundHover,    color: m.light.color,     borderColor: transparent },
      active:   { background: m.light.backgroundActive,   color: m.light.color,     borderColor: transparent },
      disabled: { background: disabledBg,                 color: disabledFg,        borderColor: transparent },
    },
    outline: {
      default:  { background: m.outline.background,       color: m.outline.color,   borderColor: m.outline.border },
      hover:    { background: m.outline.backgroundHover,  color: m.outline.color,   borderColor: m.outline.border },
      active:   { background: m.outline.backgroundActive, color: m.outline.color,   borderColor: m.outline.border },
      disabled: { background: transparent,                color: disabledFg,        borderColor: disabledBorder },
    },
    subtle: {
      default:  { background: m.subtle.background,        color: m.subtle.color,    borderColor: transparent },
      hover:    { background: m.subtle.backgroundHover,   color: m.subtle.color,    borderColor: transparent },
      active:   { background: m.subtle.backgroundActive,  color: m.subtle.color,    borderColor: transparent },
      disabled: { background: transparent,                color: disabledFg,        borderColor: transparent },
    },
  };
}

interface ButtonStatesMatrixProps {
  isLight: boolean;
  radius: number;
  fontFamily: string;
  brandShades: string[];
}

function ButtonStatesMatrix({ isLight, radius, fontFamily, brandShades }: ButtonStatesMatrixProps) {
  const styles = buttonStateStyles(isLight, brandShades);
  const variants: Array<keyof typeof styles> = ['filled', 'light', 'outline', 'subtle'];
  const states: Array<'default' | 'hover' | 'active' | 'disabled'> = ['default', 'hover', 'active', 'disabled'];
  const variantLabels: Record<string, string> = { filled: 'Filled', light: 'Light', outline: 'Outline', subtle: 'Subtle' };
  const stateLabels: Record<string, string> = { default: 'Default', hover: 'Hover', active: 'Active', disabled: 'Disabled' };
  const headerColor = isLight ? '#495057' : '#c1c2c5';
  const labelColor = isLight ? '#868e96' : '#909296';

  return (
    <Stack gap={6}>
      {/* Header row */}
      <Group gap="sm" wrap="nowrap" align="center">
        <Box w={70} />
        {states.map((st) => (
          <Box key={st} style={{ flex: 1, textAlign: 'center' }}>
            <Text size="xs" fw={600} style={{ color: headerColor, fontFamily, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {stateLabels[st]}
            </Text>
          </Box>
        ))}
      </Group>
      {variants.map((variant) => (
        <Group key={variant} gap="sm" wrap="nowrap" align="center">
          <Text size="xs" fw={600} w={70} style={{ color: labelColor, fontFamily }}>
            {variantLabels[variant]}
          </Text>
          {states.map((state) => {
            const st = styles[variant][state];
            return (
              <Box key={state} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <Box
                  component="span"
                  aria-disabled={state === 'disabled'}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingInline: 16,
                    height: 36,
                    minWidth: 96,
                    borderRadius: radius,
                    background: st.background,
                    color: st.color,
                    border: `1px solid ${st.borderColor}`,
                    fontFamily,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: state === 'disabled' ? 'not-allowed' : 'default',
                    transform: state === 'active' ? 'translateY(1px)' : undefined,
                    transition: 'none',
                    userSelect: 'none',
                  }}
                >
                  Button
                </Box>
              </Box>
            );
          })}
        </Group>
      ))}
    </Stack>
  );
}

export function TokenPreview() {
  const { tokens } = useTokens();
  const { radius, typography } = tokens;
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('dark');
  const { mode: contrastMode } = useWcagMode();
  const previewRef = useRef<HTMLDivElement>(null);

  /**
   * When AA/AAA is selected, the preview consumes a token snapshot whose palettes have
   * been adjusted for WCAG — same algorithm and output as the Contraste tab and as the
   * exporters. This is non-destructive: the underlying project tokens stay untouched.
   */
  const effectiveTokens = useMemo(() => {
    if (contrastMode === 'none') return tokens;
    return applyContrastAdjustments(tokens, contrastMode as WcagTarget);
  }, [tokens, contrastMode]);

  const adjustmentCount = useMemo(
    () => (contrastMode === 'none' ? 0 : countPaletteAdjustments(tokens, effectiveTokens)),
    [tokens, effectiveTokens, contrastMode],
  );

  const colors = effectiveTokens.colors;

  const brandColor = colors.brand.shades[5] ?? '#228be6';
  const accentColor = colors.accent.shades[5] ?? '#228be6';
  const grayColor = colors.gray.shades[5] ?? '#868e96';
  const errorColor = colors.feedback.error.shades[5] ?? '#fa5252';
  const successColor = colors.feedback.success.shades[5] ?? '#40c057';
  const warningColor = colors.feedback.warning.shades[5] ?? '#fab005';

  const cardRadius = radius.scale[radius.components.card];
  const buttonRadius = radius.scale[radius.components.button];
  const inputRadius = radius.scale[radius.components.input];
  const badgeRadius = radius.scale[radius.components.badge];

  const fontFamily = `${typography.fonts.base}, sans-serif`;
  const monoFamily = `${typography.fonts.mono}, monospace`;

  const previewTheme = useMemo(() => {
    const toTuple = (shades: string[]): MantineColorsTuple =>
      shades.length === 10
        ? (shades as unknown as MantineColorsTuple)
        : ['#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff'];

    return createTheme({
      primaryColor: 'brand',
      primaryShade: 5,
      colors: {
        brand: toTuple(colors.brand.shades),
        accent: toTuple(colors.accent.shades),
        gray: toTuple(colors.gray.shades),
      },
      fontFamily,
      fontFamilyMonospace: monoFamily,
    });
  }, [colors.brand.shades, colors.accent.shades, colors.gray.shades, fontFamily, monoFamily]);

  const isLight = previewMode === 'light';
  const previewBg = isLight ? '#ffffff' : '#1a1b1e';
  const previewTextColor = isLight ? '#1a1b1e' : '#f1f3f5';
  const previewDimmed = isLight ? '#868e96' : '#909296';
  const previewBorder = isLight ? '#dee2e6' : '#2c2e33';
  const previewCardBg = isLight ? '#f8f9fa' : '#25262b';
  const previewShadowAlpha = isLight ? '0.1' : '0.4';

  const sectionStyle = {
    background: previewCardBg,
    border: `1px solid ${previewBorder}`,
    borderRadius: `${cardRadius}px`,
  };

  const sectionTitleProps = {
    size: 'sm' as const,
    fw: 600,
    mb: 'sm' as const,
    style: { fontFamily, color: previewTextColor },
  };

  const sharedProps: PreviewStyleProps = {
    brandColor, accentColor, grayColor, errorColor, successColor, warningColor,
    cardRadius, buttonRadius, inputRadius, badgeRadius,
    fontFamily, monoFamily,
    previewBg, previewTextColor, previewDimmed, previewBorder, previewCardBg, previewShadowAlpha, isLight,
    sectionStyle, sectionTitleProps,
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center" wrap="wrap">
        <div>
          <Title order={4} mb={4}>
            Preview do Design System
          </Title>
          <Text size="sm" c="dimmed">
            Todos os componentes Mantine com seus tokens aplicados.
          </Text>
        </div>
        <Group gap="md" wrap="nowrap" align="center">
          {contrastMode !== 'none' && adjustmentCount > 0 && (
            <Badge color="brand" variant="filled" leftSection={<IconWand size={12} />}>
              {adjustmentCount} tons ajustados ({contrastMode})
            </Badge>
          )}
          <SegmentedControl
            value={previewMode}
            onChange={(v) => setPreviewMode(v as 'light' | 'dark')}
            data={[
              {
                value: 'light',
                label: (
                  <Group gap={6} wrap="nowrap">
                    <IconSun size={14} />
                    <Text size="xs">Light</Text>
                  </Group>
                ),
              },
              {
                value: 'dark',
                label: (
                  <Group gap={6} wrap="nowrap">
                    <IconMoon size={14} />
                    <Text size="xs">Dark</Text>
                  </Group>
                ),
              },
            ]}
            size="xs"
          />
        </Group>
      </Group>

      {/* Preview Container */}
      <MantineProvider
        theme={previewTheme}
        forceColorScheme={previewMode}
        cssVariablesSelector=".preview-root"
        getRootElement={() => previewRef.current ?? undefined}
      >
      <Stack
        ref={previewRef}
        className="preview-root"
        gap="md"
        data-mantine-color-scheme={previewMode}
        style={{
          colorScheme: previewMode,
          background: previewBg,
          color: previewTextColor,
          borderRadius: 12,
          border: `1px solid ${previewBorder}`,
          padding: 'var(--mantine-spacing-lg)',
          transition: 'background 200ms ease, border-color 200ms ease, color 200ms ease',
        }}
      >

        {/* COLOR PALETTE */}
        <Paper p="md" style={sectionStyle}>
          <Text {...sectionTitleProps}>Paletas de Cor</Text>
          <Stack gap="sm">
            <Group gap="xs">
              <Text size="xs" w={60} style={{ color: previewDimmed }}>Brand</Text>
              {colors.brand.shades.map((c, i) => (
                <ColorSwatchPreview key={i} color={c} label={String(i)} />
              ))}
            </Group>
            <Group gap="xs">
              <Text size="xs" w={60} style={{ color: previewDimmed }}>Accent</Text>
              {colors.accent.shades.map((c, i) => (
                <ColorSwatchPreview key={i} color={c} label={String(i)} />
              ))}
            </Group>
            <Group gap="xs">
              <Text size="xs" w={60} style={{ color: previewDimmed }}>Gray</Text>
              {colors.gray.shades.map((c, i) => (
                <ColorSwatchPreview key={i} color={c} label={String(i)} />
              ))}
            </Group>
          </Stack>
        </Paper>

        {/* BUTTONS */}
        <Paper p="md" style={sectionStyle}>
          <Text {...sectionTitleProps}>Buttons</Text>
          <Stack gap="sm">
            <Group gap="sm" wrap="wrap">
              <Button color="brand" style={{ borderRadius: `${buttonRadius}px`, fontFamily }}>Filled</Button>
              <Button color="brand" variant="light" style={{ borderRadius: `${buttonRadius}px`, fontFamily }}>Light</Button>
              <Button color="brand" variant="outline" style={{ borderRadius: `${buttonRadius}px`, fontFamily }}>Outline</Button>
              <Button color="brand" variant="subtle" style={{ borderRadius: `${buttonRadius}px`, fontFamily }}>Subtle</Button>
              <Button color="brand" variant="transparent" style={{ fontFamily }}>Transparent</Button>
              <Button variant="default" style={{ borderRadius: `${buttonRadius}px`, fontFamily }}>Default</Button>
            </Group>
            <Group gap="sm" wrap="wrap">
              <Button size="xs" style={{ backgroundColor: brandColor, borderRadius: `${buttonRadius}px`, fontFamily }}>XS</Button>
              <Button size="sm" style={{ backgroundColor: brandColor, borderRadius: `${buttonRadius}px`, fontFamily }}>SM</Button>
              <Button size="md" style={{ backgroundColor: brandColor, borderRadius: `${buttonRadius}px`, fontFamily }}>MD</Button>
              <Button size="lg" style={{ backgroundColor: brandColor, borderRadius: `${buttonRadius}px`, fontFamily }}>LG</Button>
              <Button size="xl" style={{ backgroundColor: brandColor, borderRadius: `${buttonRadius}px`, fontFamily }}>XL</Button>
            </Group>
            <Group gap="sm" wrap="wrap">
              <Button leftSection={<IconPlus size={16} />} style={{ backgroundColor: brandColor, borderRadius: `${buttonRadius}px`, fontFamily }}>Com ícone</Button>
              <Button rightSection={<IconArrowRight size={16} />} color="accent" variant="outline" style={{ borderRadius: `${buttonRadius}px`, fontFamily }}>Próximo</Button>
              <Button loading style={{ backgroundColor: brandColor, borderRadius: `${buttonRadius}px`, fontFamily }}>Loading</Button>
              <Button disabled style={{ borderRadius: `${buttonRadius}px`, fontFamily }}>Disabled</Button>
            </Group>
            <Button fullWidth style={{ backgroundColor: brandColor, borderRadius: `${buttonRadius}px`, fontFamily }}>Full Width Button</Button>
          </Stack>
        </Paper>

        {/* BUTTON STATES MATRIX */}
        <Paper p="md" style={sectionStyle}>
          <Text {...sectionTitleProps}>Button States</Text>
          <Text size="xs" mb="md" style={{ color: previewDimmed, fontFamily }}>
            Visualização estática dos estados Default · Hover · Active · Disabled para cada variante (Brand).
          </Text>
          <ButtonStatesMatrix
            isLight={isLight}
            radius={buttonRadius}
            fontFamily={fontFamily}
            brandShades={colors.brand.shades}
          />
        </Paper>

        {/* ACTION ICONS */}
        <Paper p="md" style={sectionStyle}>
          <Text {...sectionTitleProps}>ActionIcon</Text>
          <Group gap="sm" wrap="wrap">
            <ActionIcon variant="filled" style={{ backgroundColor: brandColor, borderRadius: `${buttonRadius}px` }} aria-label="Favoritar"><IconHeart size={16} /></ActionIcon>
            <ActionIcon variant="light" color="blue" style={{ borderRadius: `${buttonRadius}px` }} aria-label="Destacar"><IconStar size={16} /></ActionIcon>
            <ActionIcon color="brand" variant="outline" style={{ borderRadius: `${buttonRadius}px` }} aria-label="Configurações"><IconSettings size={16} /></ActionIcon>
            <ActionIcon variant="subtle" style={{ color: brandColor, borderRadius: `${buttonRadius}px` }} aria-label="Notificações"><IconBell size={16} /></ActionIcon>
            <ActionIcon variant="default" style={{ borderRadius: `${buttonRadius}px` }} aria-label="Mais opções"><IconDots size={16} /></ActionIcon>
            <ActionIcon size="lg" variant="filled" style={{ backgroundColor: accentColor, borderRadius: `${buttonRadius}px` }} aria-label="Adicionar"><IconPlus size={20} /></ActionIcon>
            <ActionIcon size="xl" variant="filled" style={{ backgroundColor: successColor, borderRadius: `${buttonRadius}px` }} aria-label="Confirmar"><IconCheck size={24} /></ActionIcon>
            <ActionIcon variant="filled" color="red" style={{ borderRadius: `${buttonRadius}px` }} aria-label="Excluir"><IconTrash size={16} /></ActionIcon>
            <ActionIcon disabled style={{ borderRadius: `${buttonRadius}px` }} aria-label="Editar (desabilitado)"><IconEdit size={16} /></ActionIcon>
          </Group>
        </Paper>

        <PreviewFormElements {...sharedProps} />
        <PreviewContent {...sharedProps} />
        <PreviewDataAndLayout {...sharedProps} />

      </Stack>
      </MantineProvider>
    </Stack>
  );
}
