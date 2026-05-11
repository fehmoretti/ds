/**
 * Bundles every exporter output (Mantine theme + Figma collections) into a single .zip
 * and triggers a browser download. Reused by the export tab and the projects card so the
 * exact same file set ships from both surfaces.
 */
import JSZip from 'jszip';
import type { DesignTokens } from '@/types';
import { exportToMantineCode } from './mantine-export';
import { exportFigmaColorsAdvanced } from './figma-color-export';
import { exportRadiusToFigma } from './figma-export';
import { exportSpacingToFigma } from './figma-export';
import { exportTypographyToFigma } from './figma-export';
import { exportShadowsToFigma } from './figma-export';

export interface ExportProjectArchiveOptions {
  /** Suffix appended to every filename (e.g. `-aa`, `-aaa`). */
  fileSuffix?: string;
  /** Base name of the resulting zip (no extension). */
  archiveBaseName?: string;
}

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'design-tokens';
}

/**
 * Builds a zip blob with all exporter outputs for the given tokens.
 */
export async function buildProjectArchive(
  tokens: DesignTokens,
  options: ExportProjectArchiveOptions = {},
): Promise<{ blob: Blob; fileName: string }> {
  const { fileSuffix = '', archiveBaseName = 'design-tokens' } = options;
  const zip = new JSZip();

  zip.file(`theme${fileSuffix}.ts`, exportToMantineCode(tokens));
  zip.file(`figma-colors${fileSuffix}.json`, JSON.stringify(exportFigmaColorsAdvanced(tokens), null, 2));
  zip.file(`figma-radius${fileSuffix}.json`, JSON.stringify(exportRadiusToFigma(tokens), null, 2));
  zip.file(`figma-spacing${fileSuffix}.json`, JSON.stringify(exportSpacingToFigma(tokens), null, 2));
  zip.file(`figma-typography${fileSuffix}.json`, JSON.stringify(exportTypographyToFigma(tokens), null, 2));
  zip.file(`figma-shadows${fileSuffix}.json`, JSON.stringify(exportShadowsToFigma(tokens), null, 2));

  const blob = await zip.generateAsync({ type: 'blob' });
  return { blob, fileName: `${sanitizeFileName(archiveBaseName)}${fileSuffix}.zip` };
}

/**
 * Builds the archive and triggers a browser download via a temporary anchor.
 */
export async function downloadProjectArchive(
  tokens: DesignTokens,
  options: ExportProjectArchiveOptions = {},
): Promise<void> {
  const { blob, fileName } = await buildProjectArchive(tokens, options);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
