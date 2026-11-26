/**
 * ContentRepository over any SQL driver (node:sqlite, expo-sqlite, pg). Only portable SQL is
 * used; the dialect decides placeholders (`?` vs `$1`) and the Postgres schema prefix.
 */
import type { GrammarTopicSummary } from '../grammar/types';
import { toResolvedExample, toTopicDetail, toTopicSummary } from '../grammar/resolve';
import type { PracticeQuestion } from '../practice';
import type { ContentRepository, PracticeQuestionFilter, SurahSummary } from '../repository';
import type { StudyData } from '../types';
import type { ContentRows, GrammarRows } from './grammar-rows';
import { rowsToQuestions, topicRowToRecord } from './grammar-rows';
import { rowsToStudies, type StudyRows } from './rows';
import { POSTGRES_SCHEMA, type Dialect } from './schema';
import type { ContentVersion } from './version';

export type SqlValue = string | number | null;

/** Runs one read-only statement and returns plain row objects keyed by column name. */
export interface SqlExecutor {
  all(sql: string, params: readonly SqlValue[]): Promise<Record<string, unknown>[]>;
}

/** Every SQL statement the repositories run, for one dialect. Each takes at most one parameter. */
export function contentQueries(dialect: Dialect) {
  const t = (table: string) => (dialect === 'postgres' ? `${POSTGRES_SCHEMA}.${table}` : table);
  const p = dialect === 'postgres' ? '$1' : '?';
  return {
    contentVersion: `select database_schema_version, study_schema_version, content_sha256, source_commit, synced_at, surah_count, ayah_count, word_count from ${t('content_version')} where id = 1`,
    surahs: `select number, name_urdu, name_arabic, ayah_count, word_count from ${t('surahs')} order by number`,
    study: {
      /** Not per Surah: run without a parameter. */
      translations: `select * from ${t('translations')} order by position`,
      surahs: `select * from ${t('surahs')} where number = ${p}`,
      ayahs: `select * from ${t('ayahs')} where surah = ${p} order by number`,
      ayah_translations: `select * from ${t('ayah_translations')} where surah = ${p} order by ayah, position`,
      rules: `select * from ${t('rules')} where surah = ${p} order by position`,
      roots: `select * from ${t('roots')} where surah = ${p} order by position`,
      words: `select * from ${t('words')} where surah = ${p} order by ayah, position`,
      word_segments: `select s.* from ${t('word_segments')} s join ${t('words')} w on w.id = s.word_id where w.surah = ${p} order by s.word_id, s.position`,
      word_rules: `select * from ${t('word_rules')} where surah = ${p} order by word_id, position`,
      verb_forms: `select * from ${t('verb_forms')} where surah = ${p} order by position`,
      phrases: `select * from ${t('phrases')} where surah = ${p} order by ayah, position`,
      phrase_words: `select pw.* from ${t('phrase_words')} pw join ${t('phrases')} ph on ph.id = pw.phrase_id where ph.surah = ${p} order by pw.phrase_id, pw.position`,
    } satisfies Record<keyof StudyRows, string>,
    topics: `select t.id, t.position, t.title_urdu, t.title_english, t.summary_urdu, t.explanation_urdu, t.occurrence_count, (select cast(count(*) as integer) from ${t('practice_questions')} q where q.topic_id = t.id) as question_count from ${t('grammar_topics')} t order by t.position`,
    topic: `select t.id, t.position, t.title_urdu, t.title_english, t.summary_urdu, t.explanation_urdu, t.occurrence_count, (select cast(count(*) as integer) from ${t('practice_questions')} q where q.topic_id = t.id) as question_count from ${t('grammar_topics')} t where t.id = ${p}`,
    topicPoints: `select topic_id, position, text_urdu from ${t('grammar_topic_points')} where topic_id = ${p} order by position`,
    topicExamples: `select e.kind, e.position, e.word_id, e.note_urdu, w.surah, w.ayah, w.arabic, w.meaning_urdu from ${t('grammar_topic_examples')} e join ${t('words')} w on w.id = e.word_id where e.topic_id = ${p} order by e.kind, e.position`,
    topicExampleTranslations: `select distinct a.surah, a.ayah, a.position, a.translation_id, a.text from ${t('grammar_topic_examples')} e join ${t('words')} x on x.id = e.word_id join ${t('ayah_translations')} a on a.surah = x.surah and a.ayah = x.ayah where e.topic_id = ${p} order by a.surah, a.ayah, a.position`,
    topicExampleAyahWords: `select distinct w.surah, w.ayah, w.position, w.arabic from ${t('grammar_topic_examples')} e join ${t('words')} x on x.id = e.word_id join ${t('words')} w on w.surah = x.surah and w.ayah = x.ayah where e.topic_id = ${p} order by w.surah, w.ayah, w.position`,
    topicQuestions: `select id, position, topic_id, kind, prompt_urdu, correct_option_id, explanation_urdu, word_id from ${t('practice_questions')} where topic_id = ${p} order by position`,
    topicOptions: `select o.question_id, o.position, o.id, o.text, o.language from ${t('practice_options')} o join ${t('practice_questions')} q on q.id = o.question_id where q.topic_id = ${p} order by q.position, o.position`,
    kindQuestions: `select id, position, topic_id, kind, prompt_urdu, correct_option_id, explanation_urdu, word_id from ${t('practice_questions')} where kind = ${p} order by position`,
    kindOptions: `select o.question_id, o.position, o.id, o.text, o.language from ${t('practice_options')} o join ${t('practice_questions')} q on q.id = o.question_id where q.kind = ${p} order by q.position, o.position`,
  };
}

