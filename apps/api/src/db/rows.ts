import { createHash } from 'node:crypto';
import type { PartOfSpeech, StudyData } from '@quran-grammar/core';

export interface ContentRows {
  surahs: {
    number: number;
    name_urdu: string;
    name_arabic: string;
    ayah_count: number;
    word_count: number;
  }[];
  ayahs: {
    surah: number;
    number: number;
    translation_urdu: string;
    theme_urdu: string;
    tafsir_urdu: string;
  }[];
  rules: {
    surah: number;
    position: number;
    id: string;
    title_urdu: string;
    explanation_urdu: string;
    example_urdu: string;
  }[];
  roots: {
    surah: number;
    position: number;
    root: string;
    meaning_urdu: string;
    note_urdu: string;
  }[];
  words: {
    id: string;
    surah: number;
    ayah: number;
    position: number;
    arabic: string;
    meaning_urdu: string;
    pos: PartOfSpeech;
    pos_urdu: string;
    root: string | null;
    lemma: string | null;
    morphology_urdu: string;
    syntax_urdu: string;
    dictionary_urdu: string;
  }[];
  word_segments: {
    word_id: string;
    position: number;
    arabic: string;
    role_urdu: string;
    meaning_urdu: string;
  }[];
  word_rules: { word_id: string; position: number; surah: number; rule_id: string }[];
  verb_forms: {
    word_id: string;
    surah: number;
    position: number;
    baab_urdu: string;
    form_urdu: string;
    past: string;
    present: string;
    pattern: string;
    note_urdu: string;
  }[];
  phrases: {
    id: string;
    surah: number;
    ayah: number;
    position: number;
    label_urdu: string;
    explanation_urdu: string;
  }[];
  phrase_words: { phrase_id: string; position: number; word_id: string }[];
}

/** Insertion order: parents before children. */
export const TABLES_PARENT_FIRST = [
  'surahs',
  'ayahs',
  'rules',
  'roots',
  'words',
  'word_segments',
  'word_rules',
  'verb_forms',
  'phrases',
  'phrase_words',
] as const satisfies readonly (keyof ContentRows)[];

/** Stable fingerprint of the bundled content; recorded with every database sync. */
export function contentSha256(studies: readonly StudyData[]): string {
  return createHash('sha256').update(JSON.stringify(studies)).digest('hex');
}

export function studiesToRows(studies: readonly StudyData[]): ContentRows {
  const rows: ContentRows = {
    surahs: [],
    ayahs: [],
    rules: [],
    roots: [],
    words: [],
    word_segments: [],
    word_rules: [],
    verb_forms: [],
    phrases: [],
    phrase_words: [],
  };
  for (const study of studies) {
    const surah = study.surah.number;
    if (study.schemaVersion !== 1) throw new Error(`Surah ${surah}: unsupported schemaVersion`);
    rows.surahs.push({
      number: surah,
      name_urdu: study.surah.nameUrdu,
      name_arabic: study.surah.nameArabic,
      ayah_count: study.surah.ayahCount,
      word_count: study.surah.wordCount,
    });
    for (const ayah of study.ayahs) {
      rows.ayahs.push({
        surah,
        number: ayah.number,
        translation_urdu: ayah.translationUrdu,
        theme_urdu: ayah.themeUrdu,
        tafsir_urdu: ayah.tafsirUrdu,
      });
      ayah.phrases.forEach((phrase, index) => {
        rows.phrases.push({
          id: phrase.id,
          surah,
          ayah: ayah.number,
          position: index + 1,
          label_urdu: phrase.labelUrdu,
          explanation_urdu: phrase.explanationUrdu,
        });
        phrase.wordIds.forEach((wordId, position) =>
          rows.phrase_words.push({ phrase_id: phrase.id, position: position + 1, word_id: wordId }),
        );
      });
    }
    study.rules.forEach((rule, index) =>
      rows.rules.push({
        surah,
        position: index + 1,
        id: rule.id,
        title_urdu: rule.titleUrdu,
        explanation_urdu: rule.explanationUrdu,
        example_urdu: rule.exampleUrdu,
      }),
    );
    Object.entries(study.roots).forEach(([root, entry], index) =>
      rows.roots.push({
        surah,
        position: index + 1,
        root,
        meaning_urdu: entry.meaningUrdu,
        note_urdu: entry.noteUrdu,
      }),
    );
    for (const word of study.words) {
      rows.words.push({
        id: word.id,
        surah,
        ayah: word.ayah,
        position: word.position,
        arabic: word.arabic,
        meaning_urdu: word.meaningUrdu,
        pos: word.pos,
        pos_urdu: word.posUrdu,
        root: word.root,
        lemma: word.lemma,
        morphology_urdu: word.morphologyUrdu,
        syntax_urdu: word.syntaxUrdu,
        dictionary_urdu: word.dictionaryUrdu,
      });
      word.segments.forEach((segment, index) =>
        rows.word_segments.push({
          word_id: word.id,
          position: index + 1,
          arabic: segment.arabic,
          role_urdu: segment.roleUrdu,
          meaning_urdu: segment.meaningUrdu,
        }),
      );
      word.ruleIds.forEach((ruleId, index) =>
        rows.word_rules.push({ word_id: word.id, position: index + 1, surah, rule_id: ruleId }),
      );
    }
    Object.entries(study.verbForms).forEach(([wordId, verb], index) =>
      rows.verb_forms.push({
        word_id: wordId,
        surah,
        position: index + 1,
        baab_urdu: verb.baabUrdu,
        form_urdu: verb.formUrdu,
        past: verb.past,
        present: verb.present,
        pattern: verb.pattern,
        note_urdu: verb.noteUrdu,
      }),
    );
  }
  return rows;
}

