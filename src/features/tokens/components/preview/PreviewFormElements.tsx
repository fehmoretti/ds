import {
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  PasswordInput,
  Textarea,
  NumberInput,
  Select,
  MultiSelect,
  Checkbox,
  Switch,
  Radio,
  Slider,
  SegmentedControl,
  Chip,
  Group,
} from '@mantine/core';
import { IconSearch, IconLock } from '@tabler/icons-react';
import type { PreviewStyleProps } from './PreviewTypes';

export function PreviewFormElements(props: PreviewStyleProps) {
  const { brandColor, inputRadius, fontFamily, previewDimmed, sectionStyle, sectionTitleProps } = props;

  return (
    <>
      {/* INPUTS */}
      <Paper p="md" style={sectionStyle}>
        <Text {...sectionTitleProps}>Inputs</Text>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          <Stack gap="xs">
            <TextInput
              label="Text Input"
              placeholder="Digite algo..."
              leftSection={<IconSearch size={14} />}
              styles={{ input: { borderRadius: `${inputRadius}px`, fontFamily } }}
            />
            <PasswordInput
              label="Password"
              placeholder="Sua senha"
              leftSection={<IconLock size={14} />}
              styles={{ input: { borderRadius: `${inputRadius}px`, fontFamily } }}
            />
            <NumberInput
              label="Number"
              placeholder="0"
              styles={{ input: { borderRadius: `${inputRadius}px`, fontFamily } }}
            />
            <Textarea
              label="Textarea"
              placeholder="Mensagem..."
              rows={3}
              styles={{ input: { borderRadius: `${inputRadius}px`, fontFamily } }}
            />
          </Stack>
          <Stack gap="xs">
            <Select
              label="Select"
              placeholder="Escolha..."
              data={['React', 'Vue', 'Angular', 'Svelte']}
              styles={{ input: { borderRadius: `${inputRadius}px`, fontFamily } }}
            />
            <MultiSelect
              label="MultiSelect"
              placeholder="Selecione vários"
              data={['TypeScript', 'JavaScript', 'Python', 'Rust', 'Go']}
              styles={{ input: { borderRadius: `${inputRadius}px`, fontFamily } }}
            />
            <TextInput
              label="Com erro"
              placeholder="Campo inválido"
              error="Este campo é obrigatório"
              styles={{ input: { borderRadius: `${inputRadius}px`, fontFamily } }}
            />
            <TextInput
              label="Disabled"
              placeholder="Não editável"
              disabled
              styles={{ input: { borderRadius: `${inputRadius}px`, fontFamily } }}
            />
          </Stack>
        </SimpleGrid>
      </Paper>

      {/* CHECKBOXES, SWITCHES, RADIOS */}
      <Paper p="md" style={sectionStyle}>
        <Text {...sectionTitleProps}>Checkbox, Switch & Radio</Text>
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
          <Stack gap="xs">
            <Text size="xs" fw={500} style={{ color: previewDimmed }}>Checkbox</Text>
            <Checkbox label="Opção ativa" defaultChecked color={brandColor} />
            <Checkbox label="Opção inativa" color={brandColor} />
            <Checkbox label="Indeterminado" indeterminate color={brandColor} />
            <Checkbox label="Disabled" disabled defaultChecked />
          </Stack>
          <Stack gap="xs">
            <Text size="xs" fw={500} style={{ color: previewDimmed }}>Switch</Text>
            <Switch label="Ativado" defaultChecked color={brandColor} />
            <Switch label="Desativado" color={brandColor} />
            <Switch label="Com tamanho LG" size="lg" color={brandColor} />
            <Switch label="Disabled" disabled defaultChecked />
          </Stack>
          <Stack gap="xs">
            <Text size="xs" fw={500} style={{ color: previewDimmed }}>Radio</Text>
            <Radio.Group defaultValue="option1">
              <Stack gap="xs">
                <Radio value="option1" label="Opção 1" color={brandColor} />
                <Radio value="option2" label="Opção 2" color={brandColor} />
                <Radio value="option3" label="Opção 3" color={brandColor} />
              </Stack>
            </Radio.Group>
          </Stack>
        </SimpleGrid>
      </Paper>

      {/* SLIDER & SEGMENTED CONTROL */}
      <Paper p="md" style={sectionStyle}>
        <Text {...sectionTitleProps}>Slider & SegmentedControl</Text>
        <Stack gap="md">
          <div>
            <Text size="xs" mb={4} style={{ color: previewDimmed }}>Slider</Text>
            <Slider defaultValue={40} color={brandColor} marks={[{ value: 20 }, { value: 50 }, { value: 80 }]} />
          </div>
          <div>
            <Text size="xs" mb={4} style={{ color: previewDimmed }}>Slider com labels</Text>
            <Slider
              defaultValue={60}
              color={brandColor}
              marks={[
                { value: 0, label: '0%' },
                { value: 25, label: '25%' },
                { value: 50, label: '50%' },
                { value: 75, label: '75%' },
                { value: 100, label: '100%' },
              ]}
              mb="xl"
            />
          </div>
          <div>
            <Text size="xs" mb={4} style={{ color: previewDimmed }}>SegmentedControl</Text>
            <SegmentedControl data={['Daily', 'Weekly', 'Monthly', 'Yearly']} />
          </div>
          <div>
            <Text size="xs" mb={4} style={{ color: previewDimmed }}>Chips</Text>
            <Group gap="xs">
              <Chip defaultChecked color={brandColor}>React</Chip>
              <Chip color={brandColor}>Vue</Chip>
              <Chip color={brandColor}>Angular</Chip>
              <Chip color={brandColor}>Svelte</Chip>
            </Group>
          </div>
        </Stack>
      </Paper>
    </>
  );
}
