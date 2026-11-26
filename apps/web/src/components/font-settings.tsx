import type { CSSProperties } from 'react';
import {
  fontsForRole,
  getUiStrings,
  translationText,
  quranText,
  type FontRole,
  type ReadingFont,
  type StudyData,
  type UiLanguage,
} from '@quran-grammar/core';
import { fontStack, lineScale } from '../use-fonts';

/** Words shown in the Quran preview; longer first ayahs end with an ellipsis. */
const previewWords = 5;

interface Props {
  language: UiLanguage;
  /** The loaded chapter; its first ayah is the preview text (absent while loading). */
  study: StudyData | null;
  quranFont: ReadingFont;
  urduFont: ReadingFont;
  /** The Urdu font previews this translation of the first ayah. */
  translationId: string;
  onChange: (role: FontRole, id: string) => void;
  saveError: boolean;
}

/** The registry's note about characters drawn by a fallback font, if any. */
const coverageNote = (font: ReadingFont, language: UiLanguage) =>
  (language === 'ur' && font.coverageNoteUrdu) || font.coverageNote;

/** Settings card with one radio group per role; each option previews its own font. */
export function FontSettings({
  language,
  study,
  quranFont,
  urduFont,
  translationId,
  onChange,
  saveError,
}: Props) {
  const ui = getUiStrings(language);
  const firstAyah = study?.ayahs[0];
  const urduSample =
    translationText(firstAyah?.translations, translationId) ||
    (study?.words ?? [])
      .slice(0, previewWords)
      .map((word) => word.meaningUrdu)
      .join('، ');
  const ayahWords = firstAyah ? study.words.filter((word) => word.ayah === firstAyah.number) : [];
  // Each Quran option previews the text it will show (IndoPak fonts: the IndoPak text).
  const quranSample = (font: ReadingFont) =>
    ayahWords
      .slice(0, previewWords)
      .map((word) => quranText(word, font))
      .join(' ') + (ayahWords.length > previewWords ? ' …' : '');
  const groups: {
    role: FontRole;
    title: string;
    selected: ReadingFont;
    sample: (font: ReadingFont) => string;
  }[] = [
    { role: 'quran', title: ui.quranFont, selected: quranFont, sample: quranSample },
    { role: 'urdu', title: ui.urduFont, selected: urduFont, sample: () => urduSample },
  ];
  // The preview is clamped to two lines (overflow hidden), so each line holds the font's full ink
  // extent: marks above and below are never cut.
  const previewStyle = (font: ReadingFont): CSSProperties => ({
    fontFamily: fontStack(font),
    fontSize: `${(font.role === 'quran' ? 26 : 16) * font.scale}px`,
    lineHeight: Math.max(
      (font.role === 'quran' ? 2.3 : 2) * Number(lineScale(font)),
      font.metrics.inkTop + font.metrics.inkBottom + 0.15,
    ).toFixed(2),
  });

  return (
    <div className="settings-card font-settings">
      <h2 id="fonts-title">{ui.fonts}</h2>
      <p>{ui.fontsHelp}</p>
      {groups.map(({ role, title, selected, sample }) => (
        <div className="font-group" key={role}>
          <h3 id={`${role}-font-title`}>{title}</h3>
          <div
            className="font-options"
            role="radiogroup"
            aria-labelledby={`${role}-font-title`}
            data-font-role={role}
          >
            {fontsForRole(role).map((font) => {
              const note = coverageNote(font, language);
              const preview = sample(font);
              const id = `font-${font.id}`;
              return (
                <label
                  className={`font-option ${font.id === selected.id ? 'selected' : ''}`}
                  key={font.id}
                  data-font={font.id}
                >
                  <span className="font-option-head">
                    <input
                      type="radio"
                      name={`${role}-font`}
                      value={font.id}
                      checked={font.id === selected.id}
                      aria-labelledby={`${id}-name`}
                      aria-describedby={
                        [preview && `${id}-preview`, note && `${id}-note`].filter(Boolean).join(' ') ||
                        undefined
                      }
                      onChange={() => onChange(role, font.id)}
                    />
                    <strong id={`${id}-name`}>{language === 'ur' ? font.labelUrdu : font.label}</strong>
                  </span>
                  {preview && (
                    <span className="font-preview" id={`${id}-preview`}>
                      <span className="sr-only">{ui.fontPreview}: </span>
                      <span
                        className="font-preview-text"
                        lang={role === 'quran' ? 'ar' : 'ur'}
                        dir="rtl"
                        style={previewStyle(font)}
                      >
                        {preview}
                      </span>
                    </span>
                  )}
                  {note && (
                    <small className="font-note" id={`${id}-note`}>
                      {note}
                    </small>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      ))}
      {saveError && (
        <p className="settings-error" role="alert">
          {ui.preferenceError}
        </p>
      )}
    </div>
  );
}
