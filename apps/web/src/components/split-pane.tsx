import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { clampSplit, roundSplit, splitLimits, useSplitWidth } from '../use-split-width';

interface SplitPaneProps {
  className: string;
  dir: 'ltr' | 'rtl';
  lang: string;
  /** Desktop only: without it the children render unchanged and no splitter is shown. */
  enabled: boolean;
  /** Accessible name for the splitter, in the interface language. */
  label: string;
  labelLang: string;
  /** Id of the word-study panel that the splitter sizes. */
  controls: string;
  /** The Quran reading column (grid track `1fr`). */
  reading: ReactNode;
  /** The word-study panel (grid track `--detail-width`, at the container's inline end). */
  detail: ReactNode;
}

interface Geometry {
  left: number;
  right: number;
  gap: number;
  available: number;
  /** The panel sits at the inline end of the grid, so it is on the left in an RTL container. */
  panelOnLeft: boolean;
}

interface Drag extends Geometry {
  pointerId: number;
  /** Pointer distance from the splitter's centre when grabbed, so the divider does not jump. */
  offset: number;
  clientX: number;
  frame: number;
  fraction: number | null;
}

const keySteps: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1 };

/**
 * Two-column study layout with a draggable, keyboard-operable splitter in the gap.
 * The splitter keeps its own state so committing a new width re-renders only this
 * component; the reading list and word panel elements are passed in unchanged.
 */
export function SplitPane({
  className,
  dir,
  lang,
  enabled,
  label,
  labelLang,
  controls,
  reading,
  detail,
}: SplitPaneProps) {
  const { split, changeSplit } = useSplitWidth();
  const container = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const [metrics, setMetrics] = useState({ available: 0, detail: 0 });

  const geometry = useCallback((): Geometry | null => {
    const node = container.current;
    if (!node) return null;
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    const gap = parseFloat(style.columnGap) || 0;
    return {
      left: rect.left,
      right: rect.right,
      gap,
      available: node.clientWidth - gap,
      panelOnLeft: style.direction === 'rtl',
    };
  }, []);

  // Track the real column widths (after CSS clamping) for the ARIA value and keyboard steps,
  // including when the window is resized and the stored fraction is re-clamped.
  useLayoutEffect(() => {
    if (!enabled) return;
    const node = container.current;
    const panel = handle.current?.nextElementSibling;
    if (!node || !panel) return;
    const update = () => {
      const box = geometry();
      if (!box) return;
      const next = {
        available: Math.round(box.available),
        detail: Math.round(panel.getBoundingClientRect().width),
      };
      setMetrics((old) =>
        old.available === next.available && old.detail === next.detail ? old : next,
      );
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    observer.observe(panel);
    return () => observer.disconnect();
  }, [enabled, geometry]);

  const { min, max } = splitLimits(metrics.available);
  const current = metrics.available > 0 ? metrics.detail / metrics.available : 0;
  const percent = (value: number) => Math.round(value * 100);

  const preview = (fraction: number) => {
    const node = container.current;
    if (!node) return;
    node.style.setProperty('--split-fraction', String(fraction));
    node.setAttribute('data-split', '');
    handle.current?.setAttribute('aria-valuenow', String(percent(fraction)));
  };

  const applyDrag = () => {
    const state = drag.current;
    if (!state) return;
    state.frame = 0;
    const x = state.clientX - state.offset;
    const width = state.panelOnLeft
      ? x - state.left - state.gap / 2
      : state.right - x - state.gap / 2;
    const fraction = roundSplit(clampSplit(width / state.available, state.available));
    if (fraction === state.fraction) return;
    state.fraction = fraction;
    preview(fraction);
  };

  const endDrag = () => {
    const state = drag.current;
    if (!state) return;
    if (state.frame) {
      cancelAnimationFrame(state.frame);
      applyDrag();
    }
    drag.current = null;
    document.documentElement.classList.remove('split-dragging');
    handle.current?.removeAttribute('data-dragging');
    if (handle.current?.hasPointerCapture(state.pointerId))
      handle.current.releasePointerCapture(state.pointerId);
    if (state.fraction !== null) changeSplit(state.fraction);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const box = geometry();
    if (!box || box.available <= 0 || drag.current) return;
    // No preventDefault: the mouse default still focuses the splitter (without a focus ring);
    // text selection is suppressed by `user-select: none` while dragging.
    const target = event.currentTarget;
    target.setPointerCapture(event.pointerId);
    const bar = target.getBoundingClientRect();
    drag.current = {
      ...box,
      pointerId: event.pointerId,
      offset: event.clientX - (bar.left + bar.width / 2),
      clientX: event.clientX,
      frame: 0,
      fraction: null,
    };
    target.setAttribute('data-dragging', '');
    document.documentElement.classList.add('split-dragging');
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state || state.pointerId !== event.pointerId) return;
    state.clientX = event.clientX;
    if (!state.frame) state.frame = requestAnimationFrame(applyDrag);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const box = geometry();
    if (!box || box.available <= 0) return;
    const base = clampSplit(split ?? current, box.available);
    let next: number | null;
    if (event.key in keySteps) {
      // Arrows move the divider physically; the panel grows when it moves away from it.
      const toward = keySteps[event.key] * (box.panelOnLeft ? 1 : -1);
      next = base + toward * (event.shiftKey ? 0.1 : 0.02);
    } else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = 1;
    else if (event.key === 'Enter') next = null;
    else return;
    event.preventDefault();
    changeSplit(next === null ? null : clampSplit(next, box.available));
  };

  const style =
    enabled && split !== null ? ({ '--split-fraction': split } as CSSProperties) : undefined;

  return (
    <div
      ref={container}
      className={className}
      dir={dir}
      lang={lang}
      style={style}
      data-split={enabled && split !== null ? '' : undefined}
    >
      {reading}
      {enabled && (
        <div
          ref={handle}
          className="split-handle"
          role="separator"
          tabIndex={0}
          lang={labelLang}
          aria-label={label}
          aria-orientation="vertical"
          aria-controls={controls}
          aria-valuemin={percent(min)}
          aria-valuemax={percent(max)}
          aria-valuenow={percent(current)}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={endDrag}
          onKeyDown={onKeyDown}
          onDoubleClick={() => changeSplit(null)}
        >
          <span className="split-grip" aria-hidden="true" />
        </div>
      )}
      {detail}
    </div>
  );
}
