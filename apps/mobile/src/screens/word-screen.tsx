import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  availableSurahNumbers,
  getSurahTitle,
  getTranslationEdition,
  quranText,
  translationText,
  type Rule,
  type StudyData,
  type Word,
} from '@quran-grammar/core';
import { AppIcon } from '@/components/app-icon';
import { Action, InitialDataState, Label, Paragraph, Section } from '@/components/study-ui';
import { useInterface } from '@/state/preferences-provider';
import { useStudy, useSurahStudy } from '@/state/study-provider';
import { parseWordLocation } from '@/state/word-location';
import { cardStyle, lineEndSlack, quranWordSlack, row } from '@/theme/tokens';
import { themed, useTheme } from '@/theme/theme';
import { useTypography } from '@/theme/typography';

/** Words sharing a root shown before "Show all": a common root (اللہ) has ~290 in Al-Baqarah. */
const relatedPreview = 24;

export default function WordScreen() {
  const { id, preview, source } = useLocalSearchParams<{
    id: string;
    preview?: string;
    source?: string;
  }>();
  const { focusWord } = useStudy();
  const { ui } = useInterface();
  const router = useRouter();
  const location = parseWordLocation(id);
  // The Surah's words load asynchronously; the word itself is checked once that study arrives.
  const routeSurah =
    location && availableSurahNumbers.includes(location.surah) ? location.surah : null;
  // Words opened from a grammar topic or quiz are previews: they load their chapter on their own,
  // so returning never switches (or reloads) the study screen behind them. Other entries, such as
  // deep links, also select the chapter on the study screen and its ayah.
  const isPreview = preview === '1';
  // A word opened from a study card is already on screen there; the study list only follows once
  // the reader moves to another word (previous/next, the ayah, related words).
  const openedWith = useRef(source === 'study' ? id : null);
  const ayah = location?.ayah ?? null;
  useEffect(() => {
    if (routeSurah === null || ayah === null || isPreview || id === openedWith.current) return;
    focusWord(routeSurah, ayah, id);
  }, [routeSurah, ayah, id, isPreview, focusWord]);
  const chapter = useSurahStudy(routeSurah);
  const study = chapter.study;
  // A chain of word screens (deep links, words opened from words) closes back to the study
  // screen in one step; a preview returns to the topic or quiz that opened it.
  const close = () => {
    if (isPreview && router.canGoBack()) router.back();
    else router.dismissTo('/');
  };
  const closeLabel = isPreview ? ui.close : ui.backToStudy;
  if (routeSurah === null) return <NotFound onClose={close} label={closeLabel} />;
  if (!study || study.surah.number !== routeSurah) {
    return <InitialDataState state={chapter} />;
  }
  return <WordDetail study={study} id={id} onClose={close} closeLabel={closeLabel} />;
}

function NotFound({ onClose, label }: { onClose: () => void; label: string }) {
  const { ui } = useInterface();
  return (
    <View style={{ padding: 24, gap: 20 }}>
      <Label>{ui.notFound}</Label>
      <Action onPress={onClose}>{label}</Action>
    </View>
  );
}

