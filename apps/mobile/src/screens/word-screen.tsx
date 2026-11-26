import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { availableSurahNumbers, quranText, type Rule } from '@quran-grammar/core';
import { AppIcon } from '@/components/app-icon';
import { Action, InitialDataState, Label, Paragraph, Section } from '@/components/study-ui';
import { useInterface } from '@/state/preferences-provider';
import { useStudy, useSurahStudy } from '@/state/study-provider';
import { parseWordLocation } from '@/state/word-location';
import { card, colors, lineEndSlack, row } from '@/theme/tokens';
import { useTypography } from '@/theme/typography';

export default function WordScreen() {
  const { id, preview } = useLocalSearchParams<{ id: string; preview?: string }>();
  const { selectSurah } = useStudy();
  const { ui, count, labelStyle, controlRow } = useInterface();
  const type = useTypography();
  const { arabicText } = type;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [segmentSelection, setSegmentSelection] = useState({ wordId: id, index: 0 });
  const segment = segmentSelection.wordId === id ? segmentSelection.index : 0;
  const location = parseWordLocation(id);
  // The Surah's words load asynchronously; the word itself is checked once that study arrives.
  const routeSurah =
    location && availableSurahNumbers.includes(location.surah) ? location.surah : null;
  // Words opened from a grammar topic or quiz are previews: they load their chapter on their own,
  // so returning never switches (or reloads) the study screen behind them. Other entries, such as
  // deep links, also select the chapter on the study screen.
  const isPreview = preview === '1';
  useEffect(() => {
    if (routeSurah !== null && !isPreview) selectSurah(routeSurah);
  }, [routeSurah, isPreview, selectSurah]);
  const chapter = useSurahStudy(routeSurah);
  const study = chapter.study;
  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));
  if (routeSurah === null)
    return (
      <View style={{ padding: 24, gap: 20 }}>
        <Label>{ui.notFound}</Label>
        <Action onPress={close}>{ui.backToStudy}</Action>
      </View>
    );
  if (!study || study.surah.number !== routeSurah) {
    return <InitialDataState state={chapter} />;
  }
  const index = study.words.findIndex((entry) => entry.id === id);
  const word = study.words[index];
  if (!word)
    return (
      <View style={{ padding: 24, gap: 20 }}>
        <Label>{ui.notFound}</Label>
        <Action onPress={close}>{ui.backToStudy}</Action>
      </View>
    );
  const root = word.root ? study.roots[word.root] : undefined;
  const verb = study.verbForms[word.id];
  const related = word.root
    ? study.words.filter((entry) => entry.root === word.root && entry.id !== word.id)
    : [];
  const selectedSegment = word.segments[segment] ?? word.segments[0];
  const navigate = (next: number) => {
    const target = study.words[next];
    if (target) router.setParams({ id: target.id });
  };
  const rules = study.rules.filter((rule) => word.ruleIds.includes(rule.id));

  return (
    <>
      <Stack.Screen
        options={{
          title: `${ui.ayah} ${count(word.ayah)} · ${ui.word} ${count(word.position)}`,
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={ui.close}
              onPress={close}
              style={{
                minWidth: 48,
                minHeight: 44,
                justifyContent: 'center',
                paddingHorizontal: 4,
              }}
            >
              <Text style={[labelStyle, { color: colors.primary }]}>{ui.close}</Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView
        key={word.id}
        testID="word-detail"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          padding: 18,
          paddingBottom: Math.max(insets.bottom, 20),
          gap: 16,
          width: '100%',
          maxWidth: 760,
          alignSelf: 'center',
        }}
      >
        <View style={{ ...card, alignItems: 'center' }}>
          <Text
            selectable
            style={[type.arabic, arabicText(46), { textAlign: 'center' }]}
          >
            {quranText(word, type.quranFont)}
          </Text>
          <Paragraph style={{ ...type.urduText(22, 38), textAlign: 'center' }}>
            {word.meaningUrdu}
          </Paragraph>
          <View
            style={{
              paddingHorizontal: 14,
              paddingVertical: 4,
              borderRadius: 8,
              backgroundColor: colors.wash,
            }}
          >
            <Text style={[type.small, { color: colors.primary }]}>{word.posUrdu}
              {lineEndSlack}
            </Text>
          </View>
        </View>
        <View style={{ ...controlRow, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <Action quiet disabled={index === 0} onPress={() => navigate(index - 1)}>
            {ui.previous}
          </Action>
          <Label muted>
            {count(index + 1)} / {count(study.words.length)}
          </Label>
          <Action
            quiet
            disabled={index === study.words.length - 1}
            onPress={() => navigate(index + 1)}
          >
            {ui.next}
          </Action>
        </View>
        <Section title={ui.rootMeaning}>
          {word.root && root ? (
            <>
              <Text
                selectable
                style={[type.arabic, arabicText(34), { color: colors.primary }]}
              >
                {word.root}
              </Text>
              {/* Source-only chapters may have no root meaning or note; empty fields are hidden. */}
              {root.meaningUrdu ? <Paragraph>{root.meaningUrdu}</Paragraph> : null}
              {root.noteUrdu ? <Paragraph muted>{root.noteUrdu}</Paragraph> : null}
            </>
          ) : (
            <Label muted>{ui.noRoot}</Label>
          )}
          {word.lemma && (
            <View style={{ gap: 4 }}>
              <Label muted>{ui.headword}</Label>
              <Paragraph>{word.lemma}</Paragraph>
            </View>
          )}
          {word.dictionaryUrdu ? <Paragraph>{word.dictionaryUrdu}</Paragraph> : null}
        </Section>
        {verb && (
          <Section title={ui.verbForm}>
            {verb.baabUrdu ? (
              <Text selectable style={[type.heading, { color: colors.primary }]}>
                {verb.baabUrdu}
              </Text>
            ) : null}
            <Paragraph muted>{verb.formUrdu}</Paragraph>
            <View style={{ ...row, flexWrap: 'wrap' }}>
              <View style={{ ...card, flexGrow: 1, backgroundColor: colors.wash }}>
                <Label muted>{ui.past}</Label>
                <Text selectable style={type.arabic}>
                  {verb.past}
                </Text>
              </View>
              {verb.present ? (
                <View style={{ ...card, flexGrow: 1, backgroundColor: colors.wash }}>
                  <Label muted>{ui.present}</Label>
                  <Text selectable style={type.arabic}>
                    {verb.present}
                  </Text>
                </View>
              ) : null}
            </View>
            {verb.pattern ? (
              <>
                <Label muted>{ui.pattern}</Label>
                <Text selectable style={[type.arabic, arabicText(26)]}>
                  {verb.pattern}
                </Text>
              </>
            ) : null}
            {verb.noteUrdu ? <Paragraph>{verb.noteUrdu}</Paragraph> : null}
          </Section>
        )}
        {/* Corpus segments split the Uthmani word and stay Uthmani (no IndoPak segmentation). */}
        <Section title={ui.segments}>
          <View style={{ ...row, flexWrap: 'wrap' }}>
            {word.segments.map((item, itemIndex) => (
              <Pressable
                key={`${word.id}-${itemIndex}`}
                accessibilityRole="button"
                accessibilityState={{ selected: segment === itemIndex }}
                accessibilityLabel={`${item.arabic}، ${item.roleUrdu}`}
                onPress={() => setSegmentSelection({ wordId: id, index: itemIndex })}
                style={{
                  minWidth: 58,
                  paddingHorizontal: 13,
                  paddingVertical: 3,
                  borderRadius: 10,
                  backgroundColor: segment === itemIndex ? colors.primary : colors.wash,
                }}
              >
                <Text
                  style={[
                    type.arabic,
                    arabicText(25),
                    { color: segment === itemIndex ? '#fff' : colors.primary },
                  ]}
                >
                  {item.arabic}
                </Text>
              </Pressable>
            ))}
          </View>
          {selectedSegment && (
            <View accessibilityLiveRegion="polite" style={{ gap: 2 }}>
              <Paragraph>{selectedSegment.roleUrdu}</Paragraph>
              {selectedSegment.meaningUrdu ? (
                <Paragraph muted>{selectedSegment.meaningUrdu}</Paragraph>
              ) : null}
            </View>
          )}
        </Section>
        <Section title={ui.morphology}>
          <Paragraph>{word.morphologyUrdu}</Paragraph>
        </Section>
        <Section title={ui.syntax}>
          <Paragraph>{word.syntaxUrdu}</Paragraph>
        </Section>
        {rules.length > 0 && (
          <Section title={ui.rules}>
            {rules.map((rule) => (
              <RuleLink
                key={`${word.id}-${rule.id}`}
                rule={rule}
                onPress={() => router.push({ pathname: '/topic/[id]', params: { id: rule.id } })}
              />
            ))}
          </Section>
        )}
        {related.length > 0 && (
          <Section title={ui.relatedWords}>
            <View style={{ ...row, flexWrap: 'wrap' }}>
              {related.map((entry) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${quranText(entry, type.quranFont)}, ${ui.ayah} ${count(entry.ayah)}`}
                  key={entry.id}
                  onPress={() => router.setParams({ id: entry.id })}
                  style={{
                    backgroundColor: colors.wash,
                    borderRadius: 10,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                  }}
                >
                  <Text
                    style={[type.arabic, arabicText(24), { color: colors.primary }]}
                  >
                    {quranText(entry, type.quranFont)}
                  </Text>
                  <Label muted style={{ textAlign: 'center' }}>
                    {ui.ayah} {count(entry.ayah)}
                  </Label>
                </Pressable>
              ))}
            </View>
          </Section>
        )}
        <Action onPress={close}>{ui.backToStudy}</Action>
      </ScrollView>
    </>
  );
}

function RuleLink({ rule, onPress }: { rule: Rule; onPress: () => void }) {
  const { ui } = useInterface();
  const type = useTypography();
  // The row is laid out right-to-left for the Urdu title, so the chevron points left.
  // Rules open their full grammar topic screen instead of expanding inline.
  return (
    <Pressable
      testID={`rule-${rule.id}`}
      accessibilityRole="button"
      accessibilityLabel={rule.titleUrdu}
      accessibilityHint={ui.openTopic}
      onPress={onPress}
      style={({ pressed }) => ({
        ...row,
        minHeight: 52,
        justifyContent: 'space-between',
        gap: 12,
        borderTopWidth: 1,
        borderColor: colors.border,
        paddingVertical: 6,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <Text style={[type.body, { color: colors.primary, flex: 1 }]}>{rule.titleUrdu}</Text>
      <AppIcon name="chevronLeft" />
    </Pressable>
  );
}
