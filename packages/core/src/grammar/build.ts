/**
 * Deterministic builder for grammar topics, examples and practice questions.
 *
 * Inputs are the study registry, the authored topic library and the Al-Fatihah questions; the
 * output is identical on every run (no Math.random, no clock), so database copies and their
 * checksums are reproducible. Quranic Arabic is never typed here: every Arabic string is read
 * from a word occurrence in the study data.
 */
import { normalizeText, urduNumber, withoutPauseMarks } from '../search';
import { toResolvedOption, type PracticeOption, type PracticeQuestion } from '../practice';
import type { PartOfSpeech, Rule, StudyData, Word } from '../types';
import { joinIndoPak, toResolvedExample, toTopicDetail, toTopicSummary } from './resolve';
import type {
  GrammarContent,
  GrammarTopicDetail,
  GrammarTopicExampleRecord,
  GrammarTopicRecord,
  GrammarTopicSource,
  GrammarTopicSummary,
  ResolvedTopicExample,
} from './types';

export const MAX_QURANIC_EXAMPLES = 12;
export const MAX_APPLY_QUESTIONS = 3;
export const MAX_SPOT_QUESTIONS = 3;

/**
 * Topics that commonly describe the same word (or overlap in meaning). A generated question never
 * uses a topic from the same group as a "wrong" answer, so a distractor cannot be arguably right.
 */
const RELATED_TOPIC_GROUPS: readonly (readonly string[])[] = [
  ['genitive', 'preposition', 'idafa', 'extra-particle', 'oath'],
  ['nominative', 'nominal', 'subject', 'kana', 'inna', 'inna-sisters', 'passive', 'separating-pronoun'],
  [
    'accusative', 'object', 'two-objects', 'fronted-object', 'zanna', 'inna', 'inna-sisters',
    'kana', 'kada-asa', 'haal', 'tamyiz', 'cognate-object', 'purpose-object', 'adverb',
    'exception', 'vocative', 'subjunctive', 'ishtighal', 'censure', 'la-generic',
  ],
  ['implied-case', 'weak-verb', 'five-nouns', 'diptote', 'elision', 'nominative', 'accusative', 'genitive'],
  [
    'pronoun', 'subject-pronoun', 'object-pronoun', 'independent-pronoun', 'separating-pronoun',
    'pronoun-of-matter', 'nun-wiqaya', 'five-verbs', 'resumption',
  ],
  ['subject', 'subject-pronoun', 'verbal-sentence', 'passive', 'tanazu'],
  ['object', 'object-pronoun', 'two-objects', 'zanna', 'fronted-object', 'fronting', 'ishtighal', 'tanazu'],
  ['nominal', 'verbal-sentence', 'fronting', 'kana', 'inna', 'resumption', 'quoted-speech', 'parenthetical'],
  ['inna', 'inna-sisters', 'lightened-particle', 'emphatic-lam', 'pronoun-of-matter', 'negative-in'],
  ['kana', 'kada-asa', 'zanna'],
  [
    'condition', 'condition-answer', 'conditional-jazm', 'law-condition', 'lawla-condition',
    'exhortation', 'lamma', 'surprise-idha', 'idh', 'detailing', 'adverb', 'jussive',
  ],
  [
    'jussive', 'lam-jussive', 'prohibition', 'imperative-lam', 'conditional-jazm', 'five-verbs',
    'emphatic-nun', 'imperative',
  ],
  [
    'subjunctive', 'lan-negation', 'purpose-lam', 'masdar-particle', 'lam-juhud', 'hatta',
    'five-verbs', 'explanatory-an', 'lightened-particle',
  ],
  [
    'negation', 'la-generic', 'negative-in', 'lam-jussive', 'lan-negation', 'prohibition',
    'lam-juhud', 'restriction', 'exception', 'deterrence', 'answer-particle',
  ],
  [
    'weak-verb', 'hamzated', 'doubled', 'quadriliteral', 'derived-form', 'assimilation',
    'verbal-noun', 'participle', 'resembling-adjective', 'intensive', 'noun-of-place-time',
  ],
  ['perfect', 'imperfect', 'imperative', 'passive', 'future', 'qad', 'five-verbs', 'emphatic-nun', 'verb-like-noun'],
  ['definite', 'indefinite', 'proper-noun', 'demonstrative', 'relative', 'idafa', 'vocative', 'la-generic', 'diptote'],
  [
    'adjective', 'participle', 'resembling-adjective', 'comparative', 'intensive', 'tawkid',
    'badal', 'haal', 'number-words', 'demonstrative', 'praise-blame', 'exclamation',
  ],
  ['verbal-noun', 'cognate-object', 'purpose-object', 'masdar-particle', 'explanatory-an'],
  ['sound-plural', 'broken-plural', 'feminine-plural', 'dual', 'feminine-marker', 'number-words', 'five-verbs', 'diptote'],
  ['relative', 'masdar-particle', 'condition', 'interrogative', 'kam', 'explanatory-an'],
  ['interrogative', 'equalization', 'retraction', 'kam', 'answer-particle', 'exhortation'],
  ['conjunction', 'resumption', 'retraction', 'detailing', 'badal', 'tawkid', 'condition-answer'],
  ['emphatic-lam', 'oath', 'emphatic-nun', 'qad', 'tawkid', 'restriction', 'separating-pronoun'],
  ['quoted-speech', 'resumption', 'parenthetical', 'elision', 'condition-answer', 'oath'],
  ['purpose-lam', 'imperative-lam', 'lam-juhud', 'emphatic-lam', 'preposition'],
  ['muqattaat', 'resumption', 'elision'],
];

