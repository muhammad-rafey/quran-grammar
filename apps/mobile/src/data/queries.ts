/**
 * SQL for the bundled content database (schema v3) and the mapping back to the shared
 * StudyData / grammar-topic / practice shapes. Pure TypeScript importing only the light core entry
 * (shared shaping helpers), so the same code runs on device (expo-sqlite) and in Node tests
 * (node:sqlite).
 *
 * Every query is keyed by an indexed column (words(surah), primary keys, topic_id) and a whole
 * chapter loads in a fixed number of statements, independent of its word count.
 */
import {
  joinIndoPak,
  toResolvedOption,
  type GrammarTopicDetail,
  type GrammarTopicSummary,
  type PracticeOption,
  type PracticeQuestion,
  type PracticeQuestionFilter,
  type PracticeQuestionKind,
  type ResolvedTopicExample,
  type StudyData,
  type TopicExampleKind,
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

/** Rebuild one chapter's StudyData exactly (key and list order included). */
export async function loadStudy(exec: SqlExecutor, surah: number): Promise<StudyData | null> {
  const [surahRow] = await exec.all<SurahRow>(
    'select number, name_urdu, name_arabic, ayah_count, word_count from surahs where number = ?',
    [surah],
  );
  if (!surahRow) return null;
  const p = [surah];
  const [
    ayahs,
    ayahTranslations,
    words,
    segments,
    wordRules,
    verbs,
    rules,
    roots,
    phrases,
    phraseWords,
  ] = await Promise.all([
    exec.all<{ number: number }>('select number from ayahs where surah = ? order by number', p),
    // Keys in catalog (position) order, as core's rowsToStudies builds them.
    exec.all<{ ayah: number; translation_id: string; text: string }>(
      `select ayah, translation_id, text
         from ayah_translations where surah = ? order by ayah, position`,
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
    }>(
      `select id, ayah, position, arabic, arabic_indopak, meaning_urdu, pos, pos_urdu, root, lemma,
              morphology_urdu, syntax_urdu, dictionary_urdu
         from words where surah = ? order by ayah, position`,
      p,
    ),
    exec.all<{ word_id: string; arabic: string; role_urdu: string; meaning_urdu: string }>(
      `select s.word_id, s.arabic, s.role_urdu, s.meaning_urdu
         from words w join word_segments s on s.word_id = w.id
        where w.surah = ? order by s.word_id, s.position`,
      p,
    ),
    exec.all<{ word_id: string; rule_id: string }>(
      'select word_id, rule_id from word_rules where surah = ? order by word_id, position',
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
        where ph.surah = ? order by pw.phrase_id, pw.position`,
      p,
    ),
  ]);

  const segmentsByWord = groupBy(segments, (row) => row.word_id);
  const rulesByWord = groupBy(wordRules, (row) => row.word_id);
  const phrasesByAyah = groupBy(phrases, (row) => row.ayah);
  const translationsByAyah = groupBy(ayahTranslations, (row) => row.ayah);
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
      segments: (segmentsByWord.get(word.id) ?? []).map((segment) => ({
        arabic: segment.arabic,
        roleUrdu: segment.role_urdu,
        meaningUrdu: segment.meaning_urdu,
      })),
      ruleIds: (rulesByWord.get(word.id) ?? []).map((rule) => rule.rule_id),
    })),
    ayahs: ayahs.map((ayah) => ({
      number: ayah.number,
      translations: Object.fromEntries(
        (translationsByAyah.get(ayah.number) ?? []).map((row) => [row.translation_id, row.text]),
      ),
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
      arabic_indopak: string | null;
      meaning_urdu: string;
    }>(
      `select e.kind, e.word_id, e.note_urdu, w.surah, w.ayah, w.arabic, w.arabic_indopak,
              w.meaning_urdu
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
    exec.all<{ surah: number; ayah: number; arabic: string; arabic_indopak: string | null }>(
      `select distinct w2.surah, w2.ayah, w2.position, w2.arabic, w2.arabic_indopak
         from grammar_topic_examples e
         join words w on w.id = e.word_id
         join words w2 on w2.surah = w.surah and w2.ayah = w.ayah
        where e.topic_id = ?
        order by w2.surah, w2.ayah, w2.position`,
      [id],
    ),
  ]);
  const ayahArabic = new Map<string, { arabic: string; indoPak: string }>();
  for (const [key, words] of groupBy(ayahWords, (row) => `${row.surah}:${row.ayah}`))
    ayahArabic.set(key, {
      arabic: words.map((word) => word.arabic).join(' '),
      indoPak: joinIndoPak(words.map((word) => word.arabic_indopak)),
    });
  const translations = new Map<string, Record<string, string>>();
  for (const [key, rows] of groupBy(exampleTranslations, (row) => `${row.surah}:${row.ayah}`))
    translations.set(key, Object.fromEntries(rows.map((row) => [row.translation_id, row.text])));
  const resolved = examples.map((row): ResolvedTopicExample => {
    const ayah = ayahArabic.get(`${row.surah}:${row.ayah}`);
    return {
      kind: row.kind,
      wordId: row.word_id,
      surah: row.surah,
      ayah: row.ayah,
      wordArabic: row.arabic,
      wordArabicIndoPak: row.arabic_indopak ?? '',
      meaningUrdu: row.meaning_urdu,
      ayahArabic: ayah?.arabic ?? row.arabic,
      ayahArabicIndoPak: ayah ? ayah.indoPak : (row.arabic_indopak ?? ''),
      translations: translations.get(`${row.surah}:${row.ayah}`) ?? {},
      noteUrdu: row.note_urdu ?? null,
    };
  });
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
    // Word options join the word whose id they carry, for its IndoPak text (toResolvedOption).
    exec.all<{
      question_id: string;
      id: string;
      text: string;
      language: PracticeOption['language'];
      word_arabic: string | null;
      word_arabic_indopak: string | null;
    }>(
      `select o.question_id, o.id, o.text, o.language, w.arabic as word_arabic,
              w.arabic_indopak as word_arabic_indopak
         from practice_questions q join practice_options o on o.question_id = q.id
         left join words w on w.id = o.id
        where ${where} order by o.question_id, o.position`,
      params,
    ),
  ]);
  const optionsByQuestion = groupBy(options, (row) => row.question_id);
  return questions.map(
    (row): PracticeQuestion => ({
      id: row.id,
      promptUrdu: row.prompt_urdu,
      options: (optionsByQuestion.get(row.id) ?? []).map((option) =>
        toResolvedOption(
          option,
          option.word_arabic === null
            ? null
            : { arabic: option.word_arabic, arabicIndoPak: option.word_arabic_indopak },
        ),
      ),
      correctOptionId: row.correct_option_id,
      explanationUrdu: row.explanation_urdu,
      wordId: row.word_id,
      topicId: row.topic_id,
      kind: row.kind,
    }),
  );
}
