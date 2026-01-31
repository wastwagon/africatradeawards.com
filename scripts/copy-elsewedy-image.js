#!/usr/bin/env node
/**
 * Copies ElsewedyElectric.png from project root to public/assets/img/awardees/elsewedy-electric.png
 * Run from project root: node scripts/copy-elsewedy-image.js
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'ElsewedyElectric.png');
const destDir = path.join(root, 'public', 'assets', 'img', 'awardees');
const dest = path.join(destDir, 'elsewedy-electric.png');

if (!fs.existsSync(src)) {
  console.error('ElsewedyElectric.png not found in project root:', root);
  process.exit(1);
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(src, dest);
console.log('Copied ElsewedyElectric.png -> public/assets/img/awardees/elsewedy-electric.png');
