#!/usr/bin/env node
/**
 * Copies Elsewedy image from project root to public/assets/img/awardees/elsewedy-electric.png
 * Tries: newelsewedy.png, then ElsewedyElectric.png
 * Run from project root: node scripts/copy-elsewedy-image.js  OR  npm run copy-elsewedy
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const destDir = path.join(root, 'public', 'assets', 'img', 'awardees');
const dest = path.join(destDir, 'elsewedy-electric.png');

const candidates = ['newelsewedy.png', 'ElsewedyElectric.png'];
let src = null;
for (const name of candidates) {
  const p = path.join(root, name);
  if (fs.existsSync(p)) {
    src = p;
    break;
  }
}

if (!src) {
  console.error('No Elsewedy image found in project root. Tried:', candidates.join(', '));
  console.error('Root:', root);
  process.exit(1);
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(src, dest);
console.log('Copied', path.basename(src), '-> public/assets/img/awardees/elsewedy-electric.png');
