import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { formatCount, getUiStrings, isUiLanguage } from './interface';
import {
  fatihahStudy,
  isStudyData,
  matchesWord,
  normalizeText,
  urduNumber,
  surahCatalog,
  juzCatalog,
  fatihahPractice,
  gradePracticeAnswer,
  getPracticeProgress,
  studies,
  getStudy,
  availableSurahNumbers,
  getSurahTitle,
} from './index';

const expectedChapters = [1, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114];

test('navigation catalogs distinguish the available lesson from future content and partial juz', () => {
  assert.deepEqual(
    surahCatalog.map((surah) => surah.number),
    Array.from({ length: 114 }, (_, i) => i + 1),
  );
  assert.deepEqual(
    surahCatalog.filter((surah) => surah.available).map((surah) => surah.number),
    expectedChapters,
  );
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
      (surah) => /[\u0600-\u06ff]/.test(surah.nameArabic) && surah.nameEnglish.trim(),
    ),
  );
  assert.equal(new Set(surahCatalog.map((surah) => surah.nameArabic)).size, 114);
  assert.deepEqual(
    juzCatalog.map((juz) => juz.number),
    Array.from({ length: 30 }, (_, i) => i + 1),
  );
  assert.deepEqual(
    juzCatalog.filter((juz) => juz.available),
    [
      { number: 1, available: true, partial: true, previewSurahNumber: 1, surahNumbers: [1] },
      {
        number: 30,
        available: true,
        partial: true,
        previewSurahNumber: 105,
        surahNumbers: expectedChapters.slice(1),
      },
    ],
  );
  assert.ok(
    juzCatalog
      .filter((juz) => !juz.available)
      .every(
        (juz) =>
          !juz.partial && juz.previewSurahNumber === undefined && juz.surahNumbers.length === 0,
      ),
  );
  assert.equal(getSurahTitle(114, 'en'), 'An-Nas');
  assert.equal(getSurahTitle(114, 'ur'), 'الناس');
});

test('all eleven available lessons have complete occurrence, rule and phrase coverage', () => {
  const counts = new Map([
    [1, [7, 29]],
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
  assert.deepEqual([...availableSurahNumbers], expectedChapters);
  assert.deepEqual(
    studies.map((study) => study.surah.number),
    expectedChapters,
  );
  assert.equal(
    studies.reduce((total, study) => total + study.ayahs.length, 0),
    55,
  );
  assert.equal(
    studies.reduce((total, study) => total + study.words.length, 0),
    230,
  );
  const occurrences = studies.flatMap((study) => study.words.map((word) => word.id));
  assert.equal(new Set(occurrences).size, 230);
  for (const study of studies) {
    const chapter = study.surah.number;
    assert.equal(getStudy(chapter), study);
    assert.equal(isStudyData(study), true, `Surah ${chapter}: complete schema and relationships`);
    assert.deepEqual([study.ayahs.length, study.words.length], counts.get(chapter));
    const covered = new Set(
      study.ayahs.flatMap((ayah) => ayah.phrases.flatMap((phrase) => phrase.wordIds)),
    );
    for (const word of study.words) {
      assert.ok(word.ruleIds.length > 0, `${word.id}: grammar rules`);
      assert.ok(covered.has(word.id), `${word.id}: phrase context`);
    }
    assert.ok(
      study.ayahs.every((ayah) => ayah.phrases.length > 0),
      `Surah ${chapter}: phrase analysis`,
    );
    assert.ok(
      !/https?:\/\//.test(JSON.stringify(study)),
      'Source links stay in the repository audit',
    );
  }
  for (const number of [0, 2, 104, 115, 105.5, NaN]) assert.equal(getStudy(number), undefined);
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
  ];
  for (const mutate of mutations) {
    const value = structuredClone(fatihahStudy);
    mutate(value);
    assert.equal(isStudyData(value), false, mutate.toString());
  }
});
