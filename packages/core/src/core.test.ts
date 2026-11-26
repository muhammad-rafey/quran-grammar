import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { formatCount, getUiStrings, isUiLanguage } from './interface';
import type { StudyData } from './types';
import { defaultTranslationId, translationEditions, translationIds, translationText } from './translations';
import { fatihahPractice, fatihahStudy, getStudy, studies } from './content';
import {
  isStudyData,
  matchesWord,
  normalizeText,
  urduNumber,
  surahCatalog,
  juzCatalog,
  gradePracticeAnswer,
  getPracticeProgress,
  availableSurahNumbers,
  getSurahTitle,
  getJuzForAyah,
  getJuzStartAyah,
  partialSurahLastAyah,
} from './index';

const lastTen = [105, 106, 107, 108, 109, 110, 111, 112, 113, 114];
const fiveSurahs = [18, 23, 32, 36, 55];
const editionTwo = [4, 7, 25, 29, ...Array.from({ length: 20 }, (_, index) => 85 + index)];
const editionThree = [22, 56];
const allChapters = Array.from({ length: 114 }, (_, i) => i + 1);
/**
 * Chapters that keep their published grammar layer (dictionary notes, phrase cards, segment
 * glosses, root meanings, paradigms). Every other word is source-only (content-pipeline/full-quran).
 */
const publishedChapters = new Set([1, ...fiveSurahs, ...lastTen, ...editionTwo, ...editionThree]);
/** Al-Baqarah 2:1–20 keeps the pilot grammar layer (no phrase cards); 2:21–286 are source-only. */
const pilot = { surah: 2, lastAyah: 20 };
const hasGrammarLayer = (surah: number, ayah: number) =>
  publishedChapters.has(surah) || (surah === pilot.surah && ayah <= pilot.lastAyah);
const pipelineFile = (path: string) =>
  JSON.parse(readFileSync(new URL(`../../../content-pipeline/full-quran/${path}`, import.meta.url), 'utf8'));

test('navigation catalogs list every chapter and every complete juz', () => {
  assert.deepEqual(
    surahCatalog.map((surah) => surah.number),
    allChapters,
  );
  assert.ok(surahCatalog.every((surah) => surah.available));
  assert.deepEqual(partialSurahLastAyah, {});
  assert.deepEqual(surahCatalog[0], {
    number: 1,
    nameArabic: 'الفاتحة',
    nameEnglish: 'Al-Fatihah',
    available: true,
  });
  assert.equal(surahCatalog[113].nameArabic, 'الناس');
  assert.equal(surahCatalog[113].nameEnglish, 'An-Nas');
  assert.ok(
    surahCatalog.every(
      (surah) => /[؀-ۿ]/.test(surah.nameArabic) && surah.nameEnglish.trim(),
    ),
  );
  assert.equal(new Set(surahCatalog.map((surah) => surah.nameArabic)).size, 114);
  assert.deepEqual(
    juzCatalog.map((juz) => juz.number),
    Array.from({ length: 30 }, (_, i) => i + 1),
  );
  // Every juz is complete: no partial previews, and the ranges tile every ayah of every chapter
  // exactly once, in mushaf order.
  const covered: string[] = [];
  for (const juz of juzCatalog) {
    assert.equal(juz.available, true, `Juz ${juz.number}`);
    assert.equal(juz.partial, false, `Juz ${juz.number}`);
    assert.equal(juz.previewSurahNumber, juz.ranges[0].surah);
    assert.deepEqual(juz.surahNumbers, juz.ranges.map((range) => range.surah));
    for (const range of juz.ranges)
      for (let ayah = range.firstAyah; ayah <= range.lastAyah; ayah += 1)
        covered.push(`${range.surah}:${ayah}`);
  }
  assert.deepEqual(
    covered,
    studies.flatMap((study) => study.ayahs.map((ayah) => `${study.surah.number}:${ayah.number}`)),
  );
  const range = (juz: number) =>
    juzCatalog[juz - 1].ranges.map(({ surah, firstAyah, lastAyah }) => [surah, firstAyah, lastAyah]);
  assert.deepEqual(range(1), [[1, 1, 7], [2, 1, 141]]);
  assert.deepEqual(range(3), [[2, 253, 286], [3, 1, 92]]);
  assert.deepEqual(range(15), [[17, 1, 111], [18, 1, 74]]);
  assert.deepEqual(range(16), [[18, 75, 110], [19, 1, 98], [20, 1, 135]]);
  assert.deepEqual(range(27), [[51, 31, 60], [52, 1, 49], [53, 1, 62], [54, 1, 55], [55, 1, 78], [56, 1, 96], [57, 1, 29]]);
  assert.deepEqual(
    range(30),
    Array.from({ length: 37 }, (_, index) => 78 + index).map((surah) => [surah, 1, getStudy(surah)!.surah.ayahCount]),
  );
  // Al-Kahf and Ya-Sin span two juz; the juz shown follows the ayah being read.
  for (const [surah, ayah, juz] of [
    [18, 1, 15],
    [18, 74, 15],
    [18, 75, 16],
    [18, 110, 16],
    [22, 78, 17],
    [23, 118, 18],
    [32, 15, 21],
    [36, 27, 22],
    [36, 28, 23],
    [36, 83, 23],
    [55, 13, 27],
    [56, 96, 27],
    [1, 7, 1],
    [2, 1, 1],
    [2, 20, 1],
    [2, 21, 1],
    [2, 141, 1],
    [2, 142, 2],
    [2, 286, 3],
    [3, 1, 3],
    [114, 6, 30],
  ] as const)
    assert.equal(getJuzForAyah(surah, ayah)?.number, juz, `${surah}:${ayah}`);
  for (const [surah, ayah] of [
    [18, 111],
    [36, 0],
    [2, 287],
    [115, 1],
  ] as const)
    assert.equal(getJuzForAyah(surah, ayah), undefined, `${surah}:${ayah}`);
  assert.equal(getJuzStartAyah(15, 18), 1);
  assert.equal(getJuzStartAyah(16, 18), 75);
  assert.equal(getJuzStartAyah(2, 2), 142);
  assert.equal(getJuzStartAyah(22, 36), 1);
  assert.equal(getJuzStartAyah(23, 36), 28);
  assert.equal(getJuzStartAyah(30, 114), 1);
  assert.equal(getSurahTitle(18, 'en'), 'Al-Kahf');
  assert.equal(getSurahTitle(36, 'ur'), 'يس');
  assert.equal(getSurahTitle(114, 'en'), 'An-Nas');
  assert.equal(getSurahTitle(114, 'ur'), 'الناس');
});

