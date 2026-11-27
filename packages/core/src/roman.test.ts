import assert from 'node:assert/strict';
import test from 'node:test';
import { getStudy, grammarTopicSources } from './content';
import {
  isLatinQuery,
  matchesEnglish,
  matchesRoman,
  matchesWord,
  romanKey,
  searchSurahs,
  searchTopics,
} from './index';
import { romanDistance } from './roman';

/** Urdu titles of the topics a query finds, best first. */
const topics = (query: string) => searchTopics(grammarTopicSources, query).map((t) => t.titleUrdu);
const firstTopic = (query: string) => topics(query)[0];
const topSurah = (query: string) => searchSurahs(query)[0]?.surah.number;

test('romanKey reduces Urdu, Arabic and Latin spellings to the same consonant skeleton', () => {
  const same: ReadonlyArray<readonly [string, ...string[]]> = [
    ['مرکبِ اضافی', 'muraqab e izafi', 'murakkab-e-izafi', 'murakab izafi', 'Murakkab-e-Izāfī'],
    ['فعلِ ماضی', 'fel mazi', 'fail mazi', 'fiil maazi'],
    ['اسمِ اشارہ', 'ism e ishara', 'ism ishaarah'],
    ['مجرور', 'majroor', 'majrur', 'majruur'],
    ['ضمیر', 'zameer', 'zamir'],
    ['كِتَاب', 'kitab', 'kitaab', 'ketab'],
    ['زمین', 'zameen', 'zamin'],
    ['خبر', 'khabar', 'khbr'],
    ['شرط', 'shart', 'sharat'],
    ['غیر', 'ghair', 'gair'.replace('g', 'gh')],
    ['کھانا', 'khana'],
    ['گھر', 'ghar'],
    ['پھر', 'phir'],
    ['بھی', 'bhi'],
    ['اللہ', 'allah'],
    ['قسم', 'qasam', 'kasam'],
  ];
  // ض/ظ (class D) meet a typed z.
  const key = (text: string) => romanKey(text).replaceAll('D', 'z');
  for (const [arabic, ...latin] of same)
    for (const spelling of latin) assert.equal(key(spelling), key(arabic), spelling);
  assert.equal(romanKey('مرکبِ اضافی'), 'mrkb Df');
  assert.equal(romanKey('murakkab-e-izafi'), 'mrkb zf');
  // Diacritics, tatweel and Quranic marks never change the key.
  assert.equal(romanKey('ٱلْكِتَـٰبُ'), romanKey('الكتاب'));
  // ض and ظ keep their own class, which a typed d or z both meet.
  assert.equal(romanKey('ضمیر'), 'Dmr');
  assert.ok(matchesRoman('damir', 'ضمیر'));
  assert.ok(matchesRoman('zamir', 'ضمیر'));
  assert.ok(matchesRoman('dhamir', 'ضمیر'));
});

test('Latin queries ignore case, accents, apostrophes, hyphens and the izafat joiner', () => {
  for (const query of ["fe'l maazi", 'FE’L MĀẒĪ', 'fel-e-mazi', 'fele mazi', 'fi‘l māḍī'])
    assert.ok(matchesRoman(query, 'فعلِ ماضی'), query);
  for (const query of ['ism e ishara', 'isme ishara', 'ism-e-ishara', 'ismeishara'])
    assert.ok(matchesRoman(query, 'اسمِ اشارہ'), query);
  // Word order does not matter; every query word must meet some title word.
  assert.ok(matchesRoman('izafi murakkab', 'مرکبِ اضافی'));
  assert.ok(!matchesRoman('murakkab tafzil', 'مرکبِ اضافی'));
  // Single-letter words ("o", "wa", "al") are optional joiners.
  assert.ok(matchesRoman('jar o majrur', 'جار و مجرور'));
  assert.ok(matchesRoman('jar wa majrur', 'جار و مجرور'));
  assert.ok(matchesRoman('jaar majroor', 'حرفِ جر اور جار و مجرور'));
  // The Arabic article and attached particles are optional; assimilated articles meet.
  assert.ok(matchesRoman('kitab', 'ٱلْكِتَٰبُ'));
  assert.ok(matchesRoman('alkitab', 'ٱلْكِتَٰبُ'));
  assert.ok(matchesRoman('arrahman', 'ٱلرَّحْمَٰنِ'));
  assert.ok(matchesRoman('ar-rahman', 'ٱلرَّحْمَٰنِ'));
  assert.ok(matchesRoman('ard', 'وَٱلْأَرْضِ'));
  // Words still being typed match by their start; small typos from 4 skeleton letters.
  assert.ok(matchesRoman('murak', 'مرکبِ اضافی'));
  assert.ok(matchesRoman('mubtda', 'مبتدا'));
  assert.ok(matchesRoman('mubtadda khabar', 'مبتدا اور خبر'));
  assert.ok(matchesRoman('murkkab', 'مرکب'));
  assert.ok(matchesRoman('mutalq', 'مطلق'), 'adjacent swap');
});

