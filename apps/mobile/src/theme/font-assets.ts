/**
 * Bundled reading-font files for expo-font, keyed by the registry `family`
 * (packages/core/src/fonts.ts). One entry per family: a family shared by a Quran and an Urdu
 * registry entry (Naskh, ScheherazadeNew) is a single file. The files and their license texts are
 * also served by the web app from apps/web/public/fonts with identical bytes.
 */
export const fontAssets: Record<string, number> = {
  AmiriQuran: require('../../assets/fonts/amiri-quran.ttf'),
  AlQalamQuranMajeed: require('../../assets/fonts/al-qalam-quran-majeed.ttf'),
  ScheherazadeNew: require('../../assets/fonts/scheherazade-new.ttf'),
  Naskh: require('../../assets/fonts/naskh.ttf'),
  Nastaliq: require('../../assets/fonts/nastaliq.ttf'),
  Lateef: require('../../assets/fonts/lateef.ttf'),
};
