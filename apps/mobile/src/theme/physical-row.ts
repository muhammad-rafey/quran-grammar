/** Yoga already reverses rows on RTL devices; preserve the requested reading order. */
export function physicalRowDirection(desiredRtl: boolean, nativeRtl: boolean): 'row' | 'row-reverse' {
  return desiredRtl !== nativeRtl ? 'row-reverse' : 'row';
}
