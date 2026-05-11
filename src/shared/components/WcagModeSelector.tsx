/**
 * Single global selector for the WCAG export mode. Rendered in the app header
 * so the choice can be made from any screen and applies to every export action
 * (project card download, token editor export tab).
 */
import { SegmentedControl, Tooltip } from '@mantine/core';
import { useWcagMode, type WcagMode } from '@/providers/WcagModeProvider';

export function WcagModeSelector() {
  const { mode, setMode } = useWcagMode();

  return (
    <Tooltip
      label="Nível de contraste WCAG aplicado às exportações"
      position="bottom"
      withArrow
    >
      <SegmentedControl
        size="xs"
        radius="md"
        value={mode}
        onChange={(v) => setMode(v as WcagMode)}
        data={[
          { value: 'none', label: 'Original' },
          { value: 'AA', label: 'AA' },
          { value: 'AAA', label: 'AAA' },
        ]}
      />
    </Tooltip>
  );
}
