import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { normalizeText, type GrammarTopicSummary } from '@quran-grammar/core';
import { AppIcon } from '@/components/app-icon';
import { Action, Label } from '@/components/study-ui';
import { usePracticeQuestions, useTopics } from '@/state/content-hooks';
import { useInterface } from '@/state/preferences-provider';
import { card, colors, lineEndSlack, radius, spacing } from '@/theme/tokens';
import { useTypography } from '@/theme/typography';
import { QuizRunner } from './quick-practice';

const pageSize = 25;

type ActivePractice = { kind: 'fatihah' } | { kind: 'topic'; id: string };

/**
 * The whole "Practice Grammar" tab body. It is rendered inside the study screen's ScrollView,
 * so the topic list is a plain paginated column rather than a nested vertical FlatList.
 */
export function PracticeGrammar({ initialTopicId }: { initialTopicId?: string }) {
  const router = useRouter();
  const [active, setActive] = useState<ActivePractice | null>(
    initialTopicId ? { kind: 'topic', id: initialTopicId } : null,
  );
  const topics = useTopics();
  const openWord = useCallback(
    (id: string) => router.push({ pathname: '/word/[id]', params: { id, preview: '1' } }),
    [router],
  );
  const openTopic = useCallback(
    (id: string) => router.push({ pathname: '/topic/[id]', params: { id } }),
    [router],
  );

  if (active)
    return (
      <PracticeSession
        active={active}
        topic={
          active.kind === 'topic'
            ? topics.data?.find((entry) => entry.id === active.id)
            : undefined
        }
        onExit={() => setActive(null)}
        onWord={openWord}
      />
    );

  return (
    <TopicIndex
      topics={topics}
      onPractice={(id) => setActive({ kind: 'topic', id })}
      onFatihah={() => setActive({ kind: 'fatihah' })}
      onOpenTopic={openTopic}
    />
  );
}

/** Loads one question set and hands it to the shared quiz runner. */
export function PracticeSession({
  active,
  topic,
  onExit,
  onWord,
  exitLabel,
}: {
  active: ActivePractice;
  topic?: GrammarTopicSummary;
  onExit: () => void;
  onWord?: (id: string) => void;
  exitLabel?: string;
}) {
  const { ui } = useInterface();
  const topicId = active.kind === 'topic' ? active.id : null;
  const filter = useMemo(
    () => (topicId ? { topicId } : { set: 'fatihah' as const }),
    [topicId],
  );
  const questions = usePracticeQuestions(filter);
  if (questions.loading || questions.error || !questions.data)
    return (
      <LoadState
        loading={questions.loading}
        error={Boolean(questions.error)}
        onRetry={questions.retry}
        onBack={onExit}
        backLabel={exitLabel ?? ui.allTopics}
      />
    );
  return (
    <QuizRunner
      key={topicId ?? 'fatihah'}
      questions={questions.data}
      title={active.kind === 'fatihah' ? ui.quickPractice : (topic?.titleUrdu ?? ui.practiceGrammar)}
      subtitle={active.kind === 'fatihah' ? ui.practiceDescription : topic?.titleEnglish}
      onExit={onExit}
      exitLabel={exitLabel ?? ui.allTopics}
      onWord={onWord}
    />
  );
}

export function LoadState({
  loading,
  error,
  onRetry,
  onBack,
  backLabel,
}: {
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  onBack?: () => void;
  backLabel?: string;
}) {
  const { ui, labelStyle } = useInterface();
  return (
    <View style={{ ...card, gap: spacing.md, alignItems: 'stretch' }}>
      {loading || !error ? (
        <>
          <ActivityIndicator color={colors.primary} />
          <Label muted style={{ textAlign: 'center' }}>
            {ui.loading}
          </Label>
        </>
      ) : (
        <>
          <Text accessibilityRole="alert" style={[labelStyle, { textAlign: 'center' }]}>
            {ui.loadFailed}
          </Text>
          <Action onPress={onRetry}>{ui.retry}</Action>
        </>
      )}
      {onBack && backLabel && !loading ? (
        <Action quiet onPress={onBack}>
          {backLabel}
        </Action>
      ) : null}
    </View>
  );
}

