import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  getPracticeProgress,
  gradePracticeAnswer,
  type PracticeQuestion,
} from '@quran-grammar/core';
import { AppIcon } from '@/components/app-icon';
import { Action, Label, Paragraph } from '@/components/study-ui';
import { useInterface } from '@/state/preferences-provider';
import { parseWordLocation } from '@/state/word-location';
import { card, colors, lineEndSlack, radius, spacing } from '@/theme/tokens';
import { useTypography } from '@/theme/typography';

/**
 * Reusable multiple-choice runner: one question at a time, choose → check → feedback with the
 * Urdu explanation → next, then a score screen. Answers live only in component state.
 */
export function QuizRunner({
  questions,
  title,
  subtitle,
  onExit,
  exitLabel,
  onWord,
}: {
  questions: readonly PracticeQuestion[];
  /** Urdu topic title (or interface title for the Al-Fatihah set). */
  title: string;
  subtitle?: string;
  onExit: () => void;
  exitLabel: string;
  onWord?: (id: string) => void;
}) {
  const { ui, count, labelStyle, labelText, controlRow } = useInterface();
  const type = useTypography();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const total = questions.length;
  const progress = getPracticeProgress(questions, answers);
  const complete = index >= total;
  const question = complete ? undefined : questions[index];
  const checked = question ? Object.hasOwn(answers, question.id) : false;
  const correct = question && checked ? gradePracticeAnswer(question, answers[question.id]) : null;
  const wordId = question?.wordId;
  const restart = () => {
    setIndex(0);
    setAnswers({});
    setSelected(null);
  };
  const titleStyle = /[؀-ۿ]/.test(title) ? type.heading : [labelText(19), styles.titleLtr];

  return (
    <View style={styles.shell} testID="quiz-runner">
      <View style={{ ...controlRow, gap: spacing.sm }}>
        <AppIcon name="spark" color={colors.gold} />
        <View style={{ flex: 1 }}>
          <Text accessibilityRole="header" style={titleStyle}>
            {title}
          </Text>
          {subtitle ? <Label muted>{subtitle}</Label> : null}
        </View>
      </View>

      {total === 0 ? (
        <>
          <Label muted>{ui.noResults}</Label>
          <Action quiet onPress={onExit}>
            {exitLabel}
          </Action>
        </>
      ) : complete || !question ? (
        <View accessibilityLiveRegion="polite" style={{ gap: spacing.md }} testID="quiz-score">
          <Label style={{ fontSize: 22, fontWeight: '700' }}>{ui.practiceComplete}</Label>
          <Label>
            {ui.practiceScore}: {count(progress.correct)} / {count(total)}
          </Label>
          <Action onPress={restart}>{ui.restartPractice}</Action>
          <Action quiet onPress={onExit}>
            {exitLabel}
          </Action>
        </View>
      ) : (
        <>
          <View style={{ gap: spacing.xs }}>
            <Label muted>
              {ui.question} {count(index + 1)} {ui.of} {count(total)}
            </Label>
            <View
              style={{ ...controlRow, gap: 3 }}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              {questions.map((item, itemIndex) => (
                <View
                  key={item.id}
                  style={{
                    flex: 1,
                    height: 5,
                    borderRadius: radius.pill,
                    backgroundColor:
                      itemIndex < index || (itemIndex === index && checked)
                        ? colors.primary
                        : colors.edge,
                  }}
                />
              ))}
            </View>
          </View>
          <Text selectable style={[type.heading, type.urduText(23)]}>
            {question.promptUrdu}
          </Text>
          <View
            accessibilityRole="radiogroup"
            accessibilityLabel={ui.chooseAnswer}
            style={{ gap: spacing.sm }}
          >
            {question.options.map((option) => {
              const chosen = selected === option.id;
              const rightAnswer = checked && option.id === question.correctOptionId;
              const wrongChoice = checked && chosen && !rightAnswer;
              return (
                <Pressable
                  key={option.id}
                  testID={`answer-${option.id}`}
                  accessibilityRole="radio"
                  accessibilityLabel={option.text}
                  accessibilityState={{ checked: chosen, disabled: checked }}
                  disabled={checked}
                  onPress={() => setSelected(option.id)}
                  style={({ pressed }) => ({
                    minHeight: 60,
                    borderRadius: radius.md,
                    borderWidth: 2,
                    borderBottomWidth: pressed ? 2 : 4,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                    justifyContent: 'center',
                    backgroundColor: rightAnswer
                      ? colors.lime
                      : wrongChoice
                        ? colors.amberWash
                        : chosen
                          ? colors.paper
                          : colors.background,
                    borderColor: rightAnswer
                      ? colors.primary
                      : wrongChoice
                        ? colors.amber
                        : chosen
                          ? colors.primary
                          : colors.border,
                  })}
                >
                  <Text
                    style={[
                      option.language === 'ar' ? type.arabic : type.body,
                      { textAlign: 'center', color: colors.ink },
                    ]}
                  >
                    {option.text}
                    {lineEndSlack}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {checked ? (
            <View accessibilityLiveRegion="polite" style={{ gap: spacing.md }}>
              <Text
                accessibilityRole="header"
                style={[
                  labelStyle,
                  { fontWeight: '700', color: correct ? colors.primary : colors.amber },
                ]}
              >
                {correct ? ui.correctAnswer : ui.tryAgainAnswer}
              </Text>
              <Paragraph>{question.explanationUrdu}</Paragraph>
              <Action
                onPress={() => {
                  setIndex(index + 1);
                  setSelected(null);
                }}
              >
                {index === total - 1 ? ui.practiceComplete : ui.nextQuestion}
              </Action>
              {onWord && wordId && parseWordLocation(wordId) ? (
                <Action quiet onPress={() => onWord(wordId)}>
                  {ui.wordStudy}
                </Action>
              ) : null}
            </View>
          ) : (
            <Action
              disabled={!selected}
              onPress={() => {
                if (!selected || gradePracticeAnswer(question, selected) === null) return;
                setAnswers({ ...answers, [question.id]: selected });
              }}
            >
              {ui.checkAnswer}
            </Action>
          )}
          <Action quiet onPress={onExit}>
            {exitLabel}
          </Action>
        </>
      )}
    </View>
  );
}

const styles = {
  shell: {
    ...card,
    backgroundColor: colors.wash,
    borderColor: colors.edge,
    borderBottomWidth: 4,
    gap: spacing.lg,
  },
  titleLtr: { fontWeight: '700' },
} as const;
