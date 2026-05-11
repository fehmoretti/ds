import { useMemo, useState } from 'react';
import {
  Stack,
  Paper,
  Title,
  Text,
  Group,
  Badge,
  SegmentedControl,
  Table,
  Tooltip,
  Box,
  Divider,
  Alert,
  ScrollArea,
  ActionIcon,
  CopyButton,
  Button,
} from '@mantine/core';
import {
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconCopy,
  IconShieldCheck,
  IconWand,
  IconArrowRight,
} from '@tabler/icons-react';
import { useTokens } from '@/providers';
import { classifyContrast, formatRatio, type WcagTarget } from '@/lib/contrast';
import {
  deriveSemanticTokens,
  type ContrastCheck,
  type SemanticMode,
} from '@/lib/semantic-tokens';
import type { ColorPalette, ColorShade } from '@/types';

interface SwatchProps {
  hex: string;
  size?: number;
}

function Swatch({ hex, size = 20 }: SwatchProps) {
  return (
    <Box
      style={{
        width: size,
        height: size,
        borderRadius: 4,
        background: hex,
        border: '1px solid rgba(0,0,0,0.12)',
        flexShrink: 0,
      }}
      title={hex}
    />
  );
}

interface ContrastBadgeProps {
  ratio: number;
  required: number;
  passed: boolean;
  size?: 'normal' | 'large' | 'ui';
}

function ContrastBadge({ ratio, required, passed, size = 'normal' }: ContrastBadgeProps) {
  const level = classifyContrast(ratio, size === 'large' ? 'large' : 'normal');
  const color = passed ? (level === 'AAA' ? 'teal' : 'green') : ratio >= 3 ? 'yellow' : 'red';
  const Icon = passed ? IconCheck : ratio >= 3 ? IconAlertTriangle : IconX;
  return (
    <Tooltip label={`Contraste ${formatRatio(ratio)} — alvo ${required.toFixed(1)}:1 (${level})`}>
      <Badge
        size="sm"
        color={color}
        variant="light"
        leftSection={<Icon size={12} />}
        style={{ textTransform: 'none', minWidth: 70, justifyContent: 'center' }}
      >
        {formatRatio(ratio)}
      </Badge>
    </Tooltip>
  );
}

interface RowSpec {
  key: string;
  label: string;
  check: ContrastCheck;
}

function CheckRow({ label, check }: { label: string; check: ContrastCheck }) {
  return (
    <Table.Tr>
      <Table.Td>
        <Group gap={6} wrap="nowrap">
          <Text size="sm" fw={500}>{label}</Text>
          {check.adjusted && (
            <Tooltip label="Valor ajustado automaticamente para atender ao contraste alvo.">
              <Badge size="xs" color="grape" variant="light" leftSection={<IconWand size={10} />}>
                ajustado
              </Badge>
            </Tooltip>
          )}
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap={6} wrap="nowrap">
          <Swatch hex={check.fgEffective} />
          <Text size="xs" ff="monospace">{check.fgEffective.toUpperCase()}</Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap={6} wrap="nowrap">
          <Swatch hex={check.bgEffective} />
          <Text size="xs" ff="monospace">{check.bgEffective.toUpperCase()}</Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Box
          px="md"
          py={6}
          style={{
            background: check.bgEffective,
            color: check.fgEffective,
            borderRadius: 6,
            border: '1px solid rgba(0,0,0,0.08)',
            minWidth: 110,
            textAlign: 'center',
            fontWeight: 500,
            fontSize: check.usage === 'large' ? 18 : 13,
          }}
        >
          Aa Texto
        </Box>
      </Table.Td>
      <Table.Td>
        <ContrastBadge
          ratio={check.ratio}
          required={check.required}
          passed={check.passed}
          size={check.usage === 'large' ? 'large' : check.usage === 'ui' ? 'ui' : 'normal'}
        />
      </Table.Td>
    </Table.Tr>
  );
}

function ContrastTable({ rows }: { rows: RowSpec[] }) {
  return (
    <ScrollArea>
      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Token</Table.Th>
            <Table.Th>Foreground</Table.Th>
            <Table.Th>Background</Table.Th>
            <Table.Th>Amostra</Table.Th>
            <Table.Th>Contraste</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((r) => (
            <CheckRow key={r.key} label={r.label} check={r.check} />
          ))}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Paper p="lg" radius="md" withBorder>
      <Title order={5} mb="md">{title}</Title>
      {children}
    </Paper>
  );
}

