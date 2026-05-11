/**
 * Figma Color export â€” produces a Variable Collection that mirrors the structure of the
 * project's reference `Color.json` (primitives + semantic aliases). Semantic variables resolve
 * to primitives via VARIABLE_ALIAS so changing a primitive shade in Figma cascades through
 * the entire system, exactly like in code.
 *
 * The mapping table below was extracted from the reference design system file. Primitive
 * hex values come from the current `tokens.colors` (already optionally adjusted for AA/AAA
 * via `applyContrastAdjustments`).
 */

import type { DesignTokens } from '@/types';
import { hexToFigmaRgba } from './color-utils';
import { getMantineButtonTokens, type MantineMode } from './mantine-tokens';

interface FigmaRgba { r: number; g: number; b: number; a: number; }
interface AliasRef { type: 'VARIABLE_ALIAS'; id: string; }

interface FigmaVariable {
  id: string;
  name: string;
  description: string;
  type: 'COLOR';
  valuesByMode: Record<string, FigmaRgba | AliasRef>;
  resolvedValuesByMode: Record<string, { resolvedValue: FigmaRgba; alias: string | null; aliasName?: string }>;
  scopes: string[];
  hiddenFromPublishing: boolean;
  codeSyntax: Record<string, string>;
}

interface FigmaCollection {
  id: string;
  name: string;
  modes: Record<string, string>;
  variableIds: string[];
  variables: FigmaVariable[];
}

const COLLECTION_ID = 'VariableCollectionId:color:1';
const LIGHT_MODE = 'mode:light';
const DARK_MODE = 'mode:dark';

// --- Semantic mapping table ------------------------------------------------
// Each entry references primitives by `group/shade` (e.g. `brand/5`, `base/white`, `feedback/error/3`)
// or carries a raw RGBA literal (e.g. transparent overlays, pure white/black tokens).

type PrimitiveRef = { kind: 'primitive'; ref: string };
type RawColorRef = { kind: 'raw'; value: FigmaRgba };
type ColorRef = PrimitiveRef | RawColorRef;

const p = (ref: string): PrimitiveRef => ({ kind: 'primitive', ref });
const raw = (value: FigmaRgba): RawColorRef => ({ kind: 'raw', value });

interface SemanticEntry {
  name: string;
  scopes: string[];
  code: string;
  light: ColorRef;
  dark: ColorRef;
}

