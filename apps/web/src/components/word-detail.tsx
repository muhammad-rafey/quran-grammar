import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, GitBranch, X } from 'lucide-react';
import {
  formatCount,
  getUiStrings,
  type StudyData,
  type UiLanguage,
  type Word,
} from '@quran-grammar/core';

interface Props {
  word: Word;
  study: StudyData;
  language: UiLanguage;
  onSelect: (id: string) => void;
  onGrammar: (ayah: number) => void;
  onClose?: () => void;
}

export function WordDetail({ word, study, language, onSelect, onGrammar, onClose }: Props) {
  const strings = getUiStrings(language);
  const uiDirection = language === 'ur' ? 'rtl' : 'ltr';
  const [segment, setSegment] = useState<number | null>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const index = study.words.findIndex((entry) => entry.id === word.id);
  const root = word.root ? study.roots[word.root] : null;
  const verb = study.verbForms[word.id];
  const related = word.root
    ? study.words.filter((entry) => entry.root === word.root && entry.id !== word.id)
    : [];
  useEffect(() => {
    setSegment(null);
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
            {word.arabic}
          </h2>
          <span className={`pos-badge ${word.pos}`}>{word.posUrdu}</span>
        </div>
        <p className="detail-translation">{word.meaningUrdu}</p>
      </header>
      <div className="detail-scroll" ref={scroll} dir="rtl" lang="ur">
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
          {root ? (
            <div className="root-meaning">
              <h3 className="ui" dir={uiDirection} lang={language}>
                <GitBranch size={15} /> {strings.rootMeaning}
              </h3>
              <p>{root.meaningUrdu}</p>
              <p className="muted-note">{root.noteUrdu}</p>
            </div>
          ) : (
            <p className="muted-note">—</p>
          )}
        </section>
        {verb && (
          <section className="detail-section verb-section" aria-label={strings.verbForm}>
            <span className="field-label ui" dir={uiDirection} lang={language}>
              {strings.verbForm}
            </span>
            <h3 className="baab-title">{verb.baabUrdu}</h3>
            <p className="muted-note">{verb.formUrdu}</p>
            <dl className="verb-paradigm">
              <div>
                <dt className="ui" dir={uiDirection} lang={language}>
                  {strings.past}
                </dt>
                <dd lang="ar">{verb.past}</dd>
              </div>
              <div>
                <dt className="ui" dir={uiDirection} lang={language}>
                  {strings.present}
                </dt>
                <dd lang="ar">{verb.present}</dd>
              </div>
              <div className="pattern">
                <dt className="ui" dir={uiDirection} lang={language}>
                  {strings.pattern}
                </dt>
                <dd lang="ar">{verb.pattern}</dd>
              </div>
            </dl>
            <p>{verb.noteUrdu}</p>
          </section>
        )}
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
                <span lang="ar">{part.arabic}</span>
                <small>{part.roleUrdu}</small>
              </button>
            ))}
          </div>
          {segment !== null && (
            <p className="segment-explanation" role="status">
              <strong>{word.segments[segment]?.roleUrdu}:</strong>{' '}
              {word.segments[segment]?.meaningUrdu}
            </p>
          )}
        </section>
        <section className="detail-section">
          <h3 className="ui" dir={uiDirection} lang={language}>
            {strings.morphology}
          </h3>
          <p>{word.morphologyUrdu}</p>
        </section>
        <section className="detail-section">
          <h3 className="ui" dir={uiDirection} lang={language}>
            {strings.syntax}
          </h3>
          <p>{word.syntaxUrdu}</p>
          <button
            type="button"
            className="text-button ui"
            dir={uiDirection}
            lang={language}
            onClick={() => onGrammar(word.ayah)}
          >
            {strings.viewGrammar}{' '}
            {language === 'ur' ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
          </button>
        </section>
        <section className="detail-section">
          <h3 className="ui" dir={uiDirection} lang={language}>
            {strings.dictionary}
          </h3>
          <p>{word.dictionaryUrdu}</p>
        </section>
        <section className="detail-section">
          <h3 className="ui" dir={uiDirection} lang={language}>
            {strings.rules}
          </h3>
          {word.ruleIds
            .map((id) => study.rules.find((rule) => rule.id === id))
            .filter((rule) => !!rule)
            .map((rule) => (
              <details className="grammar-rule" key={`${word.id}-${rule.id}`}>
                <summary>
                  {rule.titleUrdu}
                  <ChevronDown size={15} />
                </summary>
                <p>{rule.explanationUrdu}</p>
                <p className="rule-example">{rule.exampleUrdu}</p>
              </details>
            ))}
        </section>
        {related.length > 0 && (
          <section className="detail-section">
            <h3 className="ui" dir={uiDirection} lang={language}>
              {strings.relatedWords}
            </h3>
            <div className="related-words">
              {related.map((entry) => (
                <button
                  type="button"
                  key={entry.id}
                  onClick={() => onSelect(entry.id)}
                  data-related-word={entry.id}
                >
                  <span lang="ar">{entry.arabic}</span>
                  <small className="ui" dir={uiDirection} lang={language}>
                    {strings.ayah} {formatCount(entry.ayah, language)}
                  </small>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
      <footer className="detail-navigation ui" dir={uiDirection} lang={language}>
        <button
          type="button"
          aria-label={`${strings.previous} ${strings.word.toLowerCase()}`}
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