/** Palette comparison table — original vs. adjusted hex per shade. */
function PaletteDiff({ name, original, adjusted }: { name: string; original: ColorShade; adjusted: ColorShade }) {
  const changed = original.some((hex, i) => hex.toUpperCase() !== adjusted[i]!.toUpperCase());
  return (
    <Stack gap={6}>
      <Group gap={8}>
        <Text size="sm" fw={600} tt="capitalize">{name}</Text>
        {changed ? (
          <Badge size="xs" color="grape" variant="light">alterada</Badge>
        ) : (
          <Badge size="xs" color="gray" variant="light">inalterada</Badge>
        )}
      </Group>
      <Group gap={4} wrap="nowrap">
        {original.map((hex, i) => {
          const next = adjusted[i]!;
          const diff = hex.toUpperCase() !== next.toUpperCase();
          return (
            <Tooltip key={i} label={diff ? `${hex.toUpperCase()} → ${next.toUpperCase()}` : hex.toUpperCase()}>
              <Stack gap={2} align="center">
                <Box style={{ width: 28, height: 28, borderRadius: 4, background: hex, border: '1px solid rgba(0,0,0,0.12)' }} />
                {diff && <IconArrowRight size={10} />}
                {diff && <Box style={{ width: 28, height: 28, borderRadius: 4, background: next, border: '1px solid #b97cff' }} />}
              </Stack>
            </Tooltip>
          );
        })}
      </Group>
    </Stack>
  );
}