// Inline RGBA objects (overlays, pure white/black) are wrapped in `raw()`; primitive refs
// use `p('group/shade')`.
const SEMANTIC_MAP: SemanticEntry[] = [
  { name: 'semantic/background/body', scopes: ['FRAME_FILL'], code: 'var(--color-background-body)', light: p('base/white'), dark: p('gray/9') },
  { name: 'semantic/background/surface', scopes: ['FRAME_FILL'], code: 'var(--color-background-surface)', light: p('gray/0'), dark: p('gray/8') },
  { name: 'semantic/background/subtle', scopes: ['FRAME_FILL'], code: 'var(--color-background-subtle)', light: p('gray/0'), dark: p('gray/8') },
  { name: 'semantic/background/muted', scopes: ['FRAME_FILL'], code: 'var(--color-background-muted)', light: p('gray/1'), dark: p('gray/7') },
  { name: 'semantic/background/elevated', scopes: ['FRAME_FILL'], code: 'var(--color-background-elevated)', light: p('base/white'), dark: p('gray/7') },
  { name: 'semantic/background/inverse', scopes: ['FRAME_FILL'], code: 'var(--color-background-inverse)', light: p('gray/9'), dark: p('base/white') },
  { name: 'semantic/text/primary', scopes: ['TEXT_FILL'], code: 'var(--color-text-primary)', light: p('gray/9'), dark: p('gray/0') },
  { name: 'semantic/text/secondary', scopes: ['TEXT_FILL'], code: 'var(--color-text-secondary)', light: p('gray/7'), dark: p('gray/3') },
  { name: 'semantic/text/muted', scopes: ['TEXT_FILL'], code: 'var(--color-text-muted)', light: p('gray/5'), dark: p('gray/4') },
  { name: 'semantic/text/disabled', scopes: ['TEXT_FILL'], code: 'var(--color-text-disabled)', light: p('gray/2'), dark: p('gray/6') },
  { name: 'semantic/text/inverse', scopes: ['TEXT_FILL'], code: 'var(--color-text-inverse)', light: p('base/white'), dark: p('gray/9') },
  { name: 'semantic/text/brand', scopes: ['TEXT_FILL'], code: 'var(--color-text-brand)', light: p('brand/6'), dark: p('brand/3') },
  { name: 'semantic/text/accent', scopes: ['TEXT_FILL'], code: 'var(--color-text-accent)', light: p('accent/6'), dark: p('accent/3') },
  { name: 'semantic/text/tertiary', scopes: ['TEXT_FILL'], code: 'var(--color-text-tertiary)', light: p('tertiary/6'), dark: p('tertiary/3') },
  { name: 'semantic/border/default', scopes: ['STROKE_COLOR'], code: 'var(--color-border-default)', light: p('gray/2'), dark: p('gray/7') },
  { name: 'semantic/border/subtle', scopes: ['STROKE_COLOR'], code: 'var(--color-border-subtle)', light: p('gray/1'), dark: p('gray/8') },
  { name: 'semantic/border/strong', scopes: ['STROKE_COLOR'], code: 'var(--color-border-strong)', light: p('gray/5'), dark: p('gray/5') },
  { name: 'semantic/border/focus', scopes: ['STROKE_COLOR'], code: 'var(--color-border-focus)', light: p('brand/5'), dark: p('brand/5') },
  { name: 'semantic/border/brand', scopes: ['STROKE_COLOR'], code: 'var(--color-border-brand)', light: p('brand/5'), dark: p('brand/5') },
  { name: 'semantic/action/primary/default', scopes: ['FRAME_FILL'], code: 'var(--color-action-primary-default)', light: p('brand/5'), dark: p('brand/5') },
  { name: 'semantic/action/primary/hover', scopes: ['FRAME_FILL'], code: 'var(--color-action-primary-hover)', light: p('brand/6'), dark: p('brand/4') },
  { name: 'semantic/action/primary/active', scopes: ['FRAME_FILL'], code: 'var(--color-action-primary-active)', light: p('brand/7'), dark: p('brand/3') },
  { name: 'semantic/action/primary/subtle', scopes: ['FRAME_FILL'], code: 'var(--color-action-primary-subtle)', light: p('brand/1'), dark: p('brand/9') },
  { name: 'semantic/action/primary/text', scopes: ['TEXT_FILL'], code: 'var(--color-action-primary-text)', light: p('base/white'), dark: p('base/white') },
  { name: 'semantic/action/secondary/default', scopes: ['FRAME_FILL'], code: 'var(--color-action-secondary-default)', light: p('gray/1'), dark: p('gray/7') },
  { name: 'semantic/action/secondary/hover', scopes: ['FRAME_FILL'], code: 'var(--color-action-secondary-hover)', light: p('gray/2'), dark: p('gray/6') },
  { name: 'semantic/action/secondary/active', scopes: ['FRAME_FILL'], code: 'var(--color-action-secondary-active)', light: p('gray/3'), dark: p('gray/5') },
  { name: 'semantic/action/secondary/text', scopes: ['TEXT_FILL'], code: 'var(--color-action-secondary-text)', light: p('gray/9'), dark: p('gray/0') },
  { name: 'semantic/feedback/success/background', scopes: ['FRAME_FILL'], code: 'var(--color-feedback-success-background)', light: p('feedback/success/0'), dark: p('feedback/success/9') },
  { name: 'semantic/feedback/success/border', scopes: ['STROKE_COLOR'], code: 'var(--color-feedback-success-border)', light: p('feedback/success/5'), dark: p('feedback/success/5') },
  { name: 'semantic/feedback/success/text', scopes: ['TEXT_FILL'], code: 'var(--color-feedback-success-text)', light: p('feedback/success/6'), dark: p('feedback/success/3') },
  { name: 'semantic/feedback/success/icon', scopes: ['SHAPE_FILL'], code: 'var(--color-feedback-success-icon)', light: p('feedback/success/6'), dark: p('feedback/success/3') },
  { name: 'semantic/feedback/warning/background', scopes: ['FRAME_FILL'], code: 'var(--color-feedback-warning-background)', light: p('feedback/warning/0'), dark: p('feedback/warning/9') },
  { name: 'semantic/feedback/warning/border', scopes: ['STROKE_COLOR'], code: 'var(--color-feedback-warning-border)', light: p('feedback/warning/5'), dark: p('feedback/warning/5') },
  { name: 'semantic/feedback/warning/text', scopes: ['TEXT_FILL'], code: 'var(--color-feedback-warning-text)', light: p('feedback/warning/6'), dark: p('feedback/warning/3') },
  { name: 'semantic/feedback/warning/icon', scopes: ['SHAPE_FILL'], code: 'var(--color-feedback-warning-icon)', light: p('feedback/warning/6'), dark: p('feedback/warning/3') },
  { name: 'semantic/feedback/error/background', scopes: ['FRAME_FILL'], code: 'var(--color-feedback-error-background)', light: p('feedback/error/0'), dark: p('feedback/error/9') },
  { name: 'semantic/feedback/error/border', scopes: ['STROKE_COLOR'], code: 'var(--color-feedback-error-border)', light: p('feedback/error/5'), dark: p('feedback/error/5') },
  { name: 'semantic/feedback/error/text', scopes: ['TEXT_FILL'], code: 'var(--color-feedback-error-text)', light: p('feedback/error/6'), dark: p('feedback/error/3') },
  { name: 'semantic/feedback/error/icon', scopes: ['SHAPE_FILL'], code: 'var(--color-feedback-error-icon)', light: p('feedback/error/6'), dark: p('feedback/error/3') },
  { name: 'semantic/feedback/info/background', scopes: ['FRAME_FILL'], code: 'var(--color-feedback-info-background)', light: p('feedback/info/0'), dark: p('feedback/info/9') },
  { name: 'semantic/feedback/info/border', scopes: ['STROKE_COLOR'], code: 'var(--color-feedback-info-border)', light: p('feedback/info/5'), dark: p('feedback/info/5') },
  { name: 'semantic/feedback/info/text', scopes: ['TEXT_FILL'], code: 'var(--color-feedback-info-text)', light: p('feedback/info/6'), dark: p('feedback/info/3') },
  { name: 'semantic/feedback/info/icon', scopes: ['SHAPE_FILL'], code: 'var(--color-feedback-info-icon)', light: p('feedback/info/6'), dark: p('feedback/info/3') },
  { name: 'semantic/component/input/background', scopes: ['FRAME_FILL'], code: 'var(--color-component-input-background)', light: p('base/white'), dark: p('gray/8') },
  { name: 'semantic/component/input/border', scopes: ['STROKE_COLOR'], code: 'var(--color-component-input-border)', light: p('gray/3'), dark: p('gray/6') },
  { name: 'semantic/component/input/border-hover', scopes: ['STROKE_COLOR'], code: 'var(--color-component-input-border-hover)', light: p('gray/4'), dark: p('gray/5') },
  { name: 'semantic/component/input/border-focus', scopes: ['STROKE_COLOR'], code: 'var(--color-component-input-border-focus)', light: p('brand/5'), dark: p('brand/5') },
  { name: 'semantic/component/input/placeholder', scopes: ['TEXT_FILL'], code: 'var(--color-component-input-placeholder)', light: p('gray/5'), dark: p('gray/4') },
  { name: 'semantic/component/input/text', scopes: ['TEXT_FILL'], code: 'var(--color-component-input-text)', light: p('gray/9'), dark: p('gray/0') },
  { name: 'semantic/component/input/disabled-background', scopes: ['FRAME_FILL'], code: 'var(--color-component-input-disabled-background)', light: p('gray/1'), dark: p('gray/7') },
  { name: 'semantic/component/input/disabled-text', scopes: ['TEXT_FILL'], code: 'var(--color-component-input-disabled-text)', light: p('gray/3'), dark: p('gray/6') },
  { name: 'semantic/component/card/background', scopes: ['FRAME_FILL'], code: 'var(--color-component-card-background)', light: p('base/white'), dark: p('gray/8') },
  { name: 'semantic/component/card/border', scopes: ['STROKE_COLOR'], code: 'var(--color-component-card-border)', light: p('gray/2'), dark: p('gray/7') },
  { name: 'semantic/component/card/header', scopes: ['TEXT_FILL'], code: 'var(--color-component-card-header)', light: p('gray/0'), dark: p('gray/7') },
  { name: 'semantic/component/modal/background', scopes: ['FRAME_FILL'], code: 'var(--color-component-modal-background)', light: p('base/white'), dark: p('gray/8') },
  { name: 'semantic/component/drawer/background', scopes: ['FRAME_FILL'], code: 'var(--color-component-drawer-background)', light: p('base/white'), dark: p('gray/8') },
  { name: 'semantic/component/popover/background', scopes: ['FRAME_FILL'], code: 'var(--color-component-popover-background)', light: p('base/white'), dark: p('gray/8') },
  { name: 'semantic/component/menu/background', scopes: ['FRAME_FILL'], code: 'var(--color-component-menu-background)', light: p('base/white'), dark: p('gray/8') },
  { name: 'semantic/component/menu/item-hover', scopes: ['FRAME_FILL'], code: 'var(--color-component-menu-item-hover)', light: p('gray/1'), dark: p('gray/7') },
  { name: 'semantic/component/tooltip/background', scopes: ['FRAME_FILL'], code: 'var(--color-component-tooltip-background)', light: p('gray/9'), dark: p('gray/0') },
  { name: 'semantic/component/tooltip/text', scopes: ['TEXT_FILL'], code: 'var(--color-component-tooltip-text)', light: p('base/white'), dark: p('gray/9') },
  { name: 'semantic/component/overlay/background', scopes: ['FRAME_FILL'], code: 'var(--color-component-overlay-background)', light: {"r":0,"g":0,"b":0,"a":0.4000000059604645}, dark: {"r":0,"g":0,"b":0,"a":0.6000000238418579} },
  { name: 'semantic/component/table/default/header-background', scopes: ['FRAME_FILL'], code: 'var(--color-component-table-header-default-background)', light: p('gray/0'), dark: p('gray/8') },
  { name: 'semantic/component/table/default/row-header', scopes: ['FRAME_FILL'], code: 'var(--color-component-table-default-row-hover)', light: p('gray/1'), dark: p('gray/7') },
  { name: 'semantic/component/table/default/border', scopes: ['STROKE_COLOR'], code: 'var(--color-component-default-table-border)', light: p('gray/2'), dark: p('gray/7') },
  { name: 'semantic/component/chip/background', scopes: ['FRAME_FILL'], code: 'var(--color-component-chip-background)', light: p('gray/1'), dark: p('gray/7') },
  { name: 'semantic/component/chip/text', scopes: ['TEXT_FILL'], code: 'var(--color-component-chip-text)', light: p('gray/7'), dark: p('gray/0') },
  { name: 'semantic/component/chip/selected-background', scopes: ['FRAME_FILL'], code: 'var(--color-component-chip-selected-background)', light: p('brand/1'), dark: p('brand/9') },
  { name: 'semantic/component/chip/selected-text', scopes: ['TEXT_FILL'], code: 'var(--color-component-chip-selected-text)', light: p('brand/6'), dark: p('brand/3') },
  { name: 'semantic/background/brand/subtle', scopes: ['FRAME_FILL'], code: 'var(--color-background-brand-subtle)', light: p('brand/0'), dark: p('brand/9') },
  { name: 'semantic/background/brand/muted', scopes: ['FRAME_FILL'], code: 'var(--color-background-brand-muted)', light: p('brand/1'), dark: p('brand/8') },
  { name: 'semantic/background/brand/soft', scopes: ['FRAME_FILL'], code: 'var(--color-background-brand-soft)', light: p('brand/2'), dark: p('brand/7') },
  { name: 'semantic/background/light', scopes: ['FRAME_FILL'], code: 'var(--color-background-brand-default)', light: p('brand/3'), dark: p('brand/6') },
  { name: 'semantic/background/tertiary/subtle', scopes: ['FRAME_FILL'], code: 'var(--color-background-tertiary-subtle)', light: p('tertiary/0'), dark: p('tertiary/9') },
  { name: 'semantic/background/tertiary/muted', scopes: ['FRAME_FILL'], code: 'var(--color-background-tertiary-muted)', light: p('tertiary/1'), dark: p('tertiary/8') },
  { name: 'semantic/background/tertiary/soft', scopes: ['FRAME_FILL'], code: 'var(--color-background-tertiary-soft)', light: p('tertiary/2'), dark: p('tertiary/7') },
  { name: 'semantic/background/tertiary/default', scopes: ['FRAME_FILL'], code: 'var(--color-background-tertiary-default)', light: p('tertiary/5'), dark: p('tertiary/5') },
  { name: 'semantic/component/progress/background/neutral', scopes: ['SHAPE_FILL'], code: 'var(--color-component-progress-background-neutral)', light: p('gray/2'), dark: p('gray/7') },
  { name: 'semantic/component/progress/fill/neutral', scopes: ['SHAPE_FILL'], code: 'var(--color-component-progress-fill-neutral)', light: p('gray/5'), dark: p('gray/4') },
  { name: 'semantic/icon/primary', scopes: ['SHAPE_FILL'], code: 'var(--color-icon-primary)', light: p('gray/9'), dark: p('gray/0') },
  { name: 'semantic/icon/secondary', scopes: ['SHAPE_FILL'], code: 'var(--color-icon-secondary)', light: p('gray/7'), dark: p('gray/3') },
  { name: 'semantic/icon/muted', scopes: ['SHAPE_FILL'], code: 'var(--color-icon-muted)', light: p('gray/5'), dark: p('gray/4') },
  { name: 'semantic/icon/disabled', scopes: ['SHAPE_FILL'], code: 'var(--color-icon-disabled)', light: p('gray/2'), dark: p('gray/6') },
  { name: 'semantic/icon/inverse', scopes: ['SHAPE_FILL'], code: 'var(--color-icon-inverse)', light: p('base/white'), dark: p('gray/9') },
  { name: 'semantic/icon/brand', scopes: ['SHAPE_FILL'], code: 'var(--color-icon-brand)', light: p('brand/6'), dark: p('brand/3') },
  { name: 'semantic/icon/accent', scopes: ['SHAPE_FILL'], code: 'var(--color-icon-accent)', light: p('accent/6'), dark: p('accent/3') },
  { name: 'semantic/icon/tertiary', scopes: ['SHAPE_FILL'], code: 'var(--color-icon-tertiary)', light: p('tertiary/6'), dark: p('tertiary/3') },
  { name: 'semantic/icon/success', scopes: ['SHAPE_FILL'], code: 'var(--color-icon-success)', light: p('feedback/success/6'), dark: p('feedback/success/3') },
  { name: 'semantic/icon/warning', scopes: ['SHAPE_FILL'], code: 'var(--color-icon-warning)', light: p('feedback/warning/6'), dark: p('feedback/warning/3') },
  { name: 'semantic/icon/error', scopes: ['SHAPE_FILL'], code: 'var(--color-icon-error)', light: p('feedback/error/6'), dark: p('feedback/error/3') },
  { name: 'semantic/icon/info', scopes: ['SHAPE_FILL'], code: 'var(--color-icon-info)', light: p('feedback/info/6'), dark: p('feedback/info/3') },
  { name: 'semantic/action/primary/icon', scopes: ['SHAPE_FILL'], code: 'var(--color-action-primary-icon)', light: p('base/white'), dark: p('base/white') },
  { name: 'semantic/action/secondary/icon', scopes: ['SHAPE_FILL'], code: 'var(--color-action-secondary-icon)', light: p('gray/9'), dark: p('gray/0') },
  { name: 'semantic/component/table/brand/header-background', scopes: ['FRAME_FILL'], code: 'var(--color-component-table-header-brand-background)', light: p('brand/0'), dark: p('brand/8') },
  { name: 'semantic/component/table/brand/row-header', scopes: ['FRAME_FILL'], code: 'var(--color-component-table-brand-row-hover)', light: p('brand/1'), dark: p('brand/7') },
  { name: 'semantic/component/table/brand/border', scopes: ['STROKE_COLOR'], code: 'var(--color-component-brand-table-border)', light: p('brand/2'), dark: p('brand/7') },
  { name: 'semantic/component/table/accent/header-background', scopes: ['FRAME_FILL'], code: 'var(--color-component-table-header-accent-background)', light: p('accent/0'), dark: p('accent/8') },
  { name: 'semantic/component/table/accent/row-header', scopes: ['FRAME_FILL'], code: 'var(--color-component-table-accent-row-hover)', light: p('accent/1'), dark: p('accent/7') },
  { name: 'semantic/component/table/accent/border', scopes: ['STROKE_COLOR'], code: 'var(--color-component-accent-table-border)', light: p('accent/2'), dark: p('accent/7') },
  { name: 'semantic/component/table/tertiary/header-background', scopes: ['FRAME_FILL'], code: 'var(--color-component-table-header-tertiary-background)', light: p('tertiary/0'), dark: p('tertiary/8') },
  { name: 'semantic/component/table/tertiary/row-header', scopes: ['FRAME_FILL'], code: 'var(--color-component-table-tertiary-row-hover)', light: p('tertiary/1'), dark: p('tertiary/7') },
  { name: 'semantic/component/table/tertiary/border', scopes: ['STROKE_COLOR'], code: 'var(--color-component-tertiary-table-border)', light: p('tertiary/3'), dark: p('tertiary/7') },
  { name: 'semantic/background/brand/default', scopes: ['FRAME_FILL'], code: 'var(--color-background-brand-default)', light: p('brand/5'), dark: p('brand/5') },
  { name: 'semantic/background/accent/soft', scopes: ['FRAME_FILL'], code: 'var(--color-background-accent-soft)', light: p('accent/2'), dark: p('accent/7') },
  { name: 'semantic/background/accent/muted', scopes: ['FRAME_FILL'], code: 'var(--color-background-accent-muted)', light: p('accent/1'), dark: p('accent/8') },
  { name: 'semantic/background/accent/default', scopes: ['FRAME_FILL'], code: 'var(--color-background-accent-default)', light: p('accent/5'), dark: p('accent/5') },
  { name: 'semantic/background/accent/subtle', scopes: ['FRAME_FILL'], code: 'var(--color-background-accent-subtle)', light: p('accent/0'), dark: p('accent/9') },
  { name: 'semantic/background/strong', scopes: ['FRAME_FILL'], code: 'var(--color-background-strong)', light: p('gray/3'), dark: p('brand/6') },
  { name: 'semantic/component/input/icon', scopes: ['SHAPE_FILL'], code: 'var(--color-component-input-icon)', light: p('gray/5'), dark: p('gray/0') },
  { name: 'semantic/component/input/icon-error', scopes: ['SHAPE_FILL'], code: 'var(--color-component-input-icon-error)', light: p('feedback/error/5'), dark: p('feedback/error/5') },
  { name: 'semantic/component/input/placeholder-error', scopes: ['TEXT_FILL'], code: 'var(--color-component-input-placeholder-error)', light: p('feedback/error/5'), dark: p('feedback/error/5') },
  { name: 'semantic/component/input/disabled-icon', scopes: ['SHAPE_FILL'], code: 'var(--color-component-input-disabled-icon)', light: p('gray/3'), dark: p('gray/6') },
  { name: 'semantic/background/selected', scopes: ['FRAME_FILL'], code: 'var(--color-background-selected)', light: p('gray/1'), dark: p('gray/8') },
  { name: 'semantic/border/success', scopes: ['STROKE_COLOR'], code: 'var(--color-border-success)', light: p('feedback/success/5'), dark: p('feedback/success/5') },
  { name: 'semantic/border/warning', scopes: ['STROKE_COLOR'], code: 'var(--color-border-warning)', light: p('feedback/warning/5'), dark: p('feedback/warning/5') },
  { name: 'semantic/border/info', scopes: ['STROKE_COLOR'], code: 'var(--color-border-info)', light: p('feedback/info/5'), dark: p('feedback/info/5') },
  { name: 'semantic/component/progress/background/brand', scopes: ['SHAPE_FILL'], code: 'var(--color-component-progress-background-brand)', light: p('brand/2'), dark: p('brand/7') },
  { name: 'semantic/component/progress/background/accent', scopes: ['SHAPE_FILL'], code: 'var(--color-component-progress-background-accent)', light: p('accent/2'), dark: p('accent/7') },
  { name: 'semantic/component/progress/background/tertiary', scopes: ['SHAPE_FILL'], code: 'var(--color-component-progress-background-tertiary)', light: p('tertiary/2'), dark: p('tertiary/7') },
  { name: 'semantic/component/progress/background/success', scopes: ['SHAPE_FILL'], code: 'var(--color-component-progress-background-success)', light: p('feedback/success/2'), dark: p('feedback/success/7') },
  { name: 'semantic/component/progress/background/error', scopes: ['SHAPE_FILL'], code: 'var(--color-component-progress-background-error)', light: p('feedback/error/2'), dark: p('feedback/error/7') },
  { name: 'semantic/component/progress/background/warning', scopes: ['SHAPE_FILL'], code: 'var(--color-component-progress-background-warning)', light: p('feedback/warning/2'), dark: p('feedback/warning/7') },
  { name: 'semantic/component/progress/background/info', scopes: ['SHAPE_FILL'], code: 'var(--color-component-progress-background-info)', light: p('feedback/info/2'), dark: p('feedback/info/7') },
  { name: 'semantic/component/progress/fill/brand', scopes: ['SHAPE_FILL'], code: 'var(--color-component-progress-fill-brand)', light: p('brand/5'), dark: p('brand/5') },
  { name: 'semantic/component/progress/fill/accent', scopes: ['SHAPE_FILL'], code: 'var(--color-component-progress-fill-accent)', light: p('accent/5'), dark: p('accent/5') },
  { name: 'semantic/component/progress/fill/tertiary', scopes: ['SHAPE_FILL'], code: 'var(--color-component-progress-fill-tertiary)', light: p('tertiary/5'), dark: p('tertiary/5') },
  { name: 'semantic/component/progress/fill/success', scopes: ['SHAPE_FILL'], code: 'var(--color-component-progress-fill-success)', light: p('feedback/success/5'), dark: p('feedback/success/5') },
  { name: 'semantic/component/progress/fill/error', scopes: ['SHAPE_FILL'], code: 'var(--color-component-progress-fill-error)', light: p('feedback/error/5'), dark: p('feedback/error/5') },
  { name: 'semantic/component/progress/fill/warning', scopes: ['SHAPE_FILL'], code: 'var(--color-component-progress-fill-warning)', light: p('feedback/warning/5'), dark: p('feedback/warning/5') },
  { name: 'semantic/component/progress/fill/info', scopes: ['SHAPE_FILL'], code: 'var(--color-component-progress-fill-info)', light: p('feedback/info/5'), dark: p('feedback/info/5') },
  { name: 'semantic/White', scopes: ['ALL_SCOPES'], code: '', light: {"r":1,"g":1,"b":1,"a":1}, dark: {"r":1,"g":1,"b":1,"a":1} },
  { name: 'semantic/Black', scopes: ['ALL_SCOPES'], code: '', light: {"r":0,"g":0,"b":0,"a":1}, dark: {"r":0,"g":0,"b":0,"a":1} },
];

