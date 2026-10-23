import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getStudy, type Rule } from '@quran-grammar/core';
import { Action, InitialDataState, Label, Paragraph, Section } from '@/components/study-ui';
import { useInterface } from '@/state/preferences-provider';
import { useStudy } from '@/state/study-provider';
import { parseWordLocation } from '@/state/word-location';
import { card, colors, row, type } from '@/theme/tokens';

export default function WordScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { study, selectSurah } = useStudy();
  const { ui, count, labelStyle, controlRow } = useInterface();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [segmentSelection, setSegmentSelection] = useState({ wordId: id, index: 0 });
  const segment = segmentSelection.wordId === id ? segmentSelection.index : 0;
  const location = parseWordLocation(id);
  const routeSurah =
    location && getStudy(location.surah)?.words.some((word) => word.id === id)
      ? location.surah
      : null;
  useEffect(() => {
    if (routeSurah !== null) selectSurah(routeSurah);
  }, [routeSurah, selectSurah]);
  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));
  if (routeSurah === null)
    return (
      <View style={{ padding: 24, gap: 20 }}>
        <Label>{ui.notFound}</Label>
        <Action onPress={close}>{ui.backToStudy}</Action>
      </View>
    );
  if (!study || study.surah.number !== routeSurah) {
    return <InitialDataState pending={Boolean(study && study.surah.number !== routeSurah)} />;
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
            style={[type.arabic, { fontSize: 46, lineHeight: 100, textAlign: 'center' }]}
          >
            {word.arabic}
          </Text>
          <Paragraph style={{ textAlign: 'center', fontSize: 22, lineHeight: 38 }}>
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
            <Text style={[type.small, { color: colors.primary }]}>{word.posUrdu}</Text>
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
                style={[type.arabic, { fontSize: 34, lineHeight: 64, color: colors.primary }]}
              >
                {word.root}
              </Text>
              <Paragraph>{root.meaningUrdu}</Paragraph>
              <Paragraph muted>{root.noteUrdu}</Paragraph>
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
          <Paragraph>{word.dictionaryUrdu}</Paragraph>
        </Section>
        {verb && (
          <Section title={ui.verbForm}>
            <Text selectable style={[type.heading, { color: colors.primary }]}>
              {verb.baabUrdu}
            </Text>
            <Paragraph muted>{verb.formUrdu}</Paragraph>
            <View style={{ ...row, flexWrap: 'wrap' }}>
              <View style={{ ...card, flexGrow: 1, backgroundColor: colors.wash }}>
                <Label muted>{ui.past}</Label>
                <Text selectable style={type.arabic}>
                  {verb.past}
                </Text>
              </View>
              <View style={{ ...card, flexGrow: 1, backgroundColor: colors.wash }}>
                <Label muted>{ui.present}</Label>
                <Text selectable style={type.arabic}>
                  {verb.present}
                </Text>
              </View>
            </View>
            <Label muted>{ui.pattern}</Label>
            <Text selectable style={[type.arabic, { fontSize: 26, lineHeight: 62 }]}>
              {verb.pattern}
            </Text>
            <Paragraph>{verb.noteUrdu}</Paragraph>
          </Section>
        )}
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
                    {
                      color: segment === itemIndex ? '#fff' : colors.primary,
                      fontSize: 25,
                      lineHeight: 58,
                    },
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
              <Paragraph muted>{selectedSegment.meaningUrdu}</Paragraph>
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
              <RuleDisclosure key={`${word.id}-${rule.id}`} rule={rule} />
            ))}
          </Section>
        )}
        {related.length > 0 && (
          <Section title={ui.relatedWords}>
            <View style={{ ...row, flexWrap: 'wrap' }}>
              {related.map((entry) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${entry.arabic}, ${ui.ayah} ${count(entry.ayah)}`}
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
                    style={[type.arabic, { fontSize: 24, lineHeight: 56, color: colors.primary }]}
                  >
                    {entry.arabic}
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

function RuleDisclosure({ rule }: { rule: Rule }) {
  const [open, setOpen] = useState(false);
  // Expo Go 57's SwiftUI disclosure did not lay out its body during device QA.
  // Keep this disclosure in the RN layout tree so all text stays reachable.
  return (
    <View style={{ borderTopWidth: 1, borderColor: colors.border, paddingTop: 6, gap: 8 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={rule.titleUrdu}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(!open)}
        style={{ ...row, minHeight: 48, justifyContent: 'space-between', gap: 12 }}
      >
        <Text style={[type.body, { color: colors.primary, flex: 1 }]}>{rule.titleUrdu}</Text>
        <Text style={{ color: colors.primary, fontSize: 24 }}>{open ? '−' : '+'}</Text>
      </Pressable>
      {open && (
        <View style={{ gap: 8, paddingBottom: 10 }}>
          <Paragraph>{rule.explanationUrdu}</Paragraph>
          <Paragraph muted>{rule.exampleUrdu}</Paragraph>
        </View>
      )}
    </View>
  );
}
