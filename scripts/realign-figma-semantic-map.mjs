// Rebuild SEMANTIC_MAP in src/lib/figma-color-export.ts from the canonical
// dump in C:\Users\Felipe\Desktop\semantic-ts.txt, applying the Mantine/Preview
// shade convention (primaryShade=5).

import { readFileSync, writeFileSync } from 'node:fs';

const target = 'src/lib/figma-color-export.ts';
const sourceTxt = 'C:/Users/Felipe/Desktop/semantic-ts.txt';

// Load source entries (one per line).
const original = readFileSync(sourceTxt, 'utf8').replace(/\r\n/g, '\n').trimEnd();
let lines = original.split('\n');

// Fix code typos like 'ar(--color-...' -> 'var(--color-...'
lines = lines.map((l) =>
  l
    .replace(/code: 'ar\(/g, "code: 'var(")
    .replace(/code: 'var\(--color-component-menu-background',/g, "code: 'var(--color-component-menu-background)',")
    .replace(/code: 'var\(--color-component-menu-item-hover',/g, "code: 'var(--color-component-menu-item-hover)',")
    .replace(/code: 'var\(--color-action-secondary-default',/g, "code: 'var(--color-action-secondary-default)',"),
);

// Helper: rewrite the `light: p('grp/N'), dark: p('grp/M')` portion of a line.
function setShades(line, lightShade, darkShade) {
  return line.replace(
    /light: p\('([\w/]+)\/\d+'\), dark: p\('([\w/]+)\/\d+'\)/,
    (_m, lg, dg) => `light: p('${lg}/${lightShade}'), dark: p('${dg}/${darkShade}')`,
  );
}

const FAM_RX = /(brand|accent|tertiary|feedback\/(?:success|error|warning|info))/;

let changes = 0;
const out = lines.map((line) => {
  const nameMatch = line.match(/name: '([^']+)'/);
  if (!nameMatch) return line;
  const name = nameMatch[1];
  const path = name.replace(/^semantic\//, '');

  // Buttons: semantic/component/button/{family}/{variant}/{slot}
  const btn = path.match(new RegExp(`^component/button/${FAM_RX.source}/(filled|light|outline|subtle)/(.+)$`));
  if (btn) {
    const variant = btn[2];
    const slot = btn[3];

    if (variant === 'filled') {
      if (slot === 'background' || slot === 'border') {
        const next = setShades(line, 5, 5);
        if (next !== line) { changes++; return next; }
      } else if (slot === 'background-hover') {
        const next = setShades(line, 6, 4);
        if (next !== line) { changes++; return next; }
      } else if (slot === 'background-active') {
        const next = setShades(line, 7, 3);
        if (next !== line) { changes++; return next; }
      }
      return line;
    }
    if (variant === 'light') {
      if (slot === 'text' || slot === 'icon') {
        const next = setShades(line, 6, 3);
        if (next !== line) { changes++; return next; }
      } else if (slot === 'border') {
        const next = setShades(line, 5, 5);
        if (next !== line) { changes++; return next; }
      }
      return line;
    }
    if (variant === 'outline') {
      if (slot === 'border') {
        const next = setShades(line, 5, 5);
        if (next !== line) { changes++; return next; }
      } else if (slot === 'text' || slot === 'icon') {
        const next = setShades(line, 6, 3);
        if (next !== line) { changes++; return next; }
      }
      return line;
    }
    if (variant === 'subtle') {
      if (slot === 'text' || slot === 'icon') {
        const next = setShades(line, 6, 3);
        if (next !== line) { changes++; return next; }
      } else if (slot === 'text-active' || slot === 'icon-active') {
        const next = setShades(line, 7, 3);
        if (next !== line) { changes++; return next; }
      }
      return line;
    }
  }

  if (path === 'action/primary/default') { changes++; return setShades(line, 5, 5); }
  if (path === 'action/primary/hover')   { changes++; return setShades(line, 6, 4); }
  if (path === 'action/primary/active')  { changes++; return setShades(line, 7, 3); }

  if (/^text\/(brand|accent|tertiary)$/.test(path)) {
    const next = setShades(line, 6, 3);
    if (next !== line) { changes++; return next; }
    return line;
  }
  if (/^icon\/(brand|accent|tertiary|success|warning|error|info)$/.test(path)) {
    const next = setShades(line, 6, 3);
    if (next !== line) { changes++; return next; }
    return line;
  }
  if (/^border\/(brand|accent|tertiary|error|success|warning|info|focus)$/.test(path)) {
    const next = setShades(line, 5, 5);
    if (next !== line) { changes++; return next; }
    return line;
  }
  if (path === 'component/input/border-focus' ||
      path === 'component/input/icon-error' ||
      path === 'component/input/placeholder-error') {
    const next = setShades(line, 5, 5);
    if (next !== line) { changes++; return next; }
    return line;
  }

  const fb = path.match(/^feedback\/(success|error|warning|info)\/(text|icon|border)$/);
  if (fb) {
    if (fb[2] === 'border') {
      const next = setShades(line, 5, 5);
      if (next !== line) { changes++; return next; }
    } else {
      const next = setShades(line, 6, 3);
      if (next !== line) { changes++; return next; }
    }
    return line;
  }

  if (/^component\/progress\/fill\/(brand|accent|tertiary|success|error|warning|info)$/.test(path)) {
    const next = setShades(line, 5, 5);
    if (next !== line) { changes++; return next; }
    return line;
  }
  if (/^background\/(brand|accent|tertiary)\/default$/.test(path)) {
    const next = setShades(line, 5, 5);
    if (next !== line) { changes++; return next; }
    return line;
  }
  if (path === 'component/chip/selected-text') {
    const next = setShades(line, 6, 3);
    if (next !== line) { changes++; return next; }
    return line;
  }

  return line;
});

const newSemanticMapBody = out.join('\n');

// Splice into figma-color-export.ts: replace lines from `const SEMANTIC_MAP...[`
// (exclusive of the `[` line) up to (exclusive of) the closing `];`.
const tgt = readFileSync(target, 'utf8').replace(/\r\n/g, '\n');
const tgtLines = tgt.split('\n');

const startIdx = tgtLines.findIndex((l) => l.includes('const SEMANTIC_MAP: SemanticEntry[] = ['));
if (startIdx === -1) throw new Error('SEMANTIC_MAP start not found');
let endIdx = -1;
for (let i = startIdx + 1; i < tgtLines.length; i++) {
  if (tgtLines[i].trim() === '];') { endIdx = i; break; }
}
if (endIdx === -1) throw new Error('SEMANTIC_MAP end not found');

const before = tgtLines.slice(0, startIdx + 1);
const after = tgtLines.slice(endIdx);
const rebuilt = [...before, newSemanticMapBody, ...after].join('\n');

writeFileSync(target, rebuilt, 'utf8');
console.log(`Rebuilt SEMANTIC_MAP (${out.length} entries). Realignments applied: ${changes}.`);
