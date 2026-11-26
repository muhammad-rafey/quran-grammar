import {
  getUiStrings,
  translationEditions,
  translationText,
  type StudyData,
  type UiLanguage,
} from '@quran-grammar/core';

interface Props {
  language: UiLanguage;
  /** The loaded chapter; its first ayah previews each translation (absent while loading). */
  study: StudyData | null;
  translationId: string;
  onChange: (id: string) => void;
  saveError: boolean;
}

/** Settings card: one radio per Urdu translation, each previewing the chapter's first ayah. */
export function TranslationSettings({ language, study, translationId, onChange, saveError }: Props) {
  const ui = getUiStrings(language);
  const firstAyah = study?.ayahs[0];
  return (
    <div className="settings-card translation-settings">
      <h2 id="translation-title">{ui.translator}</h2>
      <p>{ui.translatorHelp}</p>
      <div className="font-options" role="radiogroup" aria-labelledby="translation-title">
        {translationEditions.map((edition) => {
          const id = `translation-${edition.id}`;
          const sample = translationText(firstAyah?.translations, edition.id);
          return (
            <label
              className={`font-option ${edition.id === translationId ? 'selected' : ''}`}
              key={edition.id}
              data-translation={edition.id}
            >
              <span className="font-option-head">
                <input
                  type="radio"
                  name="translation"
                  value={edition.id}
                  checked={edition.id === translationId}
                  aria-labelledby={`${id}-name`}
                  aria-describedby={sample ? `${id}-preview` : undefined}
                  onChange={() => onChange(edition.id)}
                />
                <strong id={`${id}-name`}>
                  {language === 'ur' ? edition.nameUrdu : edition.nameEnglish}
                </strong>
              </span>
              {sample && (
                <span className="font-preview" id={`${id}-preview`}>
                  <span className="sr-only">{ui.fontPreview}: </span>
                  <span className="font-preview-text translation-preview" lang="ur" dir="rtl">
                    {sample}
                  </span>
                </span>
              )}
            </label>
          );
        })}
      </div>
      {saveError && (
        <p className="settings-error" role="alert">
          {ui.preferenceError}
        </p>
      )}
    </div>
  );
}
