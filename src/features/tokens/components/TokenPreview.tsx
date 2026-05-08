import { useState, useRef } from 'react';
import {
  MantineProvider,
  Stack,
  Paper,
  SimpleGrid,
  Text,
  Title,
  Group,
  Box,
  Button,
  Badge,
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
  Divider,
  Avatar,
  ActionIcon,
  Tooltip,
  Progress,
  Loader,
  Skeleton,
  Table,
  Tabs,
  Accordion,
  Alert,
  Notification,
  NavLink,
  Pagination,
  Stepper,
  Timeline,
  Chip,
  Rating,
  Indicator,
  ThemeIcon,
  Kbd,
  Code,
  Anchor,
  Breadcrumbs,
  Blockquote,
  Pill,
  Card,
  Grid,
  Center,
  RingProgress,
  Spoiler,
} from '@mantine/core';
import {
  IconSun,
  IconMoon,
  IconHeart,
  IconStar,
  IconSearch,
  IconSettings,
  IconUser,
  IconHome,
  IconBell,
  IconCheck,
  IconX,
  IconAlertCircle,
  IconInfoCircle,
  IconTrash,
  IconEdit,
  IconPlus,
  IconArrowRight,
  IconMail,
  IconLock,
  IconMessageCircle,
  IconDatabase,
  IconGitBranch,
  IconGitCommit,
  IconDots,
  IconQuote,
} from '@tabler/icons-react';
import { useTokens } from '@/providers';

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

