import { useState } from 'react';
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
} from '@mantine/core';
import { IconCopy, IconCheck, IconDownload, IconFileZip } from '@tabler/icons-react';
import JSZip from 'jszip';
import { useTokens } from '@/providers';
import { exportToMantineCode } from '@/lib/mantine-export';
import {
  exportColorsToFigma,
  exportRadiusToFigma,
  exportSpacingToFigma,
  exportTypographyToFigma,
  exportShadowsToFigma,
} from '@/lib/figma-export';

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
  const [format, setFormat] = useState<ExportFormat>('mantine');

  const getExportContent = (): string => {
    switch (format) {
      case 'mantine':
        return exportToMantineCode(tokens);
      case 'figma-colors':
        return JSON.stringify(exportColorsToFigma(tokens), null, 2);
      case 'figma-radius':
        return JSON.stringify(exportRadiusToFigma(tokens), null, 2);
      case 'figma-spacing':
        return JSON.stringify(exportSpacingToFigma(tokens), null, 2);
      case 'figma-typography':
        return JSON.stringify(exportTypographyToFigma(tokens), null, 2);
      case 'figma-shadows':
        return JSON.stringify(exportShadowsToFigma(tokens), null, 2);
      default:
        return '';
    }
  };

  const handleDownload = () => {
    const content = getExportContent();
    switch (format) {
      case 'mantine':
        downloadText(content, 'theme.ts');
        break;
      case 'figma-colors':
        downloadJson(exportColorsToFigma(tokens), 'figma-colors.json');
        break;
      case 'figma-radius':
        downloadJson(exportRadiusToFigma(tokens), 'figma-radius.json');
        break;
      case 'figma-spacing':
        downloadJson(exportSpacingToFigma(tokens), 'figma-spacing.json');
        break;
      case 'figma-typography':
        downloadJson(exportTypographyToFigma(tokens), 'figma-typography.json');
        break;
      case 'figma-shadows':
        downloadJson(exportShadowsToFigma(tokens), 'figma-shadows.json');
        break;
    }
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();

    zip.file('theme.ts', exportToMantineCode(tokens));
    zip.file('figma-colors.json', JSON.stringify(exportColorsToFigma(tokens), null, 2));
    zip.file('figma-radius.json', JSON.stringify(exportRadiusToFigma(tokens), null, 2));
    zip.file('figma-spacing.json', JSON.stringify(exportSpacingToFigma(tokens), null, 2));
    zip.file('figma-typography.json', JSON.stringify(exportTypographyToFigma(tokens), null, 2));
    zip.file('figma-shadows.json', JSON.stringify(exportShadowsToFigma(tokens), null, 2));

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design-tokens.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