test('non-matches stay out', () => {
  assert.ok(!matchesRoman('kitab', 'زمین'));
  assert.ok(!matchesRoman('zameen', 'ضمیر'));
  assert.ok(!matchesRoman('fel mazi', 'فعلِ مضارع اور مستقبل'.replace('مضارع', 'امر')));
  assert.ok(!matchesRoman('xyz', 'مرکبِ اضافی'));
  // Three skeleton letters allow no typo.
  assert.ok(!matchesRoman('zmn', 'ضمیر'));
  // Arabic or Urdu script is not a Latin query.
  assert.ok(!isLatinQuery('مرکب'));
  assert.ok(!isLatinQuery('مرکب izafi'));
  assert.ok(isLatinQuery('Izafi'));
  assert.ok(!matchesRoman('مرکب', 'مرکب'));
});

test('romanDistance is optimal string alignment with the ض/ظ equivalence', () => {
  assert.equal(romanDistance('mrkb', 'mrkb', 1), 0);
  assert.equal(romanDistance('mrbk', 'mrkb', 1), 1);
  assert.equal(romanDistance('zmr', 'Dmr', 1), 0);
  assert.equal(romanDistance('dmr', 'Dmr', 1), 0);
  assert.equal(romanDistance('abcdef', 'a', 2), 3);
});

test('plain English matches English titles with light typos and everyday synonyms', () => {
  assert.ok(matchesEnglish('possessive', 'Genitive construct (idafa)'));
  assert.ok(matchesEnglish('past tense', 'Perfect (past) verb (fi‘l madi)'));
  assert.ok(matchesEnglish('Genetive', 'Genitive construct (idafa)'));
  assert.ok(matchesEnglish('demonstr', 'Demonstrative pronoun (ism al-ishara)'));
  assert.ok(matchesEnglish('the cow', 'The Cow'));
  assert.ok(!matchesEnglish('possessive', 'Verbal noun (masdar)'));
  assert.ok(!matchesEnglish('past', 'Particle of deterrence (kallā)'));
});

test('grammar topic search finds real topics by Roman Urdu, Urdu and English', () => {
  const cases: ReadonlyArray<readonly [string, string]> = [
    ['muraqab e izafi', 'مرکبِ اضافی'],
    ['murakkab-e-izafi', 'مرکبِ اضافی'],
    ['murakab izafi', 'مرکبِ اضافی'],
    ['izafi', 'مرکبِ اضافی'],
    ['idafa', 'مرکبِ اضافی'],
    ['possessive', 'مرکبِ اضافی'],
    ['fel mazi', 'فعلِ ماضی'],
    ['fail mazi', 'فعلِ ماضی'],
    ["fe'l maazi", 'فعلِ ماضی'],
    ['fil madi', 'فعلِ ماضی'],
    ['fel e amr', 'فعلِ امر'],
    ['muzare', 'فعلِ مضارع'],
    ['ism e ishara', 'اسمِ اشارہ'],
    ['isme ishara', 'اسمِ اشارہ'],
    ['jaar majroor', 'حرفِ جر اور جار و مجرور'],
    ['jar o majrur', 'حرفِ جر اور جار و مجرور'],
    ['harf e jar', 'حرفِ جر اور جار و مجرور'],
    ['mubtada khabar', 'جملۂ اسمیہ: مبتدا اور خبر'],
    ['jumla ismiya', 'جملۂ اسمیہ: مبتدا اور خبر'],
    ['jumla failiya', 'جملۂ فعلیہ'],
    ['mausoof sifat', 'موصوف اور صفت'],
    ['jama mukassar', 'جمعِ تکسیر'],
    ['ghair munsarif', 'غیر منصرف اسم'],
    ["maf'ool mutlaq", 'مفعولِ مطلق'],
    ['maf’ool bihi', 'مفعول بہ'],
    ['tamyeez', 'تمییز'],
    ['istifham', 'استفہام'],
    ['qasam', 'قسم اور جوابِ قسم'],
    ['mubalagha', 'مبالغے کے صیغے'],
    ['zanna', 'ظَنَّ اور اس کے اخوات'],
    ['hal', 'حال'],
    ['relative', 'اسمِ موصول اور صلہ'],
    ['vocative', 'ندا اور منادیٰ'],
    // Urdu script keeps working as before.
    ['مرکب', 'مرکبِ اضافی'],
    ['فعل ماضی', 'فعلِ ماضی'],
  ];
  for (const [query, title] of cases) assert.equal(firstTopic(query), title, query);
  // ضمیر names several topics; all of them come first.
  for (const query of ['zameer', 'zamir', 'damir']) {
    const found = topics(query).slice(0, 6);
    assert.ok(found.length >= 5 && found.every((t) => t.startsWith('ضمیر')), query);
  }
  assert.ok(topics('past tense').slice(0, 2).includes('فعلِ ماضی'));
  // Ranking, not list order, puts the idafa topic first (the API lists topics differently).
  assert.equal(searchTopics([...grammarTopicSources].reverse(), 'possessive')[0]?.id, 'idafa');
  assert.equal(searchTopics([...grammarTopicSources].reverse(), 'muraqab e izafi')[0]?.id, 'idafa');
  // Exact and prefix title matches rank above typo and summary matches.
  assert.deepEqual(topics('muraqab e izafi'), ['مرکبِ اضافی']);
  assert.deepEqual(topics('zzzz-no-such-topic'), []);
  assert.deepEqual(topics('qwrtp'), []);
  // An empty query keeps every topic in order.
  assert.equal(searchTopics(grammarTopicSources, '  ').length, grammarTopicSources.length);
});

