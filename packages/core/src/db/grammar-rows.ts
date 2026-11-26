import type {
  GrammarContent,
  GrammarTopicExampleRecord,
  GrammarTopicRecord,
  PracticeQuestionKind,
  TopicExampleKind,
} from '../grammar/types';
import type { PracticeQuestion } from '../practice';
import type { StudyData } from '../types';
import { byPosition, group, rowsToStudies, studiesToRows, type StudyRows } from './rows';

/** Rows of the five grammar/practice tables. */
export interface GrammarRows {
  grammar_topics: {
    id: string;
    position: number;
    title_urdu: string;
    title_english: string;
    summary_urdu: string;
    explanation_urdu: string;
    occurrence_count: number;
  }[];
  grammar_topic_points: { topic_id: string; position: number; text_urdu: string }[];
  grammar_topic_examples: {
    topic_id: string;
    position: number;
    kind: TopicExampleKind;
    word_id: string;
    note_urdu: string | null;
  }[];
  practice_questions: {
    id: string;
    position: number;
    topic_id: string | null;
    kind: PracticeQuestionKind;
    prompt_urdu: string;
    correct_option_id: string;
    explanation_urdu: string;
    word_id: string | null;
  }[];
  practice_options: {
    question_id: string;
    position: number;
    id: string;
    text: string;
    language: 'ar' | 'ur';
  }[];
}

/** Every table in the database except content_version. */
export type ContentRows = StudyRows & GrammarRows;

/** Insertion order: parents before children. */
export const TABLES_PARENT_FIRST = [
  'translations',
  'surahs',
  'ayahs',
  'ayah_translations',
  'rules',
  'roots',
  'words',
  'word_segments',
  'word_rules',
  'verb_forms',
  'phrases',
  'phrase_words',
  'grammar_topics',
  'grammar_topic_points',
  'grammar_topic_examples',
  'practice_questions',
  'practice_options',
] as const satisfies readonly (keyof ContentRows)[];

/** Read order for every table; reproduces the bundled list order. */
export const ORDER_BY: Record<keyof ContentRows, string> = {
  translations: 'position',
  surahs: 'number',
  ayahs: 'surah, number',
  ayah_translations: 'surah, ayah, position',
  rules: 'surah, position',
  roots: 'surah, position',
  words: 'surah, ayah, position',
  word_segments: 'word_id, position',
  word_rules: 'word_id, position',
  verb_forms: 'surah, position',
  phrases: 'surah, ayah, position',
  phrase_words: 'phrase_id, position',
  grammar_topics: 'position',
  grammar_topic_points: 'topic_id, position',
  grammar_topic_examples: 'topic_id, kind, position',
  practice_questions: 'position',
  practice_options: 'question_id, position',
};

export function grammarToRows(grammar: GrammarContent): GrammarRows {
  const rows: GrammarRows = {
    grammar_topics: [],
    grammar_topic_points: [],
    grammar_topic_examples: [],
    practice_questions: [],
    practice_options: [],
  };
  for (const topic of grammar.topics) {
    rows.grammar_topics.push({
      id: topic.id,
      position: topic.position,
      title_urdu: topic.titleUrdu,
      title_english: topic.titleEnglish,
      summary_urdu: topic.summaryUrdu,
      explanation_urdu: topic.explanationUrdu,
      occurrence_count: topic.occurrenceCount,
    });
    topic.pointsUrdu.forEach((text, index) =>
      rows.grammar_topic_points.push({ topic_id: topic.id, position: index + 1, text_urdu: text }),
    );
  }
  for (const example of grammar.topicExamples)
    rows.grammar_topic_examples.push({
      topic_id: example.topicId,
      position: example.position,
      kind: example.kind,
      word_id: example.wordId,
      note_urdu: example.noteUrdu,
    });
  grammar.questions.forEach((question, index) => {
    rows.practice_questions.push(questionToRow(question, index + 1));
    question.options.forEach((option, position) =>
      rows.practice_options.push({
        question_id: question.id,
        position: position + 1,
        id: option.id,
        text: option.text,
        language: option.language,
      }),
    );
  });
  return rows;
}

function questionToRow(question: PracticeQuestion, position: number) {
  return {
    id: question.id,
    position,
    topic_id: question.topicId,
    kind: question.kind,
    prompt_urdu: question.promptUrdu,
    correct_option_id: question.correctOptionId,
    explanation_urdu: question.explanationUrdu,
    word_id: question.wordId,
  };
}

export function topicRowToRecord(
  topic: GrammarRows['grammar_topics'][number],
  points: readonly GrammarRows['grammar_topic_points'][number][],
): GrammarTopicRecord {
  return {
    id: topic.id,
    position: Number(topic.position),
    titleUrdu: topic.title_urdu,
    titleEnglish: topic.title_english,
    summaryUrdu: topic.summary_urdu,
    explanationUrdu: topic.explanation_urdu,
    pointsUrdu: [...points].sort(byPosition).map((point) => point.text_urdu),
    occurrenceCount: Number(topic.occurrence_count),
  };
}

/** Rebuild questions (in row order) with their options in position order. */
export function rowsToQuestions(
  questions: readonly GrammarRows['practice_questions'][number][],
  options: readonly GrammarRows['practice_options'][number][],
): PracticeQuestion[] {
  const optionsByQuestion = group(options, (row) => row.question_id);
  return questions.map((row) => ({
    id: row.id,
    promptUrdu: row.prompt_urdu,
    options: [...(optionsByQuestion.get(row.id) ?? [])].sort(byPosition).map((option) => ({
      id: option.id,
      text: option.text,
      language: option.language,
    })),
    correctOptionId: row.correct_option_id,
    explanationUrdu: row.explanation_urdu,
    wordId: row.word_id ?? null,
    topicId: row.topic_id ?? null,
    kind: row.kind,
  }));
}

/** Rebuild GrammarContent exactly (including order) from database rows. */
export function rowsToGrammar(rows: GrammarRows): GrammarContent {
  const pointsByTopic = group(rows.grammar_topic_points, (row) => row.topic_id);
  const topics = [...rows.grammar_topics]
    .sort(byPosition)
    .map((topic) => topicRowToRecord(topic, pointsByTopic.get(topic.id) ?? []));
  const topicOrder = new Map(topics.map((topic) => [topic.id, topic.position]));
  const topicExamples: GrammarTopicExampleRecord[] = [...rows.grammar_topic_examples]
    .sort(
      (a, b) =>
        (topicOrder.get(a.topic_id) ?? 0) - (topicOrder.get(b.topic_id) ?? 0) ||
        (a.kind < b.kind ? -1 : a.kind > b.kind ? 1 : 0) ||
        a.position - b.position,
    )
    .map((row) => ({
      topicId: row.topic_id,
      kind: row.kind,
      position: Number(row.position),
      wordId: row.word_id,
      noteUrdu: row.note_urdu ?? null,
    }));
  return {
    topics,
    topicExamples,
    questions: rowsToQuestions([...rows.practice_questions].sort(byPosition), rows.practice_options),
  };
}

export function contentToRows(studies: readonly StudyData[], grammar: GrammarContent): ContentRows {
  return { ...studiesToRows(studies), ...grammarToRows(grammar) };
}

export function rowsToContent(rows: ContentRows): {
  studies: StudyData[];
  grammar: GrammarContent;
} {
  return { studies: rowsToStudies(rows), grammar: rowsToGrammar(rows) };
}
