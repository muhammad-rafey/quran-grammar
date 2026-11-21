import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { defaultFontIds, fontsForRole, readingFonts, resolveFont, type FontRole } from './fonts';

const root = new URL('../../../', import.meta.url);
const folders = ['apps/web/public/fonts/', 'apps/mobile/assets/fonts/'].map(
  (folder) => new URL(folder, root),
);
const roles: FontRole[] = ['quran', 'urdu'];

/** License text shipped next to each font file (folder-relative names). */
const licenseFiles: Readonly<Record<string, string>> = {
  'amiri-quran.ttf': 'OFL-Amiri.txt',
  'al-qalam-quran-majeed.ttf': 'LICENSE-AlQalamQuranMajeed.txt',
  'scheherazade-new.ttf': 'OFL-ScheherazadeNew.txt',
  'naskh.ttf': 'OFL-Naskh.txt',
  'nastaliq.ttf': 'OFL-Nastaliq.txt',
  'lateef.ttf': 'OFL-Lateef.txt',
};

test('every registry font file is bundled identically for web and mobile', () => {
  for (const file of new Set(readingFonts.map((font) => font.file))) {
    const [web, mobile] = folders.map((folder) => new URL(file, folder));
    assert.ok(existsSync(web), `missing web font ${file}`);
    assert.ok(existsSync(mobile), `missing mobile font ${file}`);
    const bytes = readFileSync(web);
    assert.ok(bytes.length > 1000, `${file} is not a font`);
    assert.ok(bytes.equals(readFileSync(mobile)), `${file} differs between web and mobile`);
    // TrueType (00 01 00 00) or CFF OpenType ('OTTO') outlines, matching the extension.
    const tag = bytes.subarray(0, 4).toString('latin1');
    assert.equal(tag === 'OTTO' ? '.otf' : '.ttf', file.slice(-4), `${file} extension`);
    if (tag !== 'OTTO') assert.equal(bytes.readUInt32BE(0), 0x00010000, `${file} signature`);
  }
});

test('every bundled font ships with its license text in both folders', () => {
  for (const font of readingFonts) {
    const license = licenseFiles[font.file];
    assert.ok(license, `no license file recorded for ${font.file}`);
    const texts = folders.map((folder) => readFileSync(new URL(license, folder), 'utf8'));
    assert.equal(texts[0], texts[1], `${license} differs between web and mobile`);
    if (font.license === 'OFL-1.1') {
      assert.match(texts[0], /SIL Open Font License, Version 1\.1/);
    } else {
      assert.ok(texts[0].includes(font.label), `${license} does not name ${font.label}`);
    }
  }
});

test('font ids are unique and each family names exactly one file', () => {
  assert.equal(new Set(readingFonts.map((font) => font.id)).size, readingFonts.length);
  const fileOf = new Map<string, string>();
  const familyOf = new Map<string, string>();
  for (const font of readingFonts) {
    assert.match(font.family, /^[A-Za-z][A-Za-z0-9]*$/, `${font.id} family is not PostScript-safe`);
    assert.equal(fileOf.get(font.family) ?? font.file, font.file, `${font.family} has two files`);
    assert.equal(
      familyOf.get(font.file) ?? font.family,
      font.family,
      `${font.file} has two families`,
    );
    fileOf.set(font.family, font.file);
    familyOf.set(font.file, font.family);
    const sameFamily = readingFonts.filter((other) => other.family === font.family);
    for (const other of sameFamily) assert.deepEqual(other.metrics, font.metrics);
  }
});

test('registry entries are complete and plausible', () => {
  for (const font of readingFonts) {
    assert.ok(font.label.trim() && font.labelUrdu.trim(), `${font.id} labels`);
    assert.ok(font.scale >= 0.6 && font.scale <= 1.6, `${font.id} scale`);
    const { ascent, descent, inkTop, inkBottom } = font.metrics;
    for (const value of [ascent, descent, inkTop, inkBottom]) assert.ok(value > 0 && value < 4);
    assert.equal(Boolean(font.coverageNote), Boolean(font.coverageNoteUrdu), `${font.id} notes`);
  }
});

test('each role has its default first, at least three fonts, and resolves stale ids', () => {
  for (const role of roles) {
    const fonts = fontsForRole(role);
    assert.ok(fonts.length >= 3, `${role} has ${fonts.length} fonts`);
    assert.equal(fonts[0]!.id, defaultFontIds[role]);
    assert.equal(fonts[0]!.coverageNote, undefined, `${role} default must cover all text`);
    assert.equal(resolveFont(role, 'no-such-font').id, defaultFontIds[role]);
    assert.equal(resolveFont(role, null).id, defaultFontIds[role]);
    for (const font of fonts) assert.equal(resolveFont(role, font.id), font);
  }
  // An id of the other role falls back instead of crossing roles.
  assert.equal(resolveFont('urdu', 'amiri-quran').id, defaultFontIds.urdu);
});

test('mobile font assets and web @font-face cover every registry family', () => {
  const families = [...new Set(readingFonts.map((font) => font.family))];
  const assets = readFileSync(new URL('apps/mobile/src/theme/font-assets.ts', root), 'utf8');
  const css = readFileSync(new URL('apps/web/src/fonts.css', root), 'utf8');
  for (const family of families) {
    const file = readingFonts.find((font) => font.family === family)!.file;
    assert.ok(
      assets.includes(`${family}: require('../../assets/fonts/${file}')`),
      `font-assets.ts lacks ${family}`,
    );
    const face = new RegExp(
      `font-family: '${family}';\\s*src: url\\('/fonts/${file.replace('.', '\\.')}'\\)`,
    );
    assert.match(css, face, `fonts.css lacks ${family}`);
  }
  assert.equal(css.match(/@font-face {/g)?.length, families.length);
});
