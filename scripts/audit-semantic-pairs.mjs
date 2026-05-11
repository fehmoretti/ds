// Audit: extract all entries from SEMANTIC_MAP and find pairs where the
// background is identical in both modes but a related text/icon/border isn't.

import { readFileSync } from 'node:fs';

const src = readFileSync('src/lib/figma-color-export.ts', 'utf8');
const re = /\{ name: '([^']+)', scopes: \[[^\]]*\], code: '[^']*', light: (p\('[\w/]+'\)|\{[^}]+\}), dark: (p\('[\w/]+'\)|\{[^}]+\}) \},/g;

const entries = [];
let m;
while ((m = re.exec(src)) !== null) {
  entries.push({ name: m[1], light: m[2], dark: m[3] });
}
console.log(`Parsed ${entries.length} entries.`);

const byName = new Map(entries.map((e) => [e.name, e]));

// For each entry whose name ends in /background and is identical light==dark,
// check sibling text/icon/border under the same prefix (strip last segment).
const issues = [];
for (const e of entries) {
  const parts = e.name.split('/');
  const last = parts[parts.length - 1];
  if (!/^(background|default)$/.test(last)) continue;
  if (e.light !== e.dark) continue; // bg differs by mode → skip

  const prefix = parts.slice(0, -1).join('/');
  for (const sibling of ['text', 'icon', 'border']) {
    const sibName = `${prefix}/${sibling}`;
    const sib = byName.get(sibName);
    if (!sib) continue;
    if (sib.light !== sib.dark) {
      issues.push({ bg: e.name, bgVal: e.light, sib: sibName, sibLight: sib.light, sibDark: sib.dark });
    }
  }
}

if (issues.length === 0) {
  console.log('OK — every fixed-bg slot has matching fixed text/icon/border in both modes.');
} else {
  console.log(`Found ${issues.length} potential inconsistency(ies):`);
  for (const i of issues) {
    console.log(`  - ${i.sib} (light=${i.sibLight} dark=${i.sibDark}) sits on ${i.bg} (${i.bgVal} both modes)`);
  }
}
