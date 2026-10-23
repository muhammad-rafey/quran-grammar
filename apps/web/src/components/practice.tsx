import { useRef, useState } from 'react';
import { ArrowRight, Check, CircleHelp, RotateCcw, Sparkles, Sprout } from 'lucide-react';
import {
  fatihahPractice,
  formatCount,
  getUiStrings,
  gradePracticeAnswer,
  type UiLanguage,
} from '@quran-grammar/core';

export function Practice({ language }: { language: UiLanguage }) {
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
  const question = fatihahPractice[index]!;
  const correct = choice !== null && gradePracticeAnswer(question, choice) === true;
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
    if (index === fatihahPractice.length - 1) setComplete(true);
    else {
      setIndex((value) => value + 1);
      setChoice(null);
      setChecked(false);
    }
    focusHeading();
  };
  return (
    <section
      className="practice-card ui"
      dir={direction}
      lang={language}
      aria-label={ui.quickPractice}
    >
      <header className="practice-header">
        <span className="practice-mark">
          <Sparkles size={21} />
        </span>
        <h2>{ui.quickPractice}</h2>
        <span className="practice-count">
          {complete ? (
            <Check size={18} />
          ) : (
            `${formatCount(index + 1, language)} / ${formatCount(fatihahPractice.length, language)}`
          )}
        </span>
      </header>
      <div
        className="practice-progress"
        role="progressbar"
        aria-label={ui.practice}
        aria-valuemin={0}
        aria-valuemax={fatihahPractice.length}
        aria-valuenow={complete ? fatihahPractice.length : index}
      >
        <span style={{ width: `${(complete ? 1 : index / fatihahPractice.length) * 100}%` }} />
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
            {ui.practiceScore}: {formatCount(score, language)} /{' '}
            {formatCount(fatihahPractice.length, language)}
          </p>
          <button type="button" className="primary-button" onClick={restart}>
            <RotateCcw size={17} />
            {ui.restartPractice}
          </button>
        </div>
      ) : (
        <>
          <h3 ref={heading} tabIndex={-1} className="practice-prompt" lang="ur" dir="rtl">
            {question.promptUrdu}
          </h3>
          <div className="practice-options" role="group" aria-label={ui.chooseAnswer}>
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
                <span>{option.text}</span>
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
                {index === fatihahPractice.length - 1 ? ui.practiceComplete : ui.nextQuestion}
                <ArrowRight size={17} />
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
}
