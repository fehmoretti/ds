import {
  Paper,
  Stack,
  Text,
  Title,
  Group,
  Badge,
  Divider,
  Avatar,
  Tooltip,
  Indicator,
  ThemeIcon,
  Kbd,
  Code,
  Anchor,
  Blockquote,
  Pill,
  Card,
  Button,
  Progress,
  Alert,
  Notification,
  Rating,
  Spoiler,
} from '@mantine/core';
import {
  IconHeart,
  IconStar,
  IconSettings,
  IconUser,
  IconBell,
  IconCheck,
  IconX,
  IconAlertCircle,
  IconInfoCircle,
  IconDatabase,
  IconQuote,
} from '@tabler/icons-react';
import type { PreviewStyleProps } from './PreviewTypes';

export function PreviewContent(props: PreviewStyleProps) {
  const {
    brandColor, accentColor, errorColor, successColor, warningColor,
    cardRadius, buttonRadius, badgeRadius,
    fontFamily, monoFamily,
    previewBg, previewTextColor, previewDimmed, previewBorder,
    sectionStyle, sectionTitleProps,
  } = props;

  return (
    <>
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
          <Blockquote color="brand" icon={<IconQuote size={16} />} style={{ color: previewTextColor }}>
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
            <Avatar variant="filled" color="brand" radius="xl">AB</Avatar>
            <Avatar variant="filled" color="accent" radius="xl">CD</Avatar>
            <Avatar variant="filled" color={successColor} radius="xl">EF</Avatar>
            <Avatar variant="filled" color={errorColor} radius="xl">GH</Avatar>
            <Avatar variant="filled" radius="xl"><IconUser size={20} /></Avatar>
          </Group>
          <Group gap="sm">
            <Avatar variant="filled" size="xs" color="brand" radius="xl">A</Avatar>
            <Avatar variant="filled" size="sm" color="brand" radius="xl">B</Avatar>
            <Avatar variant="filled" size="md" color="brand" radius="xl">C</Avatar>
            <Avatar variant="filled" size="lg" color="brand" radius="xl">D</Avatar>
            <Avatar variant="filled" size="xl" color="brand" radius="xl">E</Avatar>
          </Group>
          <Group gap="md">
            <Indicator color={successColor} processing>
              <Avatar variant="filled" color="brand" radius="xl">ON</Avatar>
            </Indicator>
            <Indicator color={errorColor}>
              <Avatar variant="filled" color="gray" radius="xl">OF</Avatar>
            </Indicator>
            <Indicator color={warningColor} label="3" size={16}>
              <Avatar variant="filled" color="accent" radius="xl"><IconBell size={20} /></Avatar>
            </Indicator>
          </Group>
        </Stack>
      </Paper>

      {/* THEME ICONS */}
      <Paper p="md" style={sectionStyle}>
        <Text {...sectionTitleProps}>ThemeIcon</Text>
        <Group gap="sm" wrap="wrap">
          <ThemeIcon variant="filled" color="brand" size="lg" radius={buttonRadius}><IconHeart size={18} /></ThemeIcon>
          <ThemeIcon variant="light" color="blue" size="lg" radius={buttonRadius}><IconStar size={18} /></ThemeIcon>
          <ThemeIcon variant="outline" color="brand" size="lg" radius={buttonRadius}><IconSettings size={18} /></ThemeIcon>
          <ThemeIcon variant="filled" color={successColor} size="lg" radius={buttonRadius}><IconCheck size={18} /></ThemeIcon>
          <ThemeIcon variant="filled" color={errorColor} size="lg" radius={buttonRadius}><IconX size={18} /></ThemeIcon>
          <ThemeIcon variant="filled" color={warningColor} size="lg" radius={buttonRadius}><IconAlertCircle size={18} /></ThemeIcon>
          <ThemeIcon variant="filled" color="accent" size="xl" radius={buttonRadius}><IconDatabase size={22} /></ThemeIcon>
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
              <Avatar color="accent" radius="xl">P</Avatar>
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
                <ThemeIcon variant="light" color="brand" size="lg" radius={buttonRadius}><IconDatabase size={18} /></ThemeIcon>
                <ActionIconPreview previewDimmed={previewDimmed} />
              </Group>
              <Text fw={500} style={{ color: previewTextColor }}>Métricas</Text>
              <Text size="xs" style={{ color: previewDimmed }}>Últimas 24 horas</Text>
              <Title order={2} style={{ color: previewTextColor }}>1,234</Title>
              <Progress value={65} color="brand" size="sm" radius="xl" />
              <Text size="xs" style={{ color: successColor }}>+12% vs ontem</Text>
            </Stack>
          </Card>
        </SimpleGrid>
      </Paper>

      {/* RATING & MISC */}
      <Paper p="md" style={sectionStyle}>
        <Text {...sectionTitleProps}>Rating & Misc</Text>
        <Stack gap="md">
          <Group gap="xl">
            <Stack gap={4}>
              <Text size="xs" style={{ color: previewDimmed }}>Rating</Text>
              <Rating defaultValue={3} color="brand" />
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
    </>
  );
}

import { SimpleGrid, ActionIcon } from '@mantine/core';
import { IconDots } from '@tabler/icons-react';

function ActionIconPreview({ previewDimmed }: { previewDimmed: string }) {
  return (
    <ActionIcon variant="subtle" style={{ color: previewDimmed }} aria-label="Mais opções"><IconDots size={16} /></ActionIcon>
  );
}
