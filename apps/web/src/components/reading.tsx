import { memo, useCallback, useEffect, useMemo, useRef, type CSSProperties } from 'react';
import {
  formatCount,
  getUiStrings,
  getSurahTitle,
  translationEditions,
  translationText,
  quranText,
  type ReadingFont,
  type StudyData,
  type UiLanguage,
  type UiStrings,
  type Word,
} from '@quran-grammar/core';
import type { ReadingLayout } from '../use-reading-layout';

const arabicDigits = (value: number) =>
  String(value).replace(/[0-9]/g, (digit) => '٠١٢٣٤٥٦٧٨٩'[Number(digit)]!);

const kindLabel = (word: Word) =>
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

type SelectHandler = (id: string, trigger: HTMLButtonElement) => void;

/** Chapters this long render off-screen ayahs lazily (CSS content-visibility). */
const windowedFromWords = 1000;
/** Feeds the placeholder height estimate for lazily rendered ayahs (see styles.css). */
const wordCount = (count: number) => ({ '--ayah-words': count }) as CSSProperties;
type Ayah = StudyData['ayahs'][number];

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
  onSelect: SelectHandler;
  /** Reports the ayahs visible below the sticky toolbar (in order) while the reader scrolls. */
  onVisibleAyahs?: (ayahs: number[]) => void;
}

interface AyahProps {
  ayah: Ayah;
  words: readonly Word[];
  /** The selected word id when it is in this ayah, otherwise null (keeps other ayahs memoized). */
  selectedId: string | null;
  strings: UiStrings;
  language: UiLanguage;
  quranFont: ReadingFont;
  onSelect: SelectHandler;
}

/** Plain layouts keep words tappable as inline buttons (no card styling) plus an ayah marker. */
const PlainWords = memo(function PlainWords({
  ayah,
  words,
  selectedId,
  strings,
  language,
  quranFont,
  onSelect,
}: AyahProps) {
  return (
    <>
      {words.map((word) => (
        <span key={word.id}>
          <button
            type="button"
            data-word-id={word.id}
            className={`plain-word ${selectedId === word.id ? 'selected' : ''}`}
            aria-pressed={selectedId === word.id}
            aria-label={
              word.meaningUrdu
                ? `${quranText(word, quranFont)}، ${word.meaningUrdu}`
                : quranText(word, quranFont)
            }
            onClick={(event) => onSelect(word.id, event.currentTarget)}
          >
            {quranText(word, quranFont)}
          </button>{' '}
        </span>
      ))}
      <span
        className="ayah-end"
        role="img"
        aria-label={`${strings.ayah} ${formatCount(ayah.number, language)}`}
      >
        {arabicDigits(ayah.number)}
      </span>
    </>
  );
});

/** The selected translation under an ayah, with a short credit naming the translator. */
function AyahTranslation({
  text,
  credit,
  first,
}: {
  text: string;
  credit: Credit;
  first: boolean;
}) {
  return (
    <>
      <p className="ayah-translation">{text}</p>
      {/* Screen readers hear the credit once (first ayah), not after every ayah. */}
      <p
        className="translation-credit ui"
        lang={credit.language}
        dir={credit.language === 'ur' ? 'rtl' : 'ltr'}
        aria-hidden={first ? undefined : true}
      >
        {credit.text}
      </p>
    </>
  );
}

interface Credit {
  text: string;
  language: UiLanguage;
}

const GrammarAyah = memo(function GrammarAyah({
  ayah,
  words,
  selectedId,
  strings,
  language,
  quranFont,
  onSelect,
  meanings,
  filtering,
  matches,
  translation,
  credit,
}: AyahProps & {
  meanings: boolean;
  filtering: boolean;
  matches: Set<string>;
  translation: string;
  credit: Credit;
}) {
  return (
    <article
      className="ayah"
      id={`ayah-${ayah.number}`}
      data-ayah={ayah.number}
      style={wordCount(words.length)}
    >
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
        {words.map((word) => (
          <button
            type="button"
            key={word.id}
            data-word-id={word.id}
            className={`quran-word ${word.pos} ${selectedId === word.id ? 'selected' : ''} ${filtering ? (matches.has(word.id) ? 'matched' : 'unmatched') : ''}`}
            aria-pressed={selectedId === word.id}
            aria-label={`${quranText(word, quranFont)}، ${word.meaningUrdu ? `${word.meaningUrdu}، ` : ''}${strings.ayah} ${formatCount(word.ayah, language)} ${strings.word} ${formatCount(word.position, language)}`}
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
              {kindLabel(word)}
            </span>
          </button>
        ))}
      </div>
      {translation && (
        <AyahTranslation text={translation} credit={credit} first={ayah.number === 1} />
      )}
    </article>
  );
});

