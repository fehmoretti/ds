import {
  Stack,
  Text,
  TextInput,
  NumberInput,
  SimpleGrid,
  Paper,
  Group,
  Title,
  Box,
} from '@mantine/core';
import { useTokens } from '@/providers';
import type { DesignTokenTypography, TypographySizes } from '@/types';

export function TypographyConfigurator() {
  const { tokens, dispatch } = useTokens();
  const { fonts, sizes, weights } = tokens.typography;

  const updateTypography = (partial: Partial<DesignTokenTypography>) => {
    dispatch({
      type: 'SET_TYPOGRAPHY',
      payload: { ...tokens.typography, ...partial },
    });
  };

  const handleFontChange = (key: 'base' | 'mono', value: string) => {
    updateTypography({ fonts: { ...fonts, [key]: value } });
  };

  const handleSizeChange = (key: keyof TypographySizes, value: number) => {
    updateTypography({ sizes: { ...sizes, [key]: value } });
  };

  const handleWeightChange = (key: 'regular' | 'medium' | 'bold', value: number) => {
    updateTypography({ weights: { ...weights, [key]: value } });
  };

  return (
    <Stack gap="lg">
      <div>
        <Title order={4} mb={4}>Famílias de Fonte</Title>
        <Text size="sm" c="dimmed">
          Defina as fontes principais do design system.
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        <Paper p="md" withBorder>
          <Stack gap="sm">
            <Text size="sm" fw={600}>Fonte Base</Text>
            <TextInput
              value={fonts.base}
              onChange={(e) => handleFontChange('base', e.currentTarget.value)}
              placeholder="Ex: Montserrat, Inter, Roboto"
              size="sm"
            />
            <Box style={{ fontFamily: `${fonts.base}, sans-serif` }}>
              <Text size="lg">
                Exemplo de texto com {fonts.base}
              </Text>
              <Text size="sm" c="dimmed">
                The quick brown fox jumps over the lazy dog
              </Text>
            </Box>
          </Stack>
        </Paper>

        <Paper p="md" withBorder>
          <Stack gap="sm">
            <Text size="sm" fw={600}>Fonte Mono</Text>
            <TextInput
              value={fonts.mono}
              onChange={(e) => handleFontChange('mono', e.currentTarget.value)}
              placeholder="Ex: JetBrains Mono, Fira Code"
              size="sm"
            />
            <Box style={{ fontFamily: `${fonts.mono}, monospace` }}>
              <Text size="lg">
                Exemplo de código
              </Text>
              <Text size="sm" c="dimmed">
                {'const x = { key: "value" };'}
              </Text>
            </Box>
          </Stack>
        </Paper>
      </SimpleGrid>

      <div>
        <Title order={4} mb={4}>Escala de Tamanhos</Title>
        <Text size="sm" c="dimmed">
          Valores em pixels para cada nível da escala tipográfica.
        </Text>
      </div>

      <SimpleGrid cols={{ base: 2, sm: 3, md: 5 }} spacing="md">
        {(Object.keys(sizes) as (keyof TypographySizes)[]).map((key) => (
          <Paper key={key} p="sm" withBorder>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="xs" fw={600} tt="uppercase">
                  {key}
                </Text>
                <Text size="xs" c="dimmed">
                  {sizes[key]}px
                </Text>
              </Group>
              <NumberInput
                value={sizes[key]}
                onChange={(val) => handleSizeChange(key, Number(val) || 0)}
                size="xs"
                min={8}
                max={120}
              />
              <Text
                style={{ fontSize: `${Math.min(sizes[key], 32)}px`, fontFamily: `${fonts.base}, sans-serif` }}
                lineClamp={1}
              >
                Aa
              </Text>
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>

      <div>
        <Title order={4} mb={4}>Pesos</Title>
        <Text size="sm" c="dimmed">
          Valores numéricos de font-weight.
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        {([['regular', weights.regular], ['medium', weights.medium], ['bold', weights.bold]] as const).map(
          ([key, value]) => (
            <Paper key={key} p="md" withBorder>
              <Stack gap="xs">
                <Text size="sm" fw={600} tt="capitalize">
                  {key}
                </Text>
                <NumberInput
                  value={value}
                  onChange={(val) => handleWeightChange(key, Number(val) || 400)}
                  size="sm"
                  min={100}
                  max={900}
                  step={100}
                />
                <Text
                  style={{ fontWeight: value, fontFamily: `${fonts.base}, sans-serif` }}
                  size="lg"
                >
                  Exemplo peso {value}
                </Text>
              </Stack>
            </Paper>
          ),
        )}
      </SimpleGrid>
    </Stack>
  );
}