test('the whole Quran is bundled: 114 chapters, 6,236 ayahs, 77,429 unique word occurrences', () => {
  assert.deepEqual([...availableSurahNumbers], allChapters);
  assert.deepEqual(
    studies.map((study) => study.surah.number),
    allChapters,
  );
  assert.equal(
    studies.reduce((total, study) => total + study.ayahs.length, 0),
    6236,
  );
  assert.equal(
    studies.reduce((total, study) => total + study.words.length, 0),
    77429,
  );
  const occurrences = studies.flatMap((study) => study.words.map((word) => word.id));
  assert.equal(new Set(occurrences).size, 77429);
  // The pipeline's own summary and scope agree with the bundled lessons.
  const summary = pipelineFile('inventory/sources.json').summary;
  assert.equal(summary.surahs, 114);
  assert.equal(summary.ayahs, 6236);
  assert.equal(summary.words, 77429);
  assert.equal(summary.publishedWords, 16288);
  assert.equal(summary.sourceOnlyWords, 61141);
  const scope = pipelineFile('scope.json');
  assert.deepEqual(scope.existingLessons, [...publishedChapters].sort((a, b) => a - b));
  assert.deepEqual(scope.partialPilot, { surah: pilot.surah, aiLayerThroughAyah: pilot.lastAyah });
  assert.deepEqual(
    scope.translations.map((edition: { id: string; resourceId: number }) => [edition.id, edition.resourceId]),
    translationEditions.map((edition) => [edition.id, edition.resourceId]),
  );
  // Ayah and word counts of the published lessons are unchanged; Al-Baqarah is now complete.
  const counts = new Map([
    [1, [7, 29]],
    [2, [286, 6116]],
    [3, [200, 3481]],
    [4, [176, 3747]],
    [7, [206, 3320]],
    [18, [110, 1579]],
    [22, [78, 1274]],
    [23, [118, 1050]],
    [25, [77, 893]],
    [29, [69, 976]],
    [32, [30, 372]],
    [36, [83, 725]],
    [55, [78, 351]],
    [56, [96, 379]],
    [85, [22, 109]],
    [86, [17, 61]],
    [87, [19, 72]],
    [88, [26, 92]],
    [89, [30, 137]],
    [90, [20, 82]],
    [91, [15, 54]],
    [92, [21, 71]],
    [93, [11, 40]],
    [94, [8, 27]],
    [95, [8, 34]],
    [96, [19, 72]],
    [97, [5, 30]],
    [98, [8, 94]],
    [99, [8, 36]],
    [100, [11, 40]],
    [101, [11, 36]],
    [102, [8, 28]],
    [103, [3, 14]],
    [104, [9, 33]],
    [105, [5, 23]],
    [106, [4, 17]],
    [107, [7, 25]],
    [108, [3, 10]],
    [109, [6, 26]],
    [110, [3, 19]],
    [111, [5, 23]],
    [112, [4, 15]],
    [113, [5, 23]],
    [114, [6, 20]],
  ]);
  for (const study of studies) {
    const chapter = study.surah.number;
    assert.equal(getStudy(chapter), study);
    assert.equal(isStudyData(study), true, `Surah ${chapter}: complete schema and relationships`);
    assert.equal(study.ayahs.length, study.surah.ayahCount, `Surah ${chapter}`);
    assert.equal(study.words.length, study.surah.wordCount, `Surah ${chapter}`);
    if (counts.has(chapter))
      assert.deepEqual([study.ayahs.length, study.words.length], counts.get(chapter), `Surah ${chapter}`);
    assert.ok(
      !/https?:\/\//.test(JSON.stringify(study)),
      'Source links stay in the repository audit',
    );
  }
  for (const number of [0, 115, 105.5, NaN]) assert.equal(getStudy(number), undefined);
});