// --- Primitive table -------------------------------------------------------

interface PrimitiveDef {
  ref: string;
  name: string;
  hex: string; // 8-char or 6-char hex (rgba() encoded)
}

function buildPrimitives(tokens: DesignTokens): PrimitiveDef[] {
  const c = tokens.colors;
  const list: PrimitiveDef[] = [];
  const pushPalette = (group: string, shades: readonly string[]) => {
    for (let i = 0; i < shades.length; i++) {
      list.push({ ref: `${group}/${i}`, name: `primitives/${group}/${i}`, hex: shades[i]! });
    }
  };
  pushPalette('brand', c.brand.shades);
  pushPalette('accent', c.accent.shades);
  pushPalette('tertiary', c.tertiary.shades);
  pushPalette('gray', c.gray.shades);
  pushPalette('feedback/error', c.feedback.error.shades);
  pushPalette('feedback/success', c.feedback.success.shades);
  pushPalette('feedback/warning', c.feedback.warning.shades);
  pushPalette('feedback/info', c.feedback.info.shades);
  list.push({ ref: 'base/white', name: 'primitives/base/white', hex: '#FFFFFF' });
  list.push({ ref: 'base/black', name: 'primitives/base/black', hex: '#000000' });
  list.push({ ref: 'base/none', name: 'primitives/base/none', hex: '#FFFFFF00' });
  return list;
}

