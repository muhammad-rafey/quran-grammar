/** The single content_version row describing which bundled content a database copy holds. */
export interface ContentVersion {
  database_schema_version: number;
  study_schema_version: number;
  /** sha256 over the studies and the built grammar content (see apps/api/src/db/version.ts). */
  content_sha256: string;
  source_commit: string;
  synced_at: string;
  surah_count: number;
  ayah_count: number;
  word_count: number;
}