function TopicIndex({
  topics,
  onPractice,
  onFatihah,
  onOpenTopic,
}: {
  topics: ReturnType<typeof useTopics>;
  onPractice: (id: string) => void;
  onFatihah: () => void;
  onOpenTopic: (id: string) => void;
}) {
  const { ui, count, labelStyle, labelText, controlRow, isUrdu } = useInterface();
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(pageSize);
  const normalized = normalizeText(query);
  const filtered = useMemo(() => {
    const list = topics.data ?? [];
    if (!normalized) return list;
    return list.filter((topic) =>
      normalizeText(
        [topic.id, topic.titleUrdu, topic.titleEnglish, topic.summaryUrdu].join(' '),
      ).includes(normalized),
    );
  }, [topics.data, normalized]);
  const visible = filtered.slice(0, limit);

  return (
    <View style={{ gap: spacing.lg }} testID="practice-grammar">
      <View style={{ gap: spacing.xs }}>
        <Text
          accessibilityRole="header"
          style={[labelText(24, isUrdu ? 40 : 32), { fontWeight: '700' }]}
        >
          {ui.practiceGrammar}
        </Text>
        <Label muted>{ui.practiceGrammarDescription}</Label>
      </View>

      <Pressable
        testID="practice-fatihah"
        accessibilityRole="button"
        accessibilityLabel={`${ui.quickPractice}. ${ui.practiceDescription}`}
        onPress={onFatihah}
        style={({ pressed }) => ({
          ...card,
          backgroundColor: pressed ? colors.lime : colors.wash,
          borderColor: colors.edge,
          borderBottomWidth: pressed ? 1 : 4,
        })}
      >
        <View style={{ ...controlRow, gap: spacing.sm }}>
          <AppIcon name="spark" color={colors.gold} />
          <View style={{ flex: 1 }}>
            <Label style={{ fontWeight: '700', fontSize: 18 }}>
              {ui.quickPractice}
              {lineEndSlack}
            </Label>
            <Label muted>{ui.practiceDescription}</Label>
          </View>
          <AppIcon name={isUrdu ? 'chevronLeft' : 'chevronRight'} />
        </View>
      </Pressable>

      <View style={{ gap: spacing.sm }}>
        <Text accessibilityRole="header" style={[labelText(18), { fontWeight: '600' }]}>
          {ui.allTopics}
          {topics.data ? ` · ${count(topics.data.length)}` : ''}
        </Text>
        <TextInput
          testID="topic-search"
          value={query}
          onChangeText={(value) => {
            setQuery(value);
            setLimit(pageSize);
          }}
          placeholder={ui.searchTopics}
          placeholderTextColor={colors.muted}
          accessibilityLabel={ui.searchTopics}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
          returnKeyType="search"
          style={[
            labelStyle,
            {
              minHeight: 50,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.sm,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.paper,
            },
          ]}
        />
      </View>

      {topics.loading || topics.error || !topics.data ? (
        <LoadState
          loading={topics.loading}
          error={Boolean(topics.error)}
          onRetry={topics.retry}
        />
      ) : filtered.length === 0 ? (
        <Label muted>{ui.noResults}</Label>
      ) : (
        <View style={{ gap: spacing.md }}>
          {visible.map((topic) => (
            <TopicRow
              key={topic.id}
              topic={topic}
              onPractice={onPractice}
              onOpenTopic={onOpenTopic}
            />
          ))}
          {filtered.length > visible.length ? (
            <Action quiet onPress={() => setLimit(limit + pageSize)}>
              {`${ui.showMore} · ${count(visible.length)} / ${count(filtered.length)}`}
            </Action>
          ) : null}
        </View>
      )}
    </View>
  );
}

function TopicRow({
  topic,
  onPractice,
  onOpenTopic,
}: {
  topic: GrammarTopicSummary;
  onPractice: (id: string) => void;
  onOpenTopic: (id: string) => void;
}) {
  const { ui, count, labelText, controlRow, isUrdu } = useInterface();
  const type = useTypography();
  const questions = `${count(topic.questionCount)} ${ui.topicQuestions}`;
  return (
    <View
      style={{ ...card, padding: 0, gap: 0, overflow: 'hidden' }}
      testID={`topic-row-${topic.id}`}
    >
      <Pressable
        testID={`practice-topic-${topic.id}`}
        accessibilityRole="button"
        accessibilityLabel={`${topic.titleUrdu}، ${topic.titleEnglish}. ${questions}`}
        accessibilityHint={ui.practice}
        onPress={() => onPractice(topic.id)}
        style={({ pressed }) => ({
          padding: spacing.lg,
          gap: spacing.xs,
          minHeight: 64,
          backgroundColor: pressed ? colors.wash : colors.paper,
        })}
      >
        <Text style={[type.heading, type.urduText(20, 34), { color: colors.primary }]}>
          {topic.titleUrdu}
        </Text>
        <Text style={styles.english}>
          {topic.titleEnglish}
        </Text>
        <Text numberOfLines={3} style={type.small}>
          {topic.summaryUrdu}
        </Text>
      </Pressable>
      <View
        style={{
          ...controlRow,
          justifyContent: 'space-between',
          borderTopWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: spacing.sm,
        }}
      >
        <View
          style={{ ...controlRow, gap: spacing.xs, minHeight: 48, paddingHorizontal: spacing.sm }}
        >
          <AppIcon name="spark" color={colors.gold} size={18} />
          <Label muted>
            {questions}
            {lineEndSlack}
          </Label>
        </View>
        <Pressable
          testID={`open-topic-${topic.id}`}
          accessibilityRole="button"
          accessibilityLabel={`${ui.openTopic}: ${topic.titleUrdu}`}
          onPress={() => onOpenTopic(topic.id)}
          style={({ pressed }) => ({
            ...controlRow,
            gap: spacing.xs,
            minHeight: 48,
            paddingHorizontal: spacing.sm,
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <Text style={[labelText(15), { color: colors.primary }]}>{ui.openTopic}
            {lineEndSlack}
          </Text>
          <AppIcon name={isUrdu ? 'chevronLeft' : 'chevronRight'} size={18} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = {
  english: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
    textAlign: 'left',
    writingDirection: 'ltr',
  },
} as const;