const byPosition = <T extends { position: number }>(a: T, b: T) => a.position - b.position;

function group<T>(
  items: readonly T[],
  key: (item: T) => string | number,
): Map<string | number, T[]> {
  const map = new Map<string | number, T[]>();
  for (const item of items) {
    const k = key(item);
    const list = map.get(k);
    if (list) list.push(item);
    else map.set(k, [item]);
  }
  return map;
}

/** Rebuild StudyData exactly (including key and list order) from database rows. */
export function rowsToStudies(rows: ContentRows): StudyData[] {
  const ayahsBySurah = group(rows.ayahs, (row) => row.surah);
  const wordsBySurah = group(rows.words, (row) => row.surah);
  const rulesBySurah = group(rows.rules, (row) => row.surah);
  const rootsBySurah = group(rows.roots, (row) => row.surah);
  const verbsBySurah = group(rows.verb_forms, (row) => row.surah);
  const phrasesByAyah = group(rows.phrases, (row) => `${row.surah}:${row.ayah}`);
  const segmentsByWord = group(rows.word_segments, (row) => row.word_id);
  const rulesByWord = group(rows.word_rules, (row) => row.word_id);
  const wordsByPhrase = group(rows.phrase_words, (row) => row.phrase_id);
  return [...rows.surahs]
    .sort((a, b) => a.number - b.number)
    .map((surah): StudyData => {
      const n = surah.number;
      const words = [...(wordsBySurah.get(n) ?? [])].sort(
        (a, b) => a.ayah - b.ayah || a.position - b.position,
      );
      return {
        schemaVersion: 1,
        surah: {
          number: n,
          nameUrdu: surah.name_urdu,
          nameArabic: surah.name_arabic,
          ayahCount: surah.ayah_count,
          wordCount: surah.word_count,
        },
        words: words.map((word) => ({
          id: word.id,
          ayah: word.ayah,
          position: word.position,
          arabic: word.arabic,
          meaningUrdu: word.meaning_urdu,
          pos: word.pos,
          posUrdu: word.pos_urdu,
          root: word.root,
          lemma: word.lemma,
          morphologyUrdu: word.morphology_urdu,
          syntaxUrdu: word.syntax_urdu,
          dictionaryUrdu: word.dictionary_urdu,
          segments: [...(segmentsByWord.get(word.id) ?? [])].sort(byPosition).map((segment) => ({
            arabic: segment.arabic,
            roleUrdu: segment.role_urdu,
            meaningUrdu: segment.meaning_urdu,
          })),
          ruleIds: [...(rulesByWord.get(word.id) ?? [])]
            .sort(byPosition)
            .map((rule) => rule.rule_id),
        })),
        ayahs: [...(ayahsBySurah.get(n) ?? [])]
          .sort((a, b) => a.number - b.number)
          .map((ayah) => ({
            number: ayah.number,
            translationUrdu: ayah.translation_urdu,
            themeUrdu: ayah.theme_urdu,
            tafsirUrdu: ayah.tafsir_urdu,
            phrases: [...(phrasesByAyah.get(`${n}:${ayah.number}`) ?? [])]
              .sort(byPosition)
              .map((phrase) => ({
                id: phrase.id,
                wordIds: [...(wordsByPhrase.get(phrase.id) ?? [])]
                  .sort(byPosition)
                  .map((entry) => entry.word_id),
                labelUrdu: phrase.label_urdu,
                explanationUrdu: phrase.explanation_urdu,
              })),
          })),
        rules: [...(rulesBySurah.get(n) ?? [])].sort(byPosition).map((rule) => ({
          id: rule.id,
          titleUrdu: rule.title_urdu,
          explanationUrdu: rule.explanation_urdu,
          exampleUrdu: rule.example_urdu,
        })),
        roots: Object.fromEntries(
          [...(rootsBySurah.get(n) ?? [])]
            .sort(byPosition)
            .map((root) => [
              root.root,
              { meaningUrdu: root.meaning_urdu, noteUrdu: root.note_urdu },
            ]),
        ),
        verbForms: Object.fromEntries(
          [...(verbsBySurah.get(n) ?? [])].sort(byPosition).map((verb) => [
            verb.word_id,
            {
              baabUrdu: verb.baab_urdu,
              formUrdu: verb.form_urdu,
              past: verb.past,
              present: verb.present,
              pattern: verb.pattern,
              noteUrdu: verb.note_urdu,
            },
          ]),
        ),
      };
    });
}
