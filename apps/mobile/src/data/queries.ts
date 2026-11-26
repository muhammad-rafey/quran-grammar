/**
 * SQL for the bundled content database (schema v3) and the mapping back to the shared
 * StudyData / grammar-topic / practice shapes. Pure TypeScript with type-only imports, so the
 * same code runs on device (expo-sqlite) and in Node tests (node:sqlite).
 *
 * Every query is keyed by an indexed column (words(surah), primary keys, topic_id) and a whole
 * chapter loads in a fixed number of statements, independent of its word count.
 */
import type {
  GrammarTopicDetail,
  GrammarTopicSummary,
  PracticeOption,
  PracticeQuestion,
  PracticeQuestionFilter,
  PracticeQuestionKind,
  ResolvedTopicExample,
  StudyData,
  TopicExampleKind,
} from '@quran-grammar/core';

export const MOBILE_DATABASE_SCHEMA_VERSION = 3;

export type SqlValue = string | number | null;

/** Minimal async executor; expo-sqlite's getAllAsync and node:sqlite both fit. */
export interface SqlExecutor {
  all<T>(sql: string, params?: readonly SqlValue[]): Promise<T[]>;
}

export type PracticeFilter = PracticeQuestionFilter;

export interface ContentVersionRow {
  database_schema_version: number;
  study_schema_version: number;
  content_sha256: string;
  surah_count: number;
  ayah_count: number;
  word_count: number;
}

export async function readContentVersion(exec: SqlExecutor): Promise<ContentVersionRow | null> {
  const [row] = await exec.all<ContentVersionRow>(
    `select database_schema_version, study_schema_version, content_sha256,
            surah_count, ayah_count, word_count
       from content_version where id = 1`,
  );
  return row ?? null;
}

type SurahRow = {
  number: number;
  name_urdu: string;
  name_arabic: string;
  ayah_count: number;
  word_count: number;
};

const surahFromRow = (row: SurahRow): StudyData['surah'] => ({
  number: row.number,
  nameUrdu: row.name_urdu,
  nameArabic: row.name_arabic,
  ayahCount: row.ayah_count,
  wordCount: row.word_count,
});

export async function listSurahs(exec: SqlExecutor): Promise<StudyData['surah'][]> {
  const rows = await exec.all<SurahRow>(
    'select number, name_urdu, name_arabic, ayah_count, word_count from surahs order by number',
  );
  return rows.map(surahFromRow);
}

