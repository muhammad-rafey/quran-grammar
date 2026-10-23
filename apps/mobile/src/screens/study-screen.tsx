import { useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Host, Switch } from '@expo/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  matchesWord,
  type Ayah,
  type PartOfSpeechFilter,
  type StudyData,
  type Word,
} from '@quran-grammar/core';
import { AppIcon } from '@/components/app-icon';
import { Action, DataStatus, InitialDataState, Label, Paragraph } from '@/components/study-ui';
import { useStudy } from '@/state/study-provider';
import { useInterface } from '@/state/preferences-provider';
import { card, colors, radius, row, spacing, type } from '@/theme/tokens';
import { FloatingNavigation, type StudyView } from './study-navigation';
import { StudyPicker, type BrowseMode, type PickerKind } from './study-picker';
import { QuickPractice } from './quick-practice';
import { Settings } from './study-settings';

export default function StudyScreen() {
  const { study } = useStudy();
  const { ui, count, labelStyle, controlRow, isUrdu } = useInterface();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scroll = useRef<ScrollView>(null);
  const ayahPositions = useRef<Record<number, number>>({});
  const [view, setView] = useState<StudyView>('words');
  const [mode, setMode] = useState<BrowseMode>('surah');
  const [browseMode, setBrowseMode] = useState<BrowseMode>('surah');
  const [picker, setPicker] = useState<PickerKind>(null);
  const [ayah, setAyah] = useState(1);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [pos, setPos] = useState<PartOfSpeechFilter>('all');
  const [showMeanings, setShowMeanings] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  if (!study) return <InitialDataState />;
  const filters: { value: PartOfSpeechFilter; label: string }[] = [
    { value: 'all', label: ui.allWords },
    { value: 'noun', label: ui.noun },
    { value: 'verb', label: ui.verb },
    { value: 'particle', label: ui.particle },
    { value: 'pronoun', label: ui.pronoun },
  ];
  const openWord = (id: string) => {
    setSelectedWord(id);
    router.push({ pathname: '/word/[id]', params: { id } });
  };
  const chooseAyah = (number: number) => {
    setPicker(null);
    setAyah(number);
    scroll.current?.scrollTo({
      y: Math.max(0, (ayahPositions.current[number] ?? 0) - spacing.sm),
      animated: true,
    });
  };
  const changeView = (next: StudyView) => {
    if (next === view) return;
    ayahPositions.current = {};
    setView(next);
    setAyah(1);
    scroll.current?.scrollTo({ y: 0, animated: false });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      <View
        style={{
          width: '100%',
          maxWidth: 860,
          alignSelf: 'center',
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: spacing.md,
        }}
      >
        {view === 'settings' ? (
          <Label style={{ fontSize: 24, fontWeight: '700', paddingVertical: spacing.md }}>
            {ui.settings}
          </Label>
        ) : (
          <View style={{ ...controlRow, alignItems: 'stretch', gap: spacing.sm }}>
            <Pressable
              testID="chapter-picker"
              accessibilityRole="button"
              accessibilityLabel={mode === 'surah' ? ui.selectSurah : ui.selectJuz}
              onPress={() => {
                setBrowseMode(mode);
                setPicker('chapter');
              }}
              style={({ pressed }) => ({
                ...controlRow,
                flex: 1,
                minHeight: 66,
                paddingHorizontal: spacing.md,
                gap: spacing.sm,
                borderRadius: radius.lg,
                borderWidth: 1,
                borderBottomWidth: pressed ? 1 : 3,
                borderColor: colors.border,
                backgroundColor: colors.paper,
              })}
            >
              <View style={{ flex: 1 }}>
                <Label muted style={{ fontSize: 11, lineHeight: 18 }}>
                  {mode === 'surah' ? ui.surah : `${ui.juz} ${count(1)} · ${ui.partialPreview}`}
                </Label>
                <Label style={{ fontSize: 18, fontWeight: '700' }}>{ui.surahTitle}</Label>
              </View>
              <AppIcon name="down" size={17} />
            </Pressable>
            <Pressable
              testID="ayah-picker"
              accessibilityRole="button"
              accessibilityLabel={`${ui.selectAyah}, ${ui.ayah} ${count(ayah)}`}
              onPress={() => setPicker('ayah')}
              style={({ pressed }) => ({
                ...controlRow,
                minHeight: 66,
                paddingHorizontal: spacing.md,
                gap: spacing.sm,
                borderRadius: radius.lg,
                backgroundColor: pressed ? colors.lime : colors.wash,
              })}
            >
              <View>
                <Label muted style={{ fontSize: 11, lineHeight: 18 }}>
                  {ui.ayah}
                </Label>
                <Label style={{ fontSize: 19, fontWeight: '700', textAlign: 'center' }}>
                  {count(ayah)}
                </Label>
              </View>
              <AppIcon name="down" size={17} />
            </Pressable>
            {view === 'words' && (
              <Pressable
                testID="filter-toggle"
                accessibilityRole="button"
                accessibilityLabel={ui.filters}
                accessibilityState={{ expanded: filtersOpen }}
                onPress={() => setFiltersOpen(!filtersOpen)}
                style={({ pressed }) => ({
                  width: 48,
                  minHeight: 66,
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: spacing.xs,
                  borderRadius: radius.lg,
                  backgroundColor:
                    filtersOpen || pos !== 'all' || !showMeanings
                      ? colors.lime
                      : pressed
                        ? colors.wash
                        : colors.paper,
                })}
              >
                <AppIcon name="filter" />
                {pos !== 'all' || !showMeanings ? (
                  <View
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: radius.pill,
                      backgroundColor: colors.primary,
                    }}
                  />
                ) : null}
              </Pressable>
            )}
          </View>
        )}
      </View>
      <ScrollView
        ref={scroll}
        testID="study-screen"
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={100}
        onScroll={(event) => {
          const offset = event.nativeEvent.contentOffset.y + 48;
          const visible = Object.entries(ayahPositions.current)
            .filter(([, y]) => y <= offset)
            .sort((a, b) => b[1] - a[1])[0];
          if (visible) setAyah(Number(visible[0]));
        }}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.xs,
          paddingBottom: Math.max(insets.bottom, 12) + 100,
          gap: spacing.lg,
          maxWidth: 860,
          width: '100%',
          alignSelf: 'center',
        }}
      >
        {view !== 'settings' && <DataStatus />}
        <View style={{ display: view === 'grammar' ? 'flex' : 'none' }}>
          <QuickPractice onWord={openWord} />
        </View>
        {view === 'words' ? (
          <>
            {filtersOpen && (
              <View
                style={{ ...card, backgroundColor: colors.mint, gap: spacing.md }}
                testID="filter-panel"
              >
                <Label style={{ fontWeight: '600' }}>{ui.wordType}</Label>
                <View style={{ ...controlRow, flexWrap: 'wrap', gap: spacing.sm }}>
                  {filters.map((filter) => (
                    <Pressable
                      key={filter.value}
                      testID={`filter-${filter.value}`}
                      accessibilityRole="button"
                      accessibilityState={{ selected: pos === filter.value }}
                      onPress={() => setPos(filter.value)}
                      style={({ pressed }) => ({
                        minHeight: 44,
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.sm,
                        justifyContent: 'center',
                        borderRadius: radius.pill,
                        backgroundColor: pos === filter.value ? colors.primary : colors.paper,
                        opacity: pressed ? 0.7 : 1,
                      })}
                    >
                      <Text
                        style={[
                          labelStyle,
                          { fontSize: 14, color: pos === filter.value ? colors.white : colors.ink },
                        ]}
                      >
                        {filter.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <Host
                  matchContents
                  colorScheme="light"
                  layoutDirection={isUrdu ? 'rightToLeft' : 'leftToRight'}
                  seedColor={colors.primary}
                >
                  <Switch
                    testID="meaning-toggle"
                    label={ui.wordMeanings}
                    value={showMeanings}
                    onValueChange={setShowMeanings}
                  />
                </Host>
                <Action
                  quiet
                  onPress={() => {
                    setPos('all');
                    setShowMeanings(true);
                  }}
                >
                  {ui.reset}
                </Action>
              </View>
            )}
            {study.ayahs.map((item) => (
              <View
                key={item.number}
                onLayout={(event) => {
                  ayahPositions.current[item.number] = event.nativeEvent.layout.y;
                }}
                style={{ ...card, gap: spacing.md }}
                testID={`ayah-${item.number}`}
              >
                <AyahLabel number={item.number} />
                <View style={{ ...row, flexWrap: 'wrap', alignItems: 'stretch', gap: spacing.sm }}>
                  {study.words
                    .filter((word) => word.ayah === item.number)
                    .map((word) => (
                      <WordToken
                        key={word.id}
                        word={word}
                        selected={word.id === selectedWord}
                        matched={matchesWord(word, study, '', pos)}
                        showMeaning={showMeanings}
                        onPress={() => openWord(word.id)}
                      />
                    ))}
                </View>
                <View
                  style={{ borderTopWidth: 1, borderColor: colors.border, paddingTop: spacing.md }}
                >
                  <Paragraph>{item.translationUrdu}</Paragraph>
                </View>
              </View>
            ))}
          </>
        ) : view === 'grammar' ? (
          <>
            {study.ayahs.map((item) => (
              <View
                key={item.number}
                onLayout={(event) => {
                  ayahPositions.current[item.number] = event.nativeEvent.layout.y;
                }}
              >
                <GrammarAyah ayah={item} study={study} onWord={openWord} />
              </View>
            ))}
          </>
        ) : (
          <Settings />
        )}
      </ScrollView>
      <FloatingNavigation value={view} onChange={changeView} />
      <StudyPicker
        kind={picker}
        mode={browseMode}
        ayah={ayah}
        onMode={setBrowseMode}
        onClose={() => setPicker(null)}
        onChoose={(number) => {
          if (picker === 'chapter') setMode(browseMode);
          chooseAyah(number);
        }}
      />
    </View>
  );
}

function AyahLabel({ number }: { number: number }) {
  const { ui, count, controlRow } = useInterface();
  return (
    <View style={{ ...controlRow, gap: spacing.sm }}>
      <View
        style={{
          width: 30,
          height: 30,
          borderRadius: radius.sm,
          backgroundColor: colors.wash,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Label style={{ fontSize: 13, fontWeight: '700' }}>{count(number)}</Label>
      </View>
      <Label muted style={{ fontSize: 12 }}>
        {ui.ayah}
      </Label>
    </View>
  );
}

function GrammarAyah({
  ayah,
  study,
  onWord,
}: {
  ayah: Ayah;
  study: StudyData;
  onWord: (id: string) => void;
}) {
  const { ui } = useInterface();
  return (
    <View style={{ ...card, gap: spacing.lg }}>
      <AyahLabel number={ayah.number} />
      <Text selectable style={type.arabic}>
        {study.words
          .filter((word) => word.ayah === ayah.number)
          .map((word) => word.arabic)
          .join(' ')}
      </Text>
      <Paragraph>{ayah.translationUrdu}</Paragraph>
      {ayah.phrases.map((phrase) => (
        <View
          key={phrase.id}
          style={{
            backgroundColor: colors.mint,
            borderRadius: radius.md,
            padding: spacing.md,
            gap: spacing.sm,
          }}
        >
          <Text style={[type.body, { color: colors.primary }]}>{phrase.labelUrdu}</Text>
          <View style={{ ...row, flexWrap: 'wrap' }}>
            {phrase.wordIds.map((id) => {
              const word = study.words.find((entry) => entry.id === id);
              return word ? (
                <Pressable
                  key={id}
                  accessibilityRole="button"
                  accessibilityLabel={`${word.arabic}, ${ui.wordStudy}`}
                  onPress={() => onWord(id)}
                  style={({ pressed }) => ({
                    minHeight: 48,
                    paddingHorizontal: spacing.sm,
                    opacity: pressed ? 0.6 : 1,
                  })}
                >
                  <Text
                    style={[type.arabic, { fontSize: 24, lineHeight: 56, color: colors.primary }]}
                  >
                    {word.arabic}
                  </Text>
                </Pressable>
              ) : null;
            })}
          </View>
          <Paragraph>{phrase.explanationUrdu}</Paragraph>
        </View>
      ))}
      <Label style={{ fontWeight: '600' }}>{ui.conciseMeaning}</Label>
      <Paragraph>{ayah.tafsirUrdu}</Paragraph>
    </View>
  );
}

function WordToken({
  word,
  matched,
  selected,
  showMeaning,
  onPress,
}: {
  word: Word;
  matched: boolean;
  selected: boolean;
  showMeaning: boolean;
  onPress: () => void;
}) {
  const { ui } = useInterface();
  const color =
    word.pos === 'verb' ? colors.blue : word.pos === 'particle' ? colors.amber : colors.primary;
  const wash =
    word.pos === 'verb'
      ? colors.blueWash
      : word.pos === 'particle'
        ? colors.amberWash
        : colors.wash;
  return (
    <Pressable
      testID={`word-${word.id}`}
      accessibilityRole="button"
      accessibilityLabel={`${word.arabic}, ${word.meaningUrdu}, ${word.posUrdu}, ${ui.wordStudy}`}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        minWidth: 84,
        maxWidth: '100%',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.md,
        borderWidth: selected ? 2 : 1,
        borderBottomWidth: pressed ? 1 : 4,
        borderColor: selected ? colors.primary : colors.border,
        backgroundColor: selected || pressed ? colors.wash : colors.paper,
        opacity: matched ? 1 : 0.35,
        alignItems: 'center',
        gap: spacing.xs,
      })}
    >
      <Text style={[type.arabic, { textAlign: 'center' }]}>{word.arabic}</Text>
      {showMeaning && (
        <Text style={[type.small, { color: colors.ink, textAlign: 'center', maxWidth: 180 }]}>
          {word.meaningUrdu}
        </Text>
      )}
      <View
        style={{
          paddingHorizontal: spacing.sm,
          paddingVertical: 2,
          borderRadius: radius.sm,
          backgroundColor: wash,
          maxWidth: 180,
        }}
      >
        <Text style={[type.small, { fontSize: 13, lineHeight: 22, color, textAlign: 'center' }]}>
          {word.posUrdu}
        </Text>
      </View>
    </Pressable>
  );
}
