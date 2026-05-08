import {
  ColorInput,
  Stack,
  Text,
  Group,
  Paper,
  SimpleGrid,
  Box,
  Title,
} from '@mantine/core';
import { useTokens } from '@/providers';
import { generatePalette } from '@/lib/color-utils';
import type { ColorPalette } from '@/types';

interface PaletteEditorProps {
  label: string;
  palette: ColorPalette;
  onChange: (palette: ColorPalette) => void;
}

function PalettePreview({ shades }: { shades: string[] }) {
  return (
    <Group gap={2}>
      {shades.map((color, i) => (
        <Box
          key={i}
          style={{
            backgroundColor: color,
            width: 28,
            height: 28,
            borderRadius: 4,
            border: '1px solid var(--mantine-color-gray-3)',
          }}
          title={`Shade ${i}: ${color}`}
        />
      ))}
    </Group>
  );
}

function PaletteEditor({ label, palette, onChange }: PaletteEditorProps) {
  const handleBaseColorChange = (hex: string) => {
    if (hex && hex.length === 7) {
      const shades = generatePalette(hex);
      onChange({ ...palette, baseHex: hex, shades });
    }
  };

  return (
    <Paper p="md" withBorder>
      <Stack gap="sm">
        <Group justify="space-between">
          <Text fw={600} size="sm" tt="capitalize">
            {label}
          </Text>
          <Text size="xs" c="dimmed">
            Base: {palette.baseHex}
          </Text>
        </Group>
        <ColorInput
          value={palette.baseHex}
          onChange={handleBaseColorChange}
          format="hex"
          placeholder="Escolha a cor base"
          size="sm"
        />
        <PalettePreview shades={palette.shades} />
      </Stack>
    </Paper>
  );
}

export function ColorsConfigurator() {
  const { tokens, dispatch } = useTokens();

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
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        <PaletteEditor
          label="Brand (Primária)"
          palette={tokens.colors.brand}
          onChange={handleMainPaletteChange('brand')}
        />
        <PaletteEditor
          label="Accent (Secundária)"
          palette={tokens.colors.accent}
          onChange={handleMainPaletteChange('accent')}
        />
        <PaletteEditor
          label="Tertiary (Terciária)"
          palette={tokens.colors.tertiary}
          onChange={handleMainPaletteChange('tertiary')}
        />
        <PaletteEditor
          label="Gray (Neutros)"
          palette={tokens.colors.gray}
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
          onChange={handleFeedbackChange('error')}
        />
        <PaletteEditor
          label="Success"
          palette={tokens.colors.feedback.success}
          onChange={handleFeedbackChange('success')}
        />
        <PaletteEditor
          label="Warning"
          palette={tokens.colors.feedback.warning}
          onChange={handleFeedbackChange('warning')}
        />
        <PaletteEditor
          label="Info"
          palette={tokens.colors.feedback.info}
          onChange={handleFeedbackChange('info')}
        />
      </SimpleGrid>
    </Stack>
  );
}
