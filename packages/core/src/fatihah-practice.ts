import { fatihahStudy } from './data';
import type { PracticeOption, PracticeQuestion } from './practice';

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
    topicId: null,
    kind: 'fatihah',
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
    topicId: null,
    kind: 'fatihah',
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
    topicId: null,
    kind: 'fatihah',
  },
];