test('every ayah has the six Quran.com translations in catalog order and no tafsir or theme', () => {
  assert.deepEqual(translationIds, ['jalandhari', 'junagarhi', 'mahmud-al-hasan', 'israr-ahmad', 'maududi', 'wahiduddin-khan']);
  assert.equal(defaultTranslationId, 'jalandhari');
  const texts = new Map<string, Set<string>>(translationIds.map((id) => [id, new Set()]));
  const stray: string[] = [];
  for (const study of studies)
    for (const ayah of study.ayahs) {
      const key = `${study.surah.number}:${ayah.number}`;
      assert.deepEqual(Object.keys(ayah), ['number', 'translations', 'phrases'], key);
      assert.deepEqual(Object.keys(ayah.translations), translationIds, key);
      for (const [id, text] of Object.entries(ayah.translations)) {
        assert.ok(typeof text === 'string' && text.trim() === text && text.length > 0, `${key} ${id}`);
        // Footnote markers and markup are removed; the text is Urdu, never Roman Urdu.
        assert.ok(!/<|foot_?note/i.test(text), `${key} ${id}: markup`);
        if (text.includes('>')) stray.push(`${key} ${id}`);
        assert.ok(/[؀-ۿ]/.test(text), `${key} ${id}: Urdu script`);
        texts.get(id)!.add(text);
      }
    }
  // Markup debris is removed (Quran.com's 4:106 Junagarhi text ends in a lone '>').
  assert.deepEqual(stray, []);
  // Each edition is a real translation of the whole Quran, not one repeated placeholder.
  for (const [id, distinct] of texts) assert.ok(distinct.size > 6000, `${id}: ${distinct.size} distinct ayahs`);
  assert.equal(translationText(getStudy(1)!.ayahs[0].translations, 'maududi'), getStudy(1)!.ayahs[0].translations.maududi);
  assert.equal(
    translationText(getStudy(1)!.ayahs[0].translations, 'no-longer-offered'),
    getStudy(1)!.ayahs[0].translations.jalandhari,
  );
  assert.equal(translationText(undefined, 'maududi'), '');
});

test('every word carries Quran.com IndoPak text and a Quran.com meaning except recorded gaps', () => {
  const gaps = pipelineFile('inventory/sources.json').meaningGaps as {
    sourceOnlyEmpty: string[];
    publishedEmptied: string[];
  };
  const empty = { published: [] as string[], sourceOnly: [] as string[] };
  for (const study of studies)
    for (const word of study.words) {
      assert.equal(typeof word.arabicIndoPak, 'string', word.id);
      assert.ok(word.arabicIndoPak!.length > 0, `${word.id}: IndoPak text`);
      // Clean Quran.com text: no byte-order marks, typographic spaces or edge whitespace.
      assert.ok(!/[\ufeff\u2000-\u200a]|^\s|\s$/.test(word.arabicIndoPak!), `${word.id}: IndoPak whitespace`);
      assert.ok(/[؀-ۿ]/.test(word.arabicIndoPak!), word.id);
      assert.equal(word.meaningUrdu.trim(), word.meaningUrdu, word.id);
      if (word.meaningUrdu === '')
        (hasGrammarLayer(study.surah.number, word.ayah) ? empty.published : empty.sourceOnly).push(word.id);
    }
  // Empty meanings are exactly the Quran.com word-by-word gaps the pipeline recorded.
  assert.deepEqual(empty.sourceOnly, gaps.sourceOnlyEmpty);
  assert.deepEqual(empty.published, gaps.publishedEmptied);
  assert.equal(empty.sourceOnly.length, 210);
  assert.equal(empty.published.length, 70);
});

