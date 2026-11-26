// Al-Fatihah: original Urdu teaching draft (provenance in docs/content-provenance.md); the lesson
// data lives in packages/core/data/lessons/surah-1.json with every other chapter.
import { getStudy } from './registry';
import type { StudyData } from './types';

export const fatihahStudy: StudyData = getStudy(1)!;
