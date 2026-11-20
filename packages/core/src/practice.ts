import type { PracticeQuestionKind } from './grammar/types';

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
  /** Quranic word occurrence the question is about; null when it is not about one word. */
  readonly wordId: string | null;
  /** Grammar topic (Rule.id) the question practises; null for the Al-Fatihah set. */
  readonly topicId: string | null;
  readonly kind: PracticeQuestionKind;
}

export type PracticeAnswers = Readonly<Record<string, string>>;

export interface PracticeProgress {
  readonly answered: number;
  readonly total: number;
  readonly correct: number;
  readonly complete: boolean;
}

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