test('source-only words carry no AI-written fields; published lessons keep their grammar layer', () => {
  let published = 0;
  let sourceOnly = 0;
  for (const study of studies) {
    const chapter = study.surah.number;
    const covered = new Set(
      study.ayahs.flatMap((ayah) => ayah.phrases.flatMap((phrase) => phrase.wordIds)),
    );
    const rootLayers = new Map<string, boolean>();
    for (const word of study.words) {
      const layer = hasGrammarLayer(chapter, word.ayah);
      if (word.root) rootLayers.set(word.root, (rootLayers.get(word.root) ?? false) || layer);
      const verb = study.verbForms[word.id];
      if (word.pos === 'verb') assert.ok(verb, `${word.id}: verb paradigm`);
      assert.ok(word.morphologyUrdu && word.syntaxUrdu && word.posUrdu, `${word.id}: Corpus grammar`);
      assert.ok(word.segments.length > 0, word.id);
      if (layer) {
        published += 1;
        assert.ok(word.dictionaryUrdu, `${word.id}: dictionary note`);
        assert.ok(word.segments.every((segment) => segment.meaningUrdu), `${word.id}: segment glosses`);
        if (verb) assert.ok(verb.baabUrdu && verb.present && verb.pattern && verb.noteUrdu, `${word.id}: paradigm`);
        if (publishedChapters.has(chapter)) {
          assert.ok(word.ruleIds.length > 0, `${word.id}: grammar rules`);
          assert.ok(covered.has(word.id), `${word.id}: phrase context`);
        } else if (word.ruleIds.length === 0) {
          // The pilot gets a rule only where a library card applies (none covers أَلَا).
          assert.ok(['2:12:1', '2:13:13'].includes(word.id), `${word.id}: grammar rules`);
        }
      } else {
        sourceOnly += 1;
        assert.equal(word.dictionaryUrdu, '', `${word.id}: no dictionary note`);
        assert.ok(word.segments.every((segment) => segment.meaningUrdu === ''), `${word.id}: no segment glosses`);
        assert.ok(!covered.has(word.id), `${word.id}: no phrase card`);
        if (verb) {
          assert.equal(verb.present, '', `${word.id}: no present form`);
          assert.equal(verb.noteUrdu, '', `${word.id}: no paradigm note`);
          assert.ok(verb.formUrdu && verb.past, `${word.id}: Corpus form and lemma`);
          // The Corpus gives no Form I vowel class, so Form I has no باب or pattern.
          if (verb.formUrdu.endsWith('(I)')) assert.equal(verb.baabUrdu + verb.pattern, '', word.id);
          else assert.ok(verb.baabUrdu, `${word.id}: derived-form باب`);
        }
      }
    }
    for (const [root, layer] of rootLayers) {
      const entry = study.roots[root];
      if (layer) assert.ok(entry.meaningUrdu && entry.noteUrdu, `${chapter} ${root}: root meaning`);
      else assert.deepEqual(entry, { meaningUrdu: '', noteUrdu: '' }, `${chapter} ${root}: source-only root`);
    }
    for (const ayah of study.ayahs) {
      if (publishedChapters.has(chapter)) assert.ok(ayah.phrases.length > 0, `${chapter}:${ayah.number}: phrases`);
      else assert.deepEqual(ayah.phrases, [], `${chapter}:${ayah.number}: no phrase cards`);
    }
  }
  assert.equal(published, 16288);
  assert.equal(sourceOnly, 61141);
});

test('the Al-Baqarah pilot keeps its reviewed AI layer for 2:1–20 only', () => {
  const study = getStudy(2)!;
  const layer: Record<string, { arabic: string; segmentMeaningsUrdu: string[]; dictionaryUrdu: string }> = {};
  for (const file of ['a01-10', 'a11-16', 'a17-20']) Object.assign(layer, pipelineFile(`words/2/${file}.json`));
  const pilotWords = study.words.filter((word) => word.ayah <= pilot.lastAyah);
  assert.equal(pilotWords.length, 230);
  assert.deepEqual(Object.keys(layer), pilotWords.map((word) => word.id));
  for (const word of pilotWords) {
    assert.equal(word.arabic, layer[word.id].arabic, word.id);
    assert.equal(word.dictionaryUrdu, layer[word.id].dictionaryUrdu, word.id);
    assert.deepEqual(word.segments.map((segment) => segment.meaningUrdu), layer[word.id].segmentMeaningsUrdu, word.id);
  }
  assert.equal(study.words.find((word) => word.id === '2:21:1')!.dictionaryUrdu, '');
});

test('owner-authorized drafts keep their exact grammar layer; only replaced fields differ', () => {
  const authorization = JSON.parse(
    readFileSync(new URL('../../../content-pipeline/draft-publication.json', import.meta.url), 'utf8'),
  ) as { surahs: Array<{ number: number; work?: string }> };
  const layer = (study: Omit<StudyData, 'ayahs'> & { ayahs: Array<{ number: number; phrases: unknown }> }) =>
    JSON.stringify({
      keys: Object.keys(study),
      surah: study.surah,
      // Replaced 2026-11-26: meanings come from Quran.com; IndoPak text was added.
      words: study.words.map(({ meaningUrdu: _meaning, arabicIndoPak: _indoPak, ...word }) => word),
      // Replaced: the AI translation, theme and tafsir gave way to the six Quran.com translations.
      ayahs: study.ayahs.map((ayah) => ({ number: ayah.number, phrases: ayah.phrases })),
      rules: study.rules,
      roots: study.roots,
      verbForms: study.verbForms,
    });
  assert.equal(authorization.surahs.length, 31);
  for (const entry of authorization.surahs) {
    assert.ok(publishedChapters.has(entry.number), `Surah ${entry.number}`);
    const draft = JSON.parse(
      readFileSync(
        new URL(`../../../${entry.work ?? 'content-pipeline'}/drafts/surah-${entry.number}.json`, import.meta.url),
        'utf8',
      ),
    );
    assert.equal(draft.reviewStatus, 'scholarly-review-pending');
    assert.equal(layer(getStudy(entry.number)!), layer(draft.study), `Surah ${entry.number}`);
  }
});

