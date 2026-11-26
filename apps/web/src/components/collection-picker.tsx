import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Check, ChevronDown, Layers3, Search, X } from 'lucide-react';
import {
  formatCount,
  getJuzForAyah,
  getJuzStartAyah,
  getUiStrings,
  getSurahTitle,
  juzCatalog,
  searchSurahs,
  surahCatalog,
  type SurahCatalogEntry,
  type UiLanguage,
} from '@quran-grammar/core';

export type CollectionMode = 'surah' | 'juz';

/** Text direction of the typed query: Latin reads left to right even in the Urdu interface. */
function queryDirection(query: string, fallback: 'ltr' | 'rtl') {
  const first = /[a-zÀ-ɏ]|[؀-ۿ]/i.exec(query)?.[0];
  return !first ? fallback : /[؀-ۿ]/.test(first) ? 'rtl' : 'ltr';
}

/** Typing on a touch screen opens the keyboard over the list, so only fine pointers autofocus. */
function prefersSearchFocus() {
  return typeof matchMedia !== 'function' || !matchMedia('(pointer: coarse)').matches;
}

function SurahRow({
  surah,
  language,
  current,
  suggested,
  detail,
  jumpAyah,
  onChoose,
}: {
  surah: SurahCatalogEntry;
  language: UiLanguage;
  current: boolean;
  /** The row Enter in the search field opens. */
  suggested: boolean;
  /** Replaces the ayah count, e.g. the ayah range inside a juz. */
  detail?: string;
  jumpAyah?: number;
  onChoose: () => void;
}) {
  const ui = getUiStrings(language);
  const urdu = language === 'ur';
  const count = `${formatCount(surah.ayahCount, language)} ${ui.ayahs}`;
  return (
    <button
      type="button"
      className={`catalog-entry${suggested ? ' is-suggested' : ''}`}
      data-surah={surah.number}
      aria-current={current ? 'true' : undefined}
      onClick={onChoose}
    >
      <span className="catalog-number">{formatCount(surah.number, language)}</span>
      <span className="catalog-entry-copy">
        {urdu ? (
          <>
            <strong lang="ar" dir="rtl">
              {surah.nameArabic}
            </strong>
            <small>
              <bdi lang="en" dir="ltr">
                {surah.nameEnglish}
              </bdi>
              {' · '}
              {detail ?? count}
            </small>
          </>
        ) : (
          <>
            <strong lang="en">{surah.nameEnglish}</strong>
            <small>
              {surah.meaningEnglish} · {detail ?? count}
            </small>
          </>
        )}
      </span>
      {!urdu && (
        <span className="catalog-arabic" lang="ar" dir="rtl">
          {surah.nameArabic}
        </span>
      )}
      {jumpAyah !== undefined && (
        <span className="catalog-jump">
          {ui.ayah} {formatCount(jumpAyah, language)}
        </span>
      )}
      {current && <Check size={20} aria-hidden="true" />}
    </button>
  );
}

