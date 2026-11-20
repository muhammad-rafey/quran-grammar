import { createHash } from 'node:crypto';
import type { GrammarContent, StudyData } from '@quran-grammar/core';
import { DATABASE_SCHEMA_VERSION, type ContentVersion } from '@quran-grammar/core/db';

export type { ContentVersion };

/** Stable fingerprint of the bundled studies and grammar content; recorded with every sync. */
export function contentSha256(studies: readonly StudyData[], grammar: GrammarContent): string {
  return createHash('sha256')
    .update(JSON.stringify(studies))
    .update('\n')
    .update(JSON.stringify(grammar))
    .digest('hex');
}

export function contentVersion(
  studies: readonly StudyData[],
  grammar: GrammarContent,
  sourceCommit: string,
  syncedAt: string,
): ContentVersion {
  return {
    database_schema_version: DATABASE_SCHEMA_VERSION,
    study_schema_version: 1,
    content_sha256: contentSha256(studies, grammar),
    source_commit: sourceCommit,
    synced_at: syncedAt,
    surah_count: studies.length,
    ayah_count: studies.reduce((total, study) => total + study.ayahs.length, 0),
    word_count: studies.reduce((total, study) => total + study.words.length, 0),
  };
}