// --- Button entries: generated to mirror Mantine's variant resolver -------
// We replicate `getCSSColorVariables()` + `defaultVariantColorsResolver()` from
// @mantine/core so the Figma variables produce IDENTICAL pixels to what real
// Mantine components render in the Preview. Some slots (`light` bg in dark, all
// `outline-hover` overlays) yield colors that don't exist in the primitive
// palette — those are emitted as raw RGBA values.

const BUTTON_FAMILIES: Array<{ shortName: string; tokenName: string; getShades: (t: DesignTokens) => string[] }> = [
  { shortName: 'brand',   tokenName: 'brand',           getShades: (t) => [...t.colors.brand.shades] },
  { shortName: 'accent',  tokenName: 'accent',          getShades: (t) => [...t.colors.accent.shades] },
  { shortName: 'tertiary',tokenName: 'tertiary',        getShades: (t) => [...t.colors.tertiary.shades] },
  { shortName: 'success', tokenName: 'feedback/success',getShades: (t) => [...t.colors.feedback.success.shades] },
  { shortName: 'error',   tokenName: 'feedback/error',  getShades: (t) => [...t.colors.feedback.error.shades] },
  { shortName: 'warning', tokenName: 'feedback/warning',getShades: (t) => [...t.colors.feedback.warning.shades] },
  { shortName: 'info',    tokenName: 'feedback/info',   getShades: (t) => [...t.colors.feedback.info.shades] },
];

