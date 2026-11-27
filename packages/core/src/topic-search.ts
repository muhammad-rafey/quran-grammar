import {
  englishTarget,
  romanQuery,
  romanTarget,
  scoreEnglish,
  scoreRoman,
  type EnglishTarget,
  type RomanQuery,
  type RomanScore,
  type RomanTarget,
} from './roman';
import { normalizeText } from './search';

/** The fields the topic search reads; GrammarTopicSummary and GrammarTopicRecord both fit. */
export interface SearchableTopic {
  readonly id: string;
  readonly titleUrdu: string;
  readonly titleEnglish: string;
  readonly summaryUrdu?: string;
}

interface Prepared {
  readonly title: string;
  readonly all: string;
  readonly roman: RomanTarget;
  readonly summary: RomanTarget;
  readonly english: EnglishTarget;
}

const prepared = new WeakMap<SearchableTopic, Prepared>();
function prepare(topic: SearchableTopic): Prepared {
  let entry = prepared.get(topic);
  if (!entry) {
    entry = {
      title: normalizeText(topic.titleUrdu),
      all: normalizeText(
        [topic.id, topic.titleUrdu, topic.titleEnglish, topic.summaryUrdu ?? ''].join(' '),
      ),
      roman: romanTarget(topic.titleUrdu),
      summary: romanTarget(topic.summaryUrdu ?? ''),
      english: englishTarget(topic.titleEnglish, topic.id.replaceAll('-', ' ')),
    };
    prepared.set(topic, entry);
  }
  return entry;
}

/** Summary-only matches rank after every title match. */
const summaryTier = 4;

function summaryWords(query: RomanQuery): boolean {
  return query.required.every((variants) => variants.every((variant) => variant.length >= 3));
}

function better(a: RomanScore, b: RomanScore | undefined): boolean {
  return !b || a.tier < b.tier || (a.tier === b.tier && a.distance < b.distance);
}

/**
 * Grammar topic search for the Practice Grammar lists. Urdu or Arabic script matches the Urdu
 * title, English title and summary as typed (diacritics and letter variants ignored). A Latin
 * query matches the Urdu title in Roman Urdu ("muraqab e izafi" → مرکبِ اضافی, see roman.ts),
 * the English title in plain English ("possessive", "past tense") and, below those, words of
 * the Urdu summary. Results rank exact title > title prefix > substring > typo > summary only,
 * then fewer typos, then the topics' own order. An empty query returns every topic.
 */
export function searchTopics<T extends SearchableTopic>(topics: readonly T[], query: string): T[] {
  const needle = normalizeText(query);
  if (!needle) return [...topics];
  const roman = romanQuery(query);
  const scored: { topic: T; score: RomanScore; index: number }[] = [];
  topics.forEach((topic, index) => {
    const entry = prepare(topic);
    let best: RomanScore | undefined;
    const offer = (score: RomanScore | undefined) => {
      if (score && better(score, best)) best = score;
    };
    if (entry.title === needle) offer({ tier: 0, distance: 0 });
    else if (entry.title.startsWith(needle)) offer({ tier: 1, distance: 0 });
    else if (entry.title.includes(needle)) offer({ tier: 2, distance: 0 });
    else if (entry.all.includes(needle)) offer({ tier: summaryTier, distance: 0 });
    if (roman) {
      offer(scoreRoman(roman, entry.roman));
      offer(scoreEnglish(query, entry.english));
      // Summaries are long: only whole words of 3+ skeleton letters count there.
      if (!best && summaryWords(roman)) {
        const summary = scoreRoman(roman, entry.summary, { fuzzy: false });
        if (summary?.tier === 0) offer({ tier: summaryTier, distance: summary.distance });
      }
    }
    if (best) scored.push({ topic, score: best, index });
  });
  scored.sort(
    (a, b) => a.score.tier - b.score.tier || a.score.distance - b.score.distance || a.index - b.index,
  );
  return scored.map(({ topic }) => topic);
}