/** FNV-1a 32-bit: a stable, platform-independent seed for every "random" choice. */
export function stableHash(text: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

function seededOrder<T>(items: readonly T[], seed: string, key: (item: T) => string): T[] {
  return items
    .map((item) => ({ item, key: key(item), rank: stableHash(`${seed}|${key(item)}`) }))
    .sort((a, b) => a.rank - b.rank || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0))
    .map((entry) => entry.item);
}

interface Occurrence {
  readonly word: Word;
  readonly study: StudyData;
}

interface StudyIndex {
  readonly words: ReadonlyMap<string, Occurrence>;
  /** Rule.id → tagged occurrences, in Mushaf order of the registry. */
  readonly occurrences: ReadonlyMap<string, readonly Occurrence[]>;
  /** Rule.id → the per-Surah Rule entries. */
  readonly variants: ReadonlyMap<string, readonly Rule[]>;
  readonly ayahWords: ReadonlyMap<string, readonly Word[]>;
}

const ayahKey = (surah: number, ayah: number) => `${surah}:${ayah}`;

function indexStudies(studies: readonly StudyData[]): StudyIndex {
  const words = new Map<string, Occurrence>();
  const occurrences = new Map<string, Occurrence[]>();
  const variants = new Map<string, Rule[]>();
  const ayahWords = new Map<string, Word[]>();
  for (const study of studies) {
    for (const rule of study.rules) {
      const list = variants.get(rule.id);
      if (list) list.push(rule);
      else variants.set(rule.id, [rule]);
    }
    for (const word of study.words) {
      const occurrence = { word, study };
      words.set(word.id, occurrence);
      const key = ayahKey(study.surah.number, word.ayah);
      const ayah = ayahWords.get(key);
      if (ayah) ayah.push(word);
      else ayahWords.set(key, [word]);
      for (const ruleId of word.ruleIds) {
        const list = occurrences.get(ruleId);
        if (list) list.push(occurrence);
        else occurrences.set(ruleId, [occurrence]);
      }
    }
  }
  return { words, occurrences, variants, ayahWords };
}

const kebab = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface GrammarSourceReport {
  /** Problems that would corrupt the databases or the UI; the builder refuses to run. */
  readonly errors: string[];
  /** Quality notes (for example, an annotated example word that is not tagged with the rule). */
  readonly warnings: string[];
  /** Rule.ids that have no authored topic yet (a fallback is generated from the rule variants). */
  readonly missingTopics: string[];
}

