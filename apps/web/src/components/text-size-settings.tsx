import { Minus, Plus, RotateCcw } from 'lucide-react';
import {
  canStepTextSize,
  defaultTextSize,
  formatCount,
  getUiStrings,
  quranText,
  spaceQuranText,
  stepTextSize,
  textSizePercent,
  translationText,
  type ReadingFont,
  type StudyData,
  type TextSizeRole,
  type TextSizes,
  type UiLanguage,
} from '@quran-grammar/core';

/** Words of the first ayah shown in the preview; longer ayahs end with an ellipsis. */
const previewWords = 12;

interface Props {
  language: UiLanguage;
  /** The loaded chapter; its first ayah is the preview (absent while loading). */
  study: StudyData | null;
  quranFont: ReadingFont;
  translationId: string;
  sizes: TextSizes;
  onChange: (change: Partial<TextSizes>) => void;
  saveError: boolean;
}

/**
 * Settings card: − / + steps for the Quran text and the ayah translation (see core text-size.ts),
 * a reset, and a live preview of the chapter's first ayah in the selected font and translation.
 * The preview is sized by the same CSS variables as the study text (use-text-size.ts).
 */
export function TextSizeSettings({
  language,
  study,
  quranFont,
  translationId,
  sizes,
  onChange,
  saveError,
}: Props) {
  const ui = getUiStrings(language);
  const firstAyah = study?.ayahs[0];
  const ayahWords = firstAyah ? study.words.filter((word) => word.ayah === firstAyah.number) : [];
  const arabic = ayahWords.length
    ? spaceQuranText(
        ayahWords
          .slice(0, previewWords)
          .map((word) => quranText(word, quranFont))
          .join(' '),
        quranFont,
      ) + (ayahWords.length > previewWords ? ' …' : '')
    : '';
  const translation = translationText(firstAyah?.translations, translationId);
  const percent = (size: number) =>
    `${formatCount(textSizePercent(size), language)}${language === 'ur' ? '٪' : '%'}`;
  const rows: { role: TextSizeRole; label: string }[] = [
    { role: 'quran', label: ui.quranTextSize },
    { role: 'translation', label: ui.translationTextSize },
  ];
  const isDefault = sizes.quran === defaultTextSize && sizes.translation === defaultTextSize;
  return (
    <div className="settings-card text-size-settings">
      <h2 id="text-size-title">{ui.textSize}</h2>
      <p>{ui.textSizeHelp}</p>
      <div className="text-size-rows" role="group" aria-labelledby="text-size-title">
        {rows.map(({ role, label }) => {
          const size = sizes[role];
          const id = `text-size-${role}`;
          return (
            <div className="text-size-row" key={role} data-text-size={role}>
              <span className="text-size-label" id={`${id}-label`}>
                {label}
              </span>
              <div className="text-size-stepper">
                <button
                  type="button"
                  data-step="smaller"
                  aria-label={`${ui.smaller}: ${label}`}
                  disabled={!canStepTextSize(size, -1)}
                  onClick={() => onChange({ [role]: stepTextSize(size, -1) })}
                >
                  <Minus size={18} aria-hidden="true" />
                </button>
                <output
                  className="text-size-value"
                  id={`${id}-value`}
                  aria-labelledby={`${id}-label ${id}-value`}
                  aria-live="polite"
                >
                  {percent(size)}
                </output>
                <button
                  type="button"
                  data-step="larger"
                  aria-label={`${ui.larger}: ${label}`}
                  disabled={!canStepTextSize(size, 1)}
                  onClick={() => onChange({ [role]: stepTextSize(size, 1) })}
                >
                  <Plus size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {(arabic || translation) && (
        <div className="text-size-preview" aria-label={ui.fontPreview} role="group">
          {arabic && (
            <p className="text-size-preview-arabic arabic" lang="ar" dir="rtl">
              {arabic}
            </p>
          )}
          {translation && (
            <p className="text-size-preview-translation" lang="ur" dir="rtl">
              {translation}
            </p>
          )}
        </div>
      )}
      <button
        type="button"
        className="text-size-reset"
        disabled={isDefault}
        onClick={() => onChange({ quran: defaultTextSize, translation: defaultTextSize })}
      >
        <RotateCcw size={16} aria-hidden="true" />
        <span>{ui.resetTextSize}</span>
      </button>
      {saveError && (
        <p className="settings-error" role="alert">
          {ui.preferenceError}
        </p>
      )}
    </div>
  );
}
