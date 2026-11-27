import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  Monitor,
  Moon,
  Settings,
  SlidersHorizontal,
  Sun,
  X,
} from 'lucide-react';
import {
  matchesWord,
  availableSurahNumbers,
  getSurahTitle,
  formatCount,
  getUiStrings,
  type PartOfSpeechFilter,
  type ThemePreference,
} from '@quran-grammar/core';
import { AyahPicker } from './components/ayah-picker';
import { CollectionPicker, type CollectionMode } from './components/collection-picker';
import { FontSettings } from './components/font-settings';
import { TranslationSettings } from './components/translation-settings';
import { PracticeGrammar } from './components/practice';
import { Reading } from './components/reading';
import { SplitPane } from './components/split-pane';
import { TopicDialog } from './components/topic-dialog';
import { WordDetail } from './components/word-detail';
import { useMobileLayout, useStudy } from './use-study';
import { useInterfaceLanguage } from './use-interface-language';
import { useReadingLayout, type ReadingLayout } from './use-reading-layout';
import { useTranslationChoice } from './use-translation';
import { useFonts } from './use-fonts';
import { useTheme } from './use-theme';
import type { PracticeFilter } from './use-api';
import {
  practiceFilter,
  practiceKey,
  readEntry,
  recordScreen,
  replaceHash,
  stepBack,
  type StudyView,
} from './practice-history';

// Deep links and hash changes scroll their word into view; history.replaceState never fires this.
function readLocation(scroll = true) {
  const params = new URLSearchParams(location.hash.slice(1));
  const word = params.get('word');
  const requested = Number(word?.split(':')[0] || params.get('surah') || 1);
  const ayah = Number(params.get('ayah'));
  return {
    surah: availableSurahNumbers.includes(requested) ? requested : 1,
    word,
    // Juz selections open a chapter at its first ayah inside that juz, e.g. Al-Kahf 75 for Juz 16.
    ayah: !word && Number.isSafeInteger(ayah) && ayah > 1 ? ayah : null,
    /** Scroll the reading column to the requested word (deep links, topic examples). */
    scroll,
  };
}

