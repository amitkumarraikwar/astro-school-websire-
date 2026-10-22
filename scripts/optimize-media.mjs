import { readdir, mkdir, stat } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import sharp from 'sharp';

const root = new URL('../public/', import.meta.url).pathname;

async function imageFiles(directory) {
  return (await readdir(directory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && /\.(jpe?g|png|webp)$/i.test(entry.name))
    .map((entry) => join(directory, entry.name));
}

async function optimize(source, destination, options) {
  await sharp(source)
    .rotate()
    .resize(options.resize)
    .webp({ quality: options.quality, effort: 4, smartSubsample: true })
    .toFile(destination);
}

async function optimizeDirectory(sourceDirectory, destinationDirectory, options) {
  await mkdir(destinationDirectory, { recursive: true });
  const sources = await imageFiles(sourceDirectory);
  for (const source of sources) {
    const destination = join(destinationDirectory, `${basename(source, extname(source))}.webp`);
    await optimize(source, destination, options);
  }
  return sources.length;
}

const classes = await optimizeDirectory(
  join(root, 'classes'),
  join(root, 'optimized/classes'),
  { resize: { width: 1600, withoutEnlargement: true }, quality: 72 },
);
const events = await optimizeDirectory(
  join(root, 'EVENTS'),
  join(root, 'optimized/events'),
  { resize: { width: 1200, withoutEnlargement: true }, quality: 72 },
);
const staff = await optimizeDirectory(
  join(root, 'STAFF_FINAL_PICS_PRO_HD_ENHANCED'),
  join(root, 'STAFF_FINAL_PICS_OPTIMIZED'),
  { resize: { width: 448, height: 448, fit: 'cover', position: 'top' }, quality: 70 },
);

const logoDestination = join(root, 'optimized/logo.webp');
await mkdir(join(root, 'optimized'), { recursive: true });
await optimize(join(root, 'Mppublic_logo.jpeg'), logoDestination, {
  resize: { width: 192, height: 192, fit: 'cover' },
  quality: 78,
});

console.log(JSON.stringify({ classes, events, staff, logoBytes: (await stat(logoDestination)).size }, null, 2));