const NONE_RGBA: FigmaRgba = { r: 1, g: 1, b: 1, a: 0 };

/** Convert a value emitted by `getMantineButtonTokens` into a Figma color value.
 *  - `'transparent'` → fully transparent
 *  - `#RRGGBB` (palette shade) → alias to the matching primitive when available
 *  - `rgba(r,g,b,a)` (Mantine alpha overlay) → raw RGBA literal */
function valueToColorRef(
  value: string,
  paletteRef: string,
  shades: string[],
): ColorRef {
  if (value === 'transparent') return raw(NONE_RGBA);
  if (value.startsWith('rgba(')) {
    const m = value.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/);
    if (!m) throw new Error(`Cannot parse rgba: ${value}`);
    return raw({ r: +m[1]! / 255, g: +m[2]! / 255, b: +m[3]! / 255, a: +m[4]! });
  }
  if (value.startsWith('#')) {
    // If the value matches a palette shade exactly, alias to it.
    const upper = value.toUpperCase();
    const idx = shades.findIndex((s) => s.toUpperCase() === upper);
    if (idx >= 0) return p(`${paletteRef}/${idx}`);
    if (upper === '#FFFFFF') return p('base/white');
    if (upper === '#000000') return p('base/black');
    return raw(hexToFigmaRgba(value));
  }
  throw new Error(`Unknown color value: ${value}`);
}