export function App() {
  const [locationRequest, setLocationRequest] = useState(readLocation);
  const { data: study, error, retry } = useStudy(locationRequest.surah);
  const appliedRequest = useRef<typeof locationRequest | null>(null);
  const mobile = useMobileLayout();
  const { language, changeLanguage, saveError } = useInterfaceLanguage();
  const { theme, changeTheme, saveError: themeSaveError } = useTheme();
  const { layout, changeLayout, saveError: layoutSaveError } = useReadingLayout();
  const { quranFont, urduFont, changeFont, saveError: fontSaveError } = useFonts();
  const {
    translationId,
    changeTranslation,
    saveError: translationSaveError,
  } = useTranslationChoice();
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
  const [view, setView] = useState<StudyView>('words');
  const [practice, setPractice] = useState<PracticeFilter | null>(null);
  const [topic, setTopic] = useState<{ id: string; trigger: HTMLElement | null } | null>(null);
  const [collectionMode, setCollectionMode] = useState<CollectionMode>('surah');
  const [activeAyah, setActiveAyah] = useState(1);
  const [pos, setPos] = useState<PartOfSpeechFilter>('all');
  const [meanings, setMeanings] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const stickyArea = useRef<HTMLDivElement>(null);
  const selected = study?.words.find((word) => word.id === selectedId) || study?.words[0];
  const matches = useMemo(
    () =>
      new Set(
        study?.words.filter((word) => matchesWord(word, study, '', pos)).map((word) => word.id),
      ),
    [study, pos],
  );
  // Word-type filters only apply to the word-by-word grammar layout.
  const filtering = layout.grammar && pos !== 'all';
  const themeOptions: { id: ThemePreference; label: string; Icon: typeof Sun }[] = [
    { id: 'system', label: ui.themeSystem, Icon: Monitor },
    { id: 'light', label: ui.themeLight, Icon: Sun },
    { id: 'dark', label: ui.themeDark, Icon: Moon },
  ];
  const layoutSwitches: { key: keyof ReadingLayout; label: string; help: string }[] = [
    { key: 'grammar', label: ui.showGrammarAnalysis, help: ui.showGrammarAnalysisHelp },
    { key: 'translation', label: ui.showTranslation, help: ui.showTranslationHelp },
  ];

  useEffect(() => {
    const update = () => {
      setSheetOpen(false);
      setPos('all');
      // Back/Forward to an entry this app recorded: popstate has restored its screen already.
      if (!readEntry(history.state)) {
        setTopic(null);
        setView('words');
      }
      setLocationRequest(readLocation());
    };
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);

  // Browser history of the practice flow (practice-history.ts): opening a quiz or a topic pushes an
  // entry, the browser's Back restores the previous screen, and the in-app Back is that same Back.
  const pushScreen = useRef(false);
  const topicTriggers = useRef(new Map<string, HTMLElement>());
  const currentPractice = practiceKey(practice);
  const currentTopic = topic?.id ?? null;
  useEffect(() => {
    const push = pushScreen.current;
    pushScreen.current = false;
    recordScreen({ view, practice: currentPractice, topic: currentTopic }, push);
  }, [view, currentPractice, currentTopic]);
  useEffect(() => {
    const restore = (event: PopStateEvent) => {
      pushScreen.current = false;
      const entry = readEntry(event.state);
      if (entry) setView(entry.view);
      setPractice(practiceFilter(entry?.practice ?? null));
      setTopic(
        entry?.topic
          ? { id: entry.topic, trigger: topicTriggers.current.get(entry.topic) ?? null }
          : null,
      );
    };
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, []);
  const openTopic = (id: string, button: HTMLElement | null) => {
    if (button) topicTriggers.current.set(id, button);
    if (topic?.id === id) return;
    pushScreen.current = true;
    setTopic({ id, trigger: button });
  };
  const closeTopic = () => stepBack(() => setTopic(null));
  const selectPractice = (filter: PracticeFilter | null) => {
    if (!filter) return stepBack(() => setPractice(null));
    pushScreen.current = true;
    setPractice(filter);
  };

  useEffect(() => {
    if (!study || appliedRequest.current === locationRequest) return;
    appliedRequest.current = locationRequest;
    const target = study.words.find((word) => word.id === locationRequest.word);
    const startWord = target
      ? undefined
      : study.words.find((word) => word.ayah === locationRequest.ayah);
    setSelectedId(target?.id || startWord?.id || study.words[0].id);
    setActiveAyah(target?.ayah || startWord?.ayah || 1);
    setSheetOpen(!!target && matchMedia('(max-width: 1023px)').matches);
    if (target && locationRequest.scroll)
      requestAnimationFrame(() =>
        document
          .querySelector(`[data-word-id="${target.id}"]`)
          ?.scrollIntoView({ behavior: 'instant', block: 'center' }),
      );
    if (startWord)
      requestAnimationFrame(() =>
        document
          .getElementById(`ayah-${startWord.ayah}`)
          ?.scrollIntoView({ behavior: 'instant', block: 'start' }),
      );
  }, [study, locationRequest]);

  useEffect(() => {
    document.title = `${getSurahTitle(locationRequest.surah, language)} · Quran Grammar`;
  }, [locationRequest.surah, language]);

  useEffect(() => {
    if (!mobile) setSheetOpen(false);
  }, [mobile]);

  // The sticky study toolbar (with any open filters) offsets the word panel and ayah jumps.
  useLayoutEffect(() => {
    const element = stickyArea.current;
    const root = document.documentElement;
    if (!element || typeof ResizeObserver === 'undefined') return;
    const update = () =>
      root.style.setProperty('--sticky-height', `${Math.round(element.offsetHeight)}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => {
      observer.disconnect();
      root.style.removeProperty('--sticky-height');
    };
  }, [view]);

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

  /** Bring a word into view in the reading column when it was chosen from elsewhere. */
  const revealWord = (id: string, focus = false) =>
    requestAnimationFrame(() => {
      const element = document.querySelector<HTMLElement>(`#reading [data-word-id="${id}"]`);
      if (!element) return;
      if (focus) element.focus({ preventScroll: true });
      const box = element.getBoundingClientRect();
      const top = stickyArea.current?.getBoundingClientRect().bottom ?? 0;
      const bottom =
        document.querySelector('.bottom-nav')?.getBoundingClientRect().top ?? innerHeight;
      if (box.top >= top && box.bottom <= bottom) return;
      element.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
  const selectWord = (id: string, button?: HTMLElement) => {
    if (!study?.words.some((word) => word.id === id)) return;
    if (button) trigger.current = button;
    setSelectedId(id);
    setActiveAyah(study.words.find((word) => word.id === id)!.ayah);
    replaceHash(`#word=${encodeURIComponent(id)}`);
    if (mobile) setSheetOpen(true);
    // Next/previous and related words in the side panel keep the reading column in step.
    else if (!button) revealWord(id);
  };
  /** Ayahs visible below the sticky toolbar: keep the selected word's ayah, else the topmost. */
  const visibleAyahs = (numbers: number[]) => {
    if (!numbers.length) return;
    const current = selected?.ayah;
    setActiveAyah(current !== undefined && numbers.includes(current) ? current : numbers[0]!);
  };
  const latestStep = useRef<(event: KeyboardEvent) => void>(() => {});
  // Arrow keys step through words in Quranic reading order (right to left): ← next, → previous.
  latestStep.current = (event) => {
    if (view !== 'words' || !study || !selected) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
      return;
    const target = event.target instanceof Element ? event.target : null;
    if (
      target?.closest(
        'input, textarea, select, [contenteditable="true"], [role="separator"], [role="slider"]',
      ) ||
      document.querySelector('dialog[open]:not(.word-sheet)')
    )
      return;
    const index = study.words.findIndex((word) => word.id === selected.id);
    const next = study.words[index + (event.key === 'ArrowLeft' ? 1 : -1)];
    if (!next) return;
    event.preventDefault();
    const fromReading = !!target?.closest('#reading [data-word-id]');
    setSelectedId(next.id);
    setActiveAyah(next.ayah);
    replaceHash(`#word=${encodeURIComponent(next.id)}`);
    if (!sheetOpen) revealWord(next.id, fromReading);
  };
  useEffect(() => {
    const listener = (event: KeyboardEvent) => latestStep.current(event);
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, []);
  // Topic examples open their word through the same #word=s:a:p location as deep links.
  const openWord = (id: string) => {
    replaceHash(`#word=${encodeURIComponent(id)}`);
    setTopic(null);
    setSheetOpen(false);
    setPos('all');
    setView('words');
    setLocationRequest(readLocation(true));
  };
  // A new entry above the topic's, so Back returns to the topic dialog (as on mobile).
  const practiseTopic = (topicId: string) => {
    pushScreen.current = true;
    setTopic(null);
    setSheetOpen(false);
    setPractice({ topicId });
    setView('practice');
  };
  const goToAyah = (number: number) => {
    setSheetOpen(false);
    setActiveAyah(number);
    const firstWord = study?.words.find((word) => word.ayah === number);
    if (firstWord) {
      setSelectedId(firstWord.id);
      replaceHash(`#word=${encodeURIComponent(firstWord.id)}`);
    }
    setView('words');
    requestAnimationFrame(() =>
      document.getElementById(`ayah-${number}`)?.scrollIntoView({
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        block: 'start',
      }),
    );
  };

  return (
    <>
      <a
        className="skip-link ui"
        lang={language}
        dir={direction}
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        {ui.backToStudy}
      </a>
      <header className="site-header ui" lang={language} dir={direction}>
        <a className="brand" href="./">
          <img className="brand-mark" src="/brand/logo.png" width="44" height="44" alt="" />
          <span>{language === 'en' ? 'Quran Grammar' : 'قرآن گرامر'}</span>
        </a>
      </header>
      <main className="page-shell" id="main" tabIndex={-1}>
        <h1 className="sr-only">{getSurahTitle(locationRequest.surah, language)}</h1>
        {view === 'words' && (
          <div className="study-sticky" ref={stickyArea}>
            <section
              className="lesson-toolbar ui"
              lang={language}
              dir={direction}
              aria-label={ui.study}
            >
              <CollectionPicker
                language={language}
                mode={collectionMode}
                surahNumber={locationRequest.surah}
                ayahNumber={activeAyah}
                onSelect={(mode, surahNumber, startAyah) => {
                  setCollectionMode(mode);
                  setPos('all');
                  setActiveAyah(startAyah);
                  setSheetOpen(false);
                  replaceHash(
                    startAyah > 1
                      ? `#surah=${surahNumber}&ayah=${startAyah}`
                      : `#surah=${surahNumber}`,
                  );
                  setLocationRequest({
                    surah: surahNumber,
                    word: null,
                    ayah: startAyah > 1 ? startAyah : null,
                    scroll: false,
                  });
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
              />
              <AyahPicker
                language={language}
                ayahs={study?.ayahs.map((ayah) => ayah.number) ?? []}
                current={activeAyah}
                disabled={!study}
                onSelect={goToAyah}
              />
              {study && layout.grammar && (
                <button
                  type="button"
                  aria-label={ui.filters}
                  title={ui.filters}
                  className={`filter-trigger ${filtersOpen || pos !== 'all' ? 'active' : ''}`}
                  aria-expanded={filtersOpen}
                  aria-controls="filter-panel"
                  onClick={() => setFiltersOpen((value) => !value)}
                >
                  <SlidersHorizontal size={20} />
                  {pos !== 'all' && <i className="active-filter-dot" />}
                </button>
              )}
            </section>
            {study && filtersOpen && layout.grammar && (
              <section
                className="study-controls ui"
                lang={language}
                dir={direction}
                aria-label={ui.filters}
              >
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
                </div>
              </section>
            )}
            {study && filtering && (
              <div
                className={`filter-feedback ui ${matches.size === 0 ? 'empty' : ''}`}
                lang={language}
                dir={direction}
                role="status"
              >
                <span>
                  {matches.size === 0
                    ? ui.noResults
                    : `${formatCount(matches.size, language)} ${ui.matches}`}
                </span>
                <button type="button" onClick={() => setPos('all')}>
                  <X size={15} />
                  {ui.reset}
                </button>
              </div>
            )}
          </div>
        )}
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
            <div className="settings-card">
              <h2 id="theme-title">{ui.theme}</h2>
              <p>{ui.themeHelp}</p>
              <div
                className="language-options theme-options"
                role="group"
                aria-labelledby="theme-title"
              >
                {themeOptions.map(({ id, label, Icon }) => (
                  <button
                    type="button"
                    key={id}
                    data-theme-option={id}
                    aria-pressed={theme === id}
                    onClick={() => changeTheme(id)}
                  >
                    <Icon size={18} aria-hidden="true" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
              {themeSaveError && (
                <p className="settings-error" role="alert">
                  {ui.preferenceError}
                </p>
              )}
            </div>
            <div className="settings-card">
              <h2 id="reading-layout-title">{ui.readingLayout}</h2>
              <p>{ui.readingLayoutHelp}</p>
              <div className="layout-switches" role="group" aria-labelledby="reading-layout-title">
                {layoutSwitches.map(({ key, label, help }) => (
                  <label className="layout-switch" key={key}>
                    <span className="layout-switch-copy">
                      <strong>{label}</strong>
                      <small>{help}</small>
                    </span>
                    <input
                      type="checkbox"
                      role="switch"
                      data-layout={key}
                      checked={layout[key]}
                      onChange={(event) => {
                        changeLayout({ [key]: event.target.checked });
                        if (key === 'grammar' && !event.target.checked) {
                          setPos('all');
                          setFiltersOpen(false);
                        }
                      }}
                    />
                    <span className="toggle-track" aria-hidden="true" />
                  </label>
                ))}
              </div>
              {layoutSaveError && (
                <p className="settings-error" role="alert">
                  {ui.preferenceError}
                </p>
              )}
            </div>
            <TranslationSettings
              language={language}
              study={study ?? null}
              translationId={translationId}
              onChange={changeTranslation}
              saveError={translationSaveError}
            />
            <FontSettings
              language={language}
              study={study ?? null}
              quranFont={quranFont}
              urduFont={urduFont}
              translationId={translationId}
              onChange={changeFont}
              saveError={fontSaveError}
            />
            <div className="settings-card about-card">
              <h2>{ui.about}</h2>
              <p lang="en" dir="ltr">
                Linguistic data:{' '}
                <a href="https://corpus.quran.com" target="_blank" rel="noopener noreferrer">
                  Quranic Arabic Corpus
                </a>
              </p>
              <p lang="en" dir="ltr">
                {language === 'ur' ? (
                  <span lang="ur" dir="rtl">
                    {ui.translationSource}:{' '}
                  </span>
                ) : (
                  `${ui.translationSource}: `
                )}
                <a href="https://quran.com" target="_blank" rel="noopener noreferrer">
                  Quran.com
                </a>
              </p>
            </div>
          </section>
        ) : view === 'practice' ? (
          <PracticeGrammar
            language={language}
            quranFont={quranFont}
            selection={practice}
            onSelect={selectPractice}
            onOpenTopic={openTopic}
          />
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
                <p>{ui.connectionHint}</p>
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
        ) : (
          <>
            <SplitPane
              className="study-layout"
              dir="rtl"
              lang="ur"
              enabled={!mobile}
              label={ui.resizePanels}
              labelLang={language}
              controls="word-detail-panel"
              reading={
                <div className="reading-column">
                  <Reading
                    study={study}
                    language={language}
                    selectedId={selected!.id}
                    meanings={meanings}
                    filtering={filtering}
                    matches={matches}
                    layout={layout}
                    translationId={translationId}
                    quranFont={quranFont}
                    onSelect={selectWord}
                    onVisibleAyahs={visibleAyahs}
                  />
                </div>
              }
              detail={
                !mobile && (
                  <aside className="word-detail" id="word-detail-panel" aria-label={ui.wordStudy}>
                    <WordDetail
                      word={selected!}
                      study={study}
                      language={language}
                      quranFont={quranFont}
                      onSelect={selectWord}
                      onTopic={openTopic}
                    />
                  </aside>
                )
              }
            />
          </>
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
                quranFont={quranFont}
                onSelect={selectWord}
                onTopic={openTopic}
                onClose={() => setSheetOpen(false)}
              />
            </div>
          </dialog>
        )}
        {topic && (
          <TopicDialog
            key={topic.id}
            topicId={topic.id}
            language={language}
            returnFocus={topic.trigger}
            onClose={closeTopic}
            onWord={openWord}
            onPractice={practiseTopic}
            translationId={translationId}
            quranFont={quranFont}
          />
        )}
      </main>
      <nav className="bottom-nav ui" lang={language} dir={direction} aria-label={ui.study}>
        {(
          [
            { id: 'words', label: ui.study, Icon: BookOpen },
            { id: 'practice', label: ui.practiceGrammar, Icon: GraduationCap },
            { id: 'settings', label: ui.settings, Icon: Settings },
          ] as const
        ).map(({ id, label, Icon }) => (
          <button
            type="button"
            key={id}
            className={view === id ? 'active' : ''}
            aria-label={label}
            title={label}
            aria-current={view === id ? 'page' : undefined}
            onClick={() => {
              setSheetOpen(false);
              // Re-selecting Practice Grammar returns to its topic list.
              if (id === 'practice' && view === 'practice') setPractice(null);
              setView(id);
              if (id === 'words') {
                setActiveAyah(1);
                if (study) {
                  setSelectedId(study.words[0].id);
                  replaceHash(`#word=${encodeURIComponent(study.words[0].id)}`);
                }
              }
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
          >
            <Icon size={23} strokeWidth={2} aria-hidden="true" />
            <span className="nav-label">{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
