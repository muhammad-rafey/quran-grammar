import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpenText, GitBranch, X } from 'lucide-react';
import {
  formatCount,
  getUiStrings,
  quranText,
  type ReadingFont,
  type StudyData,
  type UiLanguage,
  type Word,
} from '@quran-grammar/core';

/** Words with the same root shown before "Show all". */
const relatedPreview = 12;

interface Props {
  word: Word;
  study: StudyData;
  language: UiLanguage;
  /** The selected Quran font: IndoPak fonts show whole words in the IndoPak text. */
  quranFont: ReadingFont;
  onSelect: (id: string) => void;
  /** Opens the grammar topic dialog for a rule; the button is passed back for focus return. */
  onTopic: (ruleId: string, trigger: HTMLElement) => void;
  onClose?: () => void;
}

export function WordDetail({
  word,
  study,
  language,
  quranFont,
  onSelect,
  onTopic,
  onClose,
}: Props) {
  const strings = getUiStrings(language);
  const uiDirection = language === 'ur' ? 'rtl' : 'ltr';
  const [segment, setSegment] = useState<number | null>(null);
  const [showAllRelated, setShowAllRelated] = useState(false);
  const scroll = useRef<HTMLDivElement>(null);
  const index = study.words.findIndex((entry) => entry.id === word.id);
  const root = word.root ? study.roots[word.root] : null;
  const verb = study.verbForms[word.id];
  const rules = word.ruleIds
    .map((id) => study.rules.find((rule) => rule.id === id))
    .filter((rule) => !!rule);
  const related = word.root
    ? study.words.filter((entry) => entry.root === word.root && entry.id !== word.id)
    : [];
  useEffect(() => {
    setSegment(null);
    setShowAllRelated(false);
    scroll.current?.scrollTo(0, 0);
  }, [word.id]);

  return (
    <>
      <header className="detail-header" dir="rtl" lang="ur">
        <div className="detail-topline ui" dir={uiDirection} lang={language}>
          <span>
            {strings.wordStudy}{' '}
            <bdi className="word-location">
              {formatCount(word.ayah, language)} : {formatCount(word.position, language)}
            </bdi>
          </span>
          {onClose && (
            <button
              type="button"
              className="icon-button close-detail"
              aria-label={strings.close}
              onClick={onClose}
            >
              <X size={21} />
            </button>
          )}
        </div>
        <div className="detail-title">
          <h2 id="detail-title" className="arabic" lang="ar">
            {quranText(word, quranFont)}
          </h2>
          <span className={`pos-badge ${word.pos}`}>{word.posUrdu}</span>
        </div>
        {word.meaningUrdu && <p className="detail-translation">{word.meaningUrdu}</p>}
      </header>
      <div className="detail-scroll" ref={scroll} dir="rtl" lang="ur">
        {/* The word's grammar first: its role in the sentence (i'rab) and how it is formed. */}
        {(word.syntaxUrdu || word.morphologyUrdu) && (
          <section className="detail-section grammar-summary">
            {word.syntaxUrdu && (
              <div className="grammar-fact syntax-fact">
                <h3 className="ui" dir={uiDirection} lang={language}>
                  {strings.syntax}
                </h3>
                <p>{word.syntaxUrdu}</p>
              </div>
            )}
            {word.morphologyUrdu && (
              <div className="grammar-fact">
                <h3 className="ui" dir={uiDirection} lang={language}>
                  {strings.morphology}
                </h3>
                <p>{word.morphologyUrdu}</p>
              </div>
            )}
          </section>
        )}
        <section className="detail-section root-section">
          <div className="root-pair">
            <div>
              <span className="field-label ui" dir={uiDirection} lang={language}>
                {strings.root}
              </span>
              <strong lang="ar" dir="rtl">
                {word.root || '—'}
              </strong>
            </div>
            <div>
              <span className="field-label ui" dir={uiDirection} lang={language}>
                {strings.headword}
              </span>
              <strong lang="ar" dir="rtl">
                {word.lemma || '—'}
              </strong>
            </div>
          </div>
          {/* Source-only chapters have no root meaning; the card is hidden then. */}
          {root && (root.meaningUrdu || root.noteUrdu) ? (
            <div className="root-meaning">
              <h3 className="ui" dir={uiDirection} lang={language}>
                <GitBranch size={15} /> {strings.rootMeaning}
              </h3>
              {root.meaningUrdu && <p>{root.meaningUrdu}</p>}
              {root.noteUrdu && <p className="muted-note">{root.noteUrdu}</p>}
            </div>
          ) : null}
        </section>
        {verb && (
          <section className="detail-section verb-section" aria-label={strings.verbForm}>
            <span className="field-label ui" dir={uiDirection} lang={language}>
              {strings.verbForm}
            </span>
            {verb.baabUrdu && <h3 className="baab-title">{verb.baabUrdu}</h3>}
            <p className="muted-note">{verb.formUrdu}</p>
            <dl className="verb-paradigm">
              <div>
                <dt className="ui" dir={uiDirection} lang={language}>
                  {strings.past}
                </dt>
                <dd lang="ar">{verb.past}</dd>
              </div>
              {verb.present && (
                <div>
                  <dt className="ui" dir={uiDirection} lang={language}>
                    {strings.present}
                  </dt>
                  <dd lang="ar">{verb.present}</dd>
                </div>
              )}
              {verb.pattern && (
                <div className="pattern">
                  <dt className="ui" dir={uiDirection} lang={language}>
                    {strings.pattern}
                  </dt>
                  <dd lang="ar">{verb.pattern}</dd>
                </div>
              )}
            </dl>
            {verb.noteUrdu && <p>{verb.noteUrdu}</p>}
          </section>
        )}
        {word.segments.length > 0 && (
          <section className="detail-section">
            <h3 className="ui" dir={uiDirection} lang={language}>
              {strings.segments}
            </h3>
            <div className="segments">
              {word.segments.map((part, partIndex) => (
                <button
                  type="button"
                  key={`${word.id}-${partIndex}`}
                  data-segment={partIndex}
                  className={segment === partIndex ? 'active' : ''}
                  aria-pressed={segment === partIndex}
                  onClick={() => setSegment(partIndex)}
                >
                  {/* Corpus segments split the Uthmani word; there is no IndoPak segmentation. */}
                  <span lang="ar">{part.arabic}</span>
                  <small>{part.roleUrdu}</small>
                </button>
              ))}
            </div>
            {segment !== null && (
              <p className="segment-explanation" role="status">
                <strong>
                  {word.segments[segment]?.roleUrdu}
                  {word.segments[segment]?.meaningUrdu ? ':' : ''}
                </strong>{' '}
                {word.segments[segment]?.meaningUrdu}
              </p>
            )}
          </section>
        )}
        {word.dictionaryUrdu && (
          <section className="detail-section">
            <h3 className="ui" dir={uiDirection} lang={language}>
              {strings.dictionary}
            </h3>
            <p>{word.dictionaryUrdu}</p>
          </section>
        )}
        {rules.length > 0 && (
          <section className="detail-section">
            <h3 className="ui" dir={uiDirection} lang={language}>
              {strings.rules}
            </h3>
            <ul className="grammar-rules">
              {rules.map((rule) => (
                <li key={`${word.id}-${rule.id}`}>
                  <button
                    type="button"
                    className="grammar-rule"
                    data-rule={rule.id}
                    aria-haspopup="dialog"
                    onClick={(event) => onTopic(rule.id, event.currentTarget)}
                  >
                    <span className="grammar-rule-title">{rule.titleUrdu}</span>
                    <BookOpenText size={16} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
        {related.length > 0 && (
          <section className="detail-section">
            <h3 className="ui" dir={uiDirection} lang={language}>
              {strings.relatedWords} <small>{formatCount(related.length, language)}</small>
            </h3>
            <div className="related-words">
              {(showAllRelated ? related : related.slice(0, relatedPreview)).map((entry) => (
                <button
                  type="button"
                  key={entry.id}
                  onClick={() => onSelect(entry.id)}
                  data-related-word={entry.id}
                >
                  <span lang="ar">{quranText(entry, quranFont)}</span>
                  <small className="ui" dir={uiDirection} lang={language}>
                    {strings.ayah} {formatCount(entry.ayah, language)}
                  </small>
                </button>
              ))}
            </div>
            {/* Common roots (أ ل ه: 289 words in Al-Baqarah) start with a short list. */}
            {!showAllRelated && related.length > relatedPreview && (
              <button
                type="button"
                className="text-button ui"
                dir={uiDirection}
                lang={language}
                onClick={() => setShowAllRelated(true)}
              >
                {strings.showAll} ({formatCount(related.length, language)})
              </button>
            )}
          </section>
        )}
      </div>
      <footer className="detail-navigation ui" dir={uiDirection} lang={language}>
        <button
          type="button"
          aria-label={`${strings.previous} ${strings.word.toLowerCase()}`}
          aria-keyshortcuts="ArrowRight"
          title={`${strings.previous} (→)`}
          disabled={index === 0}
          onClick={() => onSelect(study.words[index - 1].id)}
        >
          {language === 'ur' ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
          <span>{strings.previous}</span>
        </button>
        <span>
          {formatCount(index + 1, language)}{' '}
          <small>/ {formatCount(study.words.length, language)}</small>
        </span>
        <button
          type="button"
          aria-label={`${strings.next} ${strings.word.toLowerCase()}`}
          aria-keyshortcuts="ArrowLeft"
          title={`${strings.next} (←)`}
          disabled={index === study.words.length - 1}
          onClick={() => onSelect(study.words[index + 1].id)}
        >
          <span>{strings.next}</span>
          {language === 'ur' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
        </button>
      </footer>
    </>
  );
}
