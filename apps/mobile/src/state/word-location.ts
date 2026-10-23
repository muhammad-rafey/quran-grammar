/** Parse occurrence links strictly before they can select a chapter or request data. */
export function parseWordLocation(value: unknown): {
  surah: number;
  ayah: number;
  position: number;
} | null {
  if (
    typeof value !== 'string' ||
    value.trim() !== value ||
    !/^[1-9]\d{0,2}:[1-9]\d{0,2}:[1-9]\d{0,2}$/.test(value)
  )
    return null;
  const [surah, ayah, position] = value.split(':').map(Number);
  if (surah > 114) return null;
  return { surah, ayah, position };
}