/** Check the authored topic library against the study data. */
export function checkGrammarSources(
  studies: readonly StudyData[],
  sources: readonly GrammarTopicSource[],
): GrammarSourceReport {
  return checkSources(indexStudies(studies), sources);
}

function checkSources(index: StudyIndex, sources: readonly GrammarTopicSource[]): GrammarSourceReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  const seen = new Set<string>();
  for (const source of sources) {
    const at = `topic ${source.id}`;
    if (seen.has(source.id)) errors.push(`${at}: duplicate topic id`);
    seen.add(source.id);
    if (!index.variants.has(source.id)) errors.push(`${at}: not a Rule.id used by any Surah`);
    for (const field of ['titleUrdu', 'titleEnglish', 'summaryUrdu', 'explanationUrdu'] as const) {
      if (typeof source[field] !== 'string' || !source[field].trim())
        errors.push(`${at}: ${field} is empty`);
    }
    if (!Array.isArray(source.pointsUrdu) || source.pointsUrdu.some((point) => !point?.trim()))
      errors.push(`${at}: pointsUrdu must be non-empty strings`);
    else if (source.pointsUrdu.length < 3 || source.pointsUrdu.length > 6)
      warnings.push(`${at}: ${source.pointsUrdu.length} key points (expected 3–6)`);
    const exampleIds = new Set<string>();
    for (const example of source.examples ?? []) {
      const occurrence = index.words.get(example.wordId);
      if (!occurrence) errors.push(`${at}: example word ${example.wordId} does not exist`);
      else if (!occurrence.word.ruleIds.includes(source.id))
        warnings.push(`${at}: example word ${example.wordId} is not tagged with this rule`);
      if (exampleIds.has(example.wordId))
        errors.push(`${at}: duplicate example word ${example.wordId}`);
      exampleIds.add(example.wordId);
      if (!example.noteUrdu?.trim()) errors.push(`${at}: example ${example.wordId} has no note`);
    }
    if ((source.examples ?? []).length < 3 || (source.examples ?? []).length > 5)
      warnings.push(`${at}: ${(source.examples ?? []).length} annotated examples (expected 3–5)`);
    const questionIds = new Set<string>();
    for (const question of source.questions ?? []) {
      const where = `${at}: question ${question.id}`;
      if (!kebab.test(question.id)) errors.push(`${where}: id must be kebab-case`);
      if (questionIds.has(question.id)) errors.push(`${where}: duplicate question id`);
      questionIds.add(question.id);
      if (!question.promptUrdu?.trim() || !question.explanationUrdu?.trim())
        errors.push(`${where}: prompt and explanation are required`);
      if (question.wordId !== undefined && !index.words.has(question.wordId))
        errors.push(`${where}: word ${question.wordId} does not exist`);
      const options = question.options ?? [];
      if (options.length < 2 || options.length > 6) errors.push(`${where}: needs 2–6 options`);
      else if (options.length < 3 || options.length > 4)
        warnings.push(`${where}: ${options.length} options (expected 3–4)`);
      if (new Set(options.map((option) => option.id)).size !== options.length)
        errors.push(`${where}: option ids are not unique`);
      if (new Set(options.map((option) => option.text.trim())).size !== options.length)
        errors.push(`${where}: option texts are not unique`);
      for (const option of options) {
        if (!kebab.test(option.id)) errors.push(`${where}: option id ${option.id} must be kebab-case`);
        if (!option.text?.trim()) errors.push(`${where}: option ${option.id} has no text`);
        if (option.language !== 'ar' && option.language !== 'ur')
          errors.push(`${where}: option ${option.id} language must be ar or ur`);
      }
      if (!options.some((option) => option.id === question.correctOptionId))
        errors.push(`${where}: correctOptionId is not one of the options`);
    }
    const count = (source.questions ?? []).length;
    if (count < 3 || count > 5) warnings.push(`${at}: ${count} concept questions (expected 3–5)`);
  }
  const missingTopics = [...index.variants.keys()].filter((id) => !seen.has(id)).sort();
  return { errors, warnings, missingTopics };
}

