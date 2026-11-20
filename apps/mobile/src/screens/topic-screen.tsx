import { Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { GrammarTopicDetail, ResolvedTopicExample } from '@quran-grammar/core';
import { AppIcon } from '@/components/app-icon';
import { Action, Label, Paragraph, Section } from '@/components/study-ui';
import { useTopic } from '@/state/content-hooks';
import { useInterface } from '@/state/preferences-provider';
import { parseWordLocation } from '@/state/word-location';
import { card, colors, lineEndSlack, radius, row, spacing } from '@/theme/tokens';
import { useTypography } from '@/theme/typography';
import { LoadState } from './practice-grammar';

const topicIdPattern = /^[a-z0-9-]{1,64}$/;

export function validTopicId(value: unknown): string | null {
  return typeof value === 'string' && topicIdPattern.test(value) ? value : null;
}

export default function TopicScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = validTopicId(params.id);
  const { ui } = useInterface();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topic = useTopic(id);
  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));
  const container = {
    padding: 18,
    paddingBottom: Math.max(insets.bottom, 20),
    gap: 16,
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
  } as const;

  if (!id || (!topic.loading && !topic.error && !topic.data))
    return (
      <View style={container}>
        <Label>{ui.notFound}</Label>
        <Action onPress={close}>{ui.backToStudy}</Action>
      </View>
    );
  if (topic.loading || topic.error || !topic.data)
    return (
      <View style={container}>
        <LoadState
          loading={topic.loading}
          error={Boolean(topic.error)}
          onRetry={topic.retry}
          onBack={close}
          backLabel={ui.close}
        />
      </View>
    );

  return (
    <ScrollView
      key={id}
      testID="topic-detail"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={container}
    >
      <TopicBody
        topic={topic.data}
        onWord={(wordId) => router.push({ pathname: '/word/[id]', params: { id: wordId, preview: '1' } })}
        onPractice={() =>
          router.push({ pathname: '/practice/[topicId]', params: { topicId: topic.data!.id } })
        }
      />
      <Action quiet onPress={close}>
        {ui.close}
      </Action>
    </ScrollView>
  );
}

function TopicBody({
  topic,
  onWord,
  onPractice,
}: {
  topic: GrammarTopicDetail;
  onWord: (id: string) => void;
  onPractice: () => void;
}) {
  const { ui, count } = useInterface();
  const type = useTypography();
  const paragraphs = topic.explanationUrdu
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const practice = (
    <Action onPress={onPractice} label={`${ui.practiceThisTopic}: ${topic.titleUrdu}`}>
      {`${ui.practiceThisTopic} · ${count(topic.questionCount)} ${ui.topicQuestions}`}
    </Action>
  );
  return (
    <>
      <Stack.Screen options={{ title: ui.grammarTopics }} />
      <View style={{ ...card, gap: spacing.sm }}>
        <Text
          accessibilityRole="header"
          selectable
          style={[type.heading, type.urduText(28, 48), { color: colors.primary }]}
        >
          {topic.titleUrdu}
        </Text>
        <Text
          selectable
          style={{
            fontSize: 16,
            lineHeight: 24,
            textAlign: 'left',
            writingDirection: 'ltr',
            color: colors.muted,
          }}
        >
          {topic.titleEnglish}
        </Text>
        <Paragraph>{topic.summaryUrdu}</Paragraph>
        <Label muted>
          {`${count(topic.questionCount)} ${ui.topicQuestions} · ${count(topic.occurrenceCount)} ${ui.topicOccurrences}`}
        </Label>
      </View>
      {practice}
      {paragraphs.length > 0 && (
        <Section title={ui.explanation}>
          {paragraphs.map((paragraph, index) => (
            <Paragraph key={index}>{paragraph}</Paragraph>
          ))}
        </Section>
      )}
      {topic.pointsUrdu.length > 0 && (
        <Section title={ui.keyPoints}>
          {topic.pointsUrdu.map((point, index) => (
            <View
              key={index}
              style={{ ...row, alignItems: 'flex-start', gap: spacing.sm }}
            >
              <Text style={[type.body, { color: colors.gold }]}>•</Text>
              <Paragraph style={{ flex: 1 }}>{point}</Paragraph>
            </View>
          ))}
        </Section>
      )}
      {topic.examples.length > 0 && (
        <Section title={ui.annotatedExamples}>
          {topic.examples.map((example) => (
            <ExampleCard
              key={`${example.kind}-${example.wordId}`}
              example={example}
              onWord={onWord}
            />
          ))}
        </Section>
      )}
      {topic.quranicExamples.length > 0 && (
        <Section title={ui.moreQuranicExamples}>
          {topic.quranicExamples.map((example) => (
            <ExampleCard
              key={`${example.kind}-${example.wordId}`}
              example={example}
              onWord={onWord}
              compact
            />
          ))}
        </Section>
      )}
      {practice}
    </>
  );
}

