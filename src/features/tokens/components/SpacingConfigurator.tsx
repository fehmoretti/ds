import {
  Stack,
  Text,
  NumberInput,
  SimpleGrid,
  Paper,
  Group,
  Box,
  Title,
} from '@mantine/core';
import { useTokens } from '@/providers';
import type { DesignTokenSpacing } from '@/types';

const SPACING_KEYS: (keyof DesignTokenSpacing)[] = [
  'none', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl',
];

export function SpacingConfigurator() {
  const { tokens, dispatch } = useTokens();
  const { spacing } = tokens;

  const handleChange = (key: keyof DesignTokenSpacing, value: number) => {
    dispatch({
      type: 'SET_SPACING',
      payload: { ...spacing, [key]: value },
    });
  };

  return (
    <Stack gap="lg">
      <div>
        <Title order={4} mb={4}>Escala de Espaçamento</Title>
        <Text size="sm" c="dimmed">
          Valores em pixels para gaps, paddings e margins do sistema.
        </Text>
      </div>

      <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
        {SPACING_KEYS.map((key) => (
          <Paper key={key} p="md" withBorder>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="xs" fw={600} tt="uppercase">
                  {key}
                </Text>
                <Text size="xs" c="dimmed">
                  {spacing[key]}px
                </Text>
              </Group>
              <NumberInput
                value={spacing[key]}
                onChange={(val) => handleChange(key, Number(val) || 0)}
                size="xs"
                min={0}
                max={128}
                disabled={key === 'none'}
              />
              <Box
                style={{
                  width: Math.min(spacing[key], 80),
                  height: 8,
                  backgroundColor: 'var(--mantine-color-blue-5)',
                  borderRadius: 2,
                  minWidth: 2,
                }}
              />
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