export function CollectionPicker({
  language,
  mode,
  surahNumber,
  ayahNumber,
  onSelect,
}: {
  language: UiLanguage;
  mode: CollectionMode;
  surahNumber: number;
  ayahNumber: number;
  /** startAyah is the chapter's first ayah inside the chosen juz, a searched ayah, or 1. */
  onSelect: (mode: CollectionMode, surahNumber: number, startAyah: number) => void;
}) {
  const ui = getUiStrings(language);
  const direction = language === 'ur' ? 'rtl' : 'ltr';
  const id = useId();
  const [open, setOpen] = useState(false);
  const [browseMode, setBrowseMode] = useState<CollectionMode>(mode);
  const [browseJuz, setBrowseJuz] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const currentJuz =
    getJuzForAyah(surahNumber, ayahNumber) ??
    juzCatalog.find((juz) => juz.surahNumbers.includes(surahNumber));
  const results = useMemo(() => searchSurahs(query), [query]);
  const searching = query.trim() !== '';
  const shownJuz = juzCatalog.find((juz) => juz.number === browseJuz);
  const dialog = useRef<HTMLDialogElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const subheading = useRef<HTMLHeadingElement>(null);
  const returnJuzFocus = useRef<number | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open || !dialog.current) return;
    const element = dialog.current;
    const oldOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = oldOverflow;
      trigger.current?.focus({ preventScroll: true });
    };
  }, [open]);
  // On opening a list, show the current chapter (or juz) and, with a fine pointer, focus search.
  useEffect(() => {
    if (!open || browseJuz !== null) return;
    list.current
      ?.querySelector('[aria-current="true"]')
      ?.scrollIntoView({ block: 'center', inline: 'nearest' });
    if (browseMode === 'surah' && prefersSearchFocus()) search.current?.focus();
  }, [open, browseMode, browseJuz]);
  useEffect(() => {
    if (!open || browseMode !== 'juz') return;
    if (browseJuz !== null) subheading.current?.focus();
    else if (returnJuzFocus.current !== null) {
      dialog.current
        ?.querySelector<HTMLButtonElement>(`[data-juz="${returnJuzFocus.current}"]`)
        ?.focus();
      returnJuzFocus.current = null;
    }
  }, [open, browseMode, browseJuz]);
  const select = (number: number, startAyah = 1) => {
    onSelect(browseMode, number, startAyah);
    setOpen(false);
  };
  const changeQuery = (value: string) => {
    setQuery(value);
    list.current?.scrollTo({ top: 0 });
  };
  const clearQuery = () => {
    changeQuery('');
    search.current?.focus();
  };

  const onSearchKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const first = searching ? results[0] : undefined;
      if (first) select(first.surah.number, first.ayah ?? 1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      list.current?.querySelector<HTMLButtonElement>('button')?.focus();
    } else if (event.key === 'Escape' && query) {
      // Escape clears the search first; a second Escape closes the dialog.
      event.preventDefault();
      changeQuery('');
    }
  };
  // Arrow keys move through the rows; up from the first row returns to the search field.
  const onListKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const buttons = [...(list.current?.querySelectorAll<HTMLButtonElement>('button') ?? [])];
    const index = buttons.indexOf(event.target as HTMLButtonElement);
    if (index < 0) return;
    const moves: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowUp: index - 1,
      Home: 0,
      End: buttons.length - 1,
    };
    if (event.key in moves) {
      event.preventDefault();
      const next = moves[event.key]!;
      if (next < 0) search.current?.focus();
      else buttons[Math.min(next, buttons.length - 1)]?.focus();
    } else if (
      search.current &&
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey &&
      event.key !== ' '
    ) {
      // Typing on a row continues the search.
      search.current.focus();
    }
  };

  const juzSummary = (surahNumbers: readonly number[]) => {
    const names = surahNumbers.map((number) => getSurahTitle(number, language));
    return names.length > 2 ? `${names[0]} – ${names.at(-1)}` : names.join(' · ');
  };

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="collection-trigger selector-chip"
        aria-haspopup="dialog"
        aria-label={mode === 'surah' ? ui.selectSurah : ui.selectJuz}
        onClick={() => {
          returnJuzFocus.current = null;
          setBrowseMode(mode);
          setBrowseJuz(null);
          setQuery('');
          setOpen(true);
        }}
      >
        <span className="selector-symbol">
          <Layers3 size={21} />
        </span>
        <span className="selector-copy">
          <small>
            {mode === 'surah'
              ? ui.surah
              : `${ui.juz} ${formatCount(currentJuz?.number || 1, language)}`}
          </small>
          <strong>{getSurahTitle(surahNumber, language)}</strong>
        </span>
        <ChevronDown size={17} />
      </button>
      <dialog
        ref={dialog}
        className="catalog-dialog ui"
        lang={language}
        dir={direction}
        aria-labelledby="catalog-title"
        onCancel={(event) => {
          if (browseMode === 'surah' && query) {
            event.preventDefault();
            clearQuery();
          } else setOpen(false);
        }}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
      >
        <div className="catalog-shell">
          <header className="catalog-header">
            <h2 id="catalog-title">{browseMode === 'surah' ? ui.selectSurah : ui.selectJuz}</h2>
            <button
              type="button"
              className="icon-button"
              aria-label={ui.close}
              onClick={() => setOpen(false)}
            >
              <X size={21} />
            </button>
          </header>
          <div className="catalog-modes" role="group" aria-label={`${ui.surah} / ${ui.juz}`}>
            {(['surah', 'juz'] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={browseMode === value}
                onClick={() => {
                  returnJuzFocus.current = null;
                  setBrowseMode(value);
                  setBrowseJuz(null);
                  setQuery('');
                }}
              >
                {value === 'surah' ? ui.surah : ui.juz}
              </button>
            ))}
          </div>
          {browseMode === 'surah' && (
            <>
              <label className="topic-search catalog-search">
                <Search size={18} aria-hidden="true" />
                <input
                  ref={search}
                  type="search"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  enterKeyHint="go"
                  dir={queryDirection(query, direction)}
                  aria-label={ui.searchSurahLabel}
                  aria-controls={`${id}-list`}
                  aria-describedby={`${id}-status`}
                  placeholder={ui.searchSurah}
                  value={query}
                  onChange={(event) => changeQuery(event.target.value)}
                  onKeyDown={onSearchKey}
                />
                {query && (
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={ui.clearSearch}
                    onClick={clearQuery}
                  >
                    <X size={18} />
                  </button>
                )}
              </label>
              <p id={`${id}-status`} className="sr-only" role="status">
                {searching ? `${formatCount(results.length, language)} ${ui.matches}` : ''}
              </p>
            </>
          )}
          {browseMode === 'juz' && browseJuz !== null && (
            <div className="catalog-subheading">
              <button type="button" className="text-button" onClick={() => setBrowseJuz(null)}>
                {ui.selectJuz}
              </button>
              <h3 ref={subheading} tabIndex={-1}>
                {ui.juz} {formatCount(browseJuz, language)}
              </h3>
            </div>
          )}
          <div
            ref={list}
            id={`${id}-list`}
            className="catalog-list"
            key={`${browseMode}-${browseJuz}`}
            onKeyDown={onListKey}
          >
            {browseMode === 'surah' ? (
              results.length ? (
                results.map((result, index) => (
                  <SurahRow
                    key={result.surah.number}
                    surah={result.surah}
                    language={language}
                    current={result.surah.number === surahNumber}
                    suggested={searching && index === 0}
                    jumpAyah={result.ayah}
                    onChoose={() => select(result.surah.number, result.ayah ?? 1)}
                  />
                ))
              ) : (
                <div className="catalog-empty">
                  <p>{ui.noSurahMatch}</p>
                  <small>{ui.surahSearchHelp}</small>
                </div>
              )
            ) : shownJuz ? (
              shownJuz.ranges.map((range) => (
                <SurahRow
                  key={range.surah}
                  surah={surahCatalog[range.surah - 1]!}
                  language={language}
                  current={range.surah === surahNumber}
                  suggested={false}
                  detail={`${ui.ayahRange} ${formatCount(range.firstAyah, language)}–${formatCount(range.lastAyah, language)}`}
                  onChoose={() => select(range.surah, getJuzStartAyah(shownJuz.number, range.surah))}
                />
              ))
            ) : (
              juzCatalog.map((juz) => (
                <button
                  type="button"
                  key={juz.number}
                  className="catalog-entry"
                  data-juz={juz.number}
                  aria-current={juz.number === currentJuz?.number ? 'true' : undefined}
                  onClick={() => {
                    if (juz.surahNumbers.length === 1)
                      select(juz.surahNumbers[0]!, getJuzStartAyah(juz.number, juz.surahNumbers[0]!));
                    else {
                      returnJuzFocus.current = juz.number;
                      setBrowseJuz(juz.number);
                    }
                  }}
                >
                  <span className="catalog-number">{formatCount(juz.number, language)}</span>
                  <span className="catalog-entry-copy">
                    <strong>
                      {ui.juz} {formatCount(juz.number, language)}
                    </strong>
                    <small>{juzSummary(juz.surahNumbers)}</small>
                  </span>
                  <ChevronDown size={16} aria-hidden="true" className="catalog-expand" />
                </button>
              ))
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