/** Splits the ayah at word boundaries so the studied occurrence can be emphasised in place. */
function splitAyah(example: ResolvedTopicExample) {
  const words = example.ayahArabic.split(' ');
  const position = parseWordLocation(example.wordId)?.position ?? 0;
  let index = words[position - 1] === example.wordArabic ? position - 1 : -1;
  if (index < 0) index = words.indexOf(example.wordArabic);
  if (index < 0) return null;
  return {
    before: words.slice(0, index).join(' '),
    word: words[index],
    after: words.slice(index + 1).join(' '),
  };
}

function ExampleCard({
  example,
  onWord,
  compact = false,
}: {
  example: ResolvedTopicExample;
  onWord: (id: string) => void;
  compact?: boolean;
}) {
  const { ui, count, labelText, controlRow, isUrdu } = useInterface();
  const type = useTypography();
  const { arabicText } = type;
  const parts = splitAyah(example);
  const reference = `${count(example.surah)}:${count(example.ayah)}`;
  return (
    <Pressable
      testID={`topic-example-${example.wordId}`}
      accessibilityRole="button"
      accessibilityLabel={`${example.wordArabic}، ${example.meaningUrdu}. ${ui.surah} ${reference}`}
      accessibilityHint={ui.wordStudy}
      onPress={() => onWord(example.wordId)}
      style={({ pressed }) => ({
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        borderBottomWidth: pressed ? 1 : 3,
        backgroundColor: pressed ? colors.wash : colors.background,
        padding: spacing.md,
        gap: spacing.xs,
      })}
    >
      <View style={{ ...controlRow, justifyContent: 'space-between' }}>
        <View
          style={{
            paddingHorizontal: spacing.sm,
            paddingVertical: 2,
            borderRadius: radius.sm,
            backgroundColor: colors.wash,
          }}
        >
          <Text style={[labelText(14), { color: colors.primary }]}>{reference}
            {lineEndSlack}
          </Text>
        </View>
        <View style={{ ...controlRow, gap: spacing.xs }}>
          <Text style={[type.arabic, arabicText(30), { color: colors.primary }]}>
            {example.wordArabic}
          </Text>
          <AppIcon name={isUrdu ? 'chevronLeft' : 'chevronRight'} size={18} />
        </View>
      </View>
      <Text style={[type.arabic, arabicText(compact ? 23 : 26)]}>
        {parts ? (
          <>
            {parts.before ? `${parts.before} ` : ''}
            <Text style={{ color: colors.primary, backgroundColor: colors.lime }}>{parts.word}</Text>
            {parts.after ? ` ${parts.after}` : ''}
          </>
        ) : (
          example.ayahArabic
        )}
      </Text>
      <Paragraph muted>{example.translationUrdu}</Paragraph>
      {example.noteUrdu ? (
        <View
          style={{
            borderRightWidth: 3,
            borderColor: colors.gold,
            paddingRight: spacing.sm,
          }}
        >
          <Paragraph>{example.noteUrdu}</Paragraph>
        </View>
      ) : null}
    </Pressable>
  );
}
