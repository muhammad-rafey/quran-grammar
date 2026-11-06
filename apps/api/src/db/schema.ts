/**
 * Relational schema for the study content, shared by SQLite and Postgres (Supabase).
 * The tables mirror StudyData exactly so a database can later replace the bundled data.
 * Every list keeps an explicit `position` so reading the rows back reproduces the original order.
 */
export type Dialect = 'sqlite' | 'postgres';

/** Postgres schema name; it is not exposed through the Supabase REST API. */
export const POSTGRES_SCHEMA = 'quran_grammar';

/** Increment when the table layout changes. */
export const DATABASE_SCHEMA_VERSION = 1;

/** Child tables first, so deletes and truncation never violate foreign keys. */
export const TABLES_CHILD_FIRST = [
  'phrase_words',
  'phrases',
  'verb_forms',
  'word_rules',
  'word_segments',
  'words',
  'roots',
  'rules',
  'ayahs',
  'surahs',
  'content_version',
] as const;

export function createTableStatements(dialect: Dialect): string[] {
  const p = dialect === 'postgres' ? `${POSTGRES_SCHEMA}.` : '';
  const text = 'text not null';
  return [
    `create table if not exists ${p}content_version (
  id integer primary key check (id = 1),
  database_schema_version integer not null,
  study_schema_version integer not null,
  content_sha256 text not null,
  source_commit text not null,
  synced_at text not null,
  surah_count integer not null,
  ayah_count integer not null,
  word_count integer not null
)`,
    `create table if not exists ${p}surahs (
  number integer primary key check (number between 1 and 114),
  name_urdu ${text},
  name_arabic ${text},
  ayah_count integer not null check (ayah_count > 0),
  word_count integer not null check (word_count > 0)
)`,
    `create table if not exists ${p}ayahs (
  surah integer not null references ${p}surahs (number) on delete cascade,
  number integer not null check (number > 0),
  translation_urdu ${text},
  theme_urdu ${text},
  tafsir_urdu ${text},
  primary key (surah, number)
)`,
    `create table if not exists ${p}rules (
  surah integer not null references ${p}surahs (number) on delete cascade,
  position integer not null,
  id ${text},
  title_urdu ${text},
  explanation_urdu ${text},
  example_urdu ${text},
  primary key (surah, id),
  unique (surah, position)
)`,
    `create table if not exists ${p}roots (
  surah integer not null references ${p}surahs (number) on delete cascade,
  position integer not null,
  root ${text},
  meaning_urdu ${text},
  note_urdu ${text},
  primary key (surah, root),
  unique (surah, position)
)`,
    `create table if not exists ${p}words (
  id text primary key,
  surah integer not null,
  ayah integer not null,
  position integer not null check (position > 0),
  arabic ${text},
  meaning_urdu ${text},
  pos text not null check (pos in ('noun', 'adjective', 'verb', 'particle', 'pronoun')),
  pos_urdu ${text},
  root text,
  lemma text,
  morphology_urdu ${text},
  syntax_urdu ${text},
  dictionary_urdu ${text},
  unique (surah, ayah, position),
  foreign key (surah, ayah) references ${p}ayahs (surah, number) on delete cascade,
  foreign key (surah, root) references ${p}roots (surah, root)
)`,
    `create table if not exists ${p}word_segments (
  word_id text not null references ${p}words (id) on delete cascade,
  position integer not null,
  arabic ${text},
  role_urdu ${text},
  meaning_urdu ${text},
  primary key (word_id, position)
)`,
    `create table if not exists ${p}word_rules (
  word_id text not null references ${p}words (id) on delete cascade,
  position integer not null,
  surah integer not null,
  rule_id ${text},
  primary key (word_id, position),
  unique (word_id, rule_id),
  foreign key (surah, rule_id) references ${p}rules (surah, id)
)`,
    `create table if not exists ${p}verb_forms (
  word_id text primary key references ${p}words (id) on delete cascade,
  surah integer not null,
  position integer not null,
  baab_urdu ${text},
  form_urdu ${text},
  past ${text},
  present ${text},
  pattern ${text},
  note_urdu ${text},
  unique (surah, position)
)`,
    `create table if not exists ${p}phrases (
  id text primary key,
  surah integer not null,
  ayah integer not null,
  position integer not null,
  label_urdu ${text},
  explanation_urdu ${text},
  unique (surah, ayah, position),
  foreign key (surah, ayah) references ${p}ayahs (surah, number) on delete cascade
)`,
    `create table if not exists ${p}phrase_words (
  phrase_id text not null references ${p}phrases (id) on delete cascade,
  position integer not null,
  word_id text not null references ${p}words (id),
  primary key (phrase_id, position)
)`,
    `create index if not exists words_root_idx on ${p}words (root)`,
    `create index if not exists word_rules_rule_idx on ${p}word_rules (surah, rule_id)`,
    `create index if not exists phrase_words_word_idx on ${p}phrase_words (word_id)`,
  ];
}
