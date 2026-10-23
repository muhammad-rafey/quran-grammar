import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Layers3, LockKeyhole, X } from 'lucide-react';
import {
  formatCount,
  getUiStrings,
  juzCatalog,
  surahCatalog,
  type UiLanguage,
} from '@quran-grammar/core';

export type CollectionMode = 'surah' | 'juz';

export function CollectionPicker({
  language,
  mode,
  onSelect,
}: {
  language: UiLanguage;
  mode: CollectionMode;
  onSelect: (mode: CollectionMode) => void;
}) {
  const ui = getUiStrings(language);
  const direction = language === 'ur' ? 'rtl' : 'ltr';
  const [open, setOpen] = useState(false);
  const [browseMode, setBrowseMode] = useState<CollectionMode>(mode);
  const dialog = useRef<HTMLDialogElement>(null);
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
  const select = (available: boolean) => {
    if (!available) return;
    onSelect(browseMode);
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
          setBrowseMode(mode);
          setOpen(true);
        }}
      >
        <span className="selector-symbol">
          <Layers3 size={21} />
        </span>
        <span className="selector-copy">
          <small>{mode === 'surah' ? ui.surah : `${ui.juz} ${formatCount(1, language)}`}</small>
          <strong>{ui.surahTitle}</strong>
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
                onClick={() => setBrowseMode(value)}
              >
                {value === 'surah' ? ui.surah : ui.juz}
              </button>
            ))}
          </div>
          <div className="catalog-list" key={browseMode}>
            {browseMode === 'surah'
              ? surahCatalog.map((surah) => (
                  <button
                    type="button"
                    key={surah.number}
                    className={`catalog-entry ${surah.available ? 'available' : ''}`}
                    disabled={!surah.available}
                    data-surah={surah.number}
                    onClick={() => select(surah.available)}
                  >
                    <span className="catalog-number">{formatCount(surah.number, language)}</span>
                    <span className="catalog-entry-copy">
                      <strong lang={language === 'ur' ? 'ar' : 'en'}>
                        {language === 'ur' ? surah.nameArabic : surah.nameEnglish}
                      </strong>
                      <small>{surah.available ? ui.available : ui.comingSoon}</small>
                    </span>
                    {surah.available ? <Check size={20} /> : <LockKeyhole size={16} />}
                  </button>
                ))
              : juzCatalog.map((juz) => (
                  <button
                    type="button"
                    key={juz.number}
                    className={`catalog-entry ${juz.available ? 'available' : ''}`}
                    disabled={!juz.available}
                    data-juz={juz.number}
                    onClick={() => select(juz.available)}
                  >
                    <span className="catalog-number">{formatCount(juz.number, language)}</span>
                    <span className="catalog-entry-copy">
                      <strong>
                        {ui.juz} {formatCount(juz.number, language)}
                      </strong>
                      <small>{juz.available ? ui.previewOnly : ui.comingSoon}</small>
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
