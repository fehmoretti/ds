import {
  ColorInput,
  Stack,
  Text,
  Group,
  Paper,
  SimpleGrid,
  Box,
  Title,
  Badge,
  Tooltip,
} from '@mantine/core';
import { IconWand, IconCheck } from '@tabler/icons-react';
import { useMemo } from 'react';
import { useTokens, useWcagMode } from '@/providers';
import { generatePalette } from '@/lib/color-utils';
import { applyContrastAdjustments } from '@/lib/semantic-tokens';
import { contrastRatio } from '@/lib/contrast';
import type { ColorPalette } from '@/types';

interface PaletteEditorProps {
  label: string;
  palette: ColorPalette;
  adjustedShades: string[];
  isAdjusted: boolean;
  onChange: (palette: ColorPalette) => void;
}

function eqHex(a?: string, b?: string) {
  return (a ?? '').toUpperCase() === (b ?? '').toUpperCase();
}

function PalettePreview({
  shades,
  adjustedShades,
  showAdjusted,
}: {
  shades: string[];
  adjustedShades: string[];
  showAdjusted: boolean;
}) {
  return (
    <Group gap={2}>
      {shades.map((color, i) => {
        const adjusted = adjustedShades[i] ?? color;
        const display = showAdjusted ? adjusted : color;
        const changed = showAdjusted && !eqHex(color, adjusted);
        return (
          <Tooltip
            key={i}
            label={
              changed
                ? `Shade ${i}: ${color.toUpperCase()} → ${adjusted.toUpperCase()}`
                : `Shade ${i}: ${display.toUpperCase()}`
            }
            withArrow
          >
            <Box
              style={{
                backgroundColor: display,
                width: 28,
                height: 28,
                borderRadius: 4,
                border: changed
                  ? '2px solid var(--mantine-color-brand-5)'
                  : '1px solid var(--mantine-color-gray-3)',
                position: 'relative',
              }}
            />
          </Tooltip>
        );
      })}
    </Group>
  );
}

function PaletteEditor({ label, palette, adjustedShades, isAdjusted, onChange }: PaletteEditorProps) {
  const handleBaseColorChange = (hex: string) => {
    if (hex && hex.length === 7) {
      const shades = generatePalette(hex);
      onChange({ ...palette, baseHex: hex, shades });
    }
  };

  const showAdjusted = isAdjusted;
  const baseShade = (showAdjusted ? adjustedShades[5] : palette.shades[5]) ?? palette.baseHex;
  const ratioWhite = contrastRatio(baseShade, '#FFFFFF');
  const ratioBlack = contrastRatio(baseShade, '#000000');
  const changedCount = adjustedShades.reduce(
    (acc, shade, i) => (eqHex(shade, palette.shades[i]) ? acc : acc + 1),
    0,
  );

  return (
    <Paper p="md" withBorder>
      <Stack gap="sm">
        <Group justify="space-between" wrap="nowrap">
          <Text fw={600} size="sm" tt="capitalize">
            {label}
          </Text>
          <Group gap={6}>
            {showAdjusted && changedCount > 0 && (
              <Badge size="xs" color="brand" variant="filled" leftSection={<IconWand size={10} />}>
                {changedCount} ajustado{changedCount > 1 ? 's' : ''}
              </Badge>
            )}
            {showAdjusted && changedCount === 0 && (
              <Badge size="xs" color="green" variant="light" leftSection={<IconCheck size={10} />}>
                OK
              </Badge>
            )}
            <Text size="xs" c="dimmed">
              {(showAdjusted ? adjustedShades[5] : palette.baseHex)?.toUpperCase()}
            </Text>
          </Group>
        </Group>
        <ColorInput
          value={palette.baseHex}
          onChange={handleBaseColorChange}
          format="hex"
          placeholder="Escolha a cor base"
          size="sm"
        />
        <PalettePreview
          shades={palette.shades}
          adjustedShades={adjustedShades}
          showAdjusted={showAdjusted}
        />
        <Group gap={6}>
          <Tooltip label="Contraste do shade 5 vs branco" withArrow>
            <Badge
              size="xs"
              variant="light"
              color={ratioWhite >= 4.5 ? 'green' : ratioWhite >= 3 ? 'yellow' : 'red'}
            >
              vs ⬜ {ratioWhite.toFixed(2)}:1
            </Badge>
          </Tooltip>
          <Tooltip label="Contraste do shade 5 vs preto" withArrow>
            <Badge
              size="xs"
              variant="light"
              color={ratioBlack >= 4.5 ? 'green' : ratioBlack >= 3 ? 'yellow' : 'red'}
            >
              vs ⬛ {ratioBlack.toFixed(2)}:1
            </Badge>
          </Tooltip>
        </Group>
      </Stack>
    </Paper>
  );
}

