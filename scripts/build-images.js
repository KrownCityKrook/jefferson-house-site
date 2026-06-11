#!/usr/bin/env node
/* Jefferson House — responsive image pipeline.
   Reads img/ masters, emits img/opt/<name>-<w>.{avif,webp,jpg}.
   Run: node scripts/build-images.js  (requires `npm i --no-save sharp`) */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMG = path.join(__dirname, '..', 'img');
const OUT = path.join(IMG, 'opt');
fs.mkdirSync(OUT, { recursive: true });

// Photographic masters -> full responsive sets
const PHOTOS = [
  'hero-evening.jpg',
  'east-perspective.jpg',
  'gallery-east-front.jpg',
  'gallery-interior-courtyard.jpg',
  'gallery-south-jefferson.jpg',
  'gallery-southeast-corner.jpg',
  'render-83rd-ave.png',
  'floorplan-color.jpg',
];
const WIDTHS = [480, 800, 1200, 1600, 2000];

// Logos/PNGs -> single optimized webp+png pair at capped width
const GRAPHICS = [
  ['bird-full-transparent.png', 640],
  ['logo-script.png', 800],
  ['logo-lineart.png', 640],
  ['promo-shoplocal.png', 800],
];

(async () => {
  for (const file of PHOTOS) {
    const src = path.join(IMG, file);
    if (!fs.existsSync(src)) { console.warn('skip missing', file); continue; }
    const base = file.replace(/\.(jpe?g|png)$/i, '');
    const meta = await sharp(src).metadata();
    for (const w of WIDTHS) {
      if (w > meta.width) continue;
      const stem = path.join(OUT, `${base}-${w}`);
      await sharp(src).resize(w).avif({ quality: 55 }).toFile(`${stem}.avif`);
      await sharp(src).resize(w).webp({ quality: 74 }).toFile(`${stem}.webp`);
      await sharp(src).resize(w).jpeg({ quality: 78, mozjpeg: true }).toFile(`${stem}.jpg`);
    }
    // also a max-size set at native width if smaller than largest tier
    console.log('photo done:', base, `(master ${meta.width}px)`);
  }
  for (const [file, cap] of GRAPHICS) {
    const src = path.join(IMG, file);
    if (!fs.existsSync(src)) { console.warn('skip missing', file); continue; }
    const base = file.replace(/\.png$/i, '');
    const meta = await sharp(src).metadata();
    const w = Math.min(cap, meta.width);
    await sharp(src).resize(w).webp({ quality: 86, alphaQuality: 90 }).toFile(path.join(OUT, `${base}.webp`));
    await sharp(src).resize(w).png({ compressionLevel: 9, palette: true }).toFile(path.join(OUT, `${base}.png`));
    console.log('graphic done:', base);
  }
  // og image: 1200x630 crop of east-perspective
  await sharp(path.join(IMG, 'east-perspective.jpg'))
    .resize(1200, 630, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(path.join(OUT, 'og-image.jpg'));
  console.log('og-image done');
})();