test('expansion lessons preserve every audited Uthmani word and occurrence boundary verbatim', () => {
  let total = 0;
  for (const number of [...fiveSurahs, ...editionTwo, ...editionThree]) {
    const inventory = JSON.parse(
      readFileSync(
        new URL(`../../../docs/source-audits/inventory-${number}.json`, import.meta.url),
        'utf8',
      ),
    ) as {
      surah: number;
      ayahCount: number;
      wordCount: number;
      words: Array<{ id: string; arabic: string }>;
      excludedPauseSigns: Array<{ id: string; apiText: string; excludedMark: string }>;
    };
    const study = getStudy(number)!;
    assert.equal(inventory.surah, number);
    assert.equal(inventory.ayahCount, study.surah.ayahCount);
    assert.equal(inventory.wordCount, study.surah.wordCount);
    assert.deepEqual(
      study.words.map((word) => [word.id, word.arabic]),
      inventory.words.map(({ id, arabic }) => [id, arabic]),
    );
    for (const sign of inventory.excludedPauseSigns) {
      const word = study.words.find((entry) => entry.id === sign.id)!;
      assert.ok(sign.apiText.includes(word.arabic), sign.id);
      assert.ok(!word.arabic.includes(' '), sign.id);
    }
    for (const word of study.words) {
      assert.equal(
        word.segments.map((segment) => segment.arabic).join(''),
        word.arabic,
        `${word.id}: segments are exact slices of the Quranic word`,
      );
      if (word.pos === 'verb') assert.ok(study.verbForms[word.id], `${word.id}: verb paradigm`);
    }
    total += inventory.words.length;
  }
  assert.equal(total, 15828);
});

test('last ten surahs preserve every audited Uthmani word and occurrence boundary verbatim', () => {
  const first = JSON.parse(
    readFileSync(
      new URL('../../../docs/source-audits/inventory-105-109.json', import.meta.url),
      'utf8',
    ),
  ) as {
    words: Array<{ id: string; arabic: string }>;
  };
  const last = JSON.parse(
    readFileSync(
      new URL('../../../docs/source-audits/inventory-110-114.json', import.meta.url),
      'utf8',
    ),
  ) as Record<string, Array<[string, string]>>;
  const inventory = [
    ...first.words.map(({ id, arabic }) => [id, arabic]),
    ...Object.values(last).flat(),
  ];
  assert.equal(inventory.length, 201);
  assert.deepEqual(
    studies
      .filter((study) => study.surah.number >= 105)
      .flatMap((study) => study.words.map((word) => [word.id, word.arabic])),
    inventory,
  );
});

test('Quran.com text differs from the audited and Corpus spellings only in marks', () => {
  // Letters only: Quran.com's seated hamza (ـٔ) is QAC's ء; marks, tatweel, small waw/yeh and
  // Quran.com's internal word spaces are spelling marks (content-pipeline/full-quran/scripts/build.py).
  const letters = (text: string) =>
    [...text.replace(/ـٔ|ـٕ/g, 'ء').normalize('NFD')]
      .filter((ch) => !/\p{Mn}/u.test(ch) && !'ـۥۦ '.includes(ch))
      .join('');
  // The published Al-Fatihah now uses Quran.com's tatweel before the dagger alif.
  const fatihah = new Map(fatihahStudy.words.map((word) => [word.id, word.arabic]));
  // Audited (pre-2026-11-26) spellings, written as escapes so marks keep their stored order.
  for (const [id, audited] of [
    ['1:1:3', 'ٱلرَّحْمَٰنِ'],
    ['1:2:4', 'ٱلْعَٰلَمِينَ'],
    ['1:3:1', 'ٱلرَّحْمَٰنِ'],
    ['1:4:1', 'مَٰلِكِ'],
  ]) {
    const quranCom = fatihah.get(id)!;
    assert.equal(quranCom, audited.replace('َٰ', 'َـٰ'), `${id}: tatweel before the dagger alif`);
    assert.equal(quranCom.replace('ـ', ''), audited, `${id}: tatweel is the only change`);
  }
  const fatihahChanged = fatihahStudy.words.filter((word) => word.arabic.includes('ـ')).map((word) => word.id);
  assert.deepEqual(fatihahChanged, ['1:1:3', '1:2:4', '1:3:1', '1:4:1']);
  // Every recorded Quran.com/Corpus difference is the stored word, and only marks differ except
  // for the three genuine source spelling differences the pipeline lists.
  const summary = pipelineFile('inventory/sources.json').summary;
  assert.deepEqual(summary.corpusLetterDifferences, ['11:13:3', '12:39:1', '12:41:1']);
  const letterDifferences: string[] = [];
  let differences = 0;
  for (const study of studies) {
    const inventory = pipelineFile(`inventory/inventory-${study.surah.number}.json`) as {
      surah: number;
      corpusSpellingDifferences: Array<{ id: string; quranCom: string; corpus: string }>;
    };
    assert.equal(inventory.surah, study.surah.number);
    const arabic = new Map(study.words.map((word) => [word.id, word.arabic]));
    for (const entry of inventory.corpusSpellingDifferences) {
      differences += 1;
      assert.equal(arabic.get(entry.id), entry.quranCom, entry.id);
      if (letters(entry.quranCom) !== letters(entry.corpus)) letterDifferences.push(entry.id);
    }
  }
  assert.equal(differences, summary.corpusSpellingDifferences);
  assert.deepEqual(letterDifferences, summary.corpusLetterDifferences);
});

