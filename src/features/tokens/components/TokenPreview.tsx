import { useState, useRef } from 'react';
import {
  MantineProvider,
  Stack,
  Paper,
  Text,
  Title,
  Group,
  Box,
  Button,
  ActionIcon,
  SegmentedControl,
} from '@mantine/core';
import {
  IconSun,
  IconMoon,
  IconHeart,
  IconStar,
  IconSettings,
  IconBell,
  IconCheck,
  IconTrash,
  IconEdit,
  IconPlus,
  IconArrowRight,
  IconDots,
} from '@tabler/icons-react';
import { useTokens } from '@/providers';
import { PreviewFormElements, PreviewContent, PreviewDataAndLayout } from './preview';
import type { PreviewStyleProps } from './preview';

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
  const { colors, radius, typography } = tokens;
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('dark');
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

  const sharedProps: PreviewStyleProps = {
    brandColor, accentColor, grayColor, errorColor, successColor, warningColor,
    cardRadius, buttonRadius, inputRadius, badgeRadius,
    fontFamily, monoFamily,
    previewBg, previewTextColor, previewDimmed, previewBorder, previewCardBg, previewShadowAlpha,
    sectionStyle, sectionTitleProps,
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
            <ActionIcon variant="filled" style={{ backgroundColor: brandColor, borderRadius: `${buttonRadius}px` }} aria-label="Favoritar"><IconHeart size={16} /></ActionIcon>
            <ActionIcon variant="light" color="blue" style={{ borderRadius: `${buttonRadius}px` }} aria-label="Destacar"><IconStar size={16} /></ActionIcon>
            <ActionIcon variant="outline" style={{ borderColor: brandColor, color: brandColor, borderRadius: `${buttonRadius}px` }} aria-label="Configurações"><IconSettings size={16} /></ActionIcon>
            <ActionIcon variant="subtle" style={{ color: brandColor, borderRadius: `${buttonRadius}px` }} aria-label="Notificações"><IconBell size={16} /></ActionIcon>
            <ActionIcon variant="default" style={{ borderRadius: `${buttonRadius}px` }} aria-label="Mais opções"><IconDots size={16} /></ActionIcon>
            <ActionIcon size="lg" variant="filled" style={{ backgroundColor: accentColor, borderRadius: `${buttonRadius}px` }} aria-label="Adicionar"><IconPlus size={20} /></ActionIcon>
            <ActionIcon size="xl" variant="filled" style={{ backgroundColor: successColor, borderRadius: `${buttonRadius}px` }} aria-label="Confirmar"><IconCheck size={24} /></ActionIcon>
            <ActionIcon variant="filled" color="red" style={{ borderRadius: `${buttonRadius}px` }} aria-label="Excluir"><IconTrash size={16} /></ActionIcon>
            <ActionIcon disabled style={{ borderRadius: `${buttonRadius}px` }} aria-label="Editar (desabilitado)"><IconEdit size={16} /></ActionIcon>
          </Group>
        </Paper>

        <PreviewFormElements {...sharedProps} />
        <PreviewContent {...sharedProps} />
        <PreviewDataAndLayout {...sharedProps} />

      </Stack>
      </MantineProvider>
    </Stack>
  );
}
