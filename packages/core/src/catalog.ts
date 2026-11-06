import { availableSurahNumbers } from './availability';
import type { UiLanguage } from './interface';
/** Factual chapter names checked against Quran.com API v4 on 2026-10-23.
 * Source and scope are recorded in docs/content-provenance.md.
 */
export interface SurahCatalogEntry {
  readonly number: number;
  readonly nameArabic: string;
  /** Conventional English transliteration, not a translation. */
  readonly nameEnglish: string;
  readonly available: boolean;
}

/** The ayahs of one available chapter that fall inside a juz. */
export interface JuzSurahRange {
  readonly surah: number;
  readonly firstAyah: number;
  readonly lastAyah: number;
}

export interface JuzCatalogEntry {
  readonly number: number;
  readonly available: boolean;
  /** A partial preview must never be presented as the entire juz. */
  readonly partial: boolean;
  readonly previewSurahNumber?: number;
  readonly surahNumbers: readonly number[];
  /** Ayah ranges of the available chapters in this juz; a chapter may span two juz. */
  readonly ranges: readonly JuzSurahRange[];
}

const chapterNames: ReadonlyArray<readonly [number, string, string]> = [
  [1, 'الفاتحة', 'Al-Fatihah'],
  [2, 'البقرة', 'Al-Baqarah'],
  [3, 'آل عمران', "Ali 'Imran"],
  [4, 'النساء', 'An-Nisa'],
  [5, 'المائدة', "Al-Ma'idah"],
  [6, 'الأنعام', "Al-An'am"],
  [7, 'الأعراف', "Al-A'raf"],
  [8, 'الأنفال', 'Al-Anfal'],
  [9, 'التوبة', 'At-Tawbah'],
  [10, 'يونس', 'Yunus'],
  [11, 'هود', 'Hud'],
  [12, 'يوسف', 'Yusuf'],
  [13, 'الرعد', "Ar-Ra'd"],
  [14, 'ابراهيم', 'Ibrahim'],
  [15, 'الحجر', 'Al-Hijr'],
  [16, 'النحل', 'An-Nahl'],
  [17, 'الإسراء', 'Al-Isra'],
  [18, 'الكهف', 'Al-Kahf'],
  [19, 'مريم', 'Maryam'],
  [20, 'طه', 'Taha'],
  [21, 'الأنبياء', 'Al-Anbya'],
  [22, 'الحج', 'Al-Hajj'],
  [23, 'المؤمنون', "Al-Mu'minun"],
  [24, 'النور', 'An-Nur'],
  [25, 'الفرقان', 'Al-Furqan'],
  [26, 'الشعراء', "Ash-Shu'ara"],
  [27, 'النمل', 'An-Naml'],
  [28, 'القصص', 'Al-Qasas'],
  [29, 'العنكبوت', "Al-'Ankabut"],
  [30, 'الروم', 'Ar-Rum'],
  [31, 'لقمان', 'Luqman'],
  [32, 'السجدة', 'As-Sajdah'],
  [33, 'الأحزاب', 'Al-Ahzab'],
  [34, 'سبإ', 'Saba'],
  [35, 'فاطر', 'Fatir'],
  [36, 'يس', 'Ya-Sin'],
  [37, 'الصافات', 'As-Saffat'],
  [38, 'ص', 'Sad'],
  [39, 'الزمر', 'Az-Zumar'],
  [40, 'غافر', 'Ghafir'],
  [41, 'فصلت', 'Fussilat'],
  [42, 'الشورى', 'Ash-Shuraa'],
  [43, 'الزخرف', 'Az-Zukhruf'],
  [44, 'الدخان', 'Ad-Dukhan'],
  [45, 'الجاثية', 'Al-Jathiyah'],
  [46, 'الأحقاف', 'Al-Ahqaf'],
  [47, 'محمد', 'Muhammad'],
  [48, 'الفتح', 'Al-Fath'],
  [49, 'الحجرات', 'Al-Hujurat'],
  [50, 'ق', 'Qaf'],
  [51, 'الذاريات', 'Adh-Dhariyat'],
  [52, 'الطور', 'At-Tur'],
  [53, 'النجم', 'An-Najm'],
  [54, 'القمر', 'Al-Qamar'],
  [55, 'الرحمن', 'Ar-Rahman'],
  [56, 'الواقعة', "Al-Waqi'ah"],
  [57, 'الحديد', 'Al-Hadid'],
  [58, 'المجادلة', 'Al-Mujadila'],
  [59, 'الحشر', 'Al-Hashr'],
  [60, 'الممتحنة', 'Al-Mumtahanah'],
  [61, 'الصف', 'As-Saf'],
  [62, 'الجمعة', "Al-Jumu'ah"],
  [63, 'المنافقون', 'Al-Munafiqun'],
  [64, 'التغابن', 'At-Taghabun'],
  [65, 'الطلاق', 'At-Talaq'],
  [66, 'التحريم', 'At-Tahrim'],
  [67, 'الملك', 'Al-Mulk'],
  [68, 'القلم', 'Al-Qalam'],
  [69, 'الحاقة', 'Al-Haqqah'],
  [70, 'المعارج', "Al-Ma'arij"],
  [71, 'نوح', 'Nuh'],
  [72, 'الجن', 'Al-Jinn'],
  [73, 'المزمل', 'Al-Muzzammil'],
  [74, 'المدثر', 'Al-Muddaththir'],
  [75, 'القيامة', 'Al-Qiyamah'],
  [76, 'الانسان', 'Al-Insan'],
  [77, 'المرسلات', 'Al-Mursalat'],
  [78, 'النبإ', 'An-Naba'],
  [79, 'النازعات', "An-Nazi'at"],
  [80, 'عبس', "'Abasa"],
  [81, 'التكوير', 'At-Takwir'],
  [82, 'الإنفطار', 'Al-Infitar'],
  [83, 'المطففين', 'Al-Mutaffifin'],
  [84, 'الإنشقاق', 'Al-Inshiqaq'],
  [85, 'البروج', 'Al-Buruj'],
  [86, 'الطارق', 'At-Tariq'],
  [87, 'الأعلى', "Al-A'la"],
  [88, 'الغاشية', 'Al-Ghashiyah'],
  [89, 'الفجر', 'Al-Fajr'],
  [90, 'البلد', 'Al-Balad'],
  [91, 'الشمس', 'Ash-Shams'],
  [92, 'الليل', 'Al-Layl'],
  [93, 'الضحى', 'Ad-Duhaa'],
  [94, 'الشرح', 'Ash-Sharh'],
  [95, 'التين', 'At-Tin'],
  [96, 'العلق', "Al-'Alaq"],
  [97, 'القدر', 'Al-Qadr'],
  [98, 'البينة', 'Al-Bayyinah'],
  [99, 'الزلزلة', 'Az-Zalzalah'],
  [100, 'العاديات', "Al-'Adiyat"],
  [101, 'القارعة', "Al-Qari'ah"],
  [102, 'التكاثر', 'At-Takathur'],
  [103, 'العصر', "Al-'Asr"],
  [104, 'الهمزة', 'Al-Humazah'],
  [105, 'الفيل', 'Al-Fil'],
  [106, 'قريش', 'Quraysh'],
  [107, 'الماعون', "Al-Ma'un"],
  [108, 'الكوثر', 'Al-Kawthar'],
  [109, 'الكافرون', 'Al-Kafirun'],
  [110, 'النصر', 'An-Nasr'],
  [111, 'المسد', 'Al-Masad'],
  [112, 'الإخلاص', 'Al-Ikhlas'],
  [113, 'الفلق', 'Al-Falaq'],
  [114, 'الناس', 'An-Nas'],
];