export function TokenPreview() {
  const { tokens } = useTokens();
  const { colors, radius, typography, spacing, shadows } = tokens;
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('dark');
  const [stepperActive, setStepperActive] = useState(1);
  const previewRef = useRef<HTMLDivElement>(null);

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

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <div>
          <Title order={4} mb={4}>
            Preview do Design System
          </Title>
          <Text size="sm" c="dimmed">
            Todos os componentes Mantine com seus tokens aplicados.
          </Text>
        </div>
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

      {/* Preview Container */}
      <MantineProvider
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
          background: previewBg,
          borderRadius: 12,
          border: `1px solid ${previewBorder}`,
          padding: 'var(--mantine-spacing-lg)',
          transition: 'background 200ms ease, border-color 200ms ease',
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
              <Button style={{ backgroundColor: brandColor, borderRadius: `${buttonRadius}px`, fontFamily }}>Filled</Button>
              <Button variant="light" style={{ color: brandColor, borderRadius: `${buttonRadius}px`, fontFamily }}>Light</Button>
              <Button variant="outline" style={{ borderColor: brandColor, color: brandColor, borderRadius: `${buttonRadius}px`, fontFamily }}>Outline</Button>
              <Button variant="subtle" style={{ color: brandColor, borderRadius: `${buttonRadius}px`, fontFamily }}>Subtle</Button>
              <Button variant="transparent" style={{ color: brandColor, fontFamily }}>Transparent</Button>
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
              <Button rightSection={<IconArrowRight size={16} />} variant="outline" style={{ borderColor: accentColor, color: accentColor, borderRadius: `${buttonRadius}px`, fontFamily }}>Próximo</Button>
              <Button loading style={{ backgroundColor: brandColor, borderRadius: `${buttonRadius}px`, fontFamily }}>Loading</Button>
              <Button disabled style={{ borderRadius: `${buttonRadius}px`, fontFamily }}>Disabled</Button>
            </Group>
            <Button fullWidth style={{ backgroundColor: brandColor, borderRadius: `${buttonRadius}px`, fontFamily }}>Full Width Button</Button>
          </Stack>
        </Paper>

        {/* ACTION ICONS */}
        <Paper p="md" style={sectionStyle}>
          <Text {...sectionTitleProps}>ActionIcon</Text>
          <Group gap="sm" wrap="wrap">
            <ActionIcon variant="filled" style={{ backgroundColor: brandColor, borderRadius: `${buttonRadius}px` }}><IconHeart size={16} /></ActionIcon>
            <ActionIcon variant="light" color="blue" style={{ borderRadius: `${buttonRadius}px` }}><IconStar size={16} /></ActionIcon>
            <ActionIcon variant="outline" style={{ borderColor: brandColor, color: brandColor, borderRadius: `${buttonRadius}px` }}><IconSettings size={16} /></ActionIcon>
            <ActionIcon variant="subtle" style={{ color: brandColor, borderRadius: `${buttonRadius}px` }}><IconBell size={16} /></ActionIcon>
            <ActionIcon variant="default" style={{ borderRadius: `${buttonRadius}px` }}><IconDots size={16} /></ActionIcon>
            <ActionIcon size="lg" variant="filled" style={{ backgroundColor: accentColor, borderRadius: `${buttonRadius}px` }}><IconPlus size={20} /></ActionIcon>
            <ActionIcon size="xl" variant="filled" style={{ backgroundColor: successColor, borderRadius: `${buttonRadius}px` }}><IconCheck size={24} /></ActionIcon>
            <ActionIcon variant="filled" color="red" style={{ borderRadius: `${buttonRadius}px` }}><IconTrash size={16} /></ActionIcon>
            <ActionIcon disabled style={{ borderRadius: `${buttonRadius}px` }}><IconEdit size={16} /></ActionIcon>
          </Group>
        </Paper>

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

        {/* TYPOGRAPHY */}
        <Paper p="md" style={sectionStyle}>
          <Text {...sectionTitleProps}>Typography</Text>
          <Stack gap="sm">
            <Title order={1} style={{ fontFamily, color: previewTextColor }}>Heading 1</Title>
            <Title order={2} style={{ fontFamily, color: previewTextColor }}>Heading 2</Title>
            <Title order={3} style={{ fontFamily, color: previewTextColor }}>Heading 3</Title>
            <Title order={4} style={{ fontFamily, color: previewTextColor }}>Heading 4</Title>
            <Title order={5} style={{ fontFamily, color: previewTextColor }}>Heading 5</Title>
            <Title order={6} style={{ fontFamily, color: previewTextColor }}>Heading 6</Title>
            <Divider color={previewBorder} />
            <Text size="xl" style={{ fontFamily, color: previewTextColor }}>Text XL — Texto grande para destaque</Text>
            <Text size="lg" style={{ fontFamily, color: previewTextColor }}>Text LG — Subtítulos e descrições</Text>
            <Text size="md" style={{ fontFamily, color: previewTextColor }}>Text MD — Corpo de texto padrão</Text>
            <Text size="sm" style={{ fontFamily, color: previewDimmed }}>Text SM — Informações secundárias</Text>
            <Text size="xs" style={{ fontFamily, color: previewDimmed }}>Text XS — Notas e detalhes menores</Text>
            <Divider color={previewBorder} />
            <Code style={{ fontFamily: monoFamily }}>{'const token = "code block";'}</Code>
            <Kbd>Ctrl + K</Kbd>
            <Anchor href="#" style={{ color: brandColor }}>Link de exemplo</Anchor>
            <Blockquote color={brandColor} icon={<IconQuote size={16} />} style={{ color: previewTextColor }}>
              Citação de exemplo com estilo do design system.
            </Blockquote>
          </Stack>
        </Paper>

        {/* BADGES & PILLS */}
        <Paper p="md" style={sectionStyle}>
          <Text {...sectionTitleProps}>Badges & Pills</Text>
          <Stack gap="sm">
            <Group gap="sm" wrap="wrap">
              <Badge style={{ backgroundColor: brandColor, borderRadius: `${badgeRadius}px` }}>Brand</Badge>
              <Badge style={{ backgroundColor: successColor, borderRadius: `${badgeRadius}px` }}>Sucesso</Badge>
              <Badge style={{ backgroundColor: errorColor, borderRadius: `${badgeRadius}px` }}>Erro</Badge>
              <Badge style={{ backgroundColor: warningColor, borderRadius: `${badgeRadius}px`, color: '#1a1b1e' }}>Alerta</Badge>
              <Badge style={{ backgroundColor: accentColor, borderRadius: `${badgeRadius}px` }}>Accent</Badge>
            </Group>
            <Group gap="sm" wrap="wrap">
              <Badge variant="light" color="blue" style={{ borderRadius: `${badgeRadius}px` }}>Light</Badge>
              <Badge variant="outline" style={{ borderColor: brandColor, color: brandColor, borderRadius: `${badgeRadius}px` }}>Outline</Badge>
              <Badge variant="dot" color="green" style={{ borderRadius: `${badgeRadius}px`, color: previewTextColor }}>Dot</Badge>
            </Group>
            <Group gap="sm" wrap="wrap">
              <Badge size="xs" style={{ backgroundColor: brandColor, borderRadius: `${badgeRadius}px` }}>XS</Badge>
              <Badge size="sm" style={{ backgroundColor: brandColor, borderRadius: `${badgeRadius}px` }}>SM</Badge>
              <Badge size="md" style={{ backgroundColor: brandColor, borderRadius: `${badgeRadius}px` }}>MD</Badge>
              <Badge size="lg" style={{ backgroundColor: brandColor, borderRadius: `${badgeRadius}px` }}>LG</Badge>
              <Badge size="xl" style={{ backgroundColor: brandColor, borderRadius: `${badgeRadius}px` }}>XL</Badge>
            </Group>
            <Divider color={previewBorder} />
            <Text size="xs" fw={500} style={{ color: previewDimmed }}>Pills</Text>
            <Group gap="xs">
              <Pill>Default</Pill>
              <Pill withRemoveButton>Removível</Pill>
              <Pill withRemoveButton>TypeScript</Pill>
              <Pill withRemoveButton>React</Pill>
            </Group>
          </Stack>
        </Paper>

        {/* AVATARS & INDICATORS */}
        <Paper p="md" style={sectionStyle}>
          <Text {...sectionTitleProps}>Avatar & Indicator</Text>
          <Stack gap="md">
            <Group gap="sm">
              <Avatar color={brandColor} radius="xl">AB</Avatar>
              <Avatar color={accentColor} radius="xl">CD</Avatar>
              <Avatar color={successColor} radius="xl">EF</Avatar>
              <Avatar color={errorColor} radius="xl">GH</Avatar>
              <Avatar radius="xl"><IconUser size={20} /></Avatar>
            </Group>
            <Group gap="sm">
              <Avatar size="xs" color={brandColor} radius="xl">A</Avatar>
              <Avatar size="sm" color={brandColor} radius="xl">B</Avatar>
              <Avatar size="md" color={brandColor} radius="xl">C</Avatar>
              <Avatar size="lg" color={brandColor} radius="xl">D</Avatar>
              <Avatar size="xl" color={brandColor} radius="xl">E</Avatar>
            </Group>
            <Group gap="md">
              <Indicator color={successColor} processing>
                <Avatar color={brandColor} radius="xl">ON</Avatar>
              </Indicator>
              <Indicator color={errorColor}>
                <Avatar color={grayColor} radius="xl">OF</Avatar>
              </Indicator>
              <Indicator color={warningColor} label="3" size={16}>
                <Avatar color={accentColor} radius="xl"><IconBell size={20} /></Avatar>
              </Indicator>
            </Group>
          </Stack>
        </Paper>

        {/* THEME ICONS */}
        <Paper p="md" style={sectionStyle}>
          <Text {...sectionTitleProps}>ThemeIcon</Text>
          <Group gap="sm" wrap="wrap">
            <ThemeIcon variant="filled" color={brandColor} size="lg" radius={buttonRadius}><IconHeart size={18} /></ThemeIcon>
            <ThemeIcon variant="light" color="blue" size="lg" radius={buttonRadius}><IconStar size={18} /></ThemeIcon>
            <ThemeIcon variant="outline" color={brandColor} size="lg" radius={buttonRadius}><IconSettings size={18} /></ThemeIcon>
            <ThemeIcon variant="filled" color={successColor} size="lg" radius={buttonRadius}><IconCheck size={18} /></ThemeIcon>
            <ThemeIcon variant="filled" color={errorColor} size="lg" radius={buttonRadius}><IconX size={18} /></ThemeIcon>
            <ThemeIcon variant="filled" color={warningColor} size="lg" radius={buttonRadius}><IconAlertCircle size={18} /></ThemeIcon>
            <ThemeIcon variant="filled" color={accentColor} size="xl" radius={buttonRadius}><IconDatabase size={22} /></ThemeIcon>
          </Group>
        </Paper>

        {/* ALERTS */}
        <Paper p="md" style={sectionStyle}>
          <Text {...sectionTitleProps}>Alerts</Text>
          <Stack gap="sm">
            <Alert icon={<IconInfoCircle size={16} />} title="Informação" color="blue" variant="light" radius={cardRadius}>
              Esta é uma mensagem informativa para o usuário.
            </Alert>
            <Alert icon={<IconCheck size={16} />} title="Sucesso" color="green" variant="light" radius={cardRadius}>
              Operação realizada com sucesso.
            </Alert>
            <Alert icon={<IconAlertCircle size={16} />} title="Alerta" color="yellow" variant="light" radius={cardRadius}>
              Atenção: verifique os dados antes de continuar.
            </Alert>
            <Alert icon={<IconX size={16} />} title="Erro" color="red" variant="light" radius={cardRadius}>
              Ocorreu um erro ao processar sua solicitação.
            </Alert>
          </Stack>
        </Paper>

        {/* NOTIFICATIONS */}
        <Paper p="md" style={sectionStyle}>
          <Text {...sectionTitleProps}>Notifications</Text>
          <Stack gap="sm">
            <Notification title="Notificação padrão" withCloseButton={false} radius={cardRadius}>
              Você tem uma nova mensagem.
            </Notification>
            <Notification title="Sucesso" color="green" icon={<IconCheck size={16} />} withCloseButton={false} radius={cardRadius}>
              Arquivo salvo com sucesso.
            </Notification>
            <Notification title="Erro" color="red" icon={<IconX size={16} />} withCloseButton={false} radius={cardRadius}>
              Falha ao conectar com o servidor.
            </Notification>
            <Notification title="Loading" loading withCloseButton={false} radius={cardRadius}>
              Processando dados...
            </Notification>
          </Stack>
        </Paper>

        {/* CARDS */}
        <Paper p="md" style={sectionStyle}>
          <Text {...sectionTitleProps}>Cards</Text>
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
            <Card shadow="sm" padding="lg" radius={cardRadius} style={{ background: previewBg, border: `1px solid ${previewBorder}` }}>
              <Card.Section style={{ background: brandColor, height: 80 }} />
              <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500} style={{ color: previewTextColor }}>Card Title</Text>
                <Badge style={{ backgroundColor: brandColor, borderRadius: `${badgeRadius}px` }}>New</Badge>
              </Group>
              <Text size="sm" style={{ color: previewDimmed }}>
                Descrição do card com informações relevantes.
              </Text>
              <Button fullWidth mt="md" style={{ backgroundColor: brandColor, borderRadius: `${buttonRadius}px` }}>
                Ação
              </Button>
            </Card>

            <Card shadow="sm" padding="lg" radius={cardRadius} style={{ background: previewBg, border: `1px solid ${previewBorder}` }}>
              <Group>
                <Avatar color={accentColor} radius="xl">P</Avatar>
                <div>
                  <Text size="sm" fw={500} style={{ color: previewTextColor }}>Projeto Alpha</Text>
                  <Text size="xs" style={{ color: previewDimmed }}>Atualizado há 2 dias</Text>
                </div>
              </Group>
              <Text size="sm" mt="sm" style={{ color: previewDimmed }}>
                Um card com avatar e informações do projeto.
              </Text>
              <Group mt="md" gap="xs">
                <Badge size="sm" variant="light" color="blue" style={{ borderRadius: `${badgeRadius}px` }}>React</Badge>
                <Badge size="sm" variant="light" color="green" style={{ borderRadius: `${badgeRadius}px` }}>TypeScript</Badge>
              </Group>
            </Card>

            <Card shadow="sm" padding="lg" radius={cardRadius} style={{ background: previewBg, border: `1px solid ${previewBorder}` }}>
              <Stack gap="sm">
                <Group justify="space-between">
                  <ThemeIcon variant="light" color={brandColor} size="lg" radius={buttonRadius}><IconDatabase size={18} /></ThemeIcon>
                  <ActionIcon variant="subtle" style={{ color: previewDimmed }}><IconDots size={16} /></ActionIcon>
                </Group>
                <Text fw={500} style={{ color: previewTextColor }}>Métricas</Text>
                <Text size="xs" style={{ color: previewDimmed }}>Últimas 24 horas</Text>
                <Title order={2} style={{ color: previewTextColor }}>1,234</Title>
                <Progress value={65} color={brandColor} size="sm" radius="xl" />
                <Text size="xs" style={{ color: successColor }}>+12% vs ontem</Text>
              </Stack>
            </Card>
          </SimpleGrid>
        </Paper>

        {/* PROGRESS & LOADERS */}
        <Paper p="md" style={sectionStyle}>
          <Text {...sectionTitleProps}>Progress & Loaders</Text>
          <Stack gap="md">
            <div>
              <Text size="xs" mb={4} style={{ color: previewDimmed }}>Progress</Text>
              <Progress value={35} color={brandColor} size="sm" radius="xl" />
            </div>
            <div>
              <Text size="xs" mb={4} style={{ color: previewDimmed }}>Progress Sections</Text>
              <Progress.Root size="lg" radius="xl">
                <Progress.Section value={35} color={brandColor}>
                  <Progress.Label>Docs</Progress.Label>
                </Progress.Section>
                <Progress.Section value={25} color={accentColor}>
                  <Progress.Label>Code</Progress.Label>
                </Progress.Section>
                <Progress.Section value={15} color={successColor}>
                  <Progress.Label>Tests</Progress.Label>
                </Progress.Section>
              </Progress.Root>
            </div>
            <Group gap="xl">
              <Stack gap={4} align="center">
                <RingProgress
                  size={80}
                  thickness={8}
                  sections={[{ value: 72, color: brandColor }]}
                  label={<Text size="xs" ta="center" style={{ color: previewTextColor }}>72%</Text>}
                />
                <Text size="xs" style={{ color: previewDimmed }}>RingProgress</Text>
              </Stack>
              <Stack gap={4} align="center">
                <Loader color={brandColor} size="md" />
                <Text size="xs" style={{ color: previewDimmed }}>Oval</Text>
              </Stack>
              <Stack gap={4} align="center">
                <Loader color={accentColor} size="md" type="bars" />
                <Text size="xs" style={{ color: previewDimmed }}>Bars</Text>
              </Stack>
              <Stack gap={4} align="center">
                <Loader color={successColor} size="md" type="dots" />
                <Text size="xs" style={{ color: previewDimmed }}>Dots</Text>
              </Stack>
            </Group>
          </Stack>
        </Paper>

        {/* SKELETON */}
        <Paper p="md" style={sectionStyle}>
          <Text {...sectionTitleProps}>Skeleton</Text>
          <Stack gap="sm">
            <Group>
              <Skeleton height={40} circle />
              <div style={{ flex: 1 }}>
                <Skeleton height={12} radius="xl" />
                <Skeleton height={12} mt={6} radius="xl" width="70%" />
              </div>
            </Group>
            <Skeleton height={100} radius={cardRadius} />
            <Group>
              <Skeleton height={32} width={100} radius={buttonRadius} />
              <Skeleton height={32} width={80} radius={buttonRadius} />
            </Group>
          </Stack>
        </Paper>

        {/* TABLE */}
        <Paper p="md" style={sectionStyle}>
          <Text {...sectionTitleProps}>Table</Text>
          <Table striped highlightOnHover withTableBorder withColumnBorders style={{ color: previewTextColor }}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ color: previewTextColor }}>Nome</Table.Th>
                <Table.Th style={{ color: previewTextColor }}>Status</Table.Th>
                <Table.Th style={{ color: previewTextColor }}>Progresso</Table.Th>
                <Table.Th style={{ color: previewTextColor }}>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td style={{ color: previewTextColor }}>Projeto A</Table.Td>
                <Table.Td><Badge size="sm" color="green" style={{ borderRadius: `${badgeRadius}px` }}>Ativo</Badge></Table.Td>
                <Table.Td><Progress value={80} color={brandColor} size="sm" radius="xl" style={{ width: 100 }} /></Table.Td>
                <Table.Td>
                  <Group gap={4}>
                    <ActionIcon variant="subtle" size="sm"><IconEdit size={14} /></ActionIcon>
                    <ActionIcon variant="subtle" color="red" size="sm"><IconTrash size={14} /></ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td style={{ color: previewTextColor }}>Projeto B</Table.Td>
                <Table.Td><Badge size="sm" color="yellow" style={{ borderRadius: `${badgeRadius}px` }}>Pendente</Badge></Table.Td>
                <Table.Td><Progress value={45} color={warningColor} size="sm" radius="xl" style={{ width: 100 }} /></Table.Td>
                <Table.Td>
                  <Group gap={4}>
                    <ActionIcon variant="subtle" size="sm"><IconEdit size={14} /></ActionIcon>
                    <ActionIcon variant="subtle" color="red" size="sm"><IconTrash size={14} /></ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td style={{ color: previewTextColor }}>Projeto C</Table.Td>
                <Table.Td><Badge size="sm" color="red" style={{ borderRadius: `${badgeRadius}px` }}>Inativo</Badge></Table.Td>
                <Table.Td><Progress value={10} color={errorColor} size="sm" radius="xl" style={{ width: 100 }} /></Table.Td>
                <Table.Td>
                  <Group gap={4}>
                    <ActionIcon variant="subtle" size="sm"><IconEdit size={14} /></ActionIcon>
                    <ActionIcon variant="subtle" color="red" size="sm"><IconTrash size={14} /></ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Paper>

        {/* TABS */}
        <Paper p="md" style={sectionStyle}>
          <Text {...sectionTitleProps}>Tabs</Text>
          <Stack gap="md">
            <Tabs defaultValue="tab1" color={brandColor}>
              <Tabs.List>
                <Tabs.Tab value="tab1" leftSection={<IconHome size={14} />}>Home</Tabs.Tab>
                <Tabs.Tab value="tab2" leftSection={<IconMessageCircle size={14} />}>Mensagens</Tabs.Tab>
                <Tabs.Tab value="tab3" leftSection={<IconSettings size={14} />}>Config</Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="tab1" pt="xs">
                <Text size="sm" style={{ color: previewDimmed }}>Conteúdo da aba Home</Text>
              </Tabs.Panel>
              <Tabs.Panel value="tab2" pt="xs">
                <Text size="sm" style={{ color: previewDimmed }}>Conteúdo da aba Mensagens</Text>
              </Tabs.Panel>
              <Tabs.Panel value="tab3" pt="xs">
                <Text size="sm" style={{ color: previewDimmed }}>Conteúdo da aba Config</Text>
              </Tabs.Panel>
            </Tabs>

            <Tabs defaultValue="tab1" variant="pills" color={brandColor}>
              <Tabs.List>
                <Tabs.Tab value="tab1">Overview</Tabs.Tab>
                <Tabs.Tab value="tab2">Analytics</Tabs.Tab>
                <Tabs.Tab value="tab3">Reports</Tabs.Tab>
                <Tabs.Tab value="tab4">Export</Tabs.Tab>
              </Tabs.List>
            </Tabs>

            <Tabs defaultValue="tab1" variant="outline" color={brandColor}>
              <Tabs.List>
                <Tabs.Tab value="tab1">Detalhes</Tabs.Tab>
                <Tabs.Tab value="tab2">Histórico</Tabs.Tab>
                <Tabs.Tab value="tab3">Permissões</Tabs.Tab>
              </Tabs.List>
            </Tabs>
          </Stack>
        </Paper>

        {/* ACCORDION */}
        <Paper p="md" style={sectionStyle}>
          <Text {...sectionTitleProps}>Accordion</Text>
          <Accordion variant="separated" radius={cardRadius}>
            <Accordion.Item value="item1">
              <Accordion.Control style={{ color: previewTextColor }}>Como funciona o Design System?</Accordion.Control>
              <Accordion.Panel>
                <Text size="sm" style={{ color: previewDimmed }}>
                  O Design System utiliza tokens para padronizar cores, espaçamentos, tipografia e outros estilos.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="item2">
              <Accordion.Control style={{ color: previewTextColor }}>Como exportar os tokens?</Accordion.Control>
              <Accordion.Panel>
                <Text size="sm" style={{ color: previewDimmed }}>
                  Navegue até a aba Export e escolha entre Mantine Theme ou Figma Variables JSON.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="item3">
              <Accordion.Control style={{ color: previewTextColor }}>Posso usar em múltiplos projetos?</Accordion.Control>
              <Accordion.Panel>
                <Text size="sm" style={{ color: previewDimmed }}>
                  Sim! Crie projetos separados e configure tokens independentes para cada um.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Paper>

        {/* NAVIGATION */}
        <Paper p="md" style={sectionStyle}>
          <Text {...sectionTitleProps}>Navigation</Text>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
            <Stack gap={0}>
              <Text size="xs" mb="xs" style={{ color: previewDimmed }}>NavLink</Text>
              <NavLink label="Dashboard" leftSection={<IconHome size={16} />} active color={brandColor} style={{ borderRadius: `${buttonRadius}px` }} />
              <NavLink label="Projetos" leftSection={<IconDatabase size={16} />} style={{ borderRadius: `${buttonRadius}px`, color: previewTextColor }} />
              <NavLink label="Configurações" leftSection={<IconSettings size={16} />} style={{ borderRadius: `${buttonRadius}px`, color: previewTextColor }}>
                <NavLink label="Perfil" style={{ color: previewDimmed }} />
                <NavLink label="Segurança" style={{ color: previewDimmed }} />
                <NavLink label="Notificações" style={{ color: previewDimmed }} />
              </NavLink>
              <NavLink label="Mensagens" leftSection={<IconMail size={16} />} rightSection={<Badge size="xs" color={brandColor}>3</Badge>} style={{ borderRadius: `${buttonRadius}px`, color: previewTextColor }} />
            </Stack>
            <Stack gap="sm">
              <Text size="xs" mb="xs" style={{ color: previewDimmed }}>Breadcrumbs</Text>
              <Breadcrumbs separator=">" style={{ color: previewDimmed }}>
                <Anchor href="#" size="sm" style={{ color: brandColor }}>Home</Anchor>
                <Anchor href="#" size="sm" style={{ color: brandColor }}>Projetos</Anchor>
                <Text size="sm" style={{ color: previewTextColor }}>Token Editor</Text>
              </Breadcrumbs>
              <Divider color={previewBorder} />
              <Text size="xs" mb="xs" style={{ color: previewDimmed }}>Pagination</Text>
              <Pagination total={10} color={brandColor} radius={buttonRadius} />
            </Stack>
          </SimpleGrid>
        </Paper>

        {/* STEPPER */}
        <Paper p="md" style={sectionStyle}>
          <Text {...sectionTitleProps}>Stepper</Text>
          <Stepper active={stepperActive} onStepClick={setStepperActive} color={brandColor} radius={buttonRadius}>
            <Stepper.Step label="Conta" description="Dados pessoais" icon={<IconUser size={16} />}>
              <Text size="sm" mt="sm" style={{ color: previewDimmed }}>Preencha seus dados pessoais.</Text>
            </Stepper.Step>
            <Stepper.Step label="Configuração" description="Preferências" icon={<IconSettings size={16} />}>
              <Text size="sm" mt="sm" style={{ color: previewDimmed }}>Configure suas preferências.</Text>
            </Stepper.Step>
            <Stepper.Step label="Revisão" description="Confirmar" icon={<IconCheck size={16} />}>
              <Text size="sm" mt="sm" style={{ color: previewDimmed }}>Revise e confirme.</Text>
            </Stepper.Step>
            <Stepper.Completed>
              <Text size="sm" mt="sm" style={{ color: successColor }}>Configuração completa!</Text>
            </Stepper.Completed>
          </Stepper>
        </Paper>

        {/* TIMELINE */}
        <Paper p="md" style={sectionStyle}>
          <Text {...sectionTitleProps}>Timeline</Text>
          <Timeline active={2} bulletSize={24} lineWidth={2} color={brandColor}>
            <Timeline.Item bullet={<IconGitBranch size={12} />} title={<Text size="sm" style={{ color: previewTextColor }}>Branch criada</Text>}>
              <Text size="xs" style={{ color: previewDimmed }}>feature/design-tokens</Text>
              <Text size="xs" mt={4} style={{ color: previewDimmed }}>2 horas atrás</Text>
            </Timeline.Item>
            <Timeline.Item bullet={<IconGitCommit size={12} />} title={<Text size="sm" style={{ color: previewTextColor }}>Commits adicionados</Text>}>
              <Text size="xs" style={{ color: previewDimmed }}>feat: add color tokens configurator</Text>
              <Text size="xs" mt={4} style={{ color: previewDimmed }}>1 hora atrás</Text>
            </Timeline.Item>
            <Timeline.Item bullet={<IconCheck size={12} />} title={<Text size="sm" style={{ color: previewTextColor }}>Review aprovado</Text>}>
              <Text size="xs" style={{ color: previewDimmed }}>Todas as verificações passaram</Text>
              <Text size="xs" mt={4} style={{ color: previewDimmed }}>30 min atrás</Text>
            </Timeline.Item>
            <Timeline.Item bullet={<IconGitBranch size={12} />} title={<Text size="sm" style={{ color: previewDimmed }}>Merge pendente</Text>}>
              <Text size="xs" style={{ color: previewDimmed }}>Aguardando aprovação final</Text>
            </Timeline.Item>
          </Timeline>
        </Paper>

        {/* RATING & MISC */}
        <Paper p="md" style={sectionStyle}>
          <Text {...sectionTitleProps}>Rating & Misc</Text>
          <Stack gap="md">
            <Group gap="xl">
              <Stack gap={4}>
                <Text size="xs" style={{ color: previewDimmed }}>Rating</Text>
                <Rating defaultValue={3} color={brandColor} />
              </Stack>
              <Stack gap={4}>
                <Text size="xs" style={{ color: previewDimmed }}>Rating (readonly)</Text>
                <Rating value={4.5} fractions={2} readOnly color={warningColor} />
              </Stack>
            </Group>
            <Divider color={previewBorder} />
            <Group gap="md">
              <Tooltip label="Tooltip de exemplo">
                <Button variant="light" size="xs" style={{ borderRadius: `${buttonRadius}px` }}>Hover me (Tooltip)</Button>
              </Tooltip>
              <Spoiler maxHeight={0} showLabel="Mostrar mais" hideLabel="Esconder">
                <Text size="sm" style={{ color: previewDimmed }}>Conteúdo escondido com Spoiler.</Text>
              </Spoiler>
            </Group>
          </Stack>
        </Paper>

        {/* LAYOUT — GRID */}
        <Paper p="md" style={sectionStyle}>
          <Text {...sectionTitleProps}>Layout — Grid</Text>
          <Grid>
            <Grid.Col span={4}>
              <Box style={{ background: brandColor, opacity: 0.3, borderRadius: `${cardRadius}px`, padding: 16, textAlign: 'center' }}>
                <Text size="xs" style={{ color: previewTextColor }}>span=4</Text>
              </Box>
            </Grid.Col>
            <Grid.Col span={4}>
              <Box style={{ background: brandColor, opacity: 0.5, borderRadius: `${cardRadius}px`, padding: 16, textAlign: 'center' }}>
                <Text size="xs" style={{ color: previewTextColor }}>span=4</Text>
              </Box>
            </Grid.Col>
            <Grid.Col span={4}>
              <Box style={{ background: brandColor, opacity: 0.7, borderRadius: `${cardRadius}px`, padding: 16, textAlign: 'center' }}>
                <Text size="xs" style={{ color: previewTextColor }}>span=4</Text>
              </Box>
            </Grid.Col>
            <Grid.Col span={6}>
              <Box style={{ background: accentColor, opacity: 0.4, borderRadius: `${cardRadius}px`, padding: 16, textAlign: 'center' }}>
                <Text size="xs" style={{ color: previewTextColor }}>span=6</Text>
              </Box>
            </Grid.Col>
            <Grid.Col span={6}>
              <Box style={{ background: accentColor, opacity: 0.6, borderRadius: `${cardRadius}px`, padding: 16, textAlign: 'center' }}>
                <Text size="xs" style={{ color: previewTextColor }}>span=6</Text>
              </Box>
            </Grid.Col>
            <Grid.Col span={3}>
              <Box style={{ background: successColor, opacity: 0.4, borderRadius: `${cardRadius}px`, padding: 16, textAlign: 'center' }}>
                <Text size="xs" style={{ color: previewTextColor }}>3</Text>
              </Box>
            </Grid.Col>
            <Grid.Col span={3}>
              <Box style={{ background: successColor, opacity: 0.5, borderRadius: `${cardRadius}px`, padding: 16, textAlign: 'center' }}>
                <Text size="xs" style={{ color: previewTextColor }}>3</Text>
              </Box>
            </Grid.Col>
            <Grid.Col span={3}>
              <Box style={{ background: successColor, opacity: 0.6, borderRadius: `${cardRadius}px`, padding: 16, textAlign: 'center' }}>
                <Text size="xs" style={{ color: previewTextColor }}>3</Text>
              </Box>
            </Grid.Col>
            <Grid.Col span={3}>
              <Box style={{ background: successColor, opacity: 0.7, borderRadius: `${cardRadius}px`, padding: 16, textAlign: 'center' }}>
                <Text size="xs" style={{ color: previewTextColor }}>3</Text>
              </Box>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* LAYOUT — FLEX & GROUP */}
        <Paper p="md" style={sectionStyle}>
          <Text {...sectionTitleProps}>Layout — Flex & Group</Text>
          <Stack gap="md">
            <div>
              <Text size="xs" mb={4} style={{ color: previewDimmed }}>Group (justify: space-between)</Text>
              <Group justify="space-between" style={{ background: `${brandColor}11`, padding: 8, borderRadius: `${cardRadius}px` }}>
                <Box style={{ width: 40, height: 40, borderRadius: `${buttonRadius}px`, background: brandColor }} />
                <Box style={{ width: 40, height: 40, borderRadius: `${buttonRadius}px`, background: brandColor, opacity: 0.7 }} />
                <Box style={{ width: 40, height: 40, borderRadius: `${buttonRadius}px`, background: brandColor, opacity: 0.4 }} />
              </Group>
            </div>
            <div>
              <Text size="xs" mb={4} style={{ color: previewDimmed }}>Group (justify: center)</Text>
              <Group justify="center" style={{ background: `${accentColor}11`, padding: 8, borderRadius: `${cardRadius}px` }}>
                <Box style={{ width: 40, height: 40, borderRadius: `${buttonRadius}px`, background: accentColor }} />
                <Box style={{ width: 60, height: 40, borderRadius: `${buttonRadius}px`, background: accentColor, opacity: 0.7 }} />
                <Box style={{ width: 40, height: 40, borderRadius: `${buttonRadius}px`, background: accentColor, opacity: 0.4 }} />
              </Group>
            </div>
            <div>
              <Text size="xs" mb={4} style={{ color: previewDimmed }}>Center</Text>
              <Center style={{ height: 80, background: `${successColor}11`, borderRadius: `${cardRadius}px` }}>
                <Badge style={{ backgroundColor: successColor, borderRadius: `${badgeRadius}px` }}>Centralizado</Badge>
              </Center>
            </div>
          </Stack>
        </Paper>

        {/* APP SHELL MOCK */}
        <Paper p="md" style={sectionStyle}>
          <Text {...sectionTitleProps}>Layout — AppShell Mock</Text>
          <Box style={{ border: `1px solid ${previewBorder}`, borderRadius: `${cardRadius}px`, overflow: 'hidden' }}>
            {/* Header */}
            <Group justify="space-between" px="md" py="xs" style={{ background: `${brandColor}15`, borderBottom: `1px solid ${previewBorder}` }}>
              <Group gap="sm">
                <ThemeIcon size="sm" variant="filled" color={brandColor} radius="sm"><IconStar size={12} /></ThemeIcon>
                <Text size="sm" fw={600} style={{ color: previewTextColor }}>App Name</Text>
              </Group>
              <Group gap="xs">
                <ActionIcon variant="subtle" size="sm"><IconSearch size={14} /></ActionIcon>
                <ActionIcon variant="subtle" size="sm"><IconBell size={14} /></ActionIcon>
                <Avatar size="sm" color={brandColor} radius="xl">U</Avatar>
              </Group>
            </Group>
            {/* Body */}
            <Group align="stretch" gap={0} style={{ minHeight: 160 }}>
              {/* Sidebar */}
              <Stack gap={2} p="xs" style={{ width: 140, borderRight: `1px solid ${previewBorder}`, background: previewCardBg }}>
                <NavLink label="Home" leftSection={<IconHome size={12} />} active color={brandColor} style={{ borderRadius: 4, fontSize: 11 }} />
                <NavLink label="Projects" leftSection={<IconDatabase size={12} />} style={{ borderRadius: 4, fontSize: 11, color: previewDimmed }} />
                <NavLink label="Settings" leftSection={<IconSettings size={12} />} style={{ borderRadius: 4, fontSize: 11, color: previewDimmed }} />
              </Stack>
              {/* Main */}
              <Stack gap="sm" p="md" style={{ flex: 1 }}>
                <Skeleton height={14} width="60%" radius="xl" />
                <Skeleton height={10} width="90%" radius="xl" />
                <Skeleton height={10} width="75%" radius="xl" />
                <Group gap="xs" mt="sm">
                  <Skeleton height={28} width={80} radius={buttonRadius} />
                  <Skeleton height={28} width={60} radius={buttonRadius} />
                </Group>
              </Stack>
            </Group>
          </Box>
        </Paper>

        {/* SPACING */}
        <Paper p="md" style={sectionStyle}>
          <Text {...sectionTitleProps}>Espaçamentos</Text>
          <Group gap="md" align="flex-end">
            {(Object.entries(spacing) as [string, number][])
              .filter(([, v]) => v > 0)
              .map(([key, value]) => (
                <Stack key={key} gap={2} align="center">
                  <Box
                    style={{
                      width: Math.min(value, 64),
                      height: Math.min(value, 64),
                      backgroundColor: brandColor,
                      opacity: 0.3,
                      borderRadius: 2,
                      minWidth: 4,
                      minHeight: 4,
                    }}
                  />
                  <Text size="xs" style={{ color: previewDimmed }}>{key}</Text>
                  <Text size="xs" style={{ color: previewDimmed }}>{value}px</Text>
                </Stack>
              ))}
          </Group>
        </Paper>

        {/* SHADOWS */}
        <Paper p="md" style={sectionStyle}>
          <Text {...sectionTitleProps}>Sombras</Text>
          <Group gap="xl" justify="center">
            {(Object.entries(shadows) as [string, { x: number; y: number; blur: number; spread: number }][]).map(
              ([key, s]) => (
                <Stack key={key} gap="xs" align="center">
                  <Box
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: `${cardRadius}px`,
                      backgroundColor: isLight ? '#ffffff' : '#2c2e33',
                      boxShadow: `${s.x}px ${s.y}px ${s.blur}px ${s.spread}px rgba(0,0,0,${previewShadowAlpha})`,
                    }}
                  />
                  <Text size="xs" style={{ color: previewDimmed }} tt="uppercase">{key}</Text>
                </Stack>
              ),
            )}
          </Group>
        </Paper>

        {/* BORDER RADIUS */}
        <Paper p="md" style={sectionStyle}>
          <Text {...sectionTitleProps}>Border Radius</Text>
          <Group gap="md" justify="center">
            {Object.entries(radius.scale).map(([key, value]) => (
              <Stack key={key} gap={2} align="center">
                <Box
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: value > 100 ? '50%' : `${value}px`,
                    backgroundColor: accentColor,
                    opacity: 0.7,
                  }}
                />
                <Text size="xs" style={{ color: previewDimmed }}>{key}</Text>
                <Text size="xs" style={{ color: previewDimmed }}>{value}px</Text>
              </Stack>
            ))}
          </Group>
        </Paper>

      </Stack>
      </MantineProvider>
    </Stack>
  );
}
