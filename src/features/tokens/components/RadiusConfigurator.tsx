import {
  Stack,
  Text,
  NumberInput,
  Select,
  SimpleGrid,
  Paper,
  Group,
  Box,
  Title,
} from '@mantine/core';
import { useTokens } from '@/providers';
import type { RadiusScale, RadiusComponents } from '@/types';

const RADIUS_SCALE_KEYS: (keyof RadiusScale)[] = ['none', 'xs', 'sm', 'md', 'lg', 'xl', 'full'];

function RadiusPreview({ value }: { value: number }) {
  const displayRadius = value > 100 ? '50%' : `${value}px`;
  return (
    <Box
      style={{
        width: 48,
        height: 48,
        borderRadius: displayRadius,
        backgroundColor: 'var(--mantine-color-brand-5, #228be6)',
        border: '2px solid var(--mantine-color-brand-7, #1971c2)',
      }}
    />
  );
}

export function RadiusConfigurator() {
  const { tokens, dispatch } = useTokens();
  const { scale, components } = tokens.radius;

  const handleScaleChange = (key: keyof RadiusScale, value: number) => {
    dispatch({
      type: 'SET_RADIUS_SCALE',
      payload: { ...scale, [key]: value },
    });
  };

  const handleComponentChange = (key: keyof RadiusComponents, value: keyof RadiusScale) => {
    dispatch({
      type: 'SET_RADIUS_COMPONENTS',
      payload: { ...components, [key]: value },
    });
  };

  return (
    <Stack gap="lg">
      <div>
        <Title order={4} mb={4}>Escala de Radius</Title>
        <Text size="sm" c="dimmed">
          Defina os valores base de border-radius do sistema.
        </Text>
      </div>

      <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="md">
        {RADIUS_SCALE_KEYS.map((key) => (
          <Paper key={key} p="md" withBorder>
            <Stack gap="xs" align="center">
              <RadiusPreview value={scale[key]} />
              <Text size="xs" fw={600} tt="uppercase">
                {key}
              </Text>
              <NumberInput
                value={scale[key]}
                onChange={(val) => handleScaleChange(key, Number(val) || 0)}
                size="xs"
                min={0}
                max={9999}
                w="100%"
                disabled={key === 'none' || key === 'full'}
              />
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>

      <div>
        <Title order={4} mb={4}>Radius por Componente</Title>
        <Text size="sm" c="dimmed">
          Configure qual valor da escala cada componente utiliza.
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
        {(Object.keys(components) as (keyof RadiusComponents)[]).map((key) => (
          <Paper key={key} p="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text size="sm" fw={500} tt="capitalize">
                {key}
              </Text>
              <RadiusPreview value={scale[components[key]]} />
            </Group>
            <Select
              value={components[key]}
              onChange={(val) => {
                if (val) handleComponentChange(key, val as keyof RadiusScale);
              }}
              data={RADIUS_SCALE_KEYS.map((k) => ({
                value: k,
                label: `${k} (${scale[k]}px)`,
              }))}
              size="xs"
            />
          </Paper>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
