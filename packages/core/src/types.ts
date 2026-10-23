export type PartOfSpeech = 'noun' | 'adjective' | 'verb' | 'particle' | 'pronoun';
export type PartOfSpeechFilter = PartOfSpeech | 'all';

export interface WordSegment {
  arabic: string;
  roleUrdu: string;
  meaningUrdu: string;
}

export interface Word {
  id: string;
  ayah: number;
  position: number;
  arabic: string;
  meaningUrdu: string;
  pos: PartOfSpeech;
  posUrdu: string;
  root: string | null;
  lemma: string | null;
  morphologyUrdu: string;
  syntaxUrdu: string;
  dictionaryUrdu: string;
  segments: WordSegment[];
  ruleIds: string[];
}

export interface Phrase {
  id: string;
  wordIds: string[];
  labelUrdu: string;
  explanationUrdu: string;
}

export interface Ayah {
  number: number;
  translationUrdu: string;
  themeUrdu: string;
  tafsirUrdu: string;
  phrases: Phrase[];
}

export interface Rule {
  id: string;
  titleUrdu: string;
  explanationUrdu: string;
  exampleUrdu: string;
}

export interface RootEntry {
  meaningUrdu: string;
  noteUrdu: string;
}

export interface VerbForm {
  baabUrdu: string;
  formUrdu: string;
  past: string;
  present: string;
  pattern: string;
  noteUrdu: string;
}

export interface StudyData {
  schemaVersion: 1;
  surah: {
    number: number;
    nameUrdu: string;
    nameArabic: string;
    ayahCount: number;
    wordCount: number;
  };
  words: Word[];
  ayahs: Ayah[];
  rules: Rule[];
  roots: Record<string, RootEntry>;
  verbForms: Record<string, VerbForm>;
}