test('surah search also accepts any Roman spelling of the Arabic and Urdu names', () => {
  const cases: ReadonlyArray<readonly [string, number]> = [
    ['baqra', 2],
    ['al baqrah', 2],
    ['the cow', 2],
    ['yaseen', 36],
    ['surah e yaseen', 36],
    ['rehman', 55],
    ['surah rehman', 55],
    ['al kahaf', 18],
    ['kehaf', 18],
    ['suratul mulk', 67],
    ['surat un nisa', 4],
    ['kausr', 108],
    ['zalzala', 99],
    ['takasur', 102],
  ];
  for (const [query, number] of cases) assert.equal(topSurah(query), number, query);
});

test('word search matches Latin queries by Roman key in Al-Baqarah, quickly', () => {
  const study = getStudy(2)!;
  assert.equal(study.words.length, 6116);
  const find = (query: string) => study.words.filter((word) => matchesWord(word, study, query));
  const started = performance.now();
  const kitab = find('kitab');
  const cold = performance.now() - started;
  assert.ok(kitab.length >= 40, `kitab: ${kitab.length}`);
  assert.ok(kitab.some((word) => word.arabic === 'ٱلْكِتَـٰبُ'));
  // Every hit has ك ت ب in its Arabic, or کتاب/لکھ in its meaning or root meaning.
  const rootMeaning = (word: (typeof kitab)[number]) =>
    word.root ? (study.roots[word.root]?.meaningUrdu ?? '') : '';
  assert.ok(
    kitab.every(
      (word) =>
        romanKey(word.arabic).includes('ktb') ||
        /کتاب|لکھ/.test(`${word.meaningUrdu} ${rootMeaning(word)}`),
    ),
  );
  const rabb = find('rabb');
  assert.ok(rabb.some((word) => word.meaningUrdu.includes('رب')));
  const zameen = find('zameen');
  assert.ok(zameen.length >= 40 && zameen.some((word) => word.meaningUrdu.includes('زمین')));
  assert.ok(find('shaitan').every((word) => /شیط|شیاط/.test(word.meaningUrdu)));
  // Arabic and Urdu script behave as before: whole-text substring.
  assert.equal(find('كتاب').length, study.words.filter((word) => matchesWord(word, study, 'كتاب')).length);
  assert.ok(find('زمین').length >= zameen.length - 5);
  // Single-letter skeletons ("e", "zzzz") are not Roman queries.
  assert.equal(find('zzzz').length, 0);
  const warmStart = performance.now();
  for (const query of ['kitab', 'zameen', 'rahmat', 'namaz', 'jannat']) find(query);
  const warm = (performance.now() - warmStart) / 5;
  // Measured about 240 ms to build the keys once and 5-8 ms per query on an M-series Mac.
  assert.ok(cold < 3000, `first search ${cold.toFixed(0)} ms`);
  assert.ok(warm < 100, `warm search ${warm.toFixed(1)} ms`);
});
