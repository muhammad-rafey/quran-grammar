import type { StudyData } from '@quran-grammar/core';
import { DATABASE_SCHEMA_VERSION } from './schema';
import { contentSha256 } from './rows';

/** One row describing which bundled content a database copy holds. */
export interface ContentVersion {
  database_schema_version: number;
  study_schema_version: number;
  content_sha256: string;
  source_commit: string;
  synced_at: string;
  surah_count: number;
  ayah_count: number;
  word_count: number;
}

export function contentVersion(
  studies: readonly StudyData[],
  sourceCommit: string,
  syncedAt: string,
): ContentVersion {
  return {
    database_schema_version: DATABASE_SCHEMA_VERSION,
    study_schema_version: 1,
    content_sha256: contentSha256(studies),
    source_commit: sourceCommit,
    synced_at: syncedAt,
    surah_count: studies.length,
    ayah_count: studies.reduce((total, study) => total + study.ayahs.length, 0),
    word_count: studies.reduce((total, study) => total + study.words.length, 0),
  };
}
