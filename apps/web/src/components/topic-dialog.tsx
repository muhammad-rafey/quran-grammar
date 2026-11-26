import { useEffect, useRef, type KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, X } from 'lucide-react';
import {
  formatCount,
  getSurahTitle,
  getUiStrings,
  translationText,
  type ResolvedTopicExample,
  type UiLanguage,
} from '@quran-grammar/core';
import { useTopic } from '../use-api';
import { LoadState } from './practice';

/** Ayah Arabic with the example word highlighted; text always comes from the API data. */
function AyahWithWord({ example }: { example: ResolvedTopicExample }) {
  const words = example.ayahArabic.split(' ');
  const position = Number(example.wordId.split(':')[2]) - 1;
  const index = words[position] === example.wordArabic ? position : words.indexOf(example.wordArabic);
  if (index < 0) {
    return (
      <p className="topic-ayah arabic" lang="ar" dir="rtl">
        <mark>{example.wordArabic}</mark> — {example.ayahArabic}
      </p>
    );
  }
  return (
    <p className="topic-ayah arabic" lang="ar" dir="rtl">
      {words.slice(0, index).join(' ')}
      {index > 0 && ' '}
      <mark>{words[index]}</mark>
      {index < words.length - 1 && ' '}
      {words.slice(index + 1).join(' ')}
    </p>
  );
}

function reference(example: ResolvedTopicExample, language: UiLanguage) {
  return `${getSurahTitle(example.surah, language)} ${formatCount(example.surah, language)}:${formatCount(example.ayah, language)}`;
}

/**
 * Accessible grammar topic card (native modal <dialog>: the rest of the page is inert, Esc and the
 * close button dismiss it, focus returns to the opener). Full-screen on narrow screens.
 */
