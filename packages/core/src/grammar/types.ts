/**
 * Grammar topics (one per Rule.id) and practice questions. Shared contract for the
 * content library, the database copies (SQLite + Supabase/Postgres), the API, web and mobile.
 * Learning text is Urdu. Quranic Arabic is never retyped: examples reference word occurrence IDs.
 */
import type { PracticeOption, PracticeQuestion } from '../practice';

/** One authored MCQ about a grammar concept (stored as PracticeQuestion with kind 'concept'). */
export interface AuthoredQuestionSource {
  /** Unique within the topic, kebab-case, e.g. 'case-of-mubtada'. */
  readonly id: string;
  readonly promptUrdu: string;
  /** 3–4 options. Option ids are kebab-case and unique within the question. */
  readonly options: readonly PracticeOption[];
  readonly correctOptionId: string;
  readonly explanationUrdu: string;
  /** Optional Quranic word occurrence the question is about (must exist in the registry). */
  readonly wordId?: string;
}

/** Annotated Quranic example: Arabic is resolved from the registry by wordId. */
export interface TopicExampleSource {
  readonly wordId: string;
  /** How the rule applies in this occurrence. */
  readonly noteUrdu: string;
}

/** Authored grammar topic library entry (packages/core/src/grammar/topics/part-N.ts). */
export interface GrammarTopicSource {
  /** Equals Rule.id used in Word.ruleIds. */
  readonly id: string;
  readonly titleUrdu: string;
  readonly titleEnglish: string;
  /** One or two sentences. */
  readonly summaryUrdu: string;
  /** Detailed explanation; paragraphs separated by a blank line ("\n\n"). */
  readonly explanationUrdu: string;
  /** 3–6 short key points / signs to recognise the rule. */
  readonly pointsUrdu: readonly string[];
  /** 3–5 annotated Quranic examples. */
  readonly examples: readonly TopicExampleSource[];
  /** 3–5 conceptual MCQs. */
  readonly questions: readonly AuthoredQuestionSource[];
}

export type TopicExampleKind = 'annotated' | 'quranic';

/** An example resolved against the study data, ready to display. */
export interface ResolvedTopicExample {
  readonly kind: TopicExampleKind;
  readonly wordId: string;
  readonly surah: number;
  readonly ayah: number;
  readonly wordArabic: string;
  readonly meaningUrdu: string;
  /** Full ayah Arabic (the ayah's words joined by spaces). */
  readonly ayahArabic: string;
  readonly translationUrdu: string;
  /** Present for annotated examples. */
  readonly noteUrdu: string | null;
}

/** Row for topic lists (practice tab, topic index). */
export interface GrammarTopicSummary {
  readonly id: string;
  readonly position: number;
  readonly titleUrdu: string;
  readonly titleEnglish: string;
  readonly summaryUrdu: string;
  readonly questionCount: number;
  /** Number of word occurrences tagged with this rule across all available Surahs. */
  readonly occurrenceCount: number;
}

/** Full topic for the topic detail screen/dialog. */
export interface GrammarTopicDetail extends GrammarTopicSummary {
  readonly explanationUrdu: string;
  readonly pointsUrdu: readonly string[];
  /** Authored, annotated examples first. */
  readonly examples: readonly ResolvedTopicExample[];
  /** Additional generated Quranic examples (up to 12, spread across Surahs). */
  readonly quranicExamples: readonly ResolvedTopicExample[];
}

/**
 * concept   — authored question about the rule itself
 * apply     — "which grammar rule applies to word X?" (generated)
 * spot      — "which of these words is an example of rule R?" (generated)
 * fatihah   — the original three Al-Fatihah questions (kept as-is, topicId null)
 */
export type PracticeQuestionKind = 'concept' | 'apply' | 'spot' | 'fatihah';

/** Built topic record (one per Rule.id): what the databases store in grammar_topics + points. */
export interface GrammarTopicRecord {
  readonly id: string;
  /** 1-based display order (most frequent topics first). */
  readonly position: number;
  readonly titleUrdu: string;
  readonly titleEnglish: string;
  readonly summaryUrdu: string;
  readonly explanationUrdu: string;
  readonly pointsUrdu: readonly string[];
  readonly occurrenceCount: number;
}

/** Built example reference; Arabic is resolved from the word occurrence. */
export interface GrammarTopicExampleRecord {
  readonly topicId: string;
  readonly kind: TopicExampleKind;
  /** 1-based within (topicId, kind). */
  readonly position: number;
  readonly wordId: string;
  readonly noteUrdu: string | null;
}

/** Deterministic output of buildGrammarContent(); questions are in display/position order. */
export interface GrammarContent {
  readonly topics: readonly GrammarTopicRecord[];
  readonly topicExamples: readonly GrammarTopicExampleRecord[];
  readonly questions: readonly PracticeQuestion[];
}