export function ColorsConfigurator() {
  const { tokens, dispatch } = useTokens();
  const { mode } = useWcagMode();

  const adjustedTokens = useMemo(() => {
    if (mode === 'none') return tokens;
    return applyContrastAdjustments(tokens, mode);
  }, [tokens, mode]);

  const isAdjusted = mode !== 'none';

  const handleMainPaletteChange = (key: 'brand' | 'accent' | 'tertiary' | 'gray') => (palette: ColorPalette) => {
    dispatch({ type: 'SET_COLOR_PALETTE', payload: { key, palette } });
  };

  const handleFeedbackChange = (key: 'error' | 'success' | 'warning' | 'info') => (palette: ColorPalette) => {
    dispatch({ type: 'SET_FEEDBACK_PALETTE', payload: { key, palette } });
  };

  return (
    <Stack gap="lg">
      <div>
        <Title order={4} mb={4}>Cores Principais</Title>
        <Text size="sm" c="dimmed">
          Escolha as cores base e a paleta de 10 tons será gerada automaticamente.
          {isAdjusted && (
            <>
              {' '}As paletas exibidas refletem os ajustes de contraste{' '}
              <b>WCAG {mode}</b> aplicados nas exportações e no preview.
            </>
          )}
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        <PaletteEditor
          label="Brand (Primária)"
          palette={tokens.colors.brand}
          adjustedShades={adjustedTokens.colors.brand.shades}
          isAdjusted={isAdjusted}
          onChange={handleMainPaletteChange('brand')}
        />
        <PaletteEditor
          label="Accent (Secundária)"
          palette={tokens.colors.accent}
          adjustedShades={adjustedTokens.colors.accent.shades}
          isAdjusted={isAdjusted}
          onChange={handleMainPaletteChange('accent')}
        />
        <PaletteEditor
          label="Tertiary (Terciária)"
          palette={tokens.colors.tertiary}
          adjustedShades={adjustedTokens.colors.tertiary.shades}
          isAdjusted={isAdjusted}
          onChange={handleMainPaletteChange('tertiary')}
        />
        <PaletteEditor
          label="Gray (Neutros)"
          palette={tokens.colors.gray}
          adjustedShades={adjustedTokens.colors.gray.shades}
          isAdjusted={isAdjusted}
          onChange={handleMainPaletteChange('gray')}
        />
      </SimpleGrid>

      <div>
        <Title order={4} mb={4}>Cores de Feedback</Title>
        <Text size="sm" c="dimmed">
          Cores usadas para estados de sucesso, erro, alerta e informação.
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        <PaletteEditor
          label="Error"
          palette={tokens.colors.feedback.error}
          adjustedShades={adjustedTokens.colors.feedback.error.shades}
          isAdjusted={isAdjusted}
          onChange={handleFeedbackChange('error')}
        />
        <PaletteEditor
          label="Success"
          palette={tokens.colors.feedback.success}
          adjustedShades={adjustedTokens.colors.feedback.success.shades}
          isAdjusted={isAdjusted}
          onChange={handleFeedbackChange('success')}
        />
        <PaletteEditor
          label="Warning"
          palette={tokens.colors.feedback.warning}
          adjustedShades={adjustedTokens.colors.feedback.warning.shades}
          isAdjusted={isAdjusted}
          onChange={handleFeedbackChange('warning')}
        />
        <PaletteEditor
          label="Info"
          palette={tokens.colors.feedback.info}
          adjustedShades={adjustedTokens.colors.feedback.info.shades}
          isAdjusted={isAdjusted}
          onChange={handleFeedbackChange('info')}
        />
      </SimpleGrid>
    </Stack>
  );
}
