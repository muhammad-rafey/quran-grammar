import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Jimp from 'jimp-compact';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const mobile = resolve(root, 'apps/mobile/assets');
const web = resolve(root, 'apps/web/public/brand');
await mkdir(web, { recursive: true });

// Keep the approved full-canvas artwork as the source for both appearances.
const light = await Jimp.read(resolve(root, 'design/app-icons/19-book-only-light.png'));
const dark = await Jimp.read(resolve(root, 'design/app-icons/19-book-only-black.png'));
const resize = (image, size) => image.clone().resize(size, size, Jimp.RESIZE_BICUBIC);
await resize(light, 1024).writeAsync(resolve(mobile, 'icon.png'));
await resize(dark, 1024).writeAsync(resolve(mobile, 'icon-dark.png'));
await resize(light, 256).writeAsync(resolve(web, 'icon-light.png'));
await resize(dark, 256).writeAsync(resolve(web, 'icon-dark.png'));
await resize(light, 180).writeAsync(resolve(web, 'apple-touch-icon.png'));
await resize(light, 64).writeAsync(resolve(web, 'favicon-light.png'));
await resize(dark, 64).writeAsync(resolve(web, 'favicon-dark.png'));

// Separate the green mark from its ivory canvas for UI and adaptive-icon layers.
// The green-minus-red contrast distinguishes the mark from the neutral background;
// partial coverage at the edges keeps antialiasing without an ivory fringe.
const mark = light.clone();
mark.scan(0, 0, mark.bitmap.width, mark.bitmap.height, function (_x, _y, index) {
  const coverage = Math.max(0, Math.min(1, (this.bitmap.data[index + 1] - this.bitmap.data[index]) / 103));
  this.bitmap.data[index] = 4;
  this.bitmap.data[index + 1] = 107;
  this.bitmap.data[index + 2] = 73;
  this.bitmap.data[index + 3] = Math.round(coverage * 255);
});
await resize(mark, 256).writeAsync(resolve(web, 'logo.png'));
await resize(mark, 256).writeAsync(resolve(mobile, 'logo.png'));

// The complete mark fits within Android's central 66/108 safe circle, including
// the page tips. Both foreground and monochrome layers use identical geometry.
const adaptive = new Jimp(1024, 1024, 0x00000000);
adaptive.composite(resize(mark, 720), 152, 152);
await adaptive.writeAsync(resolve(mobile, 'android-icon-foreground.png'));
const monochrome = adaptive.clone();
monochrome.scan(0, 0, 1024, 1024, function (_x, _y, index) {
  this.bitmap.data[index] = 255;
  this.bitmap.data[index + 1] = 255;
  this.bitmap.data[index + 2] = 255;
});
await monochrome.writeAsync(resolve(mobile, 'android-icon-monochrome.png'));
console.log('Exported approved light, dark, web and Android adaptive icons.');
