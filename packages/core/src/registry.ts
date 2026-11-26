import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { availableSurahNumbers } from './availability';
import type { StudyData } from './types';

/**
 * Lesson JSON directory (`packages/core/data/lessons`, built by content-pipeline/full-quran).
 * The API bundle carries a copy next to dist/server.js; QG_LESSONS_DIR overrides both.
 */
function lessonsDirectory(): string {
  const candidates = [
    process.env.QG_LESSONS_DIR,
    fileURLToPath(new URL('../data/lessons/', import.meta.url)),
    fileURLToPath(new URL('./data/lessons/', import.meta.url)),
  ];
  const found = candidates.find((dir) => dir && existsSync(`${dir}/surah-1.json`));
  if (!found) throw new Error('Lesson data not found (packages/core/data/lessons)');
  return found;
}

function loadStudies(): StudyData[] {
  const dir = lessonsDirectory();
  return availableSurahNumbers.map(
    (number) => JSON.parse(readFileSync(`${dir}/surah-${number}.json`, 'utf8')) as StudyData,
  );
}

/** Complete locally bundled study editions, in Surah order. */
export const studies: readonly StudyData[] = loadStudies();

export function getStudy(surahNumber: number): StudyData | undefined {
  return studies.find((study) => study.surah.number === surahNumber);
}
