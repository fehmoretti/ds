import { useState } from 'react';
import {
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Group,
  Box,
  Badge,
  ActionIcon,
  Progress,
  Loader,
  Skeleton,
  Table,
  Tabs,
  Accordion,
  NavLink,
  Pagination,
  Stepper,
  Timeline,
  Grid,
  Center,
  RingProgress,
  ThemeIcon,
  Avatar,
  Anchor,
  Breadcrumbs,
  Divider,
} from '@mantine/core';
import {
  IconStar,
  IconSearch,
  IconSettings,
  IconUser,
  IconHome,
  IconBell,
  IconCheck,
  IconTrash,
  IconEdit,
  IconMail,
  IconMessageCircle,
  IconDatabase,
  IconGitBranch,
  IconGitCommit,
} from '@tabler/icons-react';
import type { PreviewStyleProps } from './PreviewTypes';

export function PreviewDataAndLayout(props: PreviewStyleProps) {
  const {
    brandColor, accentColor, errorColor, successColor, warningColor,
    cardRadius, buttonRadius, badgeRadius,
    previewTextColor, previewDimmed, previewBorder, previewCardBg,
    isLight, sectionStyle, sectionTitleProps,
  } = props;

  const [stepperActive, setStepperActive] = useState(1);

  /** Convert hex (#RRGGBB) + opacity (0..1) to rgba string */
  function hexAlpha(hex: string, alpha: number) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  /** Light-mode-aware tint: slightly stronger on light bg for visibility */
  const tint = (color: string) => hexAlpha(color, isLight ? 0.12 : 0.07);

  return (
    <>
      {/* PROGRESS & LOADERS */}
      <Paper p="md" style={sectionStyle}>
        <Text {...sectionTitleProps}>Progress & Loaders</Text>
        <Stack gap="md">
          <div>
            <Text size="xs" mb={4} style={{ color: previewDimmed }}>Progress</Text>
            <Progress value={35} color="brand" size="sm" radius="xl" />
          </div>
          <div>
            <Text size="xs" mb={4} style={{ color: previewDimmed }}>Progress Sections</Text>
            <Progress.Root size="lg" radius="xl">
              <Progress.Section value={35} color="brand">
                <Progress.Label>Docs</Progress.Label>
              </Progress.Section>
              <Progress.Section value={25} color="accent">
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
              <Loader color="brand" size="md" />
              <Text size="xs" style={{ color: previewDimmed }}>Oval</Text>
            </Stack>
            <Stack gap={4} align="center">
              <Loader color="accent" size="md" type="bars" />
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
            {[
              { name: 'Projeto A', status: 'Ativo', statusColor: 'green', progress: 80, progressColor: 'brand' },
              { name: 'Projeto B', status: 'Pendente', statusColor: 'yellow', progress: 45, progressColor: 'yellow' },
              { name: 'Projeto C', status: 'Inativo', statusColor: 'red', progress: 10, progressColor: 'red' },
            ].map((row) => (
              <Table.Tr key={row.name}>
                <Table.Td style={{ color: previewTextColor }}>{row.name}</Table.Td>
                <Table.Td><Badge size="sm" color={row.statusColor} style={{ borderRadius: `${badgeRadius}px` }}>{row.status}</Badge></Table.Td>
                <Table.Td><Progress value={row.progress} color={row.progressColor} size="sm" radius="xl" style={{ width: 100 }} /></Table.Td>
                <Table.Td>
                  <Group gap={4}>
                    <ActionIcon variant="subtle" size="sm" aria-label={`Editar ${row.name}`}><IconEdit size={14} /></ActionIcon>
                    <ActionIcon variant="subtle" color="red" size="sm" aria-label={`Excluir ${row.name}`}><IconTrash size={14} /></ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* TABS */}
      <Paper p="md" style={sectionStyle}>
        <Text {...sectionTitleProps}>Tabs</Text>
        <Stack gap="md">
          <Tabs defaultValue="tab1" color="brand">
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

          <Tabs defaultValue="tab1" variant="pills" color="brand">
            <Tabs.List>
              <Tabs.Tab value="tab1">Overview</Tabs.Tab>
              <Tabs.Tab value="tab2">Analytics</Tabs.Tab>
              <Tabs.Tab value="tab3">Reports</Tabs.Tab>
              <Tabs.Tab value="tab4">Export</Tabs.Tab>
            </Tabs.List>
          </Tabs>

          <Tabs defaultValue="tab1" variant="outline" color="brand">
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
            <NavLink label="Dashboard" leftSection={<IconHome size={16} />} active variant="filled" color="brand" style={{ borderRadius: `${buttonRadius}px` }} />
            <NavLink label="Projetos" leftSection={<IconDatabase size={16} />} style={{ borderRadius: `${buttonRadius}px`, color: previewTextColor }} />
            <NavLink label="Configurações" leftSection={<IconSettings size={16} />} style={{ borderRadius: `${buttonRadius}px`, color: previewTextColor }}>
              <NavLink label="Perfil" style={{ color: previewDimmed }} />
              <NavLink label="Segurança" style={{ color: previewDimmed }} />
              <NavLink label="Notificações" style={{ color: previewDimmed }} />
            </NavLink>
            <NavLink label="Mensagens" leftSection={<IconMail size={16} />} rightSection={<Badge size="xs" color="brand">3</Badge>} style={{ borderRadius: `${buttonRadius}px`, color: previewTextColor }} />
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
            <Pagination total={10} color="brand" radius={buttonRadius} />
          </Stack>
        </SimpleGrid>
      </Paper>

      {/* STEPPER */}
      <Paper p="md" style={sectionStyle}>
        <Text {...sectionTitleProps}>Stepper</Text>
        {/* Make the in-progress step icon filled with brand color in BOTH light and dark.
            Mantine's default leaves it transparent (only border is brand), which becomes
            invisible in dark mode against the dark surface. */}
        <style>{`
          .preview-root .mantine-Stepper-stepIcon[data-progress] {
            background-color: var(--step-color);
            color: var(--mantine-color-white);
          }
        `}</style>
        <Stepper active={stepperActive} onStepClick={setStepperActive} color="brand" radius={buttonRadius}>
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
        <Timeline active={2} bulletSize={24} lineWidth={2} color="brand">
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

      {/* LAYOUT — GRID */}
      <Paper p="md" style={sectionStyle}>
        <Text {...sectionTitleProps}>Layout — Grid</Text>
        <Grid>
          {[4, 4, 4].map((span, i) => (
            <Grid.Col span={span} key={`g1-${i}`}>
              <Box style={{ background: hexAlpha(brandColor, 0.3 + i * 0.2), borderRadius: `${cardRadius}px`, padding: 16, textAlign: 'center' }}>
                <Text size="xs" style={{ color: '#ffffff' }}>span={span}</Text>
              </Box>
            </Grid.Col>
          ))}
          {[6, 6].map((span, i) => (
            <Grid.Col span={span} key={`g2-${i}`}>
              <Box style={{ background: hexAlpha(accentColor, 0.4 + i * 0.2), borderRadius: `${cardRadius}px`, padding: 16, textAlign: 'center' }}>
                <Text size="xs" style={{ color: '#ffffff' }}>span={span}</Text>
              </Box>
            </Grid.Col>
          ))}
          {[3, 3, 3, 3].map((span, i) => (
            <Grid.Col span={span} key={`g3-${i}`}>
              <Box style={{ background: hexAlpha(successColor, 0.4 + i * 0.15), borderRadius: `${cardRadius}px`, padding: 16, textAlign: 'center' }}>
                <Text size="xs" style={{ color: '#ffffff' }}>{span}</Text>
              </Box>
            </Grid.Col>
          ))}
        </Grid>
      </Paper>

      {/* LAYOUT — FLEX & GROUP */}
      <Paper p="md" style={sectionStyle}>
        <Text {...sectionTitleProps}>Layout — Flex & Group</Text>
        <Stack gap="md">
          <div>
            <Text size="xs" mb={4} style={{ color: previewDimmed }}>Group (justify: space-between)</Text>
            <Group justify="space-between" style={{ background: tint(brandColor), padding: 8, borderRadius: `${cardRadius}px` }}>
              <Box style={{ width: 40, height: 40, borderRadius: `${buttonRadius}px`, background: brandColor }} />
              <Box style={{ width: 40, height: 40, borderRadius: `${buttonRadius}px`, background: hexAlpha(brandColor, 0.7) }} />
              <Box style={{ width: 40, height: 40, borderRadius: `${buttonRadius}px`, background: hexAlpha(brandColor, 0.4) }} />
            </Group>
          </div>
          <div>
            <Text size="xs" mb={4} style={{ color: previewDimmed }}>Group (justify: center)</Text>
            <Group justify="center" style={{ background: tint(accentColor), padding: 8, borderRadius: `${cardRadius}px` }}>
              <Box style={{ width: 40, height: 40, borderRadius: `${buttonRadius}px`, background: accentColor }} />
              <Box style={{ width: 60, height: 40, borderRadius: `${buttonRadius}px`, background: hexAlpha(accentColor, 0.7) }} />
              <Box style={{ width: 40, height: 40, borderRadius: `${buttonRadius}px`, background: hexAlpha(accentColor, 0.4) }} />
            </Group>
          </div>
          <div>
            <Text size="xs" mb={4} style={{ color: previewDimmed }}>Center</Text>
            <Center style={{ height: 80, background: tint(successColor), borderRadius: `${cardRadius}px` }}>
              <Badge style={{ backgroundColor: successColor, borderRadius: `${badgeRadius}px` }}>Centralizado</Badge>
            </Center>
          </div>
        </Stack>
      </Paper>

      {/* APP SHELL MOCK */}
      <Paper p="md" style={sectionStyle}>
        <Text {...sectionTitleProps}>Layout — AppShell Mock</Text>
        <Box style={{ border: `1px solid ${previewBorder}`, borderRadius: `${cardRadius}px`, overflow: 'hidden' }}>
          <Group justify="space-between" px="md" py="xs" style={{ background: hexAlpha(brandColor, isLight ? 0.08 : 0.15), borderBottom: `1px solid ${previewBorder}` }}>
            <Group gap="sm">
              <ThemeIcon size="sm" variant="filled" color="brand" radius="sm"><IconStar size={12} /></ThemeIcon>
              <Text size="sm" fw={600} style={{ color: previewTextColor }}>App Name</Text>
            </Group>
            <Group gap="xs">
              <ActionIcon variant="subtle" size="sm" aria-label="Buscar"><IconSearch size={14} /></ActionIcon>
              <ActionIcon variant="subtle" size="sm" aria-label="Notificações"><IconBell size={14} /></ActionIcon>
              <Avatar variant="filled" size="sm" color="brand" radius="xl">U</Avatar>
            </Group>
          </Group>
          <Group align="stretch" gap={0} style={{ minHeight: 160 }}>
            <Stack gap={2} p="xs" style={{ width: 140, borderRight: `1px solid ${previewBorder}`, background: previewCardBg }}>
              <NavLink label="Home" leftSection={<IconHome size={12} />} active variant="filled" color="brand" style={{ borderRadius: 4, fontSize: 11 }} />
              <NavLink label="Projects" leftSection={<IconDatabase size={12} />} style={{ borderRadius: 4, fontSize: 11, color: previewDimmed }} />
              <NavLink label="Settings" leftSection={<IconSettings size={12} />} style={{ borderRadius: 4, fontSize: 11, color: previewDimmed }} />
            </Stack>
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
    </>
  );
}