function WordDetail({
  study,
  id,
  onClose,
  closeLabel,
}: {
  study: StudyData;
  id: string;
  onClose: () => void;
  closeLabel: string;
}) {
  const { ui, count, language, labelStyle, labelText, controlRow, translationId, isUrdu } =
    useInterface();
  const type = useTypography();
  const { colors } = useTheme();
  const card = cardStyle(colors);
  const styles = wordStyles(colors);
  const { arabicText } = type;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [segmentSelection, setSegmentSelection] = useState({ wordId: id, index: 0 });
  const segment = segmentSelection.wordId === id ? segmentSelection.index : 0;
  const [allRelatedFor, setAllRelatedFor] = useState<string | null>(null);

  // Words are stored in reading order, so one pass finds the word, its ayah and its root family;
  // Al-Baqarah has 6,116 words, so these are computed once per word rather than on every render.
  const details = useMemo(() => {
    const index = study.words.findIndex((entry) => entry.id === id);
    const word: Word | undefined = study.words[index];
    if (!word) return null;
    const ayahWords = study.words.filter((entry) => entry.ayah === word.ayah);
    const related = word.root
      ? study.words.filter((entry) => entry.root === word.root && entry.id !== word.id)
      : [];
    const rules = study.rules.filter((rule) => word.ruleIds.includes(rule.id));
    const ayah = study.ayahs.find((entry) => entry.number === word.ayah);
    return { index, word, ayahWords, related, rules, ayah };
  }, [study, id]);

  if (!details) return <NotFound onClose={onClose} label={closeLabel} />;
  const { index, word, ayahWords, related, rules } = details;
  const root = word.root ? study.roots[word.root] : undefined;
  const verb = study.verbForms[word.id];
  const selectedSegment = word.segments[segment] ?? word.segments[0];
  const openWord = (target: Word | undefined) => {
    if (target) router.setParams({ id: target.id });
  };
  const translation = translationText(details.ayah?.translations, translationId);
  const edition = getTranslationEdition(translationId);
  const showAllRelated = allRelatedFor === word.id;
  const shownRelated = showAllRelated ? related : related.slice(0, relatedPreview);
  const reference = `${getSurahTitle(study.surah.number, language)} · ${ui.ayah} ${count(word.ayah)}`;

  return (
    <>
      <Stack.Screen
        options={{
          title: `${ui.ayah} ${count(word.ayah)} · ${ui.word} ${count(word.position)}`,
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={closeLabel}
              onPress={onClose}
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
          {/* Stretched to the card, with Android's Quran-word slack: a shrink-wrapped centred
              word lost letters to its trailing waqf signs (see quranWordSlack). */}
          <Text
            selectable
            accessibilityRole="header"
            style={[type.arabic, arabicText(46), { textAlign: 'center', alignSelf: 'stretch' }]}
          >
            {quranText(word, type.quranFont)}
            {quranWordSlack}
          </Text>
          {word.meaningUrdu ? (
            <Paragraph style={{ ...type.urduText(22, 38), textAlign: 'center' }}>
              {word.meaningUrdu}
            </Paragraph>
          ) : null}
          <View
            style={{
              paddingHorizontal: 14,
              paddingVertical: 4,
              borderRadius: 8,
              backgroundColor: colors.wash,
            }}
          >
            <Text style={[type.small, { color: colors.primary }]}>
              {word.posUrdu}
              {lineEndSlack}
            </Text>
          </View>
        </View>
        <View style={{ ...controlRow, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <Action
            quiet
            disabled={index === 0}
            onPress={() => openWord(study.words[index - 1])}
            label={`${ui.previous} ${ui.word}`}
          >
            {ui.previous}
          </Action>
          <Label muted>
            {count(index + 1)} / {count(study.words.length)}
          </Label>
          <Action
            quiet
            disabled={index === study.words.length - 1}
            onPress={() => openWord(study.words[index + 1])}
            label={`${ui.next} ${ui.word}`}
          >
            {ui.next}
          </Action>
        </View>
        {/* The word in its ayah: every word can be opened, the studied one is highlighted. */}
        <View style={card} testID="word-context">
          <Text accessibilityRole="header" style={[labelText(18), { fontWeight: '600' }]}>
            {ui.wordInAyah}
            {lineEndSlack}
          </Text>
          <Label muted>{reference}</Label>
          <Text selectable style={[type.arabic, arabicText(26)]}>
            {ayahWords.map((entry, entryIndex) => (
              <Fragment key={entry.id}>
                {entryIndex > 0 ? ' ' : null}
                <Text
                  testID={`context-${entry.id}`}
                  onPress={entry.id === word.id ? undefined : () => openWord(entry)}
                  style={entry.id === word.id ? styles.contextWord : undefined}
                >
                  {quranText(entry, type.quranFont)}
                </Text>
              </Fragment>
            ))}
          </Text>
          {translation ? (
            <View style={{ gap: 2 }}>
              <Paragraph muted>{translation}</Paragraph>
              <Label muted style={{ fontSize: 12, textAlign: 'right' }}>
                {`${ui.translator}: ${isUrdu ? edition.nameUrdu : edition.nameEnglish}`}
              </Label>
            </View>
          ) : null}
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
          {word.lemma ? (
            <View style={{ gap: 4 }}>
              <Label muted>{ui.headword}</Label>
              {/* The Corpus lemma is Quranic Arabic (Uthmani), not Urdu. */}
              <Text selectable style={[type.arabic, arabicText(26)]}>
                {word.lemma}
              </Text>
            </View>
          ) : null}
          {word.dictionaryUrdu ? <Paragraph>{word.dictionaryUrdu}</Paragraph> : null}
        </Section>
        {verb && (
          <Section title={ui.verbForm}>
            {verb.baabUrdu ? (
              <Text selectable style={[type.heading, { color: colors.primary }]}>
                {verb.baabUrdu}
              </Text>
            ) : null}
            {verb.formUrdu ? <Paragraph muted>{verb.formUrdu}</Paragraph> : null}
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
                  minHeight: 44,
                  justifyContent: 'center',
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
                    {
                      textAlign: 'center',
                      color: segment === itemIndex ? colors.onPrimary : colors.primary,
                    },
                  ]}
                >
                  {item.arabic}
                  {quranWordSlack}
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
        {word.morphologyUrdu ? (
          <Section title={ui.morphology}>
            <Paragraph>{word.morphologyUrdu}</Paragraph>
          </Section>
        ) : null}
        {word.syntaxUrdu ? (
          <Section title={ui.syntax}>
            <Paragraph>{word.syntaxUrdu}</Paragraph>
          </Section>
        ) : null}
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
          <Section title={`${ui.relatedWords} · ${count(related.length)}`}>
            <View style={{ ...row, flexWrap: 'wrap' }}>
              {shownRelated.map((entry) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${quranText(entry, type.quranFont)}, ${ui.ayah} ${count(entry.ayah)}`}
                  key={entry.id}
                  onPress={() => openWord(entry)}
                  style={({ pressed }) => ({
                    minHeight: 44,
                    backgroundColor: pressed ? colors.lime : colors.wash,
                    borderRadius: 10,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                  })}
                >
                  <Text
                    style={[
                      type.arabic,
                      arabicText(24),
                      { color: colors.primary, textAlign: 'center' },
                    ]}
                  >
                    {quranText(entry, type.quranFont)}
                    {quranWordSlack}
                  </Text>
                  <Label muted style={{ textAlign: 'center' }}>
                    {ui.ayah} {count(entry.ayah)}
                  </Label>
                </Pressable>
              ))}
            </View>
            {related.length > shownRelated.length ? (
              <Action quiet onPress={() => setAllRelatedFor(word.id)} testID="related-show-all">
                {`${ui.showAll} · ${count(related.length)}`}
              </Action>
            ) : null}
          </Section>
        )}
        <Action onPress={onClose}>{closeLabel}</Action>
      </ScrollView>
    </>
  );
}

const wordStyles = themed((colors) => ({
  contextWord: { color: colors.primary, backgroundColor: colors.lime },
}));

function RuleLink({ rule, onPress }: { rule: Rule; onPress: () => void }) {
  const { ui } = useInterface();
  const type = useTypography();
  const { colors } = useTheme();
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

