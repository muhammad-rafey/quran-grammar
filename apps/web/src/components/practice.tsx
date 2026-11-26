import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Check,
  CircleHelp,
  RotateCcw,
  Search,
  Sparkles,
  Sprout,
  X,
} from 'lucide-react';
import {
  formatCount,
  getSurahTitle,
  getUiStrings,
  gradePracticeAnswer,
  normalizeText,
  practiceOptionText,
  type GrammarTopicSummary,
  type PracticeQuestion,
  type ReadingFont,
  type UiLanguage,
} from '@quran-grammar/core';
import { usePractice, useTopics, type PracticeFilter } from '../use-api';

/** One multiple-choice quiz: choose, check, explanation, next, score and restart. */
export function QuizRunner({
  questions,
  language,
  title,
  subtitle,
  onBack,
  quranFont,
}: {
  questions: readonly PracticeQuestion[];
  language: UiLanguage;
  /** Selected Quran font: IndoPak fonts show Quranic word options in IndoPak text. */
  quranFont: ReadingFont;
  title: string;
  subtitle?: { text: string; lang: 'en' | 'ur' };
  onBack?: () => void;
}) {
  const ui = getUiStrings(language);
  const direction = language === 'ur' ? 'rtl' : 'ltr';
  const heading = useRef<HTMLHeadingElement>(null);
  const feedback = useRef<HTMLDivElement>(null);
  const focusHeading = () => requestAnimationFrame(() => heading.current?.focus());
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [complete, setComplete] = useState(false);
  const total = questions.length;
  const question = questions[Math.min(index, total - 1)]!;
  const correct = choice !== null && gradePracticeAnswer(question, choice) === true;
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, []);
  const restart = () => {
    setIndex(0);
    setChoice(null);
    setChecked(false);
    setScore(0);
    setComplete(false);
    focusHeading();
  };
  const check = () => {
    if (!choice || checked) return;
    setChecked(true);
    if (correct) setScore((value) => value + 1);
    requestAnimationFrame(() => feedback.current?.focus());
  };
  const next = () => {
    if (index === total - 1) setComplete(true);
    else {
      setIndex((value) => value + 1);
      setChoice(null);
      setChecked(false);
    }
    focusHeading();
  };
  return (
    <section className="practice-card ui" dir={direction} lang={language} aria-label={title}>
      {onBack && (
        <button type="button" className="text-button practice-back" onClick={onBack}>
          {language === 'ur' ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          {ui.allTopics}
        </button>
      )}
      <header className="practice-header">
        <span className="practice-mark">
          <Sparkles size={21} />
        </span>
        <div className="practice-title">
          <h2>{title}</h2>
          {subtitle && (
            <small lang={subtitle.lang} dir={subtitle.lang === 'ur' ? 'rtl' : 'ltr'}>
              {subtitle.text}
            </small>
          )}
        </div>
        <span className="practice-count">
          {complete ? (
            <Check size={18} />
          ) : (
            `${formatCount(index + 1, language)} / ${formatCount(total, language)}`
          )}
        </span>
      </header>
      <div
        className="practice-progress"
        role="progressbar"
        aria-label={ui.practice}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={complete ? total : index}
      >
        <span style={{ width: `${(complete ? 1 : index / total) * 100}%` }} />
      </div>
      {complete ? (
        <div className="practice-complete" role="status">
          <span className="completion-mark">
            <Sprout size={34} />
          </span>
          <h3 ref={heading} tabIndex={-1}>
            {ui.practiceComplete}
          </h3>
          <p>
            {ui.practiceScore}: {formatCount(score, language)} / {formatCount(total, language)}
          </p>
          <div className="practice-complete-actions">
            <button type="button" className="primary-button" onClick={restart}>
              <RotateCcw size={17} />
              {ui.restartPractice}
            </button>
            {onBack && (
              <button type="button" className="secondary-button" onClick={onBack}>
                {ui.allTopics}
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <h3 ref={heading} tabIndex={-1} className="practice-prompt" lang="ur" dir="rtl">
            {question.promptUrdu}
          </h3>
          <div
            className={`practice-options ${question.options.length === 4 ? 'four' : ''}`}
            role="group"
            aria-label={ui.chooseAnswer}
          >
            {question.options.map((option) => (
              <button
                type="button"
                key={`${question.id}-${option.id}`}
                disabled={checked}
                data-answer={option.id}
                aria-pressed={choice === option.id}
                lang={option.language}
                dir="rtl"
                className={`practice-option ${choice === option.id ? 'selected' : ''} ${checked && option.id === question.correctOptionId ? 'correct' : ''}`}
                onClick={() => setChoice(option.id)}
              >
                <span>{practiceOptionText(option, quranFont)}</span>
                {checked && option.id === question.correctOptionId && <Check size={18} />}
              </button>
            ))}
          </div>
          {checked && (
            <div
              ref={feedback}
              tabIndex={-1}
              className={`practice-feedback ${correct ? 'correct' : 'retry'}`}
              role="status"
            >
              <strong>
                {correct ? <Check size={19} /> : <CircleHelp size={19} />}
                {correct ? ui.correctAnswer : ui.tryAgainAnswer}
              </strong>
              <p lang="ur" dir="rtl">
                {question.explanationUrdu}
              </p>
            </div>
          )}
          <div className="practice-actions">
            {!checked ? (
              <button type="button" className="primary-button" disabled={!choice} onClick={check}>
                {ui.checkAnswer}
              </button>
            ) : (
              <button type="button" className="primary-button" onClick={next}>
                {index === total - 1 ? ui.practiceComplete : ui.nextQuestion}
                <ArrowRight size={17} />
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
}

/** Loading / failure placeholder shared by the practice view and topic dialog. */
export function LoadState({
  language,
  error,
  onRetry,
}: {
  language: UiLanguage;
  error: boolean;
  onRetry: () => void;
}) {
  const ui = getUiStrings(language);
  return (
    <div
      className="load-state ui"
      lang={language}
      dir={language === 'ur' ? 'rtl' : 'ltr'}
      role="status"
      aria-live="polite"
    >
      {error ? (
        <>
          <h2>{ui.loadFailed}</h2>
          <button type="button" className="primary-button" onClick={onRetry}>
            {ui.retry}
          </button>
        </>
      ) : (
        <>
          <div className="loading-line" />
          <h2>{ui.loading}</h2>
        </>
      )}
    </div>
  );
}

function PracticeQuiz({
  filter,
  topic,
  language,
  quranFont,
  onBack,
}: {
  filter: PracticeFilter;
  topic: GrammarTopicSummary | undefined;
  language: UiLanguage;
  quranFont: ReadingFont;
  onBack: () => void;
}) {
  const ui = getUiStrings(language);
  const { data, error, retry } = usePractice(filter);
  const fatihah = 'set' in filter;
  const title = fatihah
    ? ui.quickPractice
    : topic
      ? language === 'ur'
        ? topic.titleUrdu
        : topic.titleEnglish
      : ui.practice;
  const subtitle = fatihah
    ? { text: ui.practiceDescription, lang: language }
    : topic && language === 'en'
      ? { text: topic.titleUrdu, lang: 'ur' as const }
      : undefined;
  if (!data || data.length === 0)
    return (
      <div className="practice-loading">
        <button
          type="button"
          className="text-button practice-back ui"
          lang={language}
          dir={language === 'ur' ? 'rtl' : 'ltr'}
          onClick={onBack}
        >
          {language === 'ur' ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          {ui.allTopics}
        </button>
        <LoadState language={language} error={error || data?.length === 0} onRetry={retry} />
      </div>
    );
  return (
    <QuizRunner
      questions={data}
      language={language}
      title={title}
      subtitle={subtitle}
      onBack={onBack}
      quranFont={quranFont}
    />
  );
}

/**
 * Practice Grammar view: searchable topic list, Al-Fatihah quick practice and the quiz runner
 * for the selected topic. The selection lives in the app so the topic dialog can open a quiz.
 */
export function PracticeGrammar({
  language,
  quranFont,
  selection,
  onSelect,
  onOpenTopic,
}: {
  language: UiLanguage;
  quranFont: ReadingFont;
  selection: PracticeFilter | null;
  onSelect: (filter: PracticeFilter | null) => void;
  onOpenTopic: (id: string, trigger: HTMLElement) => void;
}) {
  const ui = getUiStrings(language);
  const direction = language === 'ur' ? 'rtl' : 'ltr';
  const { data: topics, error, retry } = useTopics();
  const [query, setQuery] = useState('');
  const list = useRef<HTMLDivElement>(null);
  const lastSelection = useRef<string | null>(null);
  const selectionKey = !selection ? null : 'set' in selection ? 'fatihah' : selection.topicId;
  const shown = useMemo(() => {
    const needle = normalizeText(query);
    if (!topics || !needle) return topics;
    return topics.filter((topic) =>
      normalizeText(`${topic.titleUrdu} ${topic.titleEnglish} ${topic.summaryUrdu}`).includes(
        needle,
      ),
    );
  }, [topics, query]);

  useEffect(() => {
    if (selectionKey) {
      lastSelection.current = selectionKey;
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    // Back to the list: return focus to the entry that opened the quiz.
    const previous = lastSelection.current;
    if (!previous) return;
    requestAnimationFrame(() =>
      list.current
        ?.querySelector<HTMLButtonElement>(`[data-practice="${previous}"]`)
        ?.focus({ preventScroll: false }),
    );
  }, [selectionKey]);

  if (selection)
    return (
      <section className="practice-view" aria-label={ui.practiceGrammar}>
        <PracticeQuiz
          key={selectionKey}
          filter={selection}
          topic={'topicId' in selection ? topics?.find((t) => t.id === selection.topicId) : undefined}
          language={language}
          quranFont={quranFont}
          onBack={() => onSelect(null)}
        />
      </section>
    );

  return (
    <section className="practice-view" aria-label={ui.practiceGrammar}>
      <div className="practice-intro ui" lang={language} dir={direction}>
        <div>
          <h2>{ui.practiceGrammar}</h2>
          <p>{ui.practiceGrammarDescription}</p>
        </div>
        <label className="topic-search">
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            value={query}
            placeholder={ui.searchTopics}
            aria-label={ui.searchTopics}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button
              type="button"
              className="icon-button"
              aria-label={ui.clearSearch}
              onClick={() => setQuery('')}
            >
              <X size={17} />
            </button>
          )}
        </label>
      </div>
      <div ref={list}>
        {!query && (
          <button
            type="button"
            className="fatihah-practice ui"
            lang={language}
            dir={direction}
            data-practice="fatihah"
            onClick={() => onSelect({ set: 'fatihah' })}
          >
            <span className="practice-mark" aria-hidden="true">
              <Sparkles size={21} />
            </span>
            <span className="fatihah-practice-copy">
              <strong>
                {getSurahTitle(1, language)} · {ui.quickPractice}
              </strong>
              <small>{ui.practiceDescription}</small>
            </span>
            {language === 'ur' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
          </button>
        )}
        {!shown ? (
          <LoadState language={language} error={error} onRetry={retry} />
        ) : (
          <>
            <h3 className="topic-list-heading ui" lang={language} dir={direction}>
              {ui.grammarTopics}{' '}
              <small>
                {formatCount(shown.length, language)}
                {query && topics ? ` / ${formatCount(topics.length, language)}` : ''}
              </small>
            </h3>
            {shown.length === 0 ? (
              <p className="topic-empty ui" lang={language} dir={direction} role="status">
                {ui.noResults}
              </p>
            ) : (
              <ul className="topic-list" aria-label={ui.grammarTopics}>
                {shown.map((topic) => (
                  <li key={topic.id} className="topic-item" data-topic={topic.id}>
                    <button
                      type="button"
                      className="topic-start"
                      data-practice={topic.id}
                      onClick={() => onSelect({ topicId: topic.id })}
                    >
                      <strong lang="ur" dir="rtl">
                        {topic.titleUrdu}
                      </strong>
                      <span className="topic-english" lang="en" dir="ltr">
                        {topic.titleEnglish}
                      </span>
                      <span className="topic-summary" lang="ur" dir="rtl">
                        {topic.summaryUrdu}
                      </span>
                      <span className="topic-meta ui" lang={language} dir={direction}>
                        <span>
                          {formatCount(topic.questionCount, language)} {ui.topicQuestions}
                        </span>
                        <span>
                          {formatCount(topic.occurrenceCount, language)} {ui.topicOccurrences}
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      className="topic-open icon-button"
                      aria-label={`${ui.openTopic}: ${language === 'ur' ? topic.titleUrdu : topic.titleEnglish}`}
                      title={ui.openTopic}
                      onClick={(event) => onOpenTopic(topic.id, event.currentTarget)}
                    >
                      <BookOpenText size={20} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
}
