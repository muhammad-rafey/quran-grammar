import { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Layers3, Search, Settings, SlidersHorizontal, X } from 'lucide-react';
import {
  matchesWord,
  formatCount,
  getUiStrings,
  type PartOfSpeechFilter,
} from '@quran-grammar/core';
import { Grammar } from './components/grammar';
import { Reading } from './components/reading';
import { WordDetail } from './components/word-detail';
import { useMobileLayout, useStudy } from './use-study';
import { useInterfaceLanguage } from './use-interface-language';

const hashWord = () => new URLSearchParams(location.hash.slice(1)).get('word');

export function App() {
  const { data: study, error, retry } = useStudy();
  const mobile = useMobileLayout();
  const { language, changeLanguage, saveError } = useInterfaceLanguage();
  const ui = getUiStrings(language);
  const direction = language === 'ur' ? 'rtl' : 'ltr';
  const filters: { id: PartOfSpeechFilter; label: string }[] = [
    { id: 'all', label: ui.allWords },
    { id: 'noun', label: ui.noun },
    { id: 'verb', label: ui.verb },
    { id: 'particle', label: ui.particle },
    { id: 'pronoun', label: ui.pronoun },
  ];
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('1:1:1');
  const [view, setView] = useState<'words' | 'grammar' | 'settings'>('words');
  const [query, setQuery] = useState('');
  const [pos, setPos] = useState<PartOfSpeechFilter>('all');
  const [meanings, setMeanings] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const selected = study?.words.find((word) => word.id === selectedId) || study?.words[0];
  const matches = useMemo(
    () =>
      new Set(
        study?.words.filter((word) => matchesWord(word, study, query, pos)).map((word) => word.id),
      ),
    [study, query, pos],
  );
  const filtering = !!query.trim() || pos !== 'all';

  useEffect(() => {
    if (!study) return;
    const update = () => {
      const id = hashWord();
      const valid = study.words.some((word) => word.id === id);
      setSelectedId(valid ? id! : study.words[0].id);
      setView('words');
      setSheetOpen(valid && matchMedia('(max-width: 1023px)').matches);
    };
    update();
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, [study]);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (
        event.key === '/' &&
        !sheetOpen &&
        !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')
      ) {
        event.preventDefault();
        setView('words');
        requestAnimationFrame(() => search.current?.focus());
      }
    };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, [sheetOpen]);

  useEffect(() => {
    if (!mobile) setSheetOpen(false);
  }, [mobile]);

  useEffect(() => {
    if (!mobile || !sheetOpen || !dialog.current) return;
    const element = dialog.current;
    const oldOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = oldOverflow;
      trigger.current?.focus({ preventScroll: true });
    };
  }, [mobile, sheetOpen]);

  const selectWord = (id: string, button?: HTMLElement) => {
    if (!study?.words.some((word) => word.id === id)) return;
    if (button) trigger.current = button;
    setSelectedId(id);
    history.replaceState(null, '', `#word=${encodeURIComponent(id)}`);
    if (mobile) setSheetOpen(true);
  };
  const goToAyah = (number: number, target: 'words' | 'grammar') => {
    setSheetOpen(false);
    setView(target);
    requestAnimationFrame(() =>
      document
        .getElementById(`${target === 'words' ? 'ayah' : 'grammar-ayah'}-${number}`)
        ?.scrollIntoView({
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
          block: 'start',
        }),
    );
  };
  const resetSearch = () => {
    setQuery('');
    setPos('all');
    search.current?.focus();
  };

  return (
    <>
      <a className="skip-link ui" lang={language} dir={direction} href="#main">
        {ui.backToStudy}
      </a>
      <header className="site-header ui" lang={language} dir={direction}>
        <a className="brand" href="./">
          <span className="brand-mark">
            <BookOpen size={23} strokeWidth={1.5} />
          </span>
          <span>{language === 'en' ? 'Quran Grammar' : 'قرآن گرامر'}</span>
        </a>
      </header>
      <main className="page-shell" id="main">
        <section className="surah-heading" dir="rtl" lang="ar">
          <h1>سورۃ الفاتحہ</h1>
        </section>
        <nav className="study-tabs ui" lang={language} dir={direction} aria-label={ui.study}>
          {(
            [
              { id: 'words', label: ui.study, Icon: BookOpen },
              { id: 'grammar', label: ui.grammar, Icon: Layers3 },
              { id: 'settings', label: ui.settings, Icon: Settings },
            ] as const
          ).map(({ id, label, Icon }) => (
            <button
              type="button"
              key={id}
              className={view === id ? 'active' : ''}
              aria-current={view === id ? 'page' : undefined}
              onClick={() => setView(id)}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
        {view === 'settings' ? (
          <section
            className="settings-view ui"
            dir={direction}
            lang={language}
            aria-label={ui.settings}
          >
            <div className="settings-card">
              <h2>{ui.interfaceLanguage}</h2>
              <p>{ui.languageHelp}</p>
              <div className="language-options" role="group" aria-label={ui.interfaceLanguage}>
                <button
                  type="button"
                  lang="en"
                  dir="ltr"
                  aria-pressed={language === 'en'}
                  onClick={() => changeLanguage('en')}
                >
                  English
                </button>
                <button
                  type="button"
                  lang="ur"
                  dir="rtl"
                  aria-pressed={language === 'ur'}
                  onClick={() => changeLanguage('ur')}
                >
                  اردو
                </button>
              </div>
              {saveError && (
                <p className="settings-error" role="alert">
                  {ui.preferenceError}
                </p>
              )}
            </div>
            <div className="settings-card about-card">
              <h2>{ui.about}</h2>
              <p>{ui.educationalDraft}</p>
              <p lang="en" dir="ltr">
                Linguistic data:{' '}
                <a href="https://corpus.quran.com" target="_blank" rel="noopener noreferrer">
                  Quranic Arabic Corpus
                </a>
              </p>
            </div>
          </section>
        ) : !study ? (
          <section
            className="load-state ui"
            lang={language}
            dir={direction}
            role="status"
            aria-live="polite"
          >
            {error ? (
              <>
                <h2>{ui.loadError}</h2>
                <button type="button" className="primary-button" onClick={retry}>
                  {ui.retry}
                </button>
              </>
            ) : (
              <>
                <div className="loading-line" />
                <h2>{ui.loading}</h2>
              </>
            )}
          </section>
        ) : view === 'words' ? (
          <>
            <section
              className="study-controls ui"
              lang={language}
              dir={direction}
              aria-label={ui.filters}
            >
              <div className="search-row">
                <label className="search-field">
                  <Search size={19} />
                  <input
                    ref={search}
                    type="search"
                    aria-label={ui.searchLabel}
                    placeholder={ui.searchPlaceholder}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    autoComplete="off"
                    dir="auto"
                  />
                </label>
                <button
                  type="button"
                  className={`filter-trigger ${filtersOpen || pos !== 'all' ? 'active' : ''}`}
                  aria-expanded={filtersOpen}
                  aria-controls="filter-panel"
                  onClick={() => setFiltersOpen((value) => !value)}
                >
                  <SlidersHorizontal size={18} />
                  <span>{ui.filters}</span>
                  {pos !== 'all' && <i className="active-filter-dot" />}
                </button>
              </div>
              {filtersOpen && (
                <div className="filter-panel" id="filter-panel">
                  <div className="filters" role="group" aria-label={ui.wordType}>
                    {filters.map((filter) => (
                      <button
                        type="button"
                        key={filter.id}
                        data-pos={filter.id}
                        aria-pressed={pos === filter.id}
                        className={pos === filter.id ? 'active' : ''}
                        onClick={() => setPos(filter.id)}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                  <label className="meaning-toggle">
                    <input
                      type="checkbox"
                      checked={meanings}
                      onChange={(event) => setMeanings(event.target.checked)}
                    />
                    <span className="toggle-track" aria-hidden="true" />
                    <span>{ui.wordMeanings}</span>
                  </label>
                  <nav className="ayah-nav" aria-label={ui.goToAyah}>
                    <span>{ui.ayah}</span>
                    {study.ayahs.map((ayah) => (
                      <button
                        type="button"
                        key={ayah.number}
                        onClick={() => goToAyah(ayah.number, 'words')}
                        aria-label={`${ui.goToAyah} ${formatCount(ayah.number, language)}`}
                      >
                        {formatCount(ayah.number, language)}
                      </button>
                    ))}
                  </nav>
                </div>
              )}
            </section>
            {filtering && (
              <div
                className={`search-feedback ui ${matches.size === 0 ? 'empty' : ''}`}
                lang={language}
                dir={direction}
                role="status"
              >
                <span>
                  {matches.size === 0
                    ? ui.noResults
                    : `${formatCount(matches.size, language)} ${ui.matches}`}
                </span>
                <button type="button" onClick={resetSearch}>
                  <X size={15} />
                  {ui.clearSearch}
                </button>
              </div>
            )}
            <div className="study-layout" dir="rtl" lang="ur">
              <div className="reading-column">
                <Reading
                  study={study}
                  language={language}
                  selectedId={selected!.id}
                  meanings={meanings}
                  filtering={filtering}
                  matches={matches}
                  onSelect={selectWord}
                />
              </div>
              {!mobile && (
                <aside className="word-detail" aria-label={ui.wordStudy}>
                  <WordDetail
                    word={selected!}
                    study={study}
                    language={language}
                    onSelect={selectWord}
                    onGrammar={(ayah) => goToAyah(ayah, 'grammar')}
                  />
                </aside>
              )}
            </div>
          </>
        ) : (
          <Grammar study={study} language={language} onRead={(ayah) => goToAyah(ayah, 'words')} />
        )}
        {study && mobile && (
          <dialog
            ref={dialog}
            className="word-sheet"
            dir="rtl"
            lang="ur"
            aria-labelledby="detail-title"
            onCancel={() => setSheetOpen(false)}
            onClose={() => setSheetOpen(false)}
            onClick={(event) => {
              if (event.target === event.currentTarget) setSheetOpen(false);
            }}
          >
            <div className="sheet-content">
              <span className="sheet-handle" aria-hidden="true" />
              <WordDetail
                word={selected!}
                study={study}
                language={language}
                onSelect={selectWord}
                onGrammar={(ayah) => goToAyah(ayah, 'grammar')}
                onClose={() => setSheetOpen(false)}
              />
            </div>
          </dialog>
        )}
      </main>
    </>
  );
}