/** Available chapters are backed by complete bundled lessons. */
export const surahCatalog: readonly SurahCatalogEntry[] = chapterNames.map(
  ([number, nameArabic, nameEnglish]) => ({
    number,
    nameArabic,
    nameEnglish,
    available: availableSurahNumbers.includes(number),
  }),
);

/** Juz boundaries as [juz, surah, first ayah, last ayah] for the standard 30-part division.
 * Checked against Quran.com API v4 /juzs on 2026-11-06; every ayah of all 114 chapters is covered once.
 */
const juzBoundaries: ReadonlyArray<readonly [number, number, number, number]> = [
  [1, 1, 1, 7],
  [1, 2, 1, 141],
  [2, 2, 142, 252],
  [3, 2, 253, 286],
  [3, 3, 1, 92],
  [4, 3, 93, 200],
  [4, 4, 1, 23],
  [5, 4, 24, 147],
  [6, 4, 148, 176],
  [6, 5, 1, 81],
  [7, 5, 82, 120],
  [7, 6, 1, 110],
  [8, 6, 111, 165],
  [8, 7, 1, 87],
  [9, 7, 88, 206],
  [9, 8, 1, 40],
  [10, 8, 41, 75],
  [10, 9, 1, 92],
  [11, 9, 93, 129],
  [11, 10, 1, 109],
  [11, 11, 1, 5],
  [12, 11, 6, 123],
  [12, 12, 1, 52],
  [13, 12, 53, 111],
  [13, 13, 1, 43],
  [13, 14, 1, 52],
  [14, 15, 1, 99],
  [14, 16, 1, 128],
  [15, 17, 1, 111],
  [15, 18, 1, 74],
  [16, 18, 75, 110],
  [16, 19, 1, 98],
  [16, 20, 1, 135],
  [17, 21, 1, 112],
  [17, 22, 1, 78],
  [18, 23, 1, 118],
  [18, 24, 1, 64],
  [18, 25, 1, 20],
  [19, 25, 21, 77],
  [19, 26, 1, 227],
  [19, 27, 1, 55],
  [20, 27, 56, 93],
  [20, 28, 1, 88],
  [20, 29, 1, 45],
  [21, 29, 46, 69],
  [21, 30, 1, 60],
  [21, 31, 1, 34],
  [21, 32, 1, 30],
  [21, 33, 1, 30],
  [22, 33, 31, 73],
  [22, 34, 1, 54],
  [22, 35, 1, 45],
  [22, 36, 1, 27],
  [23, 36, 28, 83],
  [23, 37, 1, 182],
  [23, 38, 1, 88],
  [23, 39, 1, 31],
  [24, 39, 32, 75],
  [24, 40, 1, 85],
  [24, 41, 1, 46],
  [25, 41, 47, 54],
  [25, 42, 1, 53],
  [25, 43, 1, 89],
  [25, 44, 1, 59],
  [25, 45, 1, 37],
  [26, 46, 1, 35],
  [26, 47, 1, 38],
  [26, 48, 1, 29],
  [26, 49, 1, 18],
  [26, 50, 1, 45],
  [26, 51, 1, 30],
  [27, 51, 31, 60],
  [27, 52, 1, 49],
  [27, 53, 1, 62],
  [27, 54, 1, 55],
  [27, 55, 1, 78],
  [27, 56, 1, 96],
  [27, 57, 1, 29],
  [28, 58, 1, 22],
  [28, 59, 1, 24],
  [28, 60, 1, 13],
  [28, 61, 1, 14],
  [28, 62, 1, 11],
  [28, 63, 1, 11],
  [28, 64, 1, 18],
  [28, 65, 1, 12],
  [28, 66, 1, 12],
  [29, 67, 1, 30],
  [29, 68, 1, 52],
  [29, 69, 1, 52],
  [29, 70, 1, 44],
  [29, 71, 1, 28],
  [29, 72, 1, 28],
  [29, 73, 1, 20],
  [29, 74, 1, 56],
  [29, 75, 1, 40],
  [29, 76, 1, 31],
  [29, 77, 1, 50],
  [30, 78, 1, 40],
  [30, 79, 1, 46],
  [30, 80, 1, 42],
  [30, 81, 1, 29],
  [30, 82, 1, 19],
  [30, 83, 1, 36],
  [30, 84, 1, 25],
  [30, 85, 1, 22],
  [30, 86, 1, 17],
  [30, 87, 1, 19],
  [30, 88, 1, 26],
  [30, 89, 1, 30],
  [30, 90, 1, 20],
  [30, 91, 1, 15],
  [30, 92, 1, 21],
  [30, 93, 1, 11],
  [30, 94, 1, 8],
  [30, 95, 1, 8],
  [30, 96, 1, 19],
  [30, 97, 1, 5],
  [30, 98, 1, 8],
  [30, 99, 1, 8],
  [30, 100, 1, 11],
  [30, 101, 1, 11],
  [30, 102, 1, 8],
  [30, 103, 1, 3],
  [30, 104, 1, 9],
  [30, 105, 1, 5],
  [30, 106, 1, 4],
  [30, 107, 1, 7],
  [30, 108, 1, 3],
  [30, 109, 1, 6],
  [30, 110, 1, 3],
  [30, 111, 1, 5],
  [30, 112, 1, 4],
  [30, 113, 1, 5],
  [30, 114, 1, 6],
];

