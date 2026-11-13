import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Host, Switch } from '@expo/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  matchesWord,
  isStudyDraft,
  getJuzForAyah,
  getSurahTitle,
  juzCatalog,
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
import { AyahScroll } from './ayah-scroll';

export default function StudyScreen() {
  const { study, selectedSurah, selectSurah } = useStudy();
  const { ui, count, language, labelStyle, controlRow, isUrdu } = useInterface();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scroll = useRef<ScrollView>(null);
  const [view, setView] = useState<StudyView>('words');
  const [mode, setMode] = useState<BrowseMode>('surah');
  const [browseMode, setBrowseMode] = useState<BrowseMode>('surah');
  const [picker, setPicker] = useState<PickerKind>(null);
  const [ayahSelection, setAyahSelection] = useState({ surah: selectedSurah, number: 1 });
  const ayah = ayahSelection.surah === selectedSurah ? ayahSelection.number : 1;
  const setAyah = (number: number) => setAyahSelection({ surah: selectedSurah, number });
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [pos, setPos] = useState<PartOfSpeechFilter>('all');
  const [showMeanings, setShowMeanings] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const requestedAyah = useRef({ surah: selectedSurah, number: 1 });
  const surface = useMemo(
    () => ({
      navigation: new AyahScroll(
        requestedAyah.current.surah === selectedSurah ? requestedAyah.current.number : 1,
      ),
      frame: null as number | null,
      retry: false,
    }),
    [selectedSurah, view],
  );
  const activeSurface = useRef<typeof surface | null>(null);
  useLayoutEffect(() => {
    surface.navigation.activate();
    activeSurface.current = surface;
    return () => {
      surface.navigation.deactivate();
      if (surface.frame !== null) cancelAnimationFrame(surface.frame);
      surface.frame = null;
      if (activeSurface.current === surface) activeSurface.current = null;
    };
  }, [surface]);
  const applyPendingJump = useCallback(
    (retry = false) => {
      if (activeSurface.current !== surface) return;
      surface.retry ||= retry;
      if (surface.frame !== null) return;
      // Content-size events describe native layout; issue the command after that commit.
      surface.frame = requestAnimationFrame(() => {
        surface.frame = null;
        if (activeSurface.current !== surface || !scroll.current) return;
        const y = surface.navigation.takeScroll(spacing.sm, surface.retry);
        surface.retry = false;
        if (y !== null) scroll.current.scrollTo({ y, animated: false });
      });
    },
    [surface],
  );
  const openWord = useCallback(
    (id: string) => {
      setSelectedWord(id);
      router.push({ pathname: '/word/[id]', params: { id } });
    },
    [router],
  );
  const recordAyahPosition = useCallback(
    (number: number, y: number, height: number) => {
      if (activeSurface.current !== surface) return;
      surface.navigation.recordAyah(number, y, height);
      applyPendingJump();
    },
    [surface, applyPendingJump],
  );
  // Long chapters render over a thousand words; keep scroll-driven ayah updates from re-rendering them.
  const wordAyahs = useMemo(() => {
    if (!study) return null;
    const wordsByAyah = new Map<number, Word[]>();
    for (const word of study.words) {
      const list = wordsByAyah.get(word.ayah);
      if (list) list.push(word);
      else wordsByAyah.set(word.ayah, [word]);
    }
    return study.ayahs.map((item) => (
      <View
        key={`${study.surah.number}:${item.number}`}
        onLayout={(event) => {
          const { y, height } = event.nativeEvent.layout;
          recordAyahPosition(item.number, y, height);
        }}
        style={{ ...card, gap: spacing.md }}
        testID={`ayah-${item.number}`}
      >
        <AyahLabel number={item.number} />
        <View style={{ ...row, flexWrap: 'wrap', alignItems: 'stretch', gap: spacing.sm }}>
          {(wordsByAyah.get(item.number) ?? []).map((word) => (
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
        <View style={{ borderTopWidth: 1, borderColor: colors.border, paddingTop: spacing.md }}>
          <Paragraph>{item.translationUrdu}</Paragraph>
        </View>
      </View>
    ));
  }, [study, selectedWord, pos, showMeanings, openWord, recordAyahPosition]);
  const grammarAyahs = useMemo(
    () =>
      study?.ayahs.map((item) => (
        <View
          key={`${study.surah.number}:${item.number}`}
          onLayout={(event) => {
            const { y, height } = event.nativeEvent.layout;
            recordAyahPosition(item.number, y, height);
          }}
        >
          <GrammarAyah ayah={item} study={study} onWord={openWord} />
        </View>
      )) ?? null,
    [study, openWord, recordAyahPosition],
  );
  if (!study) return <InitialDataState />;
  const currentJuz =
    getJuzForAyah(selectedSurah, ayah) ??
    juzCatalog.find((item) => item.surahNumbers.includes(selectedSurah));
  const filters: { value: PartOfSpeechFilter; label: string }[] = [
    { value: 'all', label: ui.allWords },
    { value: 'noun', label: ui.noun },
    { value: 'verb', label: ui.verb },
    { value: 'particle', label: ui.particle },
    { value: 'pronoun', label: ui.pronoun },
  ];
  const chooseAyah = (number: number) => {
    setPicker(null);
    setAyah(number);
    requestedAyah.current = { surah: selectedSurah, number };
    surface.navigation.request(number);
    applyPendingJump();
  };
  const changeView = (next: StudyView) => {
    if (next === view) return;
    requestedAyah.current = { surah: selectedSurah, number: 1 };
    activeSurface.current = null;
    setView(next);
    setAyah(1);
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
                  {mode === 'surah' || !currentJuz
                    ? ui.surah
                    : `${ui.juz} ${count(currentJuz.number)}${currentJuz.partial ? ` · ${ui.partialPreview}` : ''}`}
                </Label>
                <Label style={{ fontSize: 18, fontWeight: '700' }}>
                  {getSurahTitle(selectedSurah, language)}
                </Label>
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
        key={`${selectedSurah}:${view}`}
        ref={scroll}
        testID="study-screen"
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={100}
        onLayout={(event) => {
          if (activeSurface.current !== surface) return;
          surface.navigation.recordViewport(event.nativeEvent.layout.height);
          applyPendingJump();
        }}
        onContentSizeChange={(_, height) => {
          if (activeSurface.current !== surface) return;
          surface.navigation.recordContent(height);
          applyPendingJump();
        }}
        onScrollBeginDrag={() => {
          if (activeSurface.current === surface) surface.navigation.beginReading();
        }}
        onScroll={(event) => {
          if (activeSurface.current !== surface) return;
          const result = surface.navigation.observeScroll(
            event.nativeEvent.contentOffset.y,
            event.timeStamp,
          );
          if (result.retry) applyPendingJump(true);
          if (result.ayah !== null) setAyah(result.ayah);
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
        {view !== 'settings' && isStudyDraft(study.surah.number) && (
          <View
            testID="draft-notice"
            style={{ padding: spacing.md, borderRadius: radius.sm, backgroundColor: colors.amberWash }}
          >
            <Label style={{ color: colors.amber, fontSize: 14 }}>{ui.draftNotice}</Label>
          </View>
        )}
        {view !== 'settings' && <DataStatus />}
        {study.surah.number === 1 && (
          <View style={{ display: view === 'grammar' ? 'flex' : 'none' }}>
            <QuickPractice onWord={openWord} />
          </View>
        )}
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
            {wordAyahs}
          </>
        ) : view === 'grammar' ? (
          <>{grammarAyahs}</>
        ) : (
          <Settings />
        )}
      </ScrollView>
      <FloatingNavigation value={view} onChange={changeView} />
      <StudyPicker
        kind={picker}
        mode={browseMode}
        ayah={ayah}
        ayahCount={study.surah.ayahCount}
        surah={selectedSurah}
        onMode={setBrowseMode}
        onClose={() => setPicker(null)}
        onChooseAyah={chooseAyah}
        onChooseSurah={(number, startAyah) => {
          setMode(browseMode);
          setPicker(null);
          if (number === selectedSurah) {
            chooseAyah(startAyah);
            return;
          }
          requestedAyah.current = { surah: number, number: startAyah };
          activeSurface.current = null;
          setAyahSelection({ surah: number, number: startAyah });
          selectSurah(number);
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