function buildButtonEntries(tokens: DesignTokens): SemanticEntry[] {
  const entries: SemanticEntry[] = [];
  const variants: Array<'filled' | 'light' | 'outline' | 'subtle'> = ['filled', 'light', 'outline', 'subtle'];

  for (const fam of BUTTON_FAMILIES) {
    const shades = fam.getShades(tokens);
    const lightTokens = getMantineButtonTokens(shades, 'light' as MantineMode);
    const darkTokens = getMantineButtonTokens(shades, 'dark' as MantineMode);

    for (const variant of variants) {
      const codePrefix = `var(--color-component-button-${fam.shortName}-${variant}`;
      const namePrefix = `semantic/component/button/${fam.tokenName}/${variant}`;
      const l = lightTokens[variant];
      const d = darkTokens[variant];

      entries.push(
        {
          name: `${namePrefix}/background`,
          scopes: ['FRAME_FILL'],
          code: `${codePrefix}-background)`,
          light: valueToColorRef(l.background, fam.tokenName, shades),
          dark:  valueToColorRef(d.background, fam.tokenName, shades),
        },
        {
          name: `${namePrefix}/background-hover`,
          scopes: ['FRAME_FILL'],
          code: `${codePrefix}-background-hover)`,
          light: valueToColorRef(l.backgroundHover, fam.tokenName, shades),
          dark:  valueToColorRef(d.backgroundHover, fam.tokenName, shades),
        },
        {
          name: `${namePrefix}/background-active`,
          scopes: ['FRAME_FILL'],
          code: `${codePrefix}-background-active)`,
          light: valueToColorRef(l.backgroundActive, fam.tokenName, shades),
          dark:  valueToColorRef(d.backgroundActive, fam.tokenName, shades),
        },
        {
          name: `${namePrefix}/text`,
          scopes: ['TEXT_FILL'],
          code: `${codePrefix}-text)`,
          light: valueToColorRef(l.color, fam.tokenName, shades),
          dark:  valueToColorRef(d.color, fam.tokenName, shades),
        },
        {
          name: `${namePrefix}/icon`,
          scopes: ['SHAPE_FILL'],
          code: `${codePrefix}-icon)`,
          light: valueToColorRef(l.color, fam.tokenName, shades),
          dark:  valueToColorRef(d.color, fam.tokenName, shades),
        },
        {
          name: `${namePrefix}/border`,
          scopes: ['STROKE_COLOR'],
          code: `${codePrefix}-border)`,
          light: valueToColorRef(l.border, fam.tokenName, shades),
          dark:  valueToColorRef(d.border, fam.tokenName, shades),
        },
      );
    }
  }

  return entries;
}

