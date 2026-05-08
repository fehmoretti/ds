/**
 * Generates Figma Variables JSON format for colors.
 * Matches the structure from the Figma export: colors.json
 */
import type { DesignTokens, ColorPalette } from '@/types';
import { hexToFigmaRgba, hexToRgb } from './color-utils';

interface FigmaVariable {
  id: string;
  name: string;
  description: string;
  type: string;
  valuesByMode: Record<string, unknown>;
  resolvedValuesByMode: Record<string, unknown>;
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

function generateColorVariables(
  palette: ColorPalette,
  groupName: string,
  startId: number,
  lightModeId: string,
  darkModeId: string,
): FigmaVariable[] {
  return palette.shades.map((hex, index) => {
    const rgba = hexToFigmaRgba(hex);
    const varId = `VariableID:1:${startId + index}`;
    return {
      id: varId,
      name: `primitives/${groupName}/${index}`,
      description: '',
      type: 'COLOR',
      valuesByMode: {
        [lightModeId]: rgba,
        [darkModeId]: rgba,
      },
      resolvedValuesByMode: {
        [lightModeId]: { resolvedValue: rgba, alias: null },
        [darkModeId]: { resolvedValue: rgba, alias: null },
      },
      scopes: [],
      hiddenFromPublishing: false,
      codeSyntax: {
        WEB: `var(--mantine-color-${groupName}-${index})`,
      },
    };
  });
}

export function exportColorsToFigma(tokens: DesignTokens): FigmaCollection {
  const lightModeId = '3:0';
  const darkModeId = '3:1';

  const variables: FigmaVariable[] = [];
  const variableIds: string[] = [];

  let idCounter = 1;

  // Brand colors (0-9)
  const brandVars = generateColorVariables(tokens.colors.brand, 'brand', idCounter, lightModeId, darkModeId);
  variables.push(...brandVars);
  idCounter += 10;

  // Accent colors (10-19)
  const accentVars = generateColorVariables(tokens.colors.accent, 'accent', idCounter, lightModeId, darkModeId);
  variables.push(...accentVars);
  idCounter += 10;

  // Tertiary colors (20-29)
  const tertiaryVars = generateColorVariables(tokens.colors.tertiary, 'tertiary', idCounter, lightModeId, darkModeId);
  variables.push(...tertiaryVars);
  idCounter += 10;

  // Gray colors (30-39)
  const grayVars = generateColorVariables(tokens.colors.gray, 'gray', idCounter, lightModeId, darkModeId);
  variables.push(...grayVars);
  idCounter += 10;

  // Feedback colors
  const feedbackColors = [
    { key: 'error', palette: tokens.colors.feedback.error },
    { key: 'success', palette: tokens.colors.feedback.success },
    { key: 'warning', palette: tokens.colors.feedback.warning },
    { key: 'info', palette: tokens.colors.feedback.info },
  ] as const;

  for (const { key, palette } of feedbackColors) {
    const vars = generateColorVariables(palette, `feedback/${key}`, idCounter, lightModeId, darkModeId);
    variables.push(...vars);
    idCounter += 10;
  }

  variables.forEach((v) => variableIds.push(v.id));

  return {
    id: 'VariableCollectionId:3:84',
    name: 'Color',
    modes: {
      [lightModeId]: 'Light',
      [darkModeId]: 'Dark',
    },
    variableIds,
    variables,
  };
}

export function exportRadiusToFigma(tokens: DesignTokens): FigmaCollection {
  const modeId = '3:0';
  const variables: FigmaVariable[] = [];
  const variableIds: string[] = [];

  let idCounter = 1;

  // Base radius scale
  const scaleEntries: [string, number][] = [
    ['radius-none', tokens.radius.scale.none],
    ['radius-xs', tokens.radius.scale.xs],
    ['radius-sm', tokens.radius.scale.sm],
    ['radius-md', tokens.radius.scale.md],
    ['radius-lg', tokens.radius.scale.lg],
    ['radius-xl', tokens.radius.scale.xl],
    ['radius-full', tokens.radius.scale.full],
  ];

  const scaleVarIds: Record<string, string> = {};

  for (const [name, value] of scaleEntries) {
    const varId = `VariableID:3:${idCounter}`;
    scaleVarIds[name] = varId;
    variables.push({
      id: varId,
      name,
      description: '',
      type: 'FLOAT',
      valuesByMode: { [modeId]: value },
      resolvedValuesByMode: {
        [modeId]: { resolvedValue: value, alias: null },
      },
      scopes: ['CORNER_RADIUS'],
      hiddenFromPublishing: false,
      codeSyntax: { WEB: `var(--${name})` },
    });
    variableIds.push(varId);
    idCounter++;
  }

  // Component radius (aliases)
  const componentEntries: [string, keyof typeof tokens.radius.scale][] = [
    ['component/button', tokens.radius.components.button],
    ['component/input', tokens.radius.components.input],
    ['component/card', tokens.radius.components.card],
    ['component/modal', tokens.radius.components.modal],
    ['component/badge', tokens.radius.components.badge],
    ['component/pill', tokens.radius.components.pill],
  ];

  for (const [name, scaleKey] of componentEntries) {
    const aliasName = `radius-${scaleKey}`;
    const aliasId = scaleVarIds[aliasName] ?? '';
    const resolvedValue = tokens.radius.scale[scaleKey];
    const varId = `VariableID:3:${idCounter}`;

    variables.push({
      id: varId,
      name,
      description: '',
      type: 'FLOAT',
      valuesByMode: {
        [modeId]: { type: 'VARIABLE_ALIAS', id: aliasId },
      },
      resolvedValuesByMode: {
        [modeId]: { resolvedValue, alias: aliasId, aliasName },
      },
      scopes: ['CORNER_RADIUS'],
      hiddenFromPublishing: false,
      codeSyntax: { WEB: `var(--radius-${name.replace('/', '-')})` },
    });
    variableIds.push(varId);
    idCounter++;
  }

  return {
    id: 'VariableCollectionId:3:0',
    name: 'Radius',
    modes: { [modeId]: 'Radius' },
    variableIds,
    variables,
  };
}

export function exportSpacingToFigma(tokens: DesignTokens): FigmaCollection {
  const modeId = '107:3';
  const variables: FigmaVariable[] = [];
  const variableIds: string[] = [];

  const entries: [string, number][] = [
    ['none', tokens.spacing.none],
    ['2xs', tokens.spacing['2xs']],
    ['xs', tokens.spacing.xs],
    ['sm', tokens.spacing.sm],
    ['md', tokens.spacing.md],
    ['lg', tokens.spacing.lg],
    ['xl', tokens.spacing.xl],
    ['2xl', tokens.spacing['2xl']],
  ];

  let idCounter = 147;

  for (const [name, value] of entries) {
    const varId = `VariableID:107:${idCounter}`;
    variables.push({
      id: varId,
      name,
      description: '',
      type: 'FLOAT',
      valuesByMode: { [modeId]: value },
      resolvedValuesByMode: {
        [modeId]: { resolvedValue: value, alias: null },
      },
      scopes: ['WIDTH_HEIGHT', 'GAP'],
      hiddenFromPublishing: false,
      codeSyntax: { WEB: `var(--spacing-${name})` },
    });
    variableIds.push(varId);
    idCounter++;
  }

  return {
    id: 'VariableCollectionId:107:146',
    name: 'Spacing',
    modes: { [modeId]: 'Default' },
    variableIds,
    variables,
  };
}

export function exportTypographyToFigma(tokens: DesignTokens): FigmaCollection {
  const modeId = '4:0';
  const variables: FigmaVariable[] = [];
  const variableIds: string[] = [];

  let idCounter = 1;

  // Font families
  const families: [string, string][] = [
    ['Typeface/Family/font-family-base', tokens.typography.fonts.base],
    ['Typeface/Family/font-family-mono', tokens.typography.fonts.mono],
  ];

  for (const [name, value] of families) {
    const varId = `VariableID:4:${idCounter}`;
    variables.push({
      id: varId,
      name,
      description: '',
      type: 'STRING',
      valuesByMode: { [modeId]: value },
      resolvedValuesByMode: {
        [modeId]: { resolvedValue: value, alias: null },
      },
      scopes: ['FONT_FAMILY'],
      hiddenFromPublishing: false,
      codeSyntax: {},
    });
    variableIds.push(varId);
    idCounter++;
  }

  // Font sizes
  const sizes: [string, number][] = Object.entries(tokens.typography.sizes).map(
    ([key, value]) => [`Typeface/Size/${key}`, value],
  );

  for (const [name, value] of sizes) {
    const varId = `VariableID:4:${idCounter}`;
    variables.push({
      id: varId,
      name,
      description: '',
      type: 'FLOAT',
      valuesByMode: { [modeId]: value },
      resolvedValuesByMode: {
        [modeId]: { resolvedValue: value, alias: null },
      },
      scopes: ['FONT_SIZE'],
      hiddenFromPublishing: false,
      codeSyntax: {},
    });
    variableIds.push(varId);
    idCounter++;
  }

  // Font weights
  const weights: [string, number][] = [
    ['Typeface/Weight/font-weight-regular', tokens.typography.weights.regular],
    ['Typeface/Weight/font-weight-medium', tokens.typography.weights.medium],
    ['Typeface/Weight/font-weight-bold', tokens.typography.weights.bold],
  ];

  for (const [name, value] of weights) {
    const varId = `VariableID:4:${idCounter}`;
    variables.push({
      id: varId,
      name,
      description: '',
      type: 'FLOAT',
      valuesByMode: { [modeId]: value },
      resolvedValuesByMode: {
        [modeId]: { resolvedValue: value, alias: null },
      },
      scopes: ['FONT_WEIGHT'],
      hiddenFromPublishing: false,
      codeSyntax: {},
    });
    variableIds.push(varId);
    idCounter++;
  }

  return {
    id: 'VariableCollectionId:4:0',
    name: 'Typography',
    modes: { [modeId]: 'Default' },
    variableIds,
    variables,
  };
}

export function exportShadowsToFigma(tokens: DesignTokens): FigmaCollection {
  const lightModeId = '344:3';
  const darkModeId = '344:4';
  const variables: FigmaVariable[] = [];
  const variableIds: string[] = [];

  let idCounter = 118;

  // Shadow colors derived from primitive palettes (shade 6 = main color)
  const shadowColorPalettes: [string, ColorPalette][] = [
    ['brand', tokens.colors.brand],
    ['accent', tokens.colors.accent],
    ['tertiary', tokens.colors.tertiary],
    ['success', tokens.colors.feedback.success],
    ['error', tokens.colors.feedback.error],
    ['warning', tokens.colors.feedback.warning],
    ['info', tokens.colors.feedback.info],
  ];

  for (const [name, palette] of shadowColorPalettes) {
    const hex = palette.shades[6] ?? palette.baseHex;
    const rgb = hexToRgb(hex);
    const varId = `VariableID:344:${idCounter}`;

    variables.push({
      id: varId,
      name: `color/${name}`,
      description: `Shadow color derived from ${name} primitive`,
      type: 'COLOR',
      valuesByMode: {
        [lightModeId]: { r: rgb.r, g: rgb.g, b: rgb.b, a: 0.2 },
        [darkModeId]: { r: rgb.r, g: rgb.g, b: rgb.b, a: 0.4 },
      },
      resolvedValuesByMode: {
        [lightModeId]: { resolvedValue: { r: rgb.r, g: rgb.g, b: rgb.b, a: 0.2 }, alias: null },
        [darkModeId]: { resolvedValue: { r: rgb.r, g: rgb.g, b: rgb.b, a: 0.4 }, alias: null },
      },
      scopes: ['EFFECT_COLOR'],
      hiddenFromPublishing: false,
      codeSyntax: {},
    });
    variableIds.push(varId);
    idCounter++;
  }

  // Shadow color — neutral
  variables.push({
    id: `VariableID:344:${idCounter}`,
    name: 'color/neutral',
    description: '',
    type: 'COLOR',
    valuesByMode: {
      [lightModeId]: { r: 0, g: 0, b: 0, a: 0.25 },
      [darkModeId]: { r: 0, g: 0, b: 0, a: 0.625 },
    },
    resolvedValuesByMode: {
      [lightModeId]: { resolvedValue: { r: 0, g: 0, b: 0, a: 0.25 }, alias: null },
      [darkModeId]: { resolvedValue: { r: 0, g: 0, b: 0, a: 0.625 }, alias: null },
    },
    scopes: ['EFFECT_COLOR'],
    hiddenFromPublishing: false,
    codeSyntax: {},
  });
  variableIds.push(`VariableID:344:${idCounter}`);
  idCounter++;

  // Shadow levels
  const levels: [string, { x: number; y: number; blur: number; spread: number }][] = [
    ['xs', tokens.shadows.xs],
    ['sm', tokens.shadows.sm],
    ['md', tokens.shadows.md],
    ['lg', tokens.shadows.lg],
    ['xl', tokens.shadows.xl],
  ];

  for (const [name, shadow] of levels) {
    const props: [string, number][] = [
      [`${name}/X`, shadow.x],
      [`${name}/Y`, shadow.y],
      [`${name}/Blur`, shadow.blur],
      [`${name}/Spread`, shadow.spread],
    ];

    for (const [propName, value] of props) {
      const varId = `VariableID:344:${idCounter}`;
      variables.push({
        id: varId,
        name: propName,
        description: '',
        type: 'FLOAT',
        valuesByMode: {
          [lightModeId]: value,
          [darkModeId]: value,
        },
        resolvedValuesByMode: {
          [lightModeId]: { resolvedValue: value, alias: null },
          [darkModeId]: { resolvedValue: value, alias: null },
        },
        scopes: ['EFFECT_FLOAT'],
        hiddenFromPublishing: false,
        codeSyntax: {},
      });
      variableIds.push(varId);
      idCounter++;
    }
  }

  return {
    id: 'VariableCollectionId:344:117',
    name: 'Shadow',
    modes: {
      [lightModeId]: 'Light',
      [darkModeId]: 'Dark',
    },
    variableIds,
    variables,
  };
}
