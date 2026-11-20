/**
 * Ayah navigation for the virtualized study list.
 *
 * FlatList only measures the cells it has rendered, and without fixed row heights it cannot scroll
 * to an unmeasured ayah. The list therefore holds a slice of the chapter that starts at a "start"
 * ayah: a far jump remounts the list with the target as its first item, and earlier ayahs are
 * prepended in chunks as the reader scrolls up (FlatList keeps the visible content in place).
 * Jumps inside the slice use measured `scrollToIndex` commands, re-issued until they settle.
 */

export type ViewableAyah = { index: number | null; isViewable: boolean; item: { number: number } };

/** What the screen should do after FlatList could not scroll to the target. */
export type JumpRecovery = 'remount' | 'none';

/** The ayah nearest the top of the viewport, from FlatList's viewability report. */
export function topVisibleAyah(viewable: readonly ViewableAyah[]): number | null {
  let top: ViewableAyah | null = null;
  for (const entry of viewable) {
    if (!entry.isViewable || entry.index === null) continue;
    if (!top || entry.index < (top.index ?? Infinity)) top = entry;
  }
  return top ? top.item.number : null;
}

export class AyahJump {
  private target: { surah: number; index: number } | null = null;
  private failures = 0;
  private confirmations = 0;
  private readonly maxFailures: number;
  private readonly confirmationPasses: number;

  constructor(maxFailures = 4, confirmationPasses = 2) {
    this.maxFailures = maxFailures;
    this.confirmationPasses = confirmationPasses;
  }

  /** Request a jump; the chapter may still be loading, so the target remembers its Surah. */
  request(surah: number, ayah: number) {
    this.target = { surah, index: Math.max(0, Math.floor(ayah) - 1) };
    this.failures = 0;
    this.confirmations = 0;
  }

  /** The user started reading (dragging), or the jump finished. */
  cancel() {
    this.target = null;
  }

  /** True while a jump for this Surah is unresolved (scroll-driven ayah labels wait for it). */
  pendingFor(surah: number) {
    return this.target !== null && this.target.surah === surah;
  }

  /**
   * The list index to scroll to on this Surah's list, clamped to its length. A request made for
   * another chapter is never applied to this one (no stale chapter jumps).
   */
  indexFor(surah: number, itemCount: number): number | null {
    if (!this.target || this.target.surah !== surah || itemCount <= 0) return null;
    return Math.min(this.target.index, itemCount - 1);
  }

  /**
   * A new list instance is being mounted for this Surah. Returns the ayah index its slice starts
   * at: the pending target, so a far ayah renders first instead of every ayah before it.
   */
  mount(surah: number, itemCount: number): number {
    return this.indexFor(surah, itemCount) ?? 0;
  }

  /**
   * Where to scroll inside a slice starting at `start`: an index into the slice, or 'remount'
   * when the target lies before the slice. Null when there is nothing to do for this Surah.
   */
  sliceIndex(surah: number, itemCount: number, start: number): number | 'remount' | null {
    const index = this.indexFor(surah, itemCount);
    if (index === null) return null;
    return index < start ? 'remount' : index - start;
  }

  /** FlatList has not measured the target cell (it is far below the rendered window). */
  failed(surah: number): JumpRecovery {
    if (!this.pendingFor(surah)) return 'none';
    this.failures += 1;
    if (this.failures > this.maxFailures) {
      this.target = null;
      return 'none';
    }
    // Start a new list at the target; it is then the first item and needs no measurement.
    return 'remount';
  }

  /**
   * A measured scrollToIndex was issued. Returns true when one more confirmation pass should be
   * scheduled (cells above the target can still settle); false once the jump is complete.
   */
  succeeded(surah: number): boolean {
    if (!this.pendingFor(surah)) return false;
    this.confirmations += 1;
    if (this.confirmations > this.confirmationPasses) {
      this.target = null;
      return false;
    }
    return true;
  }
}