export function TopicDialog({
  topicId,
  language,
  returnFocus,
  onClose,
  onWord,
  onPractice,
  translationId,
}: {
  topicId: string;
  /** Selected Urdu translation (Settings). */
  translationId: string;
  language: UiLanguage;
  returnFocus: HTMLElement | null;
  onClose: () => void;
  onWord: (wordId: string) => void;
  onPractice: (topicId: string) => void;
}) {
  const ui = getUiStrings(language);
  const direction = language === 'ur' ? 'rtl' : 'ltr';
  const dialog = useRef<HTMLDialogElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const { data: topic, error, retry } = useTopic(topicId);
  const handedOff = useRef(false);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (!element.open) element.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      // The word sheet may close in the same commit; only keep scrolling locked for it if open.
      document.body.style.overflow = document.querySelector('dialog[open]') ? 'hidden' : '';
      // Return focus to the rule/topic button unless the dialog handed off to another view.
      if (!handedOff.current && returnFocus?.isConnected)
        returnFocus.focus({ preventScroll: true });
    };
  }, [returnFocus]);

  useEffect(() => {
    body.current?.scrollTo(0, 0);
    if (topic) title.current?.focus({ preventScroll: true });
  }, [topic]);

  // Keep Tab inside the card even where the browser lets focus reach its own chrome.
  const trapTab = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Tab' || !dialog.current) return;
    const focusable = [
      ...dialog.current.querySelectorAll<HTMLElement>(
        'button:not(:disabled), [href], input, [tabindex]:not([tabindex="-1"])',
      ),
    ];
    if (focusable.length === 0) return;
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    if (event.shiftKey && (document.activeElement === first || document.activeElement === title.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const handOff = (action: () => void) => {
    handedOff.current = true;
    action();
  };

  return (
    <dialog
      ref={dialog}
      className="topic-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="topic-title"
      onKeyDown={trapTab}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="topic-shell">
        <header className="topic-header ui" lang={language} dir={direction}>
          <span className="topic-kicker">{ui.grammarTopics}</span>
          <button
            type="button"
            className="icon-button"
            aria-label={ui.close}
            title={ui.close}
            onClick={onClose}
          >
            <X size={21} />
          </button>
        </header>
        <div className="topic-body" ref={body}>
          {!topic ? (
            <>
              <h2 id="topic-title" className="sr-only">
                {ui.grammarTopics}
              </h2>
              <LoadState language={language} error={error} onRetry={retry} />
            </>
          ) : (
            <>
              <div className="topic-heading">
                <h2 id="topic-title" ref={title} tabIndex={-1} lang="ur" dir="rtl">
                  {topic.titleUrdu}
                </h2>
                <p className="topic-english" lang="en" dir="ltr">
                  {topic.titleEnglish}
                </p>
                <p className="topic-summary-lead" lang="ur" dir="rtl">
                  {topic.summaryUrdu}
                </p>
                <p className="topic-meta ui" lang={language} dir={direction}>
                  <span>
                    {formatCount(topic.questionCount, language)} {ui.topicQuestions}
                  </span>
                  <span>
                    {formatCount(topic.occurrenceCount, language)} {ui.topicOccurrences}
                  </span>
                </p>
              </div>
              {topic.explanationUrdu.trim() && (
                <section className="topic-section" aria-labelledby="topic-explanation">
                  <h3 id="topic-explanation" className="ui" lang={language} dir={direction}>
                    {ui.explanation}
                  </h3>
                  <div lang="ur" dir="rtl" className="topic-text">
                    {topic.explanationUrdu
                      .split(/\n\s*\n/)
                      .map((paragraph) => paragraph.trim())
                      .filter(Boolean)
                      .map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                  </div>
                </section>
              )}
              {topic.pointsUrdu.length > 0 && (
                <section className="topic-section" aria-labelledby="topic-points">
                  <h3 id="topic-points" className="ui" lang={language} dir={direction}>
                    {ui.keyPoints}
                  </h3>
                  <ul className="topic-points" lang="ur" dir="rtl">
                    {topic.pointsUrdu.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </section>
              )}
              {topic.examples.length > 0 && (
                <section className="topic-section" aria-labelledby="topic-examples">
                  <h3 id="topic-examples" className="ui" lang={language} dir={direction}>
                    {ui.annotatedExamples}
                  </h3>
                  <ol className="topic-examples">
                    {topic.examples.map((example) => (
                      <li key={example.wordId} className="topic-example" data-example={example.wordId}>
                        <AyahWithWord example={example} />
                        <button
                          type="button"
                          className="topic-reference ui"
                          lang={language}
                          dir={direction}
                          aria-label={`${ui.goToAyah}: ${reference(example, language)}`}
                          onClick={() => handOff(() => onWord(example.wordId))}
                        >
                          <bdi>{reference(example, language)}</bdi>
                          {language === 'ur' ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                        </button>
                        {translationText(example.translations, translationId) && (
                          <p className="topic-translation" lang="ur" dir="rtl">
                            {translationText(example.translations, translationId)}
                          </p>
                        )}
                        {example.noteUrdu && (
                          <p className="topic-note" lang="ur" dir="rtl">
                            {example.noteUrdu}
                          </p>
                        )}
                      </li>
                    ))}
                  </ol>
                </section>
              )}
              {topic.quranicExamples.length > 0 && (
                <section className="topic-section" aria-labelledby="topic-more">
                  <h3 id="topic-more" className="ui" lang={language} dir={direction}>
                    {ui.moreQuranicExamples}
                  </h3>
                  <ul className="topic-more">
                    {topic.quranicExamples.map((example) => (
                      <li key={example.wordId}>
                        <button
                          type="button"
                          data-example-word={example.wordId}
                          onClick={() => handOff(() => onWord(example.wordId))}
                        >
                          <span className="arabic" lang="ar" dir="rtl">
                            {example.wordArabic}
                          </span>
                          <span className="topic-more-meaning" lang="ur" dir="rtl">
                            {example.meaningUrdu}
                          </span>
                          <small className="ui" lang={language} dir={direction}>
                            <bdi>{reference(example, language)}</bdi>
                          </small>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}
        </div>
        {topic && (
          <footer className="topic-footer ui" lang={language} dir={direction}>
            <button
              type="button"
              className="primary-button"
              onClick={() => handOff(() => onPractice(topic.id))}
            >
              <Sparkles size={17} />
              {ui.practiceThisTopic}
            </button>
          </footer>
        )}
      </div>
    </dialog>
  );
}