const PlainAyah = memo(function PlainAyah({
  translation,
  credit,
  ...props
}: AyahProps & { translation: string; credit: Credit }) {
  return (
    <article
      className="ayah plain-ayah"
      id={`ayah-${props.ayah.number}`}
      data-ayah={props.ayah.number}
      style={wordCount(props.words.length)}
    >
      <p className="ayah-text arabic" lang="ar" dir="rtl">
        <PlainWords {...props} />
      </p>
      {translation && (
        <AyahTranslation text={translation} credit={credit} first={props.ayah.number === 1} />
      )}
    </article>
  );
});

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
  onVisibleAyahs,
}: Props) {
  const strings = getUiStrings(language);
  const card = useRef<HTMLDivElement>(null);
  // Each ayah re-renders only when its own words change selection; the handler stays stable.
  const latestSelect = useRef(onSelect);
  latestSelect.current = onSelect;
  const select = useCallback<SelectHandler>((id, trigger) => latestSelect.current(id, trigger), []);
  const latestVisible = useRef(onVisibleAyahs);
  latestVisible.current = onVisibleAyahs;
  const wordsByAyah = useMemo(() => {
    const groups = new Map<number, Word[]>();
    for (const word of study.words) {
      const group = groups.get(word.ayah);
      if (group) group.push(word);
      else groups.set(word.ayah, [word]);
    }
    return groups;
  }, [study]);
  const selectedAyah = study.words.find((word) => word.id === selectedId)?.ayah ?? null;
  const edition =
    translationEditions.find((entry) => entry.id === translationId) ?? translationEditions[0];
  const translatorName = language === 'ur' ? edition.nameUrdu : edition.nameEnglish;
  const credit = useMemo<Credit>(
    () => ({ text: `${strings.translator}: ${translatorName}`, language }),
    [strings.translator, translatorName, language],
  );
  const showTranslation = layout.translation;
  const windowed = study.words.length >= windowedFromWords && (layout.grammar || showTranslation);

  // Placeholder heights for lazily rendered ayahs: a base plus a per-word share that shrinks as
  // the column widens (fitted to Al-Baqarah at 360-1440px: about 5% error per ayah).
  useEffect(() => {
    const root = card.current;
    if (!root || !windowed || typeof ResizeObserver === 'undefined') return;
    const base = layout.grammar ? (showTranslation ? 200 : 145) : 122;
    const perWordArea = layout.grammar ? (showTranslation ? 19000 : 17000) : 5800;
    const update = () => {
      root.style.setProperty('--ayah-base', `${base}px`);
      root.style.setProperty(
        '--word-block',
        `${(perWordArea / Math.max(root.clientWidth, 240)).toFixed(1)}px`,
      );
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(root);
    return () => observer.disconnect();
  }, [windowed, layout.grammar, showTranslation]);

  // Track the ayahs on screen so the sticky ayah selector follows the reader's place.
  useEffect(() => {
    const root = card.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;
    const visible = new Set<number>();
    let initial = true;
    const sticky =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sticky-height')) ||
      90;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const number = Number((entry.target as HTMLElement).id.slice(5));
          if (entry.isIntersecting) visible.add(number);
          else visible.delete(number);
        }
        // The first report is the load position; the app has already chosen the ayah for it.
        if (initial) initial = false;
        else latestVisible.current?.([...visible].sort((a, b) => a - b));
      },
      { rootMargin: `-${Math.round(sticky)}px 0px -80px 0px` },
    );
    root.querySelectorAll('[id^="ayah-"]').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [study, layout.grammar, layout.translation]);

  const common = (ayah: Ayah) => ({
    ayah,
    words: wordsByAyah.get(ayah.number) ?? [],
    selectedId: selectedAyah === ayah.number ? selectedId : null,
    strings,
    language,
    quranFont,
    onSelect: select,
  });
  return (
    <div
      ref={card}
      className={`reading-card ${layout.grammar ? '' : 'plain-reading'} ${windowed ? 'windowed' : ''}`}
      id="reading"
      tabIndex={-1}
      aria-label={`${getSurahTitle(study.surah.number, language)} · ${strings.words}`}
      dir="rtl"
      lang="ur"
    >
      {!layout.grammar && !showTranslation ? (
        // Mushaf-like: one continuous Quranic text; each ayah is an inline span for ayah jumps.
        <p className="ayah-text mushaf-text arabic" lang="ar" dir="rtl">
          {study.ayahs.map((ayah) => (
            <span className="plain-ayah" id={`ayah-${ayah.number}`} key={ayah.number}>
              <PlainWords {...common(ayah)} />{' '}
            </span>
          ))}
        </p>
      ) : !layout.grammar ? (
        study.ayahs.map((ayah) => (
          <PlainAyah
            key={ayah.number}
            {...common(ayah)}
            translation={translationText(ayah.translations, translationId)}
            credit={credit}
          />
        ))
      ) : (
        study.ayahs.map((ayah) => (
          <GrammarAyah
            key={ayah.number}
            {...common(ayah)}
            meanings={meanings}
            filtering={filtering}
            matches={matches}
            translation={showTranslation ? translationText(ayah.translations, translationId) : ''}
            credit={credit}
          />
        ))
      )}
    </div>
  );
}
