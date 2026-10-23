import {
  formatCount,
  getUiStrings,
  type StudyData,
  type UiLanguage,
  type Word,
} from '@quran-grammar/core';

interface Props {
  study: StudyData;
  language: UiLanguage;
  selectedId: string;
  meanings: boolean;
  filtering: boolean;
  matches: Set<string>;
  onSelect: (id: string, trigger: HTMLButtonElement) => void;
}

export function Reading({
  study,
  language,
  selectedId,
  meanings,
  filtering,
  matches,
  onSelect,
}: Props) {
  const strings = getUiStrings(language);
  const label = (word: Word) =>
    word.pos === 'verb'
      ? word.posUrdu.includes('امر')
        ? 'فعلِ امر'
        : word.posUrdu.includes('ماضی')
          ? 'فعلِ ماضی'
          : 'فعلِ مضارع'
      : word.posUrdu === 'اسمِ موصول'
        ? 'اسمِ موصول'
        : { noun: 'اسم', adjective: 'صفت', particle: 'حرف', pronoun: 'ضمیر' }[word.pos];
  return (
    <div
      className="reading-card"
      id="reading"
      tabIndex={-1}
      aria-label={`${strings.surahTitle} · ${strings.words}`}
      dir="rtl"
      lang="ur"
    >
      {study.ayahs.map((ayah) => (
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
                  aria-label={`${word.arabic}، ${word.meaningUrdu}، ${strings.ayah} ${formatCount(word.ayah, language)} ${strings.word} ${formatCount(word.position, language)}`}
                  onClick={(event) => onSelect(word.id, event.currentTarget)}
                >
                  <span className="arabic" lang="ar">
                    {word.arabic}
                  </span>
                  {meanings && <span className="word-meaning">{word.meaningUrdu}</span>}
                  <span className="word-kind">
                    <i aria-hidden="true" />
                    {label(word)}
                  </span>
                </button>
              ))}
          </div>
          <p className="ayah-translation">{ayah.translationUrdu}</p>
        </article>
      ))}
    </div>
  );
}
