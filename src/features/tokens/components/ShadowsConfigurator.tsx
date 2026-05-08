import {
  Stack,
  Text,
  NumberInput,
  SimpleGrid,
  Paper,
  Box,
  Title,
} from '@mantine/core';
import { useTokens } from '@/providers';
import type { DesignTokenShadows, ShadowLevel } from '@/types';

const SHADOW_KEYS: (keyof DesignTokenShadows)[] = ['xs', 'sm', 'md', 'lg', 'xl'];

function ShadowPreview({ shadow }: { shadow: ShadowLevel }) {
  const boxShadow = `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px rgba(0,0,0,0.15)`;
  return (
    <Box
      style={{
        width: 64,
        height: 64,
        borderRadius: 8,
        backgroundColor: 'white',
        boxShadow,
        margin: '8px auto',
      }}
    />
  );
}

export function ShadowsConfigurator() {
  const { tokens, dispatch } = useTokens();
  const { shadows } = tokens;

  const handleChange = (
    level: keyof DesignTokenShadows,
    prop: keyof ShadowLevel,
    value: number,
  ) => {
    dispatch({
      type: 'SET_SHADOWS',
      payload: {
        ...shadows,
        [level]: { ...shadows[level], [prop]: value },
      },
    });
  };

  return (
    <Stack gap="lg">
      <div>
        <Title order={4} mb={4}>Sombras</Title>
        <Text size="sm" c="dimmed">
          Configure os valores de box-shadow para cada nível de elevação.
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
        {SHADOW_KEYS.map((key) => (
          <Paper key={key} p="md" withBorder>
            <Stack gap="xs">
              <Text size="sm" fw={600} tt="uppercase" ta="center">
                {key}
              </Text>
              <ShadowPreview shadow={shadows[key]} />
              <SimpleGrid cols={2} spacing="xs">
                <NumberInput
                  label="X"
                  value={shadows[key].x}
                  onChange={(val) => handleChange(key, 'x', Number(val) || 0)}
                  size="xs"
                  min={-50}
                  max={50}
                />
                <NumberInput
                  label="Y"
                  value={shadows[key].y}
                  onChange={(val) => handleChange(key, 'y', Number(val) || 0)}
                  size="xs"
                  min={-50}
                  max={50}
                />
                <NumberInput
                  label="Blur"
                  value={shadows[key].blur}
                  onChange={(val) => handleChange(key, 'blur', Number(val) || 0)}
                  size="xs"
                  min={0}
                  max={100}
                />
                <NumberInput
                  label="Spread"
                  value={shadows[key].spread}
                  onChange={(val) => handleChange(key, 'spread', Number(val) || 0)}
                  size="xs"
                  min={-50}
                  max={50}
                />
              </SimpleGrid>
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
