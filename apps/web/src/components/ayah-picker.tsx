import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { formatCount, getUiStrings, type UiLanguage } from '@quran-grammar/core';

/** Reduces typed ASCII, Urdu (۰-۹) and Arabic-Indic (٠-٩) digits to an ASCII digit string. */
export function normalizeAyahQuery(value: string) {
  return formatCount(value, 'en').replace(/[^0-9]/g, '');
}

const popoverWidth = 360;
const viewportGutter = 16;

/**
 * The ayah chip in the study toolbar. Opens a modal dialog with a number search and a dense
 * grid of ayah numbers: an anchored popover on wide screens and a bottom sheet at ≤600px.
 */
export function AyahPicker({
  language,
  ayahs,
  current,
  disabled,
  onSelect,
}: {
  language: UiLanguage;
  ayahs: number[];
  current: number;
  disabled: boolean;
  onSelect: (number: number) => void;
}) {
  const ui = getUiStrings(language);
  const direction = language === 'ur' ? 'rtl' : 'ltr';
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [focusTarget, setFocusTarget] = useState(current);
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const digits = normalizeAyahQuery(query);
  // Any typed text filters; text without digits matches nothing rather than everything.
  const shown = query.trim()
    ? ayahs.filter((number) => digits && String(number).startsWith(digits))
    : ayahs;
  const rovingTarget = shown.includes(focusTarget)
    ? focusTarget
    : shown.includes(current)
      ? current
      : shown[0];

  // Anchor the popover under the chip (or above it when there is more room there).
  const place = () => {
    const element = dialog.current;
    const anchor = trigger.current;
    if (!element || !anchor) return;
    const rect = anchor.getBoundingClientRect();
    const width = Math.min(popoverWidth, innerWidth - viewportGutter * 2);
    const preferred = direction === 'rtl' ? rect.left : rect.right - width;
    const left = Math.min(
      Math.max(preferred, viewportGutter),
      innerWidth - viewportGutter - width,
    );
    const below = innerHeight - rect.bottom - viewportGutter - 8;
    const above = rect.top - viewportGutter - 8;
    const style = element.style;
    style.setProperty('--ayah-picker-left', `${left}px`);
    style.setProperty('--ayah-picker-width', `${width}px`);
    if (below >= 320 || below >= above) {
      style.setProperty('--ayah-picker-top', `${rect.bottom + 8}px`);
      style.setProperty('--ayah-picker-bottom', 'auto');
      style.setProperty('--ayah-picker-max-height', `${Math.min(460, below)}px`);
    } else {
      style.setProperty('--ayah-picker-top', 'auto');
      style.setProperty('--ayah-picker-bottom', `${innerHeight - rect.top + 8}px`);
      style.setProperty('--ayah-picker-max-height', `${Math.min(460, above)}px`);
    }
  };

  useLayoutEffect(() => {
    if (!open || !dialog.current) return;
    const element = dialog.current;
    const oldOverflow = document.body.style.overflow;
    place();
    element.showModal();
    document.body.style.overflow = 'hidden';
    search.current?.focus();
    grid.current
      ?.querySelector<HTMLButtonElement>('[aria-current="true"]')
      ?.scrollIntoView({ block: 'center', inline: 'nearest' });
    addEventListener('resize', place);
    return () => {
      removeEventListener('resize', place);
      element.close();
      document.body.style.overflow = oldOverflow;
      trigger.current?.focus({ preventScroll: true });
    };
  }, [open, direction]);

  // Close if the study unloads (e.g. a collection change) while the picker is open.
  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  const choose = (number: number) => {
    if (!ayahs.includes(number)) return;
    setOpen(false);
    onSelect(number);
  };

  const focusNumber = (number: number | undefined) => {
    if (number === undefined) return;
    setFocusTarget(number);
    grid.current?.querySelector<HTMLButtonElement>(`[data-ayah="${number}"]`)?.focus();
  };

  const onSearchKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const exact = Number(digits);
      if (digits && ayahs.includes(exact)) choose(exact);
      else if (shown.length === 1) choose(shown[0]);
    } else if (event.key === 'ArrowDown' && shown.length) {
      event.preventDefault();
      focusNumber(rovingTarget);
    }
  };

  const onGridKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-ayah]');
    if (!button || !grid.current) return;
    const index = shown.indexOf(Number(button.dataset.ayah));
    const columns = Math.max(
      1,
      getComputedStyle(grid.current).gridTemplateColumns.split(' ').filter(Boolean).length,
    );
    const step = direction === 'rtl' ? -1 : 1;
    const moves: Record<string, number> = {
      ArrowRight: index + step,
      ArrowLeft: index - step,
      ArrowDown: index + columns,
      ArrowUp: index - columns,
      Home: 0,
      End: shown.length - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const next = moves[event.key];
    if (event.key === 'ArrowUp' && next < 0) {
      search.current?.focus();
      return;
    }
    focusNumber(shown[Math.min(Math.max(next, 0), shown.length - 1)]);
  };

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="ayah-selector selector-chip"
        aria-label={ui.selectAyah}
        aria-describedby={`${id}-value`}
        aria-haspopup="dialog"
        aria-expanded={open}
        data-ayah={current}
        disabled={disabled}
        onClick={() => {
          setQuery('');
          setFocusTarget(current);
          setOpen(true);
        }}
      >
        <small>{ui.ayah}</small>
        <strong id={`${id}-value`}>{formatCount(current, language)}</strong>
        <ChevronDown size={17} aria-hidden="true" />
      </button>
      <dialog
        ref={dialog}
        className="ayah-picker ui"
        lang={language}
        dir={direction}
        aria-labelledby={`${id}-title`}
        onCancel={(event) => {
          event.preventDefault();
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
      >
        {open && (
          <div className="ayah-picker-shell">
            <header className="ayah-picker-header">
              <h2 id={`${id}-title`}>{ui.selectAyah}</h2>
              <button
                type="button"
                className="icon-button"
                aria-label={ui.close}
                onClick={() => setOpen(false)}
              >
                <X size={20} />
              </button>
            </header>
            <label className="topic-search ayah-search">
              <Search size={18} aria-hidden="true" />
              <input
                ref={search}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                enterKeyHint="go"
                aria-label={ui.searchAyah}
                placeholder={ui.searchAyah}
                aria-controls={`${id}-grid`}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onSearchKey}
              />
            </label>
            {shown.length ? (
              <div
                ref={grid}
                id={`${id}-grid`}
                className="ayah-grid"
                role="group"
                aria-label={ui.selectAyah}
                onKeyDown={onGridKey}
              >
                {shown.map((number) => (
                  <button
                    type="button"
                    key={number}
                    data-ayah={number}
                    aria-current={number === current ? 'true' : undefined}
                    tabIndex={number === rovingTarget ? 0 : -1}
                    onFocus={() => setFocusTarget(number)}
                    onClick={() => choose(number)}
                  >
                    {formatCount(number, language)}
                  </button>
                ))}
              </div>
            ) : (
              <p className="ayah-no-match" role="status">
                {ui.noAyahMatch}
              </p>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