// --- Builder ---------------------------------------------------------------

export function exportFigmaColorsAdvanced(tokens: DesignTokens): FigmaCollection {
  const primitives = buildPrimitives(tokens);
  const variables: FigmaVariable[] = [];
  const variableIds: string[] = [];

  // 1) Primitives â€” concrete RGBA values, identical in light and dark.
  const idByRef = new Map<string, string>();
  const rgbaByRef = new Map<string, FigmaRgba>();
  primitives.forEach((prim, idx) => {
    const id = `VariableID:p:${idx + 1}`;
    idByRef.set(prim.ref, id);
    const rgba = hexToFigmaRgba(prim.hex);
    rgbaByRef.set(prim.ref, rgba);
    variables.push({
      id,
      name: prim.name,
      description: '',
      type: 'COLOR',
      valuesByMode: { [LIGHT_MODE]: rgba, [DARK_MODE]: rgba },
      resolvedValuesByMode: {
        [LIGHT_MODE]: { resolvedValue: rgba, alias: null },
        [DARK_MODE]: { resolvedValue: rgba, alias: null },
      },
      scopes: [],
      hiddenFromPublishing: false,
      codeSyntax: { WEB: `var(--mantine-color-${prim.ref.replace(/\//g, '-')})` },
    });
    variableIds.push(id);
  });

  // 2) Semantic variables â€” alias to primitives when possible, raw RGBA otherwise.
  const allSemantics: SemanticEntry[] = [...SEMANTIC_MAP, ...buildButtonEntries(tokens)];
  allSemantics.forEach((entry, idx) => {
    const id = `VariableID:s:${idx + 1}`;
    const resolveSide = (side: ColorRef) => {
      if (side.kind === 'primitive') {
        const aliasId = idByRef.get(side.ref);
        const rgba = rgbaByRef.get(side.ref);
        if (!aliasId || !rgba) {
          throw new Error(`Unknown primitive reference: ${side.ref}`);
        }
        return {
          value: { type: 'VARIABLE_ALIAS' as const, id: aliasId },
          resolved: { resolvedValue: rgba, alias: aliasId, aliasName: `primitives/${side.ref}` },
        };
      }
      return { value: side.value, resolved: { resolvedValue: side.value, alias: null } };
    };

    const lightSide = resolveSide(entry.light);
    const darkSide = resolveSide(entry.dark);

    variables.push({
      id,
      name: entry.name,
      description: '',
      type: 'COLOR',
      valuesByMode: { [LIGHT_MODE]: lightSide.value, [DARK_MODE]: darkSide.value },
      resolvedValuesByMode: { [LIGHT_MODE]: lightSide.resolved, [DARK_MODE]: darkSide.resolved },
      scopes: entry.scopes,
      hiddenFromPublishing: false,
      codeSyntax: entry.code ? { WEB: entry.code } : {},
    });
    variableIds.push(id);
  });

  return {
    id: COLLECTION_ID,
    name: 'Color',
    modes: { [LIGHT_MODE]: 'Light', [DARK_MODE]: 'Dark' },
    variableIds,
    variables,
  };
}
