/** Native scroll/layout events can arrive in either order after changing chapters. */
export class AyahScroll {
  private active = true;
  private positions = new Map<number, { y: number; height: number }>();
  private contentHeight = 0;
  private viewportHeight = 0;
  private target: number | null;
  private issuedOffset: number | null = null;
  private issuedMeasurements = '';
  private lastScrollTime = -Infinity;

  constructor(target = 1) {
    this.target = target;
  }

  activate() {
    this.active = true;
  }

  deactivate() {
    this.active = false;
  }

  request(number: number) {
    this.target = number;
    this.issuedOffset = null;
    this.issuedMeasurements = '';
  }

  recordAyah(number: number, y: number, height: number) {
    if (this.active) this.positions.set(number, { y, height });
  }

  recordContent(height: number) {
    if (this.active) this.contentHeight = height;
  }

  recordViewport(height: number) {
    if (this.active) this.viewportHeight = height;
  }

  /** A native command is ready only when this surface can actually contain the target. */
  takeScroll(gap: number, retry = false): number | null {
    if (!this.active || this.target === null || this.viewportHeight <= 0) return null;
    const position = this.positions.get(this.target);
    if (!position || position.height <= 0 || this.contentHeight < position.y + position.height) {
      return null;
    }
    const y = Math.min(
      this.target === 1 ? 0 : Math.max(0, position.y - gap),
      Math.max(0, this.contentHeight - this.viewportHeight),
    );
    const measurements = `${this.target}:${y}:${position.height}:${this.contentHeight}:${this.viewportHeight}`;
    if (!retry && measurements === this.issuedMeasurements) return null;
    this.issuedMeasurements = measurements;
    this.issuedOffset = y;
    return y;
  }

  beginReading() {
    this.target = null;
    this.issuedOffset = null;
  }

  observeScroll(y: number, time: number): { ayah: number | null; retry: boolean } {
    if (!this.active || time < this.lastScrollTime) return { ayah: null, retry: false };
    this.lastScrollTime = time;
    if (this.target !== null) {
      if (this.issuedOffset === null) return { ayah: null, retry: false };
      // A clamped/queued scroll is not acknowledgement that the requested ayah was reached.
      if (Math.abs(y - this.issuedOffset) > 2) return { ayah: null, retry: true };
      this.target = null;
    }
    const visible = [...this.positions]
      .filter(([, position]) => position.y <= y + 48)
      .sort((a, b) => b[1].y - a[1].y)[0];
    return { ayah: visible?.[0] ?? null, retry: false };
  }
}
