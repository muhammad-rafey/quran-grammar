import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Layers3, LockKeyhole, X } from 'lucide-react';
import {
  formatCount,
  getUiStrings,
  getSurahTitle,
  juzCatalog,
  surahCatalog,
  type UiLanguage,
} from '@quran-grammar/core';

export type CollectionMode = 'surah' | 'juz';

export function CollectionPicker({
  language,
  mode,
  surahNumber,
  onSelect,
}: {
  language: UiLanguage;
  mode: CollectionMode;
  surahNumber: number;
  onSelect: (mode: CollectionMode, surahNumber: number) => void;
}) {
  const ui = getUiStrings(language);
  const direction = language === 'ur' ? 'rtl' : 'ltr';
  const [open, setOpen] = useState(false);
  const [browseMode, setBrowseMode] = useState<CollectionMode>(mode);
  const [browseJuz, setBrowseJuz] = useState<number | null>(null);
  const currentJuz = juzCatalog.find((juz) => juz.surahNumbers.includes(surahNumber));
  const shownSurahs =
    browseMode === 'surah'
      ? [...surahCatalog].sort((a, b) => Number(b.available) - Number(a.available))
      : surahCatalog.filter((surah) =>
          juzCatalog.find((juz) => juz.number === browseJuz)?.surahNumbers.includes(surah.number),
        );
  const dialog = useRef<HTMLDialogElement>(null);
  const subheading = useRef<HTMLHeadingElement>(null);
  const returnJuzFocus = useRef<number | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open || !dialog.current) return;
    const element = dialog.current;
    const oldOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = oldOverflow;
      trigger.current?.focus({ preventScroll: true });
    };
  }, [open]);
  useEffect(() => {
    if (!open || browseMode !== 'juz') return;
    if (browseJuz !== null) subheading.current?.focus();
    else if (returnJuzFocus.current !== null) {
      dialog.current
        ?.querySelector<HTMLButtonElement>(`[data-juz="${returnJuzFocus.current}"]`)
        ?.focus();
      returnJuzFocus.current = null;
    }
  }, [open, browseMode, browseJuz]);
  const select = (number: number) => {
    if (!surahCatalog.find((surah) => surah.number === number)?.available) return;
    onSelect(browseMode, number);
    setOpen(false);
  };
  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="collection-trigger selector-chip"
        aria-haspopup="dialog"
        aria-label={mode === 'surah' ? ui.selectSurah : ui.selectJuz}
        onClick={() => {
          returnJuzFocus.current = null;
          setBrowseMode(mode);
          setBrowseJuz(null);
          setOpen(true);
        }}
      >
        <span className="selector-symbol">
          <Layers3 size={21} />
        </span>
        <span className="selector-copy">
          <small>
            {mode === 'surah'
              ? ui.surah
              : `${ui.juz} ${formatCount(currentJuz?.number || 1, language)}`}
          </small>
          <strong>{getSurahTitle(surahNumber, language)}</strong>
        </span>
        <ChevronDown size={17} />
      </button>
      <dialog
        ref={dialog}
        className="catalog-dialog ui"
        lang={language}
        dir={direction}
        aria-labelledby="catalog-title"
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
      >
        <div className="catalog-shell">
          <header className="catalog-header">
            <h2 id="catalog-title">{browseMode === 'surah' ? ui.selectSurah : ui.selectJuz}</h2>
            <button
              type="button"
              className="icon-button"
              aria-label={ui.close}
              onClick={() => setOpen(false)}
            >
              <X size={21} />
            </button>
          </header>
          <div className="catalog-modes" role="group" aria-label={`${ui.surah} / ${ui.juz}`}>
            {(['surah', 'juz'] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={browseMode === value}
                onClick={() => {
                  returnJuzFocus.current = null;
                  setBrowseMode(value);
                  setBrowseJuz(null);
                }}
              >
                {value === 'surah' ? ui.surah : ui.juz}
              </button>
            ))}
          </div>
          {browseMode === 'juz' && browseJuz !== null && (
            <div className="catalog-subheading">
              <button type="button" className="text-button" onClick={() => setBrowseJuz(null)}>
                {ui.selectJuz}
              </button>
              <h3 ref={subheading} tabIndex={-1}>
                {ui.juz} {formatCount(browseJuz, language)} · {ui.availableSurahs}
              </h3>
            </div>
          )}
          <div className="catalog-list" key={`${browseMode}-${browseJuz}`}>
            {browseMode === 'surah' || browseJuz !== null
              ? shownSurahs.map((surah) => (
                  <button
                    type="button"
                    key={surah.number}
                    className={`catalog-entry ${surah.available ? 'available' : ''}`}
                    disabled={!surah.available}
                    data-surah={surah.number}
                    aria-current={surah.number === surahNumber ? 'true' : undefined}
                    onClick={() => select(surah.number)}
                  >
                    <span className="catalog-number">{formatCount(surah.number, language)}</span>
                    <span className="catalog-entry-copy">
                      <strong lang={language === 'ur' ? 'ar' : 'en'}>
                        {language === 'ur' ? surah.nameArabic : surah.nameEnglish}
                      </strong>
                      <small>{surah.available ? ui.available : ui.comingSoon}</small>
                    </span>
                    {surah.number === surahNumber ? (
                      <Check size={20} />
                    ) : !surah.available ? (
                      <LockKeyhole size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                ))
              : [...juzCatalog]
                  .sort((a, b) => Number(b.available) - Number(a.available))
                  .map((juz) => (
                    <button
                      type="button"
                      key={juz.number}
                      className={`catalog-entry ${juz.available ? 'available' : ''}`}
                      disabled={!juz.available}
                      data-juz={juz.number}
                      onClick={() => {
                        if (!juz.available) return;
                        if (juz.surahNumbers.length === 1) select(juz.surahNumbers[0]);
                        else {
                          returnJuzFocus.current = juz.number;
                          setBrowseJuz(juz.number);
                        }
                      }}
                    >
                      <span className="catalog-number">{formatCount(juz.number, language)}</span>
                      <span className="catalog-entry-copy">
                        <strong>
                          {ui.juz} {formatCount(juz.number, language)}
                        </strong>
                        <small>
                          {juz.available
                            ? juz.number === 1
                              ? ui.previewOnly
                              : ui.partialPreview
                            : ui.comingSoon}
                        </small>
                      </span>
                      {juz.available ? <Check size={20} /> : <LockKeyhole size={16} />}
                    </button>
                  ))}
          </div>
        </div>
      </dialog>
    </>
  );
}
