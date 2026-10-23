import { fatihahStudy } from './data';

export interface PracticeOption {
  readonly id: string;
  readonly text: string;
  readonly language: 'ar' | 'ur';
}

export interface PracticeQuestion {
  readonly id: string;
  readonly promptUrdu: string;
  readonly options: readonly PracticeOption[];
  readonly correctOptionId: string;
  readonly explanationUrdu: string;
  readonly wordId: string;
}

export type PracticeAnswers = Readonly<Record<string, string>>;

export interface PracticeProgress {
  readonly answered: number;
  readonly total: number;
  readonly correct: number;
  readonly complete: boolean;
}

// Reuse the exact existing Quran word occurrence; do not retype scripture for options.
function wordOption(wordId: string): PracticeOption {
  const word = fatihahStudy.words.find((entry) => entry.id === wordId);
  if (!word) throw new Error(`Practice word is missing: ${wordId}`);
  return { id: word.id, text: word.arabic, language: 'ar' };
}

/** Original Urdu questions based solely on the available teaching draft. */
export const fatihahPractice: readonly PracticeQuestion[] = [
  {
    id: 'identify-verb',
    promptUrdu: 'ان الفاظ میں سے فعل کون سا ہے؟',
    options: [wordOption('1:2:1'), wordOption('1:5:2'), wordOption('1:5:1')],
    correctOptionId: '1:5:2',
    explanationUrdu:
      'نَعْبُدُ فعلِ مضارع ہے، یعنی «ہم عبادت کرتے ہیں»۔ ٱلْحَمْدُ اسم اور إِيَّاكَ ضمیر ہے۔',
    wordId: '1:5:2',
  },
  {
    id: 'identify-imperative',
    promptUrdu: 'ٱهْدِنَا میں ٱهْدِ کس قسم کا فعل ہے؟',
    options: [
      { id: 'past', text: 'فعلِ ماضی', language: 'ur' },
      { id: 'present', text: 'فعلِ مضارع', language: 'ur' },
      { id: 'imperative', text: 'فعلِ امر', language: 'ur' },
    ],
    correctOptionId: 'imperative',
    explanationUrdu:
      'ٱهْدِ فعلِ امر ہے۔ اس دعا میں امر کا صیغہ درخواست کے لیے آیا ہے۔ نَا کا معنی «ہمیں» ہے۔',
    wordId: '1:6:1',
  },
  {
    id: 'identify-root',
    promptUrdu: 'نَعْبُدُ کا مادہ کون سا ہے؟',
    options: [
      { id: 'abd', text: 'ع ب د', language: 'ar' },
      { id: 'hmd', text: 'ح م د', language: 'ar' },
      { id: 'rhm', text: 'ر ح م', language: 'ar' },
    ],
    correctOptionId: 'abd',
    explanationUrdu:
      'نَعْبُدُ کا مادہ ع ب د ہے، جس کا بنیادی مفہوم عبادت اور بندگی سے متعلق ہے۔ ابتدائی نون مادے کا حصہ نہیں؛ یہ جمع متکلم کے صیغے کی علامت ہے۔',
    wordId: '1:5:2',
  },
];

/** Invalid option IDs are not counted as attempts or silently marked incorrect. */
export function gradePracticeAnswer(question: PracticeQuestion, optionId: string): boolean | null {
  if (!question.options.some((option) => option.id === optionId)) return null;
  return optionId === question.correctOptionId;
}

/** Derive progress from answer IDs without mutating UI state or storing personal data. */
export function getPracticeProgress(
  questions: readonly PracticeQuestion[],
  answers: PracticeAnswers,
): PracticeProgress {
  let answered = 0;
  let correct = 0;
  for (const question of questions) {
    if (!Object.hasOwn(answers, question.id)) continue;
    const result = gradePracticeAnswer(question, answers[question.id]);
    if (result === null) continue;
    answered += 1;
    if (result) correct += 1;
  }
  return {
    answered,
    total: questions.length,
    correct,
    complete: questions.length > 0 && answered === questions.length,
  };
}
