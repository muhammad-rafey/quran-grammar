import assert from 'node:assert/strict';
import test from 'node:test';
import { searchSurahs, surahCatalog, type SurahSearchResult } from './index';
import { editDistance } from './surah-search';
import { surahSearchNames } from './surah-names';

const numbers = (results: SurahSearchResult[]) => results.map((result) => result.surah.number);
/** The Surah ranked first for a query. */
const top = (query: string) => searchSurahs(query)[0];
const topNumber = (query: string) => top(query)?.surah.number;

test('an empty query lists every Surah in order without a match kind', () => {
  for (const query of ['', '   ', '\t']) {
    const results = searchSurahs(query);
    assert.deepEqual(numbers(results), Array.from({ length: 114 }, (_, i) => i + 1));
    assert.ok(results.every((result) => result.match === undefined && result.ayah === undefined));
  }
});

test('search names cover every Surah once, in order, with an English meaning', () => {
  assert.deepEqual(
    surahSearchNames.map(([number]) => number),
    surahCatalog.map((surah) => surah.number),
  );
  for (const [number, meaning, latin, arabic] of surahSearchNames) {
    assert.ok(meaning.trim(), `meaning ${number}`);
    assert.ok(latin.split('|').every((name) => /^[a-z' -]+$/.test(name)), `latin ${number}`);
    assert.ok(arabic.split('|').every((name) => /^[؀-ۿﷺ ]+$/.test(name)), `arabic ${number}`);
  }
  // Every Surah is found first by its own transliteration, Arabic name and English meaning.
  for (const surah of surahCatalog) {
    assert.equal(topNumber(surah.nameEnglish), surah.number, surah.nameEnglish);
    assert.equal(topNumber(surah.nameArabic), surah.number, surah.nameArabic);
    assert.equal(top(surah.nameEnglish)?.match, 'exact', surah.nameEnglish);
  }
  for (const surah of surahCatalog)
    assert.ok(numbers(searchSurahs(surah.meaningEnglish)).includes(surah.number), surah.meaningEnglish);
});

test('numbers in any script open that Surah first, then the numbers they begin', () => {
  for (const query of ['2', '٢', '۲', ' 2 ', 'surah 2', 'Surah 2', 'sura 2', 'سورۃ ۲', 'سورة ٢', '002'])
    assert.deepEqual(top(query), { surah: surahCatalog[1], ayah: undefined, match: 'number' }, query);
  assert.deepEqual(numbers(searchSurahs('36')), [36]);
  assert.deepEqual(numbers(searchSurahs('۳۶')), [36]);
  assert.deepEqual(numbers(searchSurahs('11')), [11, 110, 111, 112, 113, 114]);
  assert.deepEqual(numbers(searchSurahs('1')), [1, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114]);
  assert.deepEqual(
    searchSurahs('2').map((result) => result.match),
    ['number', ...Array(10).fill('prefix')],
  );
  // A leading zero means the whole number, not a prefix.
  assert.deepEqual(numbers(searchSurahs('002')), [2]);
  for (const query of ['0', '115', '999', '-1']) assert.deepEqual(searchSurahs(query), [], query);
  assert.deepEqual(numbers(searchSurahs('114')), [114]);
});

test('"surah:ayah" and "name ayah" carry a valid ayah, in any digits and separator', () => {
  for (const query of ['2:255', '2 255', '2.255', '2/255', '2-255', '٢:٢٥٥', '۲:۲۵۵', '۲،۲۵۵', 'surah 2:255', ' 2 : 255 '])
    assert.deepEqual(searchSurahs(query), [{ surah: surahCatalog[1], ayah: 255, match: 'number' }], query);
  assert.deepEqual(searchSurahs('36:83')[0]?.ayah, 83);
  assert.deepEqual(searchSurahs('1:7')[0]?.ayah, 7);
  // Out of range or zero: the Surah still opens, at its start.
  for (const [query, surah] of [['2:287', 2], ['1:8', 1], ['2:0', 2], ['2:', 2]] as const)
    assert.deepEqual(
      searchSurahs(query),
      [{ surah: surahCatalog[surah - 1], ayah: undefined, match: 'number' }],
      query,
    );
  assert.deepEqual(searchSurahs('115:1'), []);
  assert.deepEqual(top('kahf 10'), { surah: surahCatalog[17], ayah: 10, match: 'exact' });
  assert.deepEqual(top('Al-Kahf:110'), { surah: surahCatalog[17], ayah: 110, match: 'exact' });
  assert.deepEqual(top('bakra 255'), { surah: surahCatalog[1], ayah: 255, match: 'exact' });
  assert.deepEqual(top('yasin:12'), { surah: surahCatalog[35], ayah: 12, match: 'exact' });
  assert.deepEqual(top('البقرة ٢٥٥'), { surah: surahCatalog[1], ayah: 255, match: 'exact' });
  assert.deepEqual(top('baqarah 300'), { surah: surahCatalog[1], ayah: undefined, match: 'exact' });
  // The ayah is checked per Surah: Qaf has no ayah 50, Al-Kahf does.
  const kahf = searchSurahs('kahf 50');
  assert.equal(kahf[0]?.ayah, 50);
  assert.equal(kahf.find((result) => result.surah.number === 50)?.ayah, undefined);
});

test('transliterations ignore case, accents, apostrophes, hyphens, the article and "Surah"', () => {
  const expectations: Array<[number, string[]]> = [
    [1, ['Al-Fatihah', 'al fatiha', 'AL-FATIHA', 'fatiha', 'faatiha', 'fateha', 'Al-Fātiḥah', 'surah fatiha', 'Surat al-Fatiha', 'alfatiha', 'al hamd']],
    [2, ['Al-Baqarah', 'baqarah', 'baqara', 'bakara', 'bakra', 'bakrah', 'baqra', 'albaqarah', 'al-baqara', 'the cow', 'cow', 'The Cow', 'surah baqarah', 'suratul baqarah']],
    [3, ["Ali 'Imran", 'ali imran', 'aal imran', 'aal-e-imran', 'al e imran', 'imran', 'family of imran']],
    [9, ['At-Tawbah', 'tawbah', 'tauba', 'taubah', 'toba', 'repentance']],
    [12, ['Yusuf', 'yousuf', 'yusof', 'joseph']],
    [17, ['Al-Isra', 'israa', 'bani israil', 'bani israeel', 'night journey']],
    [18, ['Al-Kahf', 'kahf', 'kahaf', 'the cave', 'el kahf']],
    [20, ['Taha', 'ta-ha', 'ta ha', 'TAHA']],
    [36, ['Ya-Sin', 'yasin', 'yaseen', 'ya seen', 'ya-seen', 'yaa seen', 'YASIN', 'Ya Sin']],
    [55, ['Ar-Rahman', 'ar rahman', 'arrahman', 'rahman', 'rehman', 'rahmaan', 'rehmaan', 'the beneficent']],
    [56, ["Al-Waqi'ah", 'waqiah', 'waqia', 'waqiya', 'al waqia']],
    [62, ["Al-Jumu'ah", 'jumuah', 'juma', 'jumma', 'friday']],
    [67, ['Al-Mulk', 'mulk', 'tabarak']],
    [74, ['Al-Muddaththir', 'muddassir', 'mudassir']],
    [93, ['Ad-Duhaa', 'duha', 'zuha', 'doha', 'dhuha']],
    [94, ['Ash-Sharh', 'sharh', 'inshirah', 'alam nashrah']],
    [99, ['Az-Zalzalah', 'zalzala', 'zilzal']],
    [108, ['Al-Kawthar', 'kawthar', 'kausar', 'kauthar']],
    [111, ['Al-Masad', 'masad', 'lahab', 'tabbat']],
    [112, ['Al-Ikhlas', 'ikhlas', 'ikhlaas', 'al-ikhlaas', 'sincerity']],
    [114, ['An-Nas', 'an nas', 'nas', 'naas', 'mankind']],
  ];
  for (const [number, queries] of expectations)
    for (const query of queries) assert.equal(topNumber(query), number, query);
  assert.equal(top('bakra')?.match, 'exact');
  assert.equal(top('rehman')?.match, 'exact');
});

test('Arabic and Urdu spellings meet: alef, ta marbuta/ha, ya, kaf, marks and the article', () => {
  const expectations: Array<[number, string[]]> = [
    [1, ['الفاتحة', 'الفاتحہ', 'فاتحہ', 'فاتحه', 'سورۃ الفاتحہ', 'سورة الفاتحة', 'الْفَاتِحَة']],
    [2, ['البقرة', 'البقرہ', 'بقرہ', 'سورۃ البقرہ', 'سورت البقرہ', 'گائے']],
    [3, ['آل عمران', 'ال عمران', 'عمران']],
    [17, ['الإسراء', 'الاسراء', 'اسراء', 'بنی اسرائیل']],
    [20, ['طه', 'طٰہٰ', 'طہ']],
    [36, ['يس', 'یس', 'یٰسٓ', 'یاسین', 'یسین']],
    [55, ['الرحمن', 'الرحمٰن', 'رحمن', 'رحمان']],
    [56, ['الواقعة', 'واقعہ']],
    [67, ['الملك', 'الملک', 'ملک', 'تبارک']],
    [76, ['الانسان', 'الإنسان', 'انسان', 'دہر']],
    [112, ['الإخلاص', 'اخلاص', 'توحید']],
    [114, ['الناس', 'ناس']],
  ];
  for (const [number, queries] of expectations)
    for (const query of queries) assert.equal(topNumber(query), number, query);
  // Al-Insan's own name outranks An-Nas's Urdu meaning "انسان".
  assert.deepEqual(numbers(searchSurahs('انسان')).slice(0, 2), [76, 114]);
});

test('ranking: number > exact > prefix > word prefix > substring > fuzzy, then Surah order', () => {
  // Prefixes while typing: the catalog name first, then aliases, each in Surah order.
  assert.deepEqual(numbers(searchSurahs('fat')).slice(0, 3), [1, 35, 48]);
  assert.deepEqual(searchSurahs('fat').map((result) => result.match).slice(0, 3), ['prefix', 'prefix', 'prefix']);
  assert.equal(topNumber('bakr'), 2);
  assert.equal(top('bakr')?.match, 'prefix');
  assert.equal(topNumber('ya'), 36);
  assert.equal(topNumber('yu'), 10);
  assert.equal(topNumber('mu'), 23);
  // Word prefix inside a longer name, then substrings.
  assert.equal(top('war')?.match, 'word');
  assert.equal(topNumber('war'), 8);
  assert.equal(top('mran')?.match, 'substring');
  assert.equal(topNumber('mran'), 3);
  // An exact alias outranks a prefix of another Surah's name.
  assert.deepEqual(numbers(searchSurahs('nas')).slice(0, 1), [114]);
  assert.equal(top('nas')?.match, 'exact');
  const kinds = searchSurahs('an nas').map((result) => result.match);
  const rank = ['number', 'exact', 'prefix', 'word', 'substring', 'fuzzy'];
  assert.deepEqual(kinds, [...kinds].sort((a, b) => rank.indexOf(a!) - rank.indexOf(b!)));
  // Every result is unique.
  for (const query of ['a', 'al', 'the', 'ma', 'an nas', 'taha'])
    assert.equal(new Set(numbers(searchSurahs(query))).size, searchSurahs(query).length, query);
});

test('small typos are tolerated: one from 4 letters, two from 7, none below 4', () => {
  assert.equal(topNumber('bqarah'), 2);
  assert.equal(top('bqarah')?.match, 'fuzzy');
  assert.equal(topNumber('baqarh'), 2);
  assert.equal(topNumber('rahmn'), 55);
  assert.equal(topNumber('yasn'), 36);
  assert.equal(topNumber('ibrahm'), 14);
  assert.equal(topNumber('kahfh'), 18);
  assert.equal(topNumber('spidr'), 29);
  assert.equal(topNumber('ikhlsa'), 112, 'adjacent transposition');
  assert.equal(topNumber('beleivers'), 23);
  assert.equal(topNumber('muzzamill'), 73);
  assert.equal(topNumber('muddaththri'), 74, 'two edits at 7+ letters');
  // Three letters allow none; four letters allow one, not two.
  assert.deepEqual(searchSurahs('kfh'), []);
  assert.deepEqual(searchSurahs('xyz'), []);
  assert.ok(!numbers(searchSurahs('bqrh')).includes(2));
  assert.deepEqual(searchSurahs('qwertyuiop'), []);
  assert.deepEqual(searchSurahs('!!!'), []);
});

test('editDistance is optimal string alignment with an early exit', () => {
  assert.equal(editDistance('', ''), 0);
  assert.equal(editDistance('abc', ''), 3);
  assert.equal(editDistance('kitten', 'sitting'), 3);
  assert.equal(editDistance('ab', 'ba'), 1);
  assert.equal(editDistance('ikhlas', 'ikhlsa'), 1);
  assert.equal(editDistance('ca', 'abc'), 3);
  assert.equal(editDistance('kitten', 'sitting', 1), 2);
  assert.equal(editDistance('a', 'abcdef', 2), 3);
});
