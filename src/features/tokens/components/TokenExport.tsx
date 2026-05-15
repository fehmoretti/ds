import { useMemo, useState } from 'react';
import {
  Stack,
  Text,
  Title,
  Paper,
  Button,
  Group,
  SegmentedControl,
  Code,
  CopyButton,
  ActionIcon,
  Tooltip,
  ScrollArea,
  Alert,
  Anchor,
  List,
  ThemeIcon,
  Badge,
} from '@mantine/core';
import {
  IconCopy,
  IconCheck,
  IconDownload,
  IconFileZip,
  IconBrandFigma,
  IconInfoCircle,
  IconShieldCheck,
  IconWand,
} from '@tabler/icons-react';
import { useTokens } from '@/providers';
import { exportToMantineCode } from '@/lib/mantine-export';
import {
  exportRadiusToFigma,
  exportSpacingToFigma,
  exportTypographyToFigma,
  exportShadowsToFigma,
} from '@/lib/figma-export';
import { exportFigmaColorsAdvanced } from '@/lib/figma-color-export';
import { applyContrastAdjustments, countPaletteAdjustments } from '@/lib/semantic-tokens';
import type { WcagTarget } from '@/lib/contrast';
import { useWcagMode } from '@/providers';

type ExportFormat = 'mantine' | 'figma-colors' | 'figma-radius' | 'figma-spacing' | 'figma-typography' | 'figma-shadows';

