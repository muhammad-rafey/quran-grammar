import { ArrowLeft, ArrowRight } from 'lucide-react';
import { formatCount, getUiStrings, type StudyData, type UiLanguage } from '@quran-grammar/core';

export function Grammar({
  study,
  language,
  onRead,
}: {
  study: StudyData;
  language: UiLanguage;
  onRead: (ayah: number) => void;
}) {
  const strings = getUiStrings(language);
  const uiDirection = language === 'ur' ? 'rtl' : 'ltr';
  return (
    <section className="grammar-view" aria-label={strings.grammar} dir="rtl" lang="ur">
      {study.ayahs.map((ayah) => (
        <article className="grammar-card" key={ayah.number} id={`grammar-ayah-${ayah.number}`}>
          <header>
            <div>
              <span
                className="ayah-number ui"
                dir={uiDirection}
                lang={language}
                aria-label={`${strings.ayah} ${formatCount(ayah.number, language)}`}
              >
                {formatCount(ayah.number, language)}
              </span>
              <h3>{ayah.themeUrdu}</h3>
            </div>
            <button
              type="button"
              className="text-button ui"
              dir={uiDirection}
              lang={language}
              onClick={() => onRead(ayah.number)}
            >
              {strings.backToStudy}{' '}
              {language === 'ur' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </button>
          </header>
          <p className="grammar-verse arabic" lang="ar">
            {study.words
              .filter((word) => word.ayah === ayah.number)
              .map((word) => word.arabic)
              .join(' ')}
          </p>
          <p className="grammar-translation">{ayah.translationUrdu}</p>
          <div className="grammar-columns">
            <div>
              <span className="field-label">نحوی ترکیب</span>
              {ayah.phrases.map((phrase) => (
                <section className="phrase" key={phrase.id}>
                  <h4 className="arabic" lang="ar">
                    {phrase.wordIds
                      .map((id) => study.words.find((word) => word.id === id)?.arabic)
                      .join(' ')}
                  </h4>
                  <strong>{phrase.labelUrdu}</strong>
                  <p>{phrase.explanationUrdu}</p>
                </section>
              ))}
            </div>
            <section className="tafsir">
              <span className="field-label">مختصر تفسیری نوٹ</span>
              <p>{ayah.tafsirUrdu}</p>
            </section>
          </div>
        </article>
      ))}
    </section>
  );
}
