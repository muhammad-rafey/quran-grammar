import type { GrammarTopicSource } from '../types';
import { topicsPart1 } from './part-1';
import { topicsPart2 } from './part-2';
import { topicsPart3 } from './part-3';
import { topicsPart4 } from './part-4';
import { topicsPart5 } from './part-5';

/** Authored grammar topic library, one entry per Rule.id (AI-authored; scholarly review pending). */
export const grammarTopicSources: readonly GrammarTopicSource[] = [
  ...topicsPart1,
  ...topicsPart2,
  ...topicsPart3,
  ...topicsPart4,
  ...topicsPart5,
];
