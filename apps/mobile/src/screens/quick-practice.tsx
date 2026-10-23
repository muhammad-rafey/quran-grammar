import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { fatihahPractice, gradePracticeAnswer } from '@quran-grammar/core';
import { AppIcon } from '@/components/app-icon';
import { Action, Label, Paragraph } from '@/components/study-ui';
import { useInterface } from '@/state/preferences-provider';
import { card, colors, radius, spacing, type } from '@/theme/tokens';

export function QuickPractice({ onWord }: { onWord: (id: string) => void }) {
  const { ui, count, labelStyle, controlRow } = useInterface();
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const question = fatihahPractice[index];
  const complete = index === fatihahPractice.length;
  const checked = answers.length > index;
  const correct = answers[index];
  const restart = () => {
    setIndex(0);
    setAnswers([]);
    setSelected(null);
    setStarted(true);
  };

  return (
    <View
      style={{
        ...card,
        backgroundColor: colors.wash,
        borderColor: colors.edge,
        borderBottomWidth: 4,
        gap: spacing.lg,
      }}
      testID="quick-practice"
    >
      <View style={{ ...controlRow, justifyContent: 'space-between' }}>
        <View style={{ ...controlRow, gap: spacing.sm }}>
          <AppIcon name="spark" color={colors.gold} />
          <Label style={{ fontWeight: '700', fontSize: 19 }}>{ui.quickPractice}</Label>
        </View>
        {started && !complete && (
          <Label muted>
            {count(index + 1)} / {count(fatihahPractice.length)}
          </Label>
        )}
      </View>
      {!started ? (
        <>
          <Label muted>{ui.practiceDescription}</Label>
          <Action onPress={() => setStarted(true)}>{ui.startPractice}</Action>
        </>
      ) : complete ? (
        <>
          <Label style={{ fontSize: 22, fontWeight: '700' }}>{ui.practiceComplete}</Label>
          <Label>
            {ui.practiceScore}: {count(answers.filter(Boolean).length)} /{' '}
            {count(fatihahPractice.length)}
          </Label>
          <Action onPress={restart}>{ui.restartPractice}</Action>
        </>
      ) : (
        <>
          <View
            style={{ ...controlRow, gap: spacing.xs }}
            accessibilityLabel={`${ui.question} ${count(index + 1)} ${ui.of} ${count(fatihahPractice.length)}`}
          >
            {fatihahPractice.map((item, itemIndex) => (
              <View
                key={item.id}
                style={{
                  flex: 1,
                  height: 5,
                  borderRadius: radius.pill,
                  backgroundColor: itemIndex < answers.length ? colors.primary : colors.edge,
                }}
              />
            ))}
          </View>
          <Text selectable style={[type.heading, { fontSize: 23 }]}>
            {question.promptUrdu}
          </Text>
          {question.options.map((option) => {
            const chosen = selected === option.id;
            const rightAnswer = checked && option.id === question.correctOptionId;
            return (
              <Pressable
                key={option.id}
                testID={`answer-${option.id}`}
                accessibilityRole="radio"
                accessibilityState={{ checked: chosen, disabled: checked }}
                disabled={checked}
                onPress={() => setSelected(option.id)}
                style={({ pressed }) => ({
                  minHeight: 56,
                  borderRadius: radius.md,
                  borderWidth: 2,
                  borderBottomWidth: pressed ? 2 : 4,
                  padding: spacing.md,
                  backgroundColor: rightAnswer
                    ? colors.lime
                    : chosen
                      ? colors.paper
                      : colors.background,
                  borderColor: rightAnswer || chosen ? colors.primary : colors.border,
                })}
              >
                <Text
                  style={[
                    option.language === 'ar' ? type.arabic : type.body,
                    { textAlign: 'center', color: colors.ink },
                  ]}
                >
                  {option.text}
                </Text>
              </Pressable>
            );
          })}
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
                {index === fatihahPractice.length - 1 ? ui.practiceComplete : ui.nextQuestion}
              </Action>
              <Action quiet onPress={() => onWord(question.wordId)}>
                {ui.wordStudy}
              </Action>
            </View>
          ) : (
            <Action
              disabled={!selected}
              onPress={() => {
                if (!selected) return;
                const result = gradePracticeAnswer(question, selected);
                if (result !== null) setAnswers([...answers, result]);
              }}
            >
              {ui.checkAnswer}
            </Action>
          )}
        </>
      )}
    </View>
  );
}