test('new lessons preserve command particles, elided pronouns and non-triliteral roots', () => {
  const word = (id: string) => {
    const study = getStudy(Number(id.split(':')[0]));
    const value = study?.words.find((entry) => entry.id === id);
    assert.ok(value, id);
    return value;
  };
  const command = word('106:3:1');
  assert.equal(command.pos, 'verb');
  assert.equal(command.root, 'ع ب د');
  assert.match(command.morphologyUrdu, /مضارع/);
  assert.match(command.morphologyUrdu, /مجزوم/);
  assert.ok(
    command.segments.some(
      (segment) => /لام/.test(segment.roleUrdu) && /امر/.test(normalizeText(segment.roleUrdu)),
    ),
  );
  assert.equal(word('106:1:2').root, null, 'Quraysh has no assigned QAC root');
  assert.equal(word('107:2:3').root, 'د ع ع', 'repulse is not the root for supplicate');
  assert.equal(word('107:4:1').root, null, 'wayl has no assigned QAC root');
  const religion = word('109:6:4');
  assert.equal(religion.root, 'د ي ن');
  assert.match(`${religion.morphologyUrdu} ${religion.syntaxUrdu}`, /مرفوع|رفع/);
  assert.match(`${religion.morphologyUrdu} ${religion.syntaxUrdu}`, /محذوف/);
  const carrier = word('111:4:2');
  assert.equal(carrier.pos, 'noun');
  assert.match(carrier.morphologyUrdu, /منصوب/);
  assert.equal(getStudy(111)!.verbForms[carrier.id], undefined);
  assert.match(normalizeText(getStudy(111)!.verbForms['111:2:2'].baabUrdu), /افعال/);
  const born = word('112:3:4');
  assert.equal(born.root, 'و ل د');
  assert.match(born.morphologyUrdu, /مضارع/);
  assert.match(born.morphologyUrdu, /مجزوم/);
  assert.match(born.morphologyUrdu, /مج[هہ]ول/);
  const whisper = word('114:5:2');
  assert.equal(whisper.root, 'و س و س');
  assert.match(normalizeText(getStudy(114)!.verbForms[whisper.id].baabUrdu), /رباعي|فعللة/);
  assert.equal(normalizeText(getStudy(114)!.verbForms[whisper.id].past), 'وسوس');
});

test('practice uses existing lesson words, verified grammar and real roots', () => {
  assert.equal(fatihahPractice.length, 3);
  assert.equal(new Set(fatihahPractice.map((question) => question.id)).size, 3);
  for (const question of fatihahPractice) {
    assert.ok(fatihahStudy.words.some((word) => word.id === question.wordId));
    assert.equal(new Set(question.options.map((option) => option.id)).size, 3);
    assert.equal(
      question.options.filter((option) => gradePracticeAnswer(question, option.id)).length,
      1,
    );
    assert.equal(gradePracticeAnswer(question, ''), null);
    assert.equal(gradePracticeAnswer(question, 'not-an-option'), null);
  }
  const verbQuestion = fatihahPractice[0];
  for (const option of verbQuestion.options) {
    const word = fatihahStudy.words.find((entry) => entry.id === option.id)!;
    assert.equal(option.text, word.arabic);
    assert.equal(gradePracticeAnswer(verbQuestion, option.id), word.pos === 'verb');
  }
  assert.ok(
    fatihahStudy.words
      .find((word) => word.id === fatihahPractice[1].wordId)!
      .ruleIds.includes('imperative'),
  );
  const rootQuestion = fatihahPractice[2];
  const targetRoot = fatihahStudy.words.find((word) => word.id === rootQuestion.wordId)!.root;
  for (const option of rootQuestion.options) {
    assert.ok(Object.hasOwn(fatihahStudy.roots, option.text));
    assert.equal(gradePracticeAnswer(rootQuestion, option.id), option.text === targetRoot);
  }
});

