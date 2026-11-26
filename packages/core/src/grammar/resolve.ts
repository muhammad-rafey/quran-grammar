/**
 * Pure shaping helpers shared by every ContentRepository implementation (bundled, SQL), so all
 * data sources return byte-identical JSON. Light: no content imports.
 */
import type {
  GrammarTopicDetail,
  GrammarTopicRecord,
  GrammarTopicSummary,
  ResolvedTopicExample,
  TopicExampleKind,
} from './types';

export function toTopicSummary(
  topic: Pick<
    GrammarTopicRecord,
    'id' | 'position' | 'titleUrdu' | 'titleEnglish' | 'summaryUrdu' | 'occurrenceCount'
  >,
  questionCount: number,
): GrammarTopicSummary {
  return {
    id: topic.id,
    position: topic.position,
    titleUrdu: topic.titleUrdu,
    titleEnglish: topic.titleEnglish,
    summaryUrdu: topic.summaryUrdu,
    questionCount,
    occurrenceCount: topic.occurrenceCount,
  };
}

export function toTopicDetail(
  topic: GrammarTopicRecord,
  questionCount: number,
  examples: readonly ResolvedTopicExample[],
): GrammarTopicDetail {
  return {
    ...toTopicSummary(topic, questionCount),
    explanationUrdu: topic.explanationUrdu,
    pointsUrdu: [...topic.pointsUrdu],
    examples: examples.filter((example) => example.kind === 'annotated'),
    quranicExamples: examples.filter((example) => example.kind === 'quranic'),
  };
}

export function toResolvedExample(value: {
  kind: TopicExampleKind;
  wordId: string;
  surah: number;
  ayah: number;
  wordArabic: string;
  wordArabicIndoPak: string;
  meaningUrdu: string;
  ayahArabic: string;
  ayahArabicIndoPak: string;
  translations: Readonly<Record<string, string>>;
  noteUrdu: string | null;
}): ResolvedTopicExample {
  return {
    kind: value.kind,
    wordId: value.wordId,
    surah: value.surah,
    ayah: value.ayah,
    wordArabic: value.wordArabic,
    wordArabicIndoPak: value.wordArabicIndoPak,
    meaningUrdu: value.meaningUrdu,
    ayahArabic: value.ayahArabic,
    ayahArabicIndoPak: value.ayahArabicIndoPak,
    translations: value.translations,
    noteUrdu: value.noteUrdu,
  };
}

/** An ayah's IndoPak text: its words' IndoPak texts joined by spaces; '' unless all have one. */
export function joinIndoPak(texts: readonly (string | null | undefined)[]): string {
  return texts.length > 0 && texts.every((text) => text) ? texts.join(' ') : '';
}
