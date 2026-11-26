import {
  formatCount,
  getUiStrings,
  getSurahTitle,
  translationText,
  quranText,
  type ReadingFont,
  type StudyData,
  type UiLanguage,
  type Word,
} from '@quran-grammar/core';
import type { ReadingLayout } from '../use-reading-layout';

const arabicDigits = (value: number) =>
  String(value).replace(/[0-9]/g, (digit) => '٠١٢٣٤٥٦٧٨٩'[Number(digit)]!);

interface Props {
  study: StudyData;
  language: UiLanguage;
  selectedId: string;
  meanings: boolean;
  filtering: boolean;
  matches: Set<string>;
  layout: ReadingLayout;
  /** Selected Urdu translation (Settings). */
  translationId: string;
  /** The selected Quran font: IndoPak fonts show the IndoPak text (see quranText). */
  quranFont: ReadingFont;
  onSelect: (id: string, trigger: HTMLButtonElement) => void;
}

export function Reading({
  study,
  language,
  selectedId,
  meanings,
  filtering,
  matches,
  layout,
  translationId,
  quranFont,
  onSelect,
}: Props) {
  const strings = getUiStrings(language);
  const translation = (ayah: StudyData['ayahs'][number]) =>
    translationText(ayah.translations, translationId);
  const label = (word: Word) =>
    word.pos === 'verb'
      ? word.posUrdu.includes('مضارع')
        ? 'فعلِ مضارع'
        : word.posUrdu.includes('امر')
          ? 'فعلِ امر'
          : word.posUrdu.includes('ماضی')
            ? 'فعلِ ماضی'
            : 'فعل'
      : word.posUrdu === 'اسمِ موصول'
        ? 'اسمِ موصول'
        : { noun: 'اسم', adjective: 'صفت', particle: 'حرف', pronoun: 'ضمیر' }[word.pos];
  // Plain layouts keep words tappable as inline buttons (no card styling) plus an ayah marker.
  const plainWords = (number: number) => (
    <>
      {study.words
        .filter((word) => word.ayah === number)
        .map((word) => (
          <span key={word.id}>
            <button
              type="button"
              data-word-id={word.id}
              className={`plain-word ${selectedId === word.id ? 'selected' : ''}`}
              aria-pressed={selectedId === word.id}
              aria-label={`${quranText(word, quranFont)}، ${word.meaningUrdu}`}
              onClick={(event) => onSelect(word.id, event.currentTarget)}
            >
              {quranText(word, quranFont)}
            </button>{' '}
          </span>
        ))}
      <span
        className="ayah-end"
        role="img"
        aria-label={`${strings.ayah} ${formatCount(number, language)}`}
      >
        {arabicDigits(number)}
      </span>
    </>
  );
  return (
    <div
      className={`reading-card ${layout.grammar ? '' : 'plain-reading'}`}
      id="reading"
      tabIndex={-1}
      aria-label={`${getSurahTitle(study.surah.number, language)} · ${strings.words}`}
      dir="rtl"
      lang="ur"
    >
      {!layout.grammar && !layout.translation ? (
        // Mushaf-like: one continuous Quranic text; each ayah is an inline span for ayah jumps.
        <p className="ayah-text mushaf-text arabic" lang="ar" dir="rtl">
          {study.ayahs.map((ayah) => (
            <span className="plain-ayah" id={`ayah-${ayah.number}`} key={ayah.number}>
              {plainWords(ayah.number)}{' '}
            </span>
          ))}
        </p>
      ) : !layout.grammar ? (
        study.ayahs.map((ayah) => (
          <article className="ayah plain-ayah" id={`ayah-${ayah.number}`} key={ayah.number}>
            <p className="ayah-text arabic" lang="ar" dir="rtl">
              {plainWords(ayah.number)}
            </p>
            {translation(ayah) && <p className="ayah-translation">{translation(ayah)}</p>}
          </article>
        ))
      ) : (
        study.ayahs.map((ayah) => (
        <article className="ayah" id={`ayah-${ayah.number}`} key={ayah.number}>
          <div className="ayah-heading">
            <span
              className="ayah-number ui"
              dir={language === 'ur' ? 'rtl' : 'ltr'}
              lang={language}
              aria-label={`${strings.ayah} ${formatCount(ayah.number, language)}`}
            >
              {formatCount(ayah.number, language)}
            </span>
          </div>
          <div className="ayah-words">
            {study.words
              .filter((word) => word.ayah === ayah.number)
              .map((word) => (
                <button
                  type="button"
                  key={word.id}
                  data-word-id={word.id}
                  className={`quran-word ${word.pos} ${selectedId === word.id ? 'selected' : ''} ${filtering ? (matches.has(word.id) ? 'matched' : 'unmatched') : ''}`}
                  aria-pressed={selectedId === word.id}
                  aria-label={`${quranText(word, quranFont)}، ${word.meaningUrdu}، ${strings.ayah} ${formatCount(word.ayah, language)} ${strings.word} ${formatCount(word.position, language)}`}
                  onClick={(event) => onSelect(word.id, event.currentTarget)}
                >
                  <span className="arabic" lang="ar">
                    {quranText(word, quranFont)}
                  </span>
                  {meanings && word.meaningUrdu && (
                    <span className="word-meaning">{word.meaningUrdu}</span>
                  )}
                  <span className="word-kind">
                    <i aria-hidden="true" />
                    {label(word)}
                  </span>
                </button>
              ))}
          </div>
          {layout.translation && translation(ayah) && (
            <p className="ayah-translation">{translation(ayah)}</p>
          )}
        </article>
        ))
      )}
    </div>
  );
}
