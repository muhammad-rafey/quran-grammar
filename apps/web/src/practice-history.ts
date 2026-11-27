import type { PracticeFilter } from './use-api';

export type StudyView = 'words' | 'practice' | 'settings';

/**
 * Browser history for the practice flow, so the browser Back button (and Android's back gesture in
 * a mobile browser) does what the in-app Back does. Opening a quiz or a grammar topic pushes an
 * entry; every other change (tabs, words, hash links) replaces the current one. The entry records
 * what was on screen, and popstate restores it. The URL is never changed here, so the #word= /
 * #surah= links work as before.
 */
export type HistoryScreen = {
  readonly view: StudyView;
  /** practiceKey() of the open quiz. */
  readonly practice: string | null;
  /** The open grammar topic dialog. */
  readonly topic: string | null;
};
export type HistoryEntry = HistoryScreen & {
  readonly qgScreen: 1;
  /** Entries this app pushed on top of the first one; in-app Back steps back while above 0. */
  readonly depth: number;
};

const views: readonly string[] = ['words', 'practice', 'settings'];

export function practiceKey(filter: PracticeFilter | null): string | null {
  if (!filter) return null;
  return 'set' in filter ? `set:${filter.set}` : `topic:${filter.topicId}`;
}

export function practiceFilter(key: string | null): PracticeFilter | null {
  if (key === 'set:fatihah') return { set: 'fatihah' };
  if (key?.startsWith('topic:') && key.length > 6) return { topicId: key.slice(6) };
  return null;
}

/** history.state when this app wrote it, else null (a new #hash entry or another page's state). */
export function readEntry(state: unknown): HistoryEntry | null {
  if (!state || typeof state !== 'object') return null;
  const entry = state as Partial<HistoryEntry>;
  if (entry.qgScreen !== 1 || typeof entry.view !== 'string' || !views.includes(entry.view))
    return null;
  return {
    qgScreen: 1,
    view: entry.view,
    practice: typeof entry.practice === 'string' ? entry.practice : null,
    topic: typeof entry.topic === 'string' ? entry.topic : null,
    depth: Number.isSafeInteger(entry.depth) && entry.depth! > 0 ? entry.depth! : 0,
  };
}

export function sameScreen(a: HistoryScreen, b: HistoryScreen): boolean {
  return a.view === b.view && a.practice === b.practice && a.topic === b.topic;
}

/**
 * Record `screen` in history: a new entry when `push` (a quiz or topic was opened), otherwise in
 * place. Nothing is written when the current entry already shows it (e.g. right after popstate).
 */
export function recordScreen(screen: HistoryScreen, push: boolean) {
  const current = readEntry(history.state);
  if (current && sameScreen(current, screen)) return;
  const depth = current?.depth ?? 0;
  const entry: HistoryEntry = { qgScreen: 1, ...screen, depth: push ? depth + 1 : depth };
  if (push) history.pushState(entry, '');
  else history.replaceState(entry, '');
}

/**
 * The in-app Back of a quiz or topic dialog: the browser's Back when this app pushed the current
 * entry (popstate then restores the previous screen), else `fallback`.
 */
export function stepBack(fallback: () => void) {
  if ((readEntry(history.state)?.depth ?? 0) > 0) history.back();
  else fallback();
}

/** Change the #hash of the current entry and keep its recorded screen. */
export function replaceHash(hash: string) {
  history.replaceState(history.state, '', hash);
}