function groupBy<T, K>(rows: readonly T[], key: (row: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (const row of rows) {
    const k = key(row);
    const list = map.get(k);
    if (list) list.push(row);
    else map.set(k, [row]);
  }
  return map;
}

/**
 * Separators for values folded into one row with group_concat. Content text never contains these
 * C0 control characters (a folded value with an unexpected field count is rejected).
 */
const unitSeparator = '\u001f';
const recordSeparator = '\u001e';

/** Split a group_concat of records (char(31)-separated) of fields (char(30)-separated). */
function splitRecords(value: string | null, fields: number): string[][] {
  if (value === null || value === '') return [];
  return value.split(unitSeparator).map((record) => {
    const parts = record.split(recordSeparator);
    if (parts.length !== fields) throw new Error('Unexpected separator in folded content.');
    return parts;
  });
}

/**
 * Rebuild one chapter's StudyData exactly (key and list order included).
 *
 * Per-word lists (segments, grammar-rule ids) and per-ayah translations are folded into their
 * word / ayah row with `group_concat(... order by position)` (SQLite 3.44+; expo-sqlite bundles
 * 3.49+). Al-Baqarah then reads ~8.5k rows instead of ~35k: on device each row becomes a JS
 * object, so the row count, not the SQL, dominated a long chapter's load time.
 */
export async function loadStudy(exec: SqlExecutor, surah: number): Promise<StudyData | null> {
  const [surahRow] = await exec.all<SurahRow>(
    'select number, name_urdu, name_arabic, ayah_count, word_count from surahs where number = ?',
    [surah],
  );
  if (!surahRow) return null;
  const p = [surah];
  const [ayahs, words, verbs, rules, roots, phrases, phraseWords] = await Promise.all([
    // Translations keyed in catalog (position) order, as core's rowsToStudies builds them.
    exec.all<{ number: number; translations: string | null }>(
      `select a.number,
              (select group_concat(t.translation_id || char(30) || t.text, char(31)
                                   order by t.position)
                 from ayah_translations t
                where t.surah = a.surah and t.ayah = a.number) as translations
         from ayahs a where a.surah = ? order by a.number`,
      p,
    ),
    exec.all<{
      id: string;
      ayah: number;
      position: number;
      arabic: string;
      arabic_indopak: string | null;
      meaning_urdu: string;
      pos: StudyData['words'][number]['pos'];
      pos_urdu: string;
      root: string | null;
      lemma: string | null;
      morphology_urdu: string;
      syntax_urdu: string;
      dictionary_urdu: string;
      segments: string | null;
      rule_ids: string | null;
    }>(
      `select w.id, w.ayah, w.position, w.arabic, w.arabic_indopak, w.meaning_urdu, w.pos,
              w.pos_urdu, w.root, w.lemma, w.morphology_urdu, w.syntax_urdu, w.dictionary_urdu,
              (select group_concat(s.arabic || char(30) || s.role_urdu || char(30) || s.meaning_urdu,
                                   char(31) order by s.position)
                 from word_segments s where s.word_id = w.id) as segments,
              (select group_concat(r.rule_id, char(31) order by r.position)
                 from word_rules r where r.word_id = w.id) as rule_ids
         from words w where w.surah = ? order by w.ayah, w.position`,
      p,
    ),
    exec.all<{
      word_id: string;
      baab_urdu: string;
      form_urdu: string;
      past: string;
      present: string;
      pattern: string;
      note_urdu: string;
    }>(
      `select word_id, baab_urdu, form_urdu, past, present, pattern, note_urdu
         from verb_forms where surah = ? order by position`,
      p,
    ),
    exec.all<{ id: string; title_urdu: string; explanation_urdu: string; example_urdu: string }>(
      'select id, title_urdu, explanation_urdu, example_urdu from rules where surah = ? order by position',
      p,
    ),
    exec.all<{ root: string; meaning_urdu: string; note_urdu: string }>(
      'select root, meaning_urdu, note_urdu from roots where surah = ? order by position',
      p,
    ),
    exec.all<{ id: string; ayah: number; label_urdu: string; explanation_urdu: string }>(
      'select id, ayah, label_urdu, explanation_urdu from phrases where surah = ? order by ayah, position',
      p,
    ),
    exec.all<{ phrase_id: string; word_id: string }>(
      `select pw.phrase_id, pw.word_id
         from phrases ph join phrase_words pw on pw.phrase_id = ph.id
        where ph.surah = ? order by ph.ayah, ph.position, pw.position`,
      p,
    ),
  ]);

  const phrasesByAyah = groupBy(phrases, (row) => row.ayah);
  const wordsByPhrase = groupBy(phraseWords, (row) => row.phrase_id);

  return {
    schemaVersion: 1,
    surah: surahFromRow(surahRow),
    words: words.map((word) => ({
      id: word.id,
      ayah: word.ayah,
      position: word.position,
      arabic: word.arabic,
      ...(word.arabic_indopak === null ? {} : { arabicIndoPak: word.arabic_indopak }),
      meaningUrdu: word.meaning_urdu,
      pos: word.pos,
      posUrdu: word.pos_urdu,
      root: word.root,
      lemma: word.lemma,
      morphologyUrdu: word.morphology_urdu,
      syntaxUrdu: word.syntax_urdu,
      dictionaryUrdu: word.dictionary_urdu,
      segments: splitRecords(word.segments, 3).map(([arabic, roleUrdu, meaningUrdu]) => ({
        arabic: arabic!,
        roleUrdu: roleUrdu!,
        meaningUrdu: meaningUrdu!,
      })),
      ruleIds: word.rule_ids ? word.rule_ids.split(unitSeparator) : [],
    })),
    ayahs: ayahs.map((ayah) => ({
      number: ayah.number,
      translations: Object.fromEntries(splitRecords(ayah.translations, 2)),
      phrases: (phrasesByAyah.get(ayah.number) ?? []).map((phrase) => ({
        id: phrase.id,
        wordIds: (wordsByPhrase.get(phrase.id) ?? []).map((entry) => entry.word_id),
        labelUrdu: phrase.label_urdu,
        explanationUrdu: phrase.explanation_urdu,
      })),
    })),
    rules: rules.map((rule) => ({
      id: rule.id,
      titleUrdu: rule.title_urdu,
      explanationUrdu: rule.explanation_urdu,
      exampleUrdu: rule.example_urdu,
    })),
    roots: Object.fromEntries(
      roots.map((root) => [root.root, { meaningUrdu: root.meaning_urdu, noteUrdu: root.note_urdu }]),
    ),
    verbForms: Object.fromEntries(
      verbs.map((verb) => [
        verb.word_id,
        {
          baabUrdu: verb.baab_urdu,
          formUrdu: verb.form_urdu,
          past: verb.past,
          present: verb.present,
          pattern: verb.pattern,
          noteUrdu: verb.note_urdu,
        },
      ]),
    ),
  };
}

type TopicRow = {
  id: string;
  position: number;
  title_urdu: string;
  title_english: string;
  summary_urdu: string;
  explanation_urdu: string;
  occurrence_count: number;
  question_count: number;
};

const topicColumns = `t.id, t.position, t.title_urdu, t.title_english, t.summary_urdu,
  t.explanation_urdu, t.occurrence_count,
  (select count(*) from practice_questions q where q.topic_id = t.id) as question_count`;

const summaryFromRow = (row: TopicRow): GrammarTopicSummary => ({
  id: row.id,
  position: row.position,
  titleUrdu: row.title_urdu,
  titleEnglish: row.title_english,
  summaryUrdu: row.summary_urdu,
  questionCount: row.question_count,
  occurrenceCount: row.occurrence_count,
});

export async function listTopics(exec: SqlExecutor): Promise<GrammarTopicSummary[]> {
  const rows = await exec.all<TopicRow>(
    `select ${topicColumns} from grammar_topics t order by t.position`,
  );
  return rows.map(summaryFromRow);
}

export async function loadTopic(exec: SqlExecutor, id: string): Promise<GrammarTopicDetail | null> {
  const [topic] = await exec.all<TopicRow>(
    `select ${topicColumns} from grammar_topics t where t.id = ?`,
    [id],
  );
  if (!topic) return null;
  const [points, examples, exampleTranslations, ayahWords] = await Promise.all([
    exec.all<{ text_urdu: string }>(
      'select text_urdu from grammar_topic_points where topic_id = ? order by position',
      [id],
    ),
    exec.all<{
      kind: TopicExampleKind;
      word_id: string;
      note_urdu: string | null;
      surah: number;
      ayah: number;
      arabic: string;
      meaning_urdu: string;
    }>(
      `select e.kind, e.word_id, e.note_urdu, w.surah, w.ayah, w.arabic, w.meaning_urdu
         from grammar_topic_examples e
         join words w on w.id = e.word_id
        where e.topic_id = ?
        order by e.kind, e.position`,
      [id],
    ),
    // The translations of each example's ayah, in catalog (position) order.
    exec.all<{ surah: number; ayah: number; translation_id: string; text: string }>(
      `select distinct a.surah, a.ayah, a.position, a.translation_id, a.text
         from grammar_topic_examples e
         join words w on w.id = e.word_id
         join ayah_translations a on a.surah = w.surah and a.ayah = w.ayah
        where e.topic_id = ?
        order by a.surah, a.ayah, a.position`,
      [id],
    ),
    // Every word of each example's ayah, to show the full ayah without retyping it.
    exec.all<{ surah: number; ayah: number; arabic: string }>(
      `select distinct w2.surah, w2.ayah, w2.position, w2.arabic
         from grammar_topic_examples e
         join words w on w.id = e.word_id
         join words w2 on w2.surah = w.surah and w2.ayah = w.ayah
        where e.topic_id = ?
        order by w2.surah, w2.ayah, w2.position`,
      [id],
    ),
  ]);
  const ayahArabic = new Map<string, string>();
  for (const [key, words] of groupBy(ayahWords, (row) => `${row.surah}:${row.ayah}`))
    ayahArabic.set(key, words.map((word) => word.arabic).join(' '));
  const translations = new Map<string, Record<string, string>>();
  for (const [key, rows] of groupBy(exampleTranslations, (row) => `${row.surah}:${row.ayah}`))
    translations.set(key, Object.fromEntries(rows.map((row) => [row.translation_id, row.text])));
  const resolved = examples.map(
    (row): ResolvedTopicExample => ({
      kind: row.kind,
      wordId: row.word_id,
      surah: row.surah,
      ayah: row.ayah,
      wordArabic: row.arabic,
      meaningUrdu: row.meaning_urdu,
      ayahArabic: ayahArabic.get(`${row.surah}:${row.ayah}`) ?? row.arabic,
      translations: translations.get(`${row.surah}:${row.ayah}`) ?? {},
      noteUrdu: row.note_urdu ?? null,
    }),
  );
  return {
    ...summaryFromRow(topic),
    explanationUrdu: topic.explanation_urdu,
    pointsUrdu: points.map((point) => point.text_urdu),
    examples: resolved.filter((example) => example.kind === 'annotated'),
    quranicExamples: resolved.filter((example) => example.kind === 'quranic'),
  };
}

export async function loadPracticeQuestions(
  exec: SqlExecutor,
  filter: PracticeFilter,
): Promise<PracticeQuestion[]> {
  const byTopic = 'topicId' in filter;
  if (!byTopic && filter.set !== 'fatihah') return [];
  const where = byTopic ? 'q.topic_id = ?' : "q.topic_id is null and q.kind = 'fatihah'";
  const params = byTopic ? [filter.topicId] : [];
  const [questions, options] = await Promise.all([
    exec.all<{
      id: string;
      topic_id: string | null;
      kind: PracticeQuestionKind;
      prompt_urdu: string;
      correct_option_id: string;
      explanation_urdu: string;
      word_id: string | null;
    }>(
      `select q.id, q.topic_id, q.kind, q.prompt_urdu, q.correct_option_id, q.explanation_urdu,
              q.word_id
         from practice_questions q where ${where} order by q.position`,
      params,
    ),
    exec.all<{ question_id: string; id: string; text: string; language: PracticeOption['language'] }>(
      `select o.question_id, o.id, o.text, o.language
         from practice_questions q join practice_options o on o.question_id = q.id
        where ${where} order by o.question_id, o.position`,
      params,
    ),
  ]);
  const optionsByQuestion = groupBy(options, (row) => row.question_id);
  return questions.map(
    (row): PracticeQuestion => ({
      id: row.id,
      promptUrdu: row.prompt_urdu,
      options: (optionsByQuestion.get(row.id) ?? []).map((option) => ({
        id: option.id,
        text: option.text,
        language: option.language,
      })),
      correctOptionId: row.correct_option_id,
      explanationUrdu: row.explanation_urdu,
      wordId: row.word_id,
      topicId: row.topic_id,
      kind: row.kind,
    }),
  );
}