export function ContrastChecker() {
  const { tokens, dispatch } = useTokens();
  const [mode, setMode] = useState<SemanticMode>('light');
  const [target, setTarget] = useState<WcagTarget>('AA');

  const derived = useMemo(
    () => deriveSemanticTokens(tokens.colors, mode, target),
    [tokens.colors, mode, target],
  );

  const { passed, failed, adjusted } = derived.report;
  const total = passed + failed;
  const passRate = total > 0 ? (passed / total) * 100 : 0;

  const exportJson = useMemo(() => JSON.stringify(derived, null, 2), [derived]);

  // Build row spec lists for each section out of the centralized report.
  const rowsFor = (paths: { path: string; label: string }[]): RowSpec[] =>
    paths
      .map(({ path, label }) => {
        const check = derived.report.checks[path];
        return check ? { key: path, label, check } : null;
      })
      .filter((r): r is RowSpec => r !== null);

  const textRows = rowsFor([
    { path: 'text/primary', label: 'text/primary' },
    { path: 'text/secondary', label: 'text/secondary' },
    { path: 'text/tertiary', label: 'text/tertiary' },
    { path: 'text/muted', label: 'text/muted' },
    { path: 'text/brand', label: 'text/brand' },
    { path: 'text/accent', label: 'text/accent' },
    { path: 'text/inverse', label: 'text/inverse' },
  ]);

  const borderRows = rowsFor([
    { path: 'border/default', label: 'border/default' },
    { path: 'border/strong', label: 'border/strong' },
    { path: 'border/brand', label: 'border/brand' },
    { path: 'border/accent', label: 'border/accent' },
    { path: 'border/tertiary', label: 'border/tertiary' },
    { path: 'icon/brand', label: 'icon/brand' },
    { path: 'icon/accent', label: 'icon/accent' },
  ]);

  const feedbackRows = rowsFor(
    (['error', 'success', 'warning', 'info'] as const).flatMap((k) => [
      { path: `feedback/${k}/text`, label: `feedback/${k}/text` },
      { path: `feedback/${k}/border`, label: `feedback/${k}/border` },
    ]),
  );

  const buttonRows = rowsFor(
    (['brand', 'accent', 'tertiary', 'error', 'success', 'warning', 'info'] as const).flatMap((family) => [
      { path: `button/${family}/filled/text`, label: `button/${family}/filled (texto sobre bg)` },
      { path: `button/${family}/filled/bg`, label: `button/${family}/filled (bg vs branco)` },
      { path: `button/${family}/light/text`, label: `button/${family}/light (texto)` },
      { path: `button/${family}/outline/border`, label: `button/${family}/outline (borda)` },
      { path: `button/${family}/outline/text`, label: `button/${family}/outline (texto)` },
    ]),
  );

  /** Apply adjusted shade values back to the project palettes. */
  function applyAdjustedPalettes() {
    const a = derived.adjustedPalettes;
    const make = (orig: ColorPalette, shades: ColorShade): ColorPalette => ({
      name: orig.name,
      baseHex: shades[5]!,
      shades,
    });
    dispatch({ type: 'SET_COLOR_PALETTE', payload: { key: 'brand', palette: make(tokens.colors.brand, a.brand) } });
    dispatch({ type: 'SET_COLOR_PALETTE', payload: { key: 'accent', palette: make(tokens.colors.accent, a.accent) } });
    dispatch({ type: 'SET_COLOR_PALETTE', payload: { key: 'tertiary', palette: make(tokens.colors.tertiary, a.tertiary) } });
    dispatch({ type: 'SET_COLOR_PALETTE', payload: { key: 'gray', palette: make(tokens.colors.gray, a.gray) } });
    dispatch({ type: 'SET_FEEDBACK_PALETTE', payload: { key: 'error', palette: make(tokens.colors.feedback.error, a.error) } });
    dispatch({ type: 'SET_FEEDBACK_PALETTE', payload: { key: 'success', palette: make(tokens.colors.feedback.success, a.success) } });
    dispatch({ type: 'SET_FEEDBACK_PALETTE', payload: { key: 'warning', palette: make(tokens.colors.feedback.warning, a.warning) } });
    dispatch({ type: 'SET_FEEDBACK_PALETTE', payload: { key: 'info', palette: make(tokens.colors.feedback.info, a.info) } });
  }

  const textRequired = target === 'AA' ? 4.5 : 7;
  const largeRequired = target === 'AA' ? 3 : 4.5;

  return (
    <Stack gap="lg">
      <Paper p="lg" radius="md" withBorder>
        <Group justify="space-between" align="flex-start" wrap="wrap">
          <Stack gap={4}>
            <Group gap="xs">
              <IconShieldCheck size={20} />
              <Title order={4}>Verificador de contraste WCAG 2.1</Title>
            </Group>
            <Text size="sm" c="dimmed" maw={720}>
              As cores semânticas seguem os mesmos slots usados pelo Mantine e pelo Preview
              (<code>filled</code> = shade 5, <code>light</code> = tint do shade 5,
              <code> outline</code> = borda no shade 5). Quando uma combinação não atinge o
              alvo WCAG, o algoritmo ajusta a luminosidade desse tom específico (mantendo
              hue/saturação) até passar. Texto: {textRequired}:1 · Texto grande: {largeRequired}:1 ·
              UI: 3:1.
            </Text>
          </Stack>
          <Group gap="md" wrap="nowrap" align="flex-end">
            <Stack gap={4}>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Modo</Text>
              <SegmentedControl
                value={mode}
                onChange={(v) => setMode(v as SemanticMode)}
                size="xs"
                data={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                ]}
              />
            </Stack>
            <Stack gap={4}>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Nível</Text>
              <SegmentedControl
                value={target}
                onChange={(v) => setTarget(v as WcagTarget)}
                size="xs"
                data={[
                  { value: 'AA', label: 'AA' },
                  { value: 'AAA', label: 'AAA' },
                ]}
              />
            </Stack>
          </Group>
        </Group>

        <Divider my="md" />

        <Group gap="md" wrap="wrap">
          <Badge size="lg" color={failed === 0 ? 'green' : 'yellow'} variant="light">
            {passed}/{total} aprovados ({passRate.toFixed(0)}%)
          </Badge>
          {failed > 0 && (
            <Badge size="lg" color="red" variant="light">
              {failed} falhas
            </Badge>
          )}
          {adjusted > 0 && (
            <Badge size="lg" color="grape" variant="light" leftSection={<IconWand size={12} />}>
              {adjusted} valores ajustados
            </Badge>
          )}
          <CopyButton value={exportJson}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copiado!' : 'Copiar JSON dos tokens semânticos derivados'}>
                <ActionIcon variant="light" onClick={copy} aria-label="Copiar JSON">
                  {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
          {adjusted > 0 && (
            <Button
              size="xs"
              leftSection={<IconWand size={14} />}
              onClick={applyAdjustedPalettes}
              variant="light"
              color="grape"
            >
              Aplicar paletas ajustadas
            </Button>
          )}
        </Group>

        {failed > 0 && (
          <Alert
            mt="md"
            icon={<IconAlertTriangle size={16} />}
            color="yellow"
            variant="light"
            radius="md"
            title="Algumas combinações não atingem o nível alvo"
          >
            O ajuste preserva a identidade visual (mesmo hue) e busca a luminosidade que satisfaz
            o contraste. Se ainda houver falhas, considere usar o nível AA em vez de AAA, ou
            escolher uma cor base do brand/accent/tertiary com luminosidade mais distante do
            fundo do modo correspondente.
          </Alert>
        )}
      </Paper>

      <Section title="Paletas — original × ajustada">
        <Stack gap="lg">
          <PaletteDiff name="brand" original={tokens.colors.brand.shades} adjusted={derived.adjustedPalettes.brand} />
          <PaletteDiff name="accent" original={tokens.colors.accent.shades} adjusted={derived.adjustedPalettes.accent} />
          <PaletteDiff name="tertiary" original={tokens.colors.tertiary.shades} adjusted={derived.adjustedPalettes.tertiary} />
          <PaletteDiff name="gray" original={tokens.colors.gray.shades} adjusted={derived.adjustedPalettes.gray} />
          <PaletteDiff name="error" original={tokens.colors.feedback.error.shades} adjusted={derived.adjustedPalettes.error} />
          <PaletteDiff name="success" original={tokens.colors.feedback.success.shades} adjusted={derived.adjustedPalettes.success} />
          <PaletteDiff name="warning" original={tokens.colors.feedback.warning.shades} adjusted={derived.adjustedPalettes.warning} />
          <PaletteDiff name="info" original={tokens.colors.feedback.info.shades} adjusted={derived.adjustedPalettes.info} />
        </Stack>
      </Section>

      <Section title="Texto sobre fundo body">
        <ContrastTable rows={textRows} />
      </Section>

      <Section title="Bordas / ícones (Non-text Contrast 1.4.11)">
        <ContrastTable rows={borderRows} />
      </Section>

      <Section title="Feedback (alertas, banners)">
        <ContrastTable rows={feedbackRows} />
      </Section>

      <Section title="Botões">
        <ContrastTable rows={buttonRows} />
      </Section>
    </Stack>
  );
}