function mostCommon(values: readonly string[]): string {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  let best = values[0] ?? '';
  for (const [value, count] of counts) if (count > (counts.get(best) ?? 0)) best = value;
  return best;
}

function firstSentence(text: string): string {
  const match = /^[\s\S]*?[۔.!?؟](?=\s|$)/.exec(text.trim());
  return (match?.[0] ?? text).trim();
}

function englishFromId(id: string): string {
  const words = id.split('-').join(' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** Fallback for a Rule.id without an authored topic: the most common per-Surah wording. */
function fallbackSource(id: string, variants: readonly Rule[]): GrammarTopicSource {
  const explanation = mostCommon(variants.map((rule) => rule.explanationUrdu));
  return {
    id,
    titleUrdu: mostCommon(variants.map((rule) => rule.titleUrdu)),
    titleEnglish: englishFromId(id),
    summaryUrdu: firstSentence(explanation),
    explanationUrdu: explanation,
    pointsUrdu: [],
    examples: [],
    questions: [],
  };
}

const posClass = (pos: PartOfSpeech) => (pos === 'adjective' ? 'noun' : pos);

function sentence(text: string): string {
  const trimmed = text.trim();
  return /[۔.!?؟]$/.test(trimmed) ? trimmed : `${trimmed}۔`;
}

function reference(occurrence: Occurrence): string {
  return `${occurrence.study.surah.nameUrdu}، آیت ${urduNumber(occurrence.word.ayah)}`;
}

function shuffleOptions(seed: string, options: PracticeOption[]): PracticeOption[] {
  return seededOrder(options, seed, (option) => option.id);
}

interface TopicContext {
  readonly record: GrammarTopicRecord;
  readonly occurrences: readonly Occurrence[];
  /** Share of this topic's occurrences per part of speech (noun includes adjective). */
  readonly posShare: ReadonlyMap<string, number>;
  readonly dominantPos: string | null;
}

/**
 * Build topics (one per Rule.id), examples and practice questions.
 * Throws when the authored library has errors (see checkGrammarSources).
 */
export function buildGrammarContent(
  studies: readonly StudyData[],
  topicSources: readonly GrammarTopicSource[],
  fatihahPractice: readonly PracticeQuestion[],
): GrammarContent {
  const index = indexStudies(studies);
  const report = checkSources(index, topicSources);
  if (report.errors.length)
    throw new Error(`Grammar topic library has errors:\n${report.errors.slice(0, 20).join('\n')}`);
  const sourceById = new Map(topicSources.map((source) => [source.id, source]));
  const sources = [...index.variants.keys()].map(
    (id) => sourceById.get(id) ?? fallbackSource(id, index.variants.get(id)!),
  );
  const occurrenceCount = (id: string) => index.occurrences.get(id)?.length ?? 0;
  sources.sort(
    (a, b) => occurrenceCount(b.id) - occurrenceCount(a.id) || (a.id < b.id ? -1 : 1),
  );

  const topics: GrammarTopicRecord[] = sources.map((source, position) => ({
    id: source.id,
    position: position + 1,
    titleUrdu: source.titleUrdu.trim(),
    titleEnglish: source.titleEnglish.trim(),
    summaryUrdu: source.summaryUrdu.trim(),
    explanationUrdu: source.explanationUrdu.trim(),
    pointsUrdu: source.pointsUrdu.map((point) => point.trim()),
    occurrenceCount: occurrenceCount(source.id),
  }));

  const related = new Map<string, Set<string>>();
  for (const topic of topics) related.set(topic.id, new Set([topic.id]));
  for (const group of RELATED_TOPIC_GROUPS)
    for (const id of group) for (const other of group) related.get(id)?.add(other);

  const contexts = topics.map((record): TopicContext => {
    const occurrences = index.occurrences.get(record.id) ?? [];
    const counts = new Map<string, number>();
    for (const { word } of occurrences)
      counts.set(posClass(word.pos), (counts.get(posClass(word.pos)) ?? 0) + 1);
    let dominantPos: string | null = null;
    for (const [pos, count] of counts)
      if (dominantPos === null || count > (counts.get(dominantPos) ?? 0)) dominantPos = pos;
    return {
      record,
      occurrences,
      dominantPos,
      posShare: new Map(
        [...counts].map(([pos, count]) => [pos, count / Math.max(occurrences.length, 1)]),
      ),
    };
  });

  const topicExamples: GrammarTopicExampleRecord[] = [];
  for (const context of contexts) {
    const source = sourceById.get(context.record.id);
    const annotated = source?.examples ?? [];
    annotated.forEach((example, position) =>
      topicExamples.push({
        topicId: context.record.id,
        kind: 'annotated',
        position: position + 1,
        wordId: example.wordId,
        noteUrdu: example.noteUrdu.trim(),
      }),
    );
    const exclude = new Set(annotated.map((example) => example.wordId));
    quranicExamples(context, exclude).forEach((occurrence, position) =>
      topicExamples.push({
        topicId: context.record.id,
        kind: 'quranic',
        position: position + 1,
        wordId: occurrence.word.id,
        noteUrdu: null,
      }),
    );
  }

  const questions: PracticeQuestion[] = fatihahPractice.map((question) => ({
    id: `fatihah/${question.id}`,
    promptUrdu: question.promptUrdu,
    options: question.options.map((option) => ({ ...option })),
    correctOptionId: question.correctOptionId,
    explanationUrdu: question.explanationUrdu,
    wordId: question.wordId,
    topicId: null,
    kind: 'fatihah',
  }));
  for (const context of contexts) {
    const topicId = context.record.id;
    for (const source of sourceById.get(topicId)?.questions ?? [])
      questions.push({
        id: `${topicId}/concept/${source.id}`,
        promptUrdu: source.promptUrdu.trim(),
        options: source.options.map((option) => ({
          id: option.id,
          text: option.text.trim(),
          language: option.language,
        })),
        correctOptionId: source.correctOptionId,
        explanationUrdu: source.explanationUrdu.trim(),
        wordId: source.wordId ?? null,
        topicId,
        kind: 'concept',
      });
    questions.push(...applyQuestions(context, contexts, related));
    questions.push(...spotQuestions(context, index, related));
  }
  return { topics, topicExamples, questions };
}

/** Up to 12 occurrences spread across Surahs, with distinct word forms, in Mushaf order. */
function quranicExamples(context: TopicContext, exclude: ReadonlySet<string>): Occurrence[] {
  const seed = `${context.record.id}/quranic`;
  const bySurah = new Map<number, Occurrence[]>();
  for (const occurrence of context.occurrences) {
    if (exclude.has(occurrence.word.id)) continue;
    const list = bySurah.get(occurrence.study.surah.number);
    if (list) list.push(occurrence);
    else bySurah.set(occurrence.study.surah.number, [occurrence]);
  }
  const queues = seededOrder([...bySurah.keys()], seed, String).map((surah) =>
    seededOrder(bySurah.get(surah)!, seed, (occurrence) => occurrence.word.id),
  );
  const forms = new Set<string>();
  const ayahs = new Set<string>();
  const chosen = new Set<Occurrence>();
  const take = (queue: readonly Occurrence[], distinctForm: boolean) => {
    const occurrence = queue.find(
      (entry) =>
        !chosen.has(entry) &&
        !ayahs.has(ayahKey(entry.study.surah.number, entry.word.ayah)) &&
        !(distinctForm && forms.has(normalizeText(entry.word.arabic))),
    );
    if (!occurrence) return false;
    chosen.add(occurrence);
    forms.add(normalizeText(occurrence.word.arabic));
    ayahs.add(ayahKey(occurrence.study.surah.number, occurrence.word.ayah));
    return true;
  };
  // One example per Surah first (a new word form when possible), then round-robin with new
  // forms, then (for particles with one or two forms) the same form in other ayahs.
  for (const queue of queues) {
    if (chosen.size >= MAX_QURANIC_EXAMPLES) break;
    if (!take(queue, true)) take(queue, false);
  }
  for (const distinctForm of [true, false]) {
    let progress = true;
    while (chosen.size < MAX_QURANIC_EXAMPLES && progress) {
      progress = false;
      for (const queue of queues) {
        if (chosen.size >= MAX_QURANIC_EXAMPLES) break;
        if (take(queue, distinctForm)) progress = true;
      }
    }
  }
  return [...chosen].sort(
    (a, b) =>
      a.study.surah.number - b.study.surah.number ||
      a.word.ayah - b.word.ayah ||
      a.word.position - b.word.position,
  );
}

/** Pick words in seeded order, preferring new Surahs and distinct word forms. */
function pickOccurrences(
  context: TopicContext,
  candidates: readonly Occurrence[],
  seed: string,
  limit: number,
  accept: (occurrence: Occurrence) => boolean,
): Occurrence[] {
  const ordered = seededOrder(candidates, seed, (occurrence) => occurrence.word.id);
  const chosen: Occurrence[] = [];
  const surahs = new Set<number>();
  const forms = new Set<string>();
  // Typical words first: the topic's usual part of speech, each from a new Surah.
  const typical = (occurrence: Occurrence) => posClass(occurrence.word.pos) === context.dominantPos;
  for (const pass of [2, 1, 0]) {
    for (const occurrence of ordered) {
      if (chosen.length >= limit) return chosen;
      const form = normalizeText(occurrence.word.arabic);
      if (forms.has(form) || chosen.includes(occurrence)) continue;
      if (pass > 0 && surahs.has(occurrence.study.surah.number)) continue;
      if (pass > 1 && !typical(occurrence)) continue;
      if (!accept(occurrence)) continue;
      chosen.push(occurrence);
      surahs.add(occurrence.study.surah.number);
      forms.add(form);
    }
  }
  return chosen;
}

/** «word» (Surah, ayah): which rule applies? One correct topic, three clearly unrelated ones. */
function applyQuestions(
  context: TopicContext,
  contexts: readonly TopicContext[],
  related: ReadonlyMap<string, ReadonlySet<string>>,
): PracticeQuestion[] {
  const topicId = context.record.id;
  const distractorsFor = (occurrence: Occurrence, seed: string) => {
    const excluded = new Set<string>();
    for (const ruleId of occurrence.word.ruleIds)
      for (const id of related.get(ruleId) ?? [ruleId]) excluded.add(id);
    for (const id of related.get(topicId) ?? []) excluded.add(id);
    const titles = new Set([context.record.titleUrdu]);
    const pos = posClass(occurrence.word.pos);
    const eligible = contexts.filter(
      (other) => !excluded.has(other.record.id) && other.record.occurrenceCount >= 5,
    );
    // Plausible first: frequent topics that usually apply to this part of speech.
    const plausible = eligible.filter(
      (other) => other.record.occurrenceCount >= 20 && (other.posShare.get(pos) ?? 0) >= 0.25,
    );
    const picked: TopicContext[] = [];
    for (const pool of [plausible, eligible])
      for (const other of seededOrder(pool, seed, (entry) => entry.record.id)) {
        if (picked.length >= 3) break;
        if (titles.has(other.record.titleUrdu) || picked.includes(other)) continue;
        titles.add(other.record.titleUrdu);
        picked.push(other);
      }
    return picked;
  };
  const words = pickOccurrences(
    context,
    context.occurrences,
    `${topicId}/apply`,
    MAX_APPLY_QUESTIONS,
    (occurrence) => Boolean(occurrence.word.syntaxUrdu.trim() && occurrence.word.meaningUrdu.trim()),
  );
  return words.flatMap((occurrence, index) => {
    const id = `${topicId}/apply/${index + 1}`;
    const distractors = distractorsFor(occurrence, id);
    if (distractors.length < 2) return [];
    const { word } = occurrence;
    const title = context.record.titleUrdu;
    return [
      {
        id,
        promptUrdu: `«${word.arabic}» (${reference(occurrence)}) میں کون سا قاعدہ لاگو ہوتا ہے؟`,
        options: shuffleOptions(id, [
          { id: topicId, text: title, language: 'ur' },
          ...distractors.map(
            (other): PracticeOption => ({
              id: other.record.id,
              text: other.record.titleUrdu,
              language: 'ur',
            }),
          ),
        ]),
        correctOptionId: topicId,
        explanationUrdu: [
          `«${word.arabic}» (${reference(occurrence)}) پر «${title}» کا قاعدہ لاگو ہوتا ہے۔`,
          sentence(context.record.summaryUrdu),
          `اس لفظ کی ترکیب: ${sentence(word.syntaxUrdu)}`,
          `معنی: «${word.meaningUrdu.trim()}»۔`,
        ].join(' '),
        wordId: word.id,
        topicId,
        kind: 'apply',
      },
    ];
  });
}

/** Which of these words (same Surah, nearby) is an example of the rule? */
function spotQuestions(
  context: TopicContext,
  index: StudyIndex,
  related: ReadonlyMap<string, ReadonlySet<string>>,
): PracticeQuestion[] {
  const topicId = context.record.id;
  const group = related.get(topicId) ?? new Set([topicId]);
  // The exact same Arabic text tagged elsewhere would make a "wrong" option look right (pause
  // signs aside: «رَيْبَ ۛ» and «رَيْبَ» are the same word).
  const taggedForms = new Set(context.occurrences.map(({ word }) => withoutPauseMarks(word.arabic)));
  const distractorsFor = (occurrence: Occurrence, seed: string): Word[] => {
    const { study, word } = occurrence;
    const forms = new Set([normalizeText(word.arabic)]);
    const eligible = (candidate: Word) =>
      candidate.id !== word.id &&
      !candidate.ruleIds.some((ruleId) => group.has(ruleId)) &&
      !taggedForms.has(withoutPauseMarks(candidate.arabic));
    const picked: Word[] = [];
    const surah = study.surah.number;
    const sameAyah = index.ayahWords.get(ayahKey(surah, word.ayah)) ?? [];
    // Then neighbouring ayahs, nearest first (earlier ayah before later at equal distance).
    function* nearby(): Generator<Word> {
      for (let distance = 1; distance < study.surah.ayahCount; distance += 1)
        for (const ayah of [word.ayah - distance, word.ayah + distance])
          yield* index.ayahWords.get(ayahKey(surah, ayah)) ?? [];
    }
    for (const pool of [seededOrder(sameAyah, seed, (entry) => entry.id), nearby()]) {
      for (const candidate of pool) {
        if (picked.length >= 3) return picked;
        const form = normalizeText(candidate.arabic);
        if (forms.has(form) || !eligible(candidate)) continue;
        forms.add(form);
        picked.push(candidate);
      }
    }
    return picked;
  };
  const results: PracticeQuestion[] = [];
  const used = new Set<string>();
  for (const minimum of [3, 2]) {
    const words = pickOccurrences(
      context,
      context.occurrences.filter((occurrence) => !used.has(occurrence.word.id)),
      `${topicId}/spot/${minimum}`,
      MAX_SPOT_QUESTIONS - results.length,
      (occurrence) =>
        distractorsFor(occurrence, occurrence.word.id).length >= minimum &&
        Boolean(occurrence.word.syntaxUrdu.trim()),
    );
    for (const occurrence of words) {
      used.add(occurrence.word.id);
      results.push(spotQuestion(context, occurrence, distractorsFor(occurrence, occurrence.word.id)));
    }
    if (results.length >= MAX_SPOT_QUESTIONS) break;
  }
  return results.map((question, index) => {
    const id = `${topicId}/spot/${index + 1}`;
    return { ...question, id, options: shuffleOptions(id, [...question.options]) };
  });
}

function spotQuestion(
  context: TopicContext,
  occurrence: Occurrence,
  distractors: readonly Word[],
): PracticeQuestion {
  const { word, study } = occurrence;
  const title = context.record.titleUrdu;
  return {
    id: '',
    promptUrdu: `${study.surah.nameUrdu} کے ان الفاظ میں سے کون سا «${title}» کی مثال ہے؟`,
    options: [word, ...distractors].map((entry) => ({
      id: entry.id,
      text: entry.arabic,
      language: 'ar',
    })),
    correctOptionId: word.id,
    explanationUrdu: [
      `«${word.arabic}» (${reference(occurrence)}) «${title}» کی مثال ہے۔`,
      `اس لفظ کی ترکیب: ${sentence(word.syntaxUrdu)}`,
      `معنی: «${word.meaningUrdu.trim()}»۔`,
      'باقی الفاظ پر اس مقام پر یہ قاعدہ لاگو نہیں ہوتا۔',
    ].join(' '),
    wordId: word.id,
    topicId: context.record.id,
    kind: 'spot',
  };
}

/** Word occurrence context for displaying an example. */
export interface ExampleWordContext {
  readonly surah: number;
  readonly ayah: number;
  readonly wordArabic: string;
  readonly wordArabicIndoPak: string;
  readonly meaningUrdu: string;
  readonly ayahArabic: string;
  readonly ayahArabicIndoPak: string;
  /** The ayah's translations keyed by translation id. */
  readonly translations: Readonly<Record<string, string>>;
}

/** Word-context lookup over study data (ayah Arabic = the ayah's words joined by spaces). */
export function createWordContextLookup(
  studies: readonly StudyData[],
): (wordId: string) => ExampleWordContext | null {
  const index = indexStudies(studies);
  return (wordId) => {
    const occurrence = index.words.get(wordId);
    if (!occurrence) return null;
    const { study, word } = occurrence;
    const ayah = study.ayahs.find((entry) => entry.number === word.ayah);
    const ayahWords = index.ayahWords.get(ayahKey(study.surah.number, word.ayah)) ?? [];
    return {
      surah: study.surah.number,
      ayah: word.ayah,
      wordArabic: word.arabic,
      wordArabicIndoPak: word.arabicIndoPak ?? '',
      meaningUrdu: word.meaningUrdu,
      ayahArabic: ayahWords.map((entry) => entry.arabic).join(' '),
      ayahArabicIndoPak: joinIndoPak(ayahWords.map((entry) => entry.arabicIndoPak)),
      translations: ayah?.translations ?? {},
    };
  };
}

/**
 * Display-time practice options for the bundled repository: each Arabic option that is a word
 * occurrence gets the word's IndoPak text (`toResolvedOption`, as the SQL repositories do).
 */
export function createPracticeResolver(
  studies: readonly StudyData[],
): (question: PracticeQuestion) => PracticeQuestion {
  const index = indexStudies(studies);
  return (question) => ({
    ...question,
    options: question.options.map((option) =>
      toResolvedOption(option, index.words.get(option.id)?.word),
    ),
  });
}

export function questionCounts(content: GrammarContent): Map<string, number> {
  const counts = new Map<string, number>();
  for (const question of content.questions)
    if (question.topicId) counts.set(question.topicId, (counts.get(question.topicId) ?? 0) + 1);
  return counts;
}

export function listTopicSummaries(content: GrammarContent): GrammarTopicSummary[] {
  const counts = questionCounts(content);
  return content.topics.map((topic) => toTopicSummary(topic, counts.get(topic.id) ?? 0));
}

/** Resolve one topic for the topic screen/dialog; null for an unknown id. */
export function resolveGrammarTopic(
  content: GrammarContent,
  id: string,
  lookup: (wordId: string) => ExampleWordContext | null,
): GrammarTopicDetail | null {
  const topic = content.topics.find((entry) => entry.id === id);
  if (!topic) return null;
  const examples: ResolvedTopicExample[] = content.topicExamples
    .filter((example) => example.topicId === id)
    .sort((a, b) => (a.kind < b.kind ? -1 : a.kind > b.kind ? 1 : a.position - b.position))
    .map((example) => {
      const word = lookup(example.wordId);
      if (!word) throw new Error(`Topic ${id}: example word ${example.wordId} is missing`);
      return toResolvedExample({
        kind: example.kind,
        wordId: example.wordId,
        ...word,
        noteUrdu: example.noteUrdu,
      });
    });
  return toTopicDetail(topic, questionCounts(content).get(id) ?? 0, examples);
}