const int = (value: unknown) => Number(value);

/** Read the content_version row (null when the table is empty). */
export async function readContentVersion(
  executor: SqlExecutor,
  dialect: Dialect,
): Promise<ContentVersion | null> {
  const [row] = await executor.all(contentQueries(dialect).contentVersion, []);
  if (!row) return null;
  return {
    database_schema_version: int(row.database_schema_version),
    study_schema_version: int(row.study_schema_version),
    content_sha256: String(row.content_sha256),
    source_commit: String(row.source_commit),
    synced_at: String(row.synced_at),
    surah_count: int(row.surah_count),
    ayah_count: int(row.ayah_count),
    word_count: int(row.word_count),
  };
}

/**
 * Repository over a schema-v3 database. Not cached: wrap it in cachedRepository() when the
 * database is static for the lifetime of the process (it is for both the API and the app).
 */
export function createSqlRepository(executor: SqlExecutor, dialect: Dialect): ContentRepository {
  const q = contentQueries(dialect);
  const rows = <T>(sql: string, params: readonly SqlValue[] = []) =>
    executor.all(sql, params) as Promise<T[]>;
  const toSummary = (row: GrammarRows['grammar_topics'][number] & { question_count: unknown }) =>
    toTopicSummary(topicRowToRecord(row, []), int(row.question_count));

  async function questions(filter: PracticeQuestionFilter): Promise<PracticeQuestion[]> {
    const [questionSql, optionSql, param] =
      'set' in filter
        ? [q.kindQuestions, q.kindOptions, filter.set]
        : [q.topicQuestions, q.topicOptions, filter.topicId];
    const list = await rows<GrammarRows['practice_questions'][number]>(questionSql, [param]);
    if (!list.length) return [];
    const options = await rows<GrammarRows['practice_options'][number]>(optionSql, [param]);
    return rowsToQuestions(list, options);
  }

  return {
    async listSurahs(): Promise<SurahSummary[]> {
      const list = await rows<ContentRows['surahs'][number]>(q.surahs);
      return list.map((row) => ({
        number: int(row.number),
        nameUrdu: row.name_urdu,
        nameArabic: row.name_arabic,
        ayahCount: int(row.ayah_count),
        wordCount: int(row.word_count),
      }));
    },
    async getStudy(surah): Promise<StudyData | null> {
      if (!Number.isSafeInteger(surah)) return null;
      const [surahRow] = await rows<StudyRows['surahs'][number]>(q.study.surahs, [surah]);
      if (!surahRow) return null;
      const table = {} as Record<keyof StudyRows, unknown[]>;
      table.surahs = [surahRow];
      // Sequential on purpose: SQLite serializes anyway, and a Postgres pool stays available.
      table.translations = [];
      for (const key of Object.keys(q.study) as (keyof StudyRows)[]) {
        if (key === 'surahs' || key === 'translations') continue;
        table[key] = await rows(q.study[key], [surah]);
      }
      return rowsToStudies(table as unknown as StudyRows)[0] ?? null;
    },
    async listTopics(): Promise<GrammarTopicSummary[]> {
      const list = await rows<GrammarRows['grammar_topics'][number] & { question_count: unknown }>(
        q.topics,
      );
      return list.map(toSummary);
    },
    async getTopic(id) {
      const [topic] = await rows<GrammarRows['grammar_topics'][number] & { question_count: unknown }>(
        q.topic,
        [id],
      );
      if (!topic) return null;
      const points = await rows<GrammarRows['grammar_topic_points'][number]>(q.topicPoints, [id]);
      const examples = await rows<{
        kind: 'annotated' | 'quranic';
        position: number;
        word_id: string;
        note_urdu: string | null;
        surah: number;
        ayah: number;
        arabic: string;
        meaning_urdu: string;
      }>(q.topicExamples, [id]);
      const translationRows = await rows<{
        surah: number;
        ayah: number;
        position: number;
        translation_id: string;
        text: string;
      }>(q.topicExampleTranslations, [id]);
      const translations = new Map<string, Record<string, string>>();
      for (const row of translationRows) {
        const key = `${int(row.surah)}:${int(row.ayah)}`;
        const entry = translations.get(key) ?? {};
        entry[row.translation_id] = row.text;
        translations.set(key, entry);
      }
      const ayahWords = await rows<{ surah: number; ayah: number; position: number; arabic: string }>(
        q.topicExampleAyahWords,
        [id],
      );
      const ayahText = new Map<string, string[]>();
      for (const word of ayahWords) {
        const key = `${int(word.surah)}:${int(word.ayah)}`;
        const list = ayahText.get(key);
        if (list) list.push(word.arabic);
        else ayahText.set(key, [word.arabic]);
      }
      return toTopicDetail(
        topicRowToRecord(topic, points),
        int(topic.question_count),
        examples.map((row) =>
          toResolvedExample({
            kind: row.kind,
            wordId: row.word_id,
            surah: int(row.surah),
            ayah: int(row.ayah),
            wordArabic: row.arabic,
            meaningUrdu: row.meaning_urdu,
            ayahArabic: (ayahText.get(`${int(row.surah)}:${int(row.ayah)}`) ?? []).join(' '),
            translations: translations.get(`${int(row.surah)}:${int(row.ayah)}`) ?? {},
            noteUrdu: row.note_urdu ?? null,
          }),
        ),
      );
    },
    getPracticeQuestions: questions,
  };
}