function downloadJson(data: unknown, filename: string) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadText(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function TokenExport() {
  const { tokens } = useTokens();
  const { mode: contrastMode, fileSuffix } = useWcagMode();
  const [format, setFormat] = useState<ExportFormat>('mantine');

  /**
   * Tokens that will actually be exported. When the user picks AA or AAA, palettes are
   * passed through `applyContrastAdjustments` (which runs both light and dark passes),
   * so the resulting Figma JSON and Mantine theme already carry the validated hex values.
   */
  const exportTokens = useMemo(() => {
    if (contrastMode === 'none') return tokens;
    return applyContrastAdjustments(tokens, contrastMode as WcagTarget);
  }, [tokens, contrastMode]);

  const adjustmentCount = useMemo(
    () => (contrastMode === 'none' ? 0 : countPaletteAdjustments(tokens, exportTokens)),
    [tokens, exportTokens, contrastMode],
  );

  const getExportContent = (): string => {
    switch (format) {
      case 'mantine':
        return exportToMantineCode(exportTokens);
      case 'figma-colors':
        return JSON.stringify(exportFigmaColorsAdvanced(exportTokens), null, 2);
      case 'figma-radius':
        return JSON.stringify(exportRadiusToFigma(exportTokens), null, 2);
      case 'figma-spacing':
        return JSON.stringify(exportSpacingToFigma(exportTokens), null, 2);
      case 'figma-typography':
        return JSON.stringify(exportTypographyToFigma(exportTokens), null, 2);
      case 'figma-shadows':
        return JSON.stringify(exportShadowsToFigma(exportTokens), null, 2);
      default:
        return '';
    }
  };

  const handleDownload = () => {
    const content = getExportContent();
    switch (format) {
      case 'mantine':
        downloadText(content, `theme${fileSuffix}.ts`);
        break;
      case 'figma-colors':
        downloadJson(exportFigmaColorsAdvanced(exportTokens), `figma-colors${fileSuffix}.json`);
        break;
      case 'figma-radius':
        downloadJson(exportRadiusToFigma(exportTokens), `figma-radius${fileSuffix}.json`);
        break;
      case 'figma-spacing':
        downloadJson(exportSpacingToFigma(exportTokens), `figma-spacing${fileSuffix}.json`);
        break;
      case 'figma-typography':
        downloadJson(exportTypographyToFigma(exportTokens), `figma-typography${fileSuffix}.json`);
        break;
      case 'figma-shadows':
        downloadJson(exportShadowsToFigma(exportTokens), `figma-shadows${fileSuffix}.json`);
        break;
    }
  };

  const handleDownloadAll = async () => {
    const { downloadProjectArchive } = await import('@/lib/project-export');
    await downloadProjectArchive(exportTokens, { fileSuffix });
  };

  const content = getExportContent();

  return (
    <Stack gap="lg">
      <div>
        <Title order={4} mb={4}>
          Exportar Tokens
        </Title>
        <Text size="sm" c="dimmed">
          Exporte seus tokens como código Mantine ou JSON para Figma Variables.
        </Text>
      </div>

      <Paper withBorder p="md" radius="md">
        <Group justify="space-between" align="flex-end" wrap="wrap" gap="md">
          <Stack gap={4} style={{ flex: 1, minWidth: 280 }}>
            <Group gap="xs">
              <IconShieldCheck size={18} />
              <Text size="sm" fw={600}>
                Conformidade WCAG 2.1
              </Text>
              <Badge size="sm" variant="light" color={contrastMode === 'none' ? 'gray' : 'brand'}>
                {contrastMode === 'none' ? 'Original' : `WCAG ${contrastMode}`}
              </Badge>
            </Group>
            <Text size="xs" c="dimmed">
              Ajusta automaticamente os tons das paletas (mantendo hue/saturação) para
              atingir o contraste exigido em <b>light e dark</b> antes de exportar. O nível
              é definido no seletor do cabeçalho e vale para todas as exportações
              (Figma, Mantine e download do projeto).
            </Text>
          </Stack>
        </Group>
        {contrastMode !== 'none' && adjustmentCount > 0 && (
          <Group mt="sm" gap="xs">
            <Badge color="brand" variant="filled" leftSection={<IconWand size={12} />}>
              {adjustmentCount} tons ajustados para atingir {contrastMode}
            </Badge>
            <Text size="xs" c="dimmed">
              Os arquivos exportados terão o sufixo <code>{fileSuffix}</code>.
            </Text>
          </Group>
        )}
        {contrastMode !== 'none' && adjustmentCount === 0 && (
          <Group mt="sm" gap="xs">
            <Badge color="green" variant="light" leftSection={<IconCheck size={12} />}>
              Paletas atuais já atendem ao nível {contrastMode}
            </Badge>
          </Group>
        )}
      </Paper>

      {format.startsWith('figma') && (
        <Alert
          icon={<IconBrandFigma size={18} />}
          title="Como importar no Figma"
          color="violet"
          variant="light"
          radius="md"
        >
          <List size="sm" spacing={6} icon={
            <ThemeIcon size={18} radius="xl" variant="light" color="violet">
              <IconInfoCircle size={12} />
            </ThemeIcon>
          }>
            <List.Item>
              Duplique o arquivo base{' '}
              <Anchor
                href="https://www.figma.com/community/file/1637177236098324065/ds-tokens-mantine"
                target="_blank"
                fw={600}
              >
                DS Tokens · Mantine
              </Anchor>{' '}
              da Figma Community para a sua conta.
            </List.Item>
            <List.Item>
              Instale o plugin{' '}
              <Anchor
                href="https://www.figma.com/community/plugin/1256972111705530093"
                target="_blank"
                fw={600}
              >
                Export/Import Variables
              </Anchor>{' '}
              no Figma.
            </List.Item>
            <List.Item>
              Abra o arquivo duplicado do Design System no Figma.
            </List.Item>
            <List.Item>
              Execute o plugin e use a opção <Text span fw={600}>Import</Text> para carregar os arquivos JSON exportados aqui — as variáveis existentes serão atualizadas mantendo os bindings dos componentes.
            </List.Item>
          </List>
        </Alert>
      )}

      <SegmentedControl
        value={format}
        onChange={(val) => setFormat(val as ExportFormat)}
        data={[
          { label: 'Mantine Theme', value: 'mantine' },
          { label: 'Figma Colors', value: 'figma-colors' },
          { label: 'Figma Radius', value: 'figma-radius' },
          { label: 'Figma Spacing', value: 'figma-spacing' },
          { label: 'Figma Typo', value: 'figma-typography' },
          { label: 'Figma Shadows', value: 'figma-shadows' },
        ]}
        fullWidth
        size="xs"
      />

      <Paper withBorder p="md" pos="relative">
        <Group justify="space-between" mb="sm">
          <Text size="xs" c="dimmed" fw={500}>
            {format === 'mantine' ? 'theme.ts' : `${format}.json`}
          </Text>
          <Group gap="xs">
            <CopyButton value={content}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copiado!' : 'Copiar'}>
                  <ActionIcon
                    variant="subtle"
                    color={copied ? 'teal' : 'gray'}
                    onClick={copy}
                    size="sm"
                    aria-label="Copiar código"
                  >
                    {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
            <Tooltip label="Download">
              <ActionIcon variant="subtle" color="gray" onClick={handleDownload} size="sm" aria-label="Download">
                <IconDownload size={14} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
        <ScrollArea h={400}>
          <Code block style={{ fontSize: 11, lineHeight: 1.5 }}>
            {content}
          </Code>
        </ScrollArea>
      </Paper>

      <Group justify="flex-end">
        <Button
          leftSection={<IconFileZip size={16} />}
          variant="light"
          onClick={handleDownloadAll}
        >
          Download Todos (.zip)
        </Button>
      </Group>
    </Stack>
  );
}