test('practice progress counts valid attempts, corrections and completion without changing answers', () => {
  assert.deepEqual(getPracticeProgress(fatihahPractice, {}), {
    answered: 0,
    total: 3,
    correct: 0,
    complete: false,
  });
  const answers = Object.freeze({
    'identify-verb': '1:2:1',
    'identify-imperative': 'invalid',
    unknown: 'value',
  });
  assert.deepEqual(getPracticeProgress(fatihahPractice, answers), {
    answered: 1,
    total: 3,
    correct: 0,
    complete: false,
  });
  const completed = Object.fromEntries(
    fatihahPractice.map((question) => [question.id, question.correctOptionId]),
  );
  assert.deepEqual(getPracticeProgress(fatihahPractice, completed), {
    answered: 3,
    total: 3,
    correct: 3,
    complete: true,
  });
  assert.deepEqual(getPracticeProgress([], {}), {
    answered: 0,
    total: 0,
    correct: 0,
    complete: false,
  });
  assert.equal(answers['identify-verb'], '1:2:1');
});

test('interface preferences accept only supported persisted language values', () => {
  assert.equal(isUiLanguage('en'), true);
  assert.equal(isUiLanguage('ur'), true);
  for (const value of [null, undefined, '', 'EN', 'ur-PK', 'english', 1, {}, ['ur']]) {
    assert.equal(isUiLanguage(value), false);
  }
  assert.equal(getUiStrings('en').settings, 'Settings');
  assert.equal(getUiStrings('ur').settings, 'ترتیبات');
  assert.deepEqual(Object.keys(getUiStrings('en')).sort(), Object.keys(getUiStrings('ur')).sort());
});

test('interface number formatting is independent of platform and input digit script', () => {
  assert.equal(formatCount(29, 'en'), '29');
  assert.equal(formatCount(29, 'ur'), '۲۹');
  assert.equal(formatCount('۱:۵:۲', 'en'), '1:5:2');
  assert.equal(formatCount('١:٥:٢', 'en'), '1:5:2');
  assert.equal(formatCount('1:۵:٢', 'ur'), '۱:۵:۲');
  assert.equal(formatCount('0 / 29', 'ur'), '۰ / ۲۹');
  assert.equal(formatCount('۰ / ۲۹', 'en'), '0 / 29');
  assert.equal(formatCount(-2.5, 'ur'), '-۲.۵');
  assert.equal(formatCount('', 'en'), '');
});

test('Al-Fatihah keeps its complete inventory and occurrence-specific grammar', () => {
  const study = fatihahStudy;
  assert.equal(isStudyData(study), true);
  assert.equal(study.words.length, 29);
  assert.equal(study.ayahs.length, 7);
  assert.equal(study.rules.length, 18);
  assert.equal(Object.keys(study.roots).length, 18);
  assert.equal(Object.keys(study.verbForms).length, 4);
  assert.equal(
    study.ayahs.reduce((count, ayah) => count + ayah.phrases.length, 0),
    14,
  );
  assert.deepEqual(
    study.ayahs.map((ayah) => study.words.filter((word) => word.ayah === ayah.number).length),
    [4, 4, 2, 3, 4, 3, 9],
  );
  assert.notEqual(
    study.words.find((word) => word.id === '1:7:4')!.syntaxUrdu,
    study.words.find((word) => word.id === '1:7:7')!.syntaxUrdu,
  );
  assert.equal(study.words.find((word) => word.id === '1:6:1')!.root, 'ه د ي');
  assert.equal(study.words.find((word) => word.id === '1:5:4')!.root, 'ع و ن');
  assert.equal(study.words.find((word) => word.id === '1:6:3')!.root, 'ق و م');
  assert.ok(
    !JSON.stringify(study).includes('https://'),
    'Audit links are kept separately from the study payload',
  );
});

test('verb paradigms distinguish Form I vowel classes and augmented forms', () => {
  assert.match(normalizeText(fatihahStudy.verbForms['1:5:2'].baabUrdu), /نصر/);
  assert.match(normalizeText(fatihahStudy.verbForms['1:5:4'].baabUrdu), /استفعال/);
  assert.match(normalizeText(fatihahStudy.verbForms['1:6:1'].baabUrdu), /ضرب/);
  assert.match(normalizeText(fatihahStudy.verbForms['1:7:3'].baabUrdu), /افعال/);
  assert.equal(fatihahStudy.verbForms['1:5:2'].present, 'يَعْبُدُ');
  assert.equal(fatihahStudy.verbForms['1:6:1'].present, 'يَهْدِي');
});