/** Juz previews list only the chapters for which study content is available. */
export const juzCatalog: readonly JuzCatalogEntry[] = Array.from({ length: 30 }, (_, index) => {
  const number = index + 1;
  const rows = juzBoundaries.filter(([juz]) => juz === number);
  const ranges = rows
    .filter(([, surah]) => availableSurahNumbers.includes(surah))
    .map(([, surah, firstAyah, lastAyah]) => ({ surah, firstAyah, lastAyah }));
  const surahNumbers = ranges.map((range) => range.surah);
  return {
    number,
    available: surahNumbers.length > 0,
    partial:
      surahNumbers.length > 0 && rows.some(([, surah]) => !availableSurahNumbers.includes(surah)),
    previewSurahNumber: surahNumbers[0],
    surahNumbers,
    ranges,
  };
});

/** The available juz that contains a given ayah, so a chapter spanning two juz shows the right one. */
export function getJuzForAyah(surah: number, ayah: number): JuzCatalogEntry | undefined {
  return juzCatalog.find((juz) =>
    juz.ranges.some(
      (range) => range.surah === surah && ayah >= range.firstAyah && ayah <= range.lastAyah,
    ),
  );
}

/** The first ayah of a chapter inside a juz: Juz 16 opens Al-Kahf at ayah 75, not ayah 1. */
export function getJuzStartAyah(juzNumber: number, surah: number): number {
  return (
    juzCatalog
      .find((juz) => juz.number === juzNumber)
      ?.ranges.find((range) => range.surah === surah)?.firstAyah ?? 1
  );
}

export function getSurahTitle(number: number, language: UiLanguage): string {
  const chapter = surahCatalog.find((surah) => surah.number === number);
  return chapter ? (language === 'ur' ? chapter.nameArabic : chapter.nameEnglish) : String(number);
}