test('search includes roots, Urdu lexical meanings, verb families, and Arabic variants', () => {
  const find = (query: string) =>
    fatihahStudy.words.filter((word) => matchesWord(word, fatihahStudy, query));
  assert.ok(find('ع و ن').some((word) => word.id === '1:5:4'));
  assert.ok(find('عون').some((word) => word.id === '1:5:4'));
  assert.ok(find('تعاون').some((word) => word.id === '1:5:4'));
  assert.ok(find('استفعال').some((word) => word.id === '1:5:4'));
  assert.ok(find('نَعْبُدُ').some((word) => word.id === '1:5:2'));
  assert.ok(find('ایاک').some((word) => word.id === '1:5:1'));
  assert.equal(find('nonexistent-term').length, 0);
  assert.equal(
    fatihahStudy.words.filter((word) => matchesWord(word, fatihahStudy, '', 'verb')).length,
    4,
  );
  const adjective = fatihahStudy.words.find((word) => word.pos === 'adjective')!;
  assert.equal(matchesWord(adjective, fatihahStudy, '', 'noun'), true);
  assert.equal(matchesWord(adjective, fatihahStudy, '', 'verb'), false);
  assert.equal(normalizeText('  إِيَّاكَ  '), normalizeText('ایاک'));
  assert.equal(urduNumber('1:5:2'), '۱:۵:۲');
});

test('downloaded data validation rejects malformed nested fields and broken relationships', () => {
  for (const value of [null, [], {}, 'bad', { schemaVersion: 1 }])
    assert.equal(isStudyData(value), false);
  const mutations: Array<(value: any) => void> = [
    (value) => {
      value.schemaVersion = 2;
    },
    (value) => {
      value.surah.number = '1';
    },
    (value) => {
      value.surah.number = 0;
    },
    (value) => {
      value.surah.number = 115;
    },
    (value) => {
      value.surah.number = 1.5;
    },
    (value) => {
      value.surah.number = 112;
    },
    (value) => {
      value.surah.wordCount = 28;
    },
    (value) => {
      value.words[0].segments = [null];
    },
    (value) => {
      value.words[0].segments[0].roleUrdu = 7;
    },
    (value) => {
      value.words[0].ruleIds.push('missing');
    },
    (value) => {
      value.words[0].root = 'missing';
    },
    (value) => {
      value.words[0].id = '1:1:2';
    },
    (value) => {
      value.words[0].pos = 'unknown';
    },
    (value) => {
      value.words[0].lemma = {};
    },
    (value) => {
      value.words[1].position = 5;
      value.words[1].id = '1:1:5';
    },
    (value) => {
      value.ayahs[0].phrases[0].wordIds = ['1:7:1'];
    },
    (value) => {
      value.ayahs[0].phrases[0].explanationUrdu = '';
    },
    (value) => {
      value.ayahs.reverse();
    },
    (value) => {
      value.rules.push(value.rules[0]);
    },
    (value) => {
      value.roots['ع و ن'].meaningUrdu = null;
    },
    (value) => {
      delete value.verbForms['1:5:4'];
    },
    (value) => {
      value.verbForms['1:1:1'] = value.verbForms['1:5:4'];
    },
    (value) => {
      value.verbForms['1:5:4'].past = [];
    },
    (value) => {
      value.words[0].arabicIndoPak = '';
    },
    (value) => {
      value.words[0].arabicIndoPak = 7;
    },
    (value) => {
      delete value.ayahs[0].translations.maududi;
    },
    (value) => {
      value.ayahs[0].translations.maududi = '';
    },
    (value) => {
      value.ayahs[0].translations.extra = 'نیا ترجمہ';
    },
    (value) => {
      const { jalandhari, ...rest } = value.ayahs[0].translations;
      value.ayahs[0].translations = { ...rest, jalandhari };
    },
    (value) => {
      value.ayahs[0].translations = 'شروع';
    },
    (value) => {
      value.words[0].meaningUrdu = null;
    },
    (value) => {
      delete value.words[0].segments[0].meaningUrdu;
    },
    (value) => {
      value.verbForms['1:5:4'].formUrdu = '';
    },
  ];
  for (const mutate of mutations) {
    const value = structuredClone(fatihahStudy);
    mutate(value);
    assert.equal(isStudyData(value), false, mutate.toString());
  }
  // Source-only shapes are accepted: empty Quran.com meaning gaps and no AI-written fields.
  const sourceOnly = structuredClone(fatihahStudy);
  sourceOnly.words[0].meaningUrdu = '';
  sourceOnly.words[0].dictionaryUrdu = '';
  sourceOnly.words[0].segments[0].meaningUrdu = '';
  sourceOnly.roots['ع و ن'] = { meaningUrdu: '', noteUrdu: '' };
  Object.assign(sourceOnly.verbForms['1:5:4'], { baabUrdu: '', present: '', pattern: '', noteUrdu: '' });
  sourceOnly.ayahs[0].phrases = [];
  assert.equal(isStudyData(sourceOnly), true);
  // The optional IndoPak text is accepted when present.
  const withIndoPak = structuredClone(fatihahStudy) as { words: { arabicIndoPak?: string }[] };
  withIndoPak.words[0]!.arabicIndoPak = 'بِسۡمِ';
  assert.equal(isStudyData(withIndoPak), true);
});
