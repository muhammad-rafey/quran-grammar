import {
  Fragment,
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
} from 'react';
import {
  FlatList,
  Platform,
  type FlatListProps,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type TextLayoutEvent,
  type TextStyle,
  type ViewStyle,
  type ViewToken,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  formatCount,
  matchesWord,
  getJuzForAyah,
  getSurahTitle,
  juzCatalog,
  translationText,
  quranText,
  quranAyahEndGap,
  quranWordGap,
  type Ayah,
  type PartOfSpeechFilter,
  type StudyData,
  type UiLanguage,
  type Word,
} from '@quran-grammar/core';
import { AppIcon } from '@/components/app-icon';
import { Action, DataStatus, InitialDataState, Label, Paragraph } from '@/components/study-ui';
import { useStudy } from '@/state/study-provider';
import { useInterface } from '@/state/preferences-provider';
import { tabBackTarget } from '@/state/back-navigation';
import { useHardwareBack } from '@/state/use-back';
import { cardStyle, lineEndSlack, quranWordSlack, radius, row, spacing } from '@/theme/tokens';
import { themed, useTheme } from '@/theme/theme';
import { fontStyles, useTypography, type Typography } from '@/theme/typography';
import { FloatingNavigation, type StudyView } from './study-navigation';
import { StudyPicker, type BrowseMode, type PickerKind } from './study-picker';
import { PracticeGrammar } from './practice-grammar';
import { Settings, ToggleRow } from './study-settings';
import { AyahJump, topVisibleAyah, type AyahIndex } from './ayah-scroll';
import {
  ayahAtOffset,
  ayahLines,
  blockIndexOf,
  flowBlockText,
  groupFlowBlocks,
  unbrokenWord,
  type AyahLine,
  type FlowBlock,
} from './mushaf-flow';

type SelectedWord = { id: string; ayah: number };
/** Per-language strings and styles shared by every card; one object per language. */
type CardChrome = {
  language: UiLanguage;
  ayahLabel: string;
  wordStudy: string;
  controlRow: ViewStyle;
  fonts: StudyFonts;
  ayahNumberText: StyleProp<TextStyle>;
  ayahCaption: StyleProp<TextStyle>;
};

const isAndroid = Platform.OS === 'android';
const viewabilityConfig = { itemVisiblePercentThreshold: 1, minimumViewTime: 0 };
const jumpRetryDelay = 120;
// FlatList always renders its first `initialNumToRender` items, so a prepended chunk of the same
// size is rendered in the same commit: no estimated spacer ever sits above the visible ayah, which
// keeps Android's maintainVisibleContentPosition anchored on a real cell.
const prependChunk = 4;
// Continuous reading: each cell is a block of ~180 words (see mushaf-flow.ts).
const flowChunk = 2;
const prependThreshold = 1.5;
let listInstances = 0;
// Keeps the visible ayah in place when earlier ayahs are prepended above it.
const keepVisibleContent = { minIndexForVisible: 0 };

export default function StudyScreen() {
  const { study, selectedSurah, selectSurah, focus } = useStudy();
  const { ui, count, language, isUrdu, labelText, controlRow, readingLayout, translationId } =
    useInterface();
  const typography = useTypography();
  const { colors } = useTheme();
  const styles = studyStyles(colors);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [view, setView] = useState<StudyView>('words');
  const [practiceVisited, setPracticeVisited] = useState(false);
  const [mode, setMode] = useState<BrowseMode>('surah');
  const [browseMode, setBrowseMode] = useState<BrowseMode>('surah');
  const [picker, setPicker] = useState<PickerKind>(null);
  const [ayahSelection, setAyahSelection] = useState({ surah: selectedSurah, number: 1 });
  const ayah = ayahSelection.surah === selectedSurah ? ayahSelection.number : 1;
  const [selectedWord, setSelectedWord] = useState<SelectedWord | null>(null);
  const [pos, setPos] = useState<PartOfSpeechFilter>('all');
  const [showMeanings, setShowMeanings] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const grammar = readingLayout.grammar;
  const showTranslation = readingLayout.translation;
  // Grammar and translation off: the chapter reads as continuous text, like a printed mushaf.
  const flow = !grammar && !showTranslation;

  // Index once per chapter; the longest lessons have thousands of words.
  const wordsByAyah = useMemo(() => {
    const byAyah = new Map<number, Word[]>();
    for (const word of study?.words ?? []) {
      const entries = byAyah.get(word.ayah);
      if (entries) entries.push(word);
      else byAyah.set(word.ayah, [word]);
    }
    return byAyah;
  }, [study]);
  // Continuous reading lists blocks of whole ayahs instead of one cell per ayah.
  const blocks = useMemo(
    () =>
      study && flow
        ? groupFlowBlocks(study.ayahs, (number) => wordsByAyah.get(number)?.length ?? 0)
        : null,
    [study, flow, wordsByAyah],
  );
  const indexOf = useMemo<AyahIndex | undefined>(
    () => (blocks ? (number) => blockIndexOf(blocks, number) : undefined),
    [blocks],
  );

  // --- Ayah jumps on the virtualized list -------------------------------------------------
  const list = useRef<FlatList<ListItem>>(null);
  const [jump] = useState(() => new AyahJump());
  // Bumped to start a fresh list (slice) at a far ayah; see ayah-scroll.ts.
  const [generation, setGeneration] = useState(0);
  const jumpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const jumpFailed = useRef(false);
  const listSurah = study?.surah.number ?? null;
  const itemCount = blocks ? blocks.length : (study?.ayahs.length ?? 0);
  // A new list instance per Surah, reading layout, translation, fonts or text sizes (different
  // cell heights) and far jump.
  const { textSizes } = typography;
  const layoutKey = `${grammar ? 'grammar' : 'plain'}:${showTranslation ? `translation-${translationId}@${textSizes.translation}` : 'arabic'}:${typography.quranFont.id}@${textSizes.quran}:${typography.urduFont.id}`;
  // Unique per list instance (returning to a chapter must not reuse an old instance's slice).
  const listKey = useMemo(
    () => `${listSurah}:${layoutKey}:${generation}:${(listInstances += 1)}`,
    [study, layoutKey, generation], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const live = useRef({
    surah: listSurah,
    count: itemCount,
    view,
    ayah,
    listKey,
    start: 0,
    blocks,
    indexOf,
  });
  // Continuous reading: where each block cell sits in the list and where each of its ayahs starts
  // (the top of its line), both measured; used by ayah jumps and the current-ayah label.
  const flowLayout = useRef({
    cells: new Map<string, number>(),
    ayahTops: new Map<string, AyahLine[]>(),
    scrollY: 0,
    visible: [] as readonly FlowBlock[],
  });
  // Each list instance measures afresh (before its cells report their layout).
  useLayoutEffect(() => {
    flowLayout.current = {
      cells: new Map(),
      ayahTops: new Map(),
      scrollY: 0,
      visible: [],
    };
  }, [listKey]);
  const recordCell = useCallback((key: string, y: number) => {
    flowLayout.current.cells.set(key, y);
  }, []);
  const mountStart = useMemo(() => {
    if (listSurah === null) return 0;
    // A layout change keeps the reader's ayah; a Surah change already requested its start ayah.
    const { surah, ayah: current } = live.current;
    if (!jump.pendingFor(listSurah) && surah === listSurah && current > 1) {
      jump.request(listSurah, current);
    }
    return jump.mount(listSurah, itemCount, indexOf);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- computed once per list instance
  }, [listKey]);
  // Earlier ayahs are prepended in chunks as the reader scrolls up from a far start.
  const [prepended, setPrepended] = useState({ listKey, start: mountStart });
  const start = prepended.listKey === listKey ? prepended.start : mountStart;
  const data = useMemo<readonly ListItem[]>(() => {
    const items: readonly ListItem[] = blocks ?? study?.ayahs ?? [];
    return start > 0 ? items.slice(start) : items;
  }, [study, blocks, start]);
  useLayoutEffect(() => {
    live.current = {
      surah: listSurah,
      count: itemCount,
      view,
      ayah,
      listKey,
      start,
      blocks,
      indexOf,
    };
  });
  const clearJumpTimer = useCallback(() => {
    if (jumpTimer.current !== null) clearTimeout(jumpTimer.current);
    jumpTimer.current = null;
  }, []);
  // Continuous reading: after a jump the label keeps the chosen ayah (its line may start with the
  // previous ayah) until the reader scrolls.
  const flowFollowsReader = useRef(false);
  const runJump = useCallback(() => {
    clearJumpTimer();
    const { surah, count, view: currentView, start: sliceStart, blocks: flowBlocks } = live.current;
    const target = list.current;
    // A hidden list has no layout; the jump resumes when the Study tab is shown again.
    if (surah === null || !target || currentView !== 'words') return;
    const index = jump.sliceIndex(surah, count, sliceStart, live.current.indexOf);
    if (index === null) return;
    flowFollowsReader.current = false;
    if (index === 'remount') {
      setGeneration((value) => value + 1);
      return;
    }
    // In a flowing block the ayah can start lines below the block's top: scroll on to its line
    // once the block's text is laid out (onTextLayout runs the jump again).
    const block = flowBlocks?.[sliceStart + index];
    const position = block?.ayahs.indexOf(jump.targetAyah(surah) ?? 0) ?? -1;
    const tops = block && position > 0 ? flowLayout.current.ayahTops.get(block.key) : undefined;
    const awaitingLayout = !!block && position > 0 && !tops;
    const lineTop = tops?.[position]?.top ?? 0;
    if (index === 0 && lineTop === 0) {
      target.scrollToOffset({ offset: 0, animated: false });
      if (!awaitingLayout) jump.cancel();
      return;
    }
    jumpFailed.current = false;
    target.scrollToIndex({ index, animated: false, viewOffset: spacing.sm - lineTop });
    // onScrollToIndexFailed runs synchronously inside scrollToIndex and handles recovery.
    if (!jumpFailed.current && jump.succeeded(surah)) {
      jumpTimer.current = setTimeout(runJump, jumpRetryDelay);
    }
  }, [clearJumpTimer, jump]);
  const onScrollToIndexFailed = useCallback(() => {
    jumpFailed.current = true;
    const { surah } = live.current;
    if (surah !== null && jump.failed(surah) === 'remount') setGeneration((value) => value + 1);
  }, [jump]);
  // Prepend only once the reader scrolls: right after a jump the list sits exactly at its first
  // cell, and Android's maintainVisibleContentPosition anchors on the first view crossing the top.
  const readerScrolled = useRef<string | null>(null);
  const prependEarlier = useCallback(() => {
    const { listKey: key, start: sliceStart, blocks: flowBlocks } = live.current;
    if (sliceStart > 0 && readerScrolled.current === key) {
      const size = flowBlocks ? flowChunk : prependChunk;
      setPrepended({ listKey: key, start: Math.max(0, sliceStart - size) });
    }
  }, []);
  useEffect(() => clearJumpTimer, [clearJumpTimer]);
  // A word screen (deep link, or the reader moving to another word there) asks the study list to
  // show that word's ayah with the word selected. A different chapter's list mounts at the target.
  const appliedFocus = useRef(0);
  useEffect(() => {
    if (!focus || focus.seq === appliedFocus.current) return;
    appliedFocus.current = focus.seq;
    setSelectedWord(focus.wordId ? { id: focus.wordId, ayah: focus.ayah } : null);
    const { surah, ayah: current } = live.current;
    if (surah === focus.surah && current === focus.ayah) return;
    clearJumpTimer();
    jump.request(focus.surah, focus.ayah);
    setAyahSelection({ surah: focus.surah, number: focus.ayah });
    if (surah === focus.surah) runJump();
  }, [focus, jump, runJump, clearJumpTimer]);
  useEffect(() => {
    if (view === 'words') runJump();
  }, [view, runJump]);

  // Continuous reading: the current ayah is the one at the start of the line at the viewport top.
  const trackFlowAyah = useCallback(() => {
    const { surah, blocks: flowBlocks } = live.current;
    if (surah === null || !flowBlocks || !flowFollowsReader.current) return;
    if (jump.pendingFor(surah)) return;
    const measured = flowLayout.current;
    const y = measured.scrollY + spacing.sm + 2;
    let found: FlowBlock | undefined;
    let foundTop = 0;
    // Visible blocks only: cells scrolled out of the window keep stale offsets after a prepend.
    for (const block of measured.visible) {
      const top = measured.cells.get(block.key);
      if (top !== undefined && top <= y && (!found || top > foundTop)) {
        found = block;
        foundTop = top;
      }
    }
    if (!found) return;
    const number = ayahAtOffset(found.ayahs, measured.ayahTops.get(found.key), y - foundTop);
    if (number !== live.current.ayah) setAyahSelection({ surah, number });
  }, [jump]);
  // FlatList requires one onViewableItemsChanged per list instance; the list is keyed by Surah.
  const onViewableItemsChanged = useMemo(() => {
    const surah = listSurah;
    return ({ viewableItems }: { viewableItems: ViewToken<ListItem>[] }) => {
      if (surah === null || live.current.surah !== surah) return;
      if (live.current.blocks) {
        const visible = viewableItems
          .filter((entry) => entry.isViewable)
          .map((entry) => entry.item)
          .filter(isFlowBlock);
        if (visible.length > 0) flowLayout.current.visible = visible;
        trackFlowAyah();
        return;
      }
      if (jump.pendingFor(surah)) return;
      const top = topVisibleAyah(viewableItems as ViewToken<Ayah>[]);
      if (top !== null && top !== live.current.ayah) setAyahSelection({ surah, number: top });
    };
  }, [listSurah, jump, trackFlowAyah]);
  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      flowLayout.current.scrollY = event.nativeEvent.contentOffset.y;
      trackFlowAyah();
    },
    [trackFlowAyah],
  );
  // A block's text was laid out: remember where its ayahs start, and finish a jump into it.
  const onFlowTops = useCallback(
    (key: string, ayahs: readonly number[], tops: AyahLine[]) => {
      flowLayout.current.ayahTops.set(key, tops);
      const { surah } = live.current;
      const target = surah === null ? null : jump.targetAyah(surah);
      if (target !== null && ayahs.includes(target)) runJump();
    },
    [jump, runJump],
  );
  const onScrollBeginDrag = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      readerScrolled.current = live.current.listKey;
      flowFollowsReader.current = true;
      jump.cancel();
      clearJumpTimer();
      // At the top of a slice there are no scroll events (and so no onStartReached) to come.
      const { contentOffset, layoutMeasurement } = event.nativeEvent;
      if (contentOffset.y < layoutMeasurement.height * prependThreshold) prependEarlier();
    },
    [jump, clearJumpTimer, prependEarlier],
  );

  // --- Cards ---------------------------------------------------------------------------------
  const openWord = useCallback(
    (word: Word) => {
      setSelectedWord({ id: word.id, ayah: word.ayah });
      router.push({ pathname: '/word/[id]', params: { id: word.id, source: 'study' } });
    },
    [router],
  );
  const chrome = useMemo<CardChrome>(() => {
    return {
      language,
      ayahLabel: ui.ayah,
      wordStudy: ui.wordStudy,
      controlRow,
      fonts: fontStyles(typography, studyFonts),
      ayahNumberText: [labelText(13), styles.ayahNumberText],
      ayahCaption: [labelText(12), styles.ayahCaption],
    };
  }, [language, ui, labelText, controlRow, typography, styles]);
  const selectedId = selectedWord?.id ?? null;
  const selectedAyah = selectedWord?.ayah ?? null;
  const renderItem = useCallback<ListRenderItem<ListItem>>(
    ({ item }) =>
      !study ? null : isFlowBlock(item) ? (
        <FlowBlockText
          block={item}
          wordsByAyah={wordsByAyah}
          selectedId={
            selectedAyah !== null && item.ayahs.includes(selectedAyah) ? selectedId : null
          }
          chrome={chrome}
          onOpen={openWord}
          onTops={onFlowTops}
        />
      ) : (
        <AyahCard
          ayah={item}
          words={wordsByAyah.get(item.number) ?? noWords}
          study={study}
          // Only the card holding the selected word re-renders when the selection changes.
          selectedId={selectedAyah === item.number ? selectedId : null}
          pos={pos}
          showMeanings={showMeanings}
          showTranslation={showTranslation}
          translationId={translationId}
          grammar={grammar}
          chrome={chrome}
          onOpen={openWord}
        />
      ),
    [
      study,
      onFlowTops,
      wordsByAyah,
      selectedAyah,
      selectedId,
      pos,
      showMeanings,
      showTranslation,
      translationId,
      grammar,
      chrome,
      openWord,
    ],
  );

  const filters = useMemo<{ value: PartOfSpeechFilter; label: string }[]>(
    () => [
      { value: 'all', label: ui.allWords },
      { value: 'noun', label: ui.noun },
      { value: 'verb', label: ui.verb },
      { value: 'particle', label: ui.particle },
      { value: 'pronoun', label: ui.pronoun },
    ],
    [ui],
  );
  const listHeader = useMemo(
    () => (
      <View style={styles.listHeader}>
        {/* Without a chapter, InitialDataState below already shows the loading or error state. */}
        {study ? <DataStatus /> : null}
        {grammar && filtersOpen && (
          <View style={styles.filterPanel} testID="filter-panel">
            <Label style={{ fontWeight: '600' }}>{ui.wordType}</Label>
            <View style={{ ...controlRow, flexWrap: 'wrap', gap: spacing.sm }}>
              {filters.map((filter) => (
                <Pressable
                  key={filter.value}
                  testID={`filter-${filter.value}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: pos === filter.value }}
                  onPress={() => setPos(filter.value)}
                  style={({ pressed }) => [
                    styles.filterChip,
                    pos === filter.value && styles.filterChipActive,
                    pressed && styles.pressedFade,
                  ]}
                >
                  <Text
                    style={[
                      labelText(14),
                      { color: pos === filter.value ? colors.onPrimary : colors.ink },
                    ]}
                  >
                    {filter.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <ToggleRow
              testID="meaning-toggle"
              label={ui.wordMeanings}
              value={showMeanings}
              onValueChange={setShowMeanings}
            />
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
      </View>
    ),
    [study, grammar, filtersOpen, ui, controlRow, filters, pos, labelText, showMeanings, styles, colors],
  );
  const listContent = useMemo(
    () => [styles.listContent, { paddingBottom: Math.max(insets.bottom, 12) + 100 }],
    [insets.bottom, styles],
  );

  // --- Header and navigation -------------------------------------------------------------
  const currentJuz =
    getJuzForAyah(selectedSurah, ayah) ??
    juzCatalog.find((item) => item.surahNumbers.includes(selectedSurah));
  const chooseAyah = (number: number) => {
    setPicker(null);
    setAyahSelection({ surah: selectedSurah, number });
    jump.request(selectedSurah, number);
    runJump();
  };
  const changeView = (next: StudyView) => {
    if (next === view) return;
    if (next === 'practice') setPracticeVisited(true);
    setPicker(null);
    setView(next);
  };
  // Android back on Practice Grammar or Settings returns to Study instead of closing the app;
  // pushed screens (topic, quiz, word) handle back themselves while they are focused.
  const backTab = tabBackTarget(view, 'words');
  const backToTab = useMemo(
    () =>
      backTab
        ? () => {
            setPicker(null);
            setView(backTab);
          }
        : null,
    [backTab],
  );
  useHardwareBack(backToTab);
  const filtersActive = pos !== 'all' || !showMeanings;
  // PracticeGrammar renders its own heading.
  const title = view === 'settings' ? ui.settings : null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      <View style={[styles.header, view === 'practice' && styles.hidden]}>
        {title !== null ? (
          <Label style={{ fontSize: 24, fontWeight: '700', paddingVertical: spacing.md }}>
            {title}
          </Label>
        ) : (
          <View style={{ ...controlRow, alignItems: 'stretch', gap: spacing.sm }}>
            {/* The rounded clip also rounds Android's keyboard-focus highlight, which is drawn over the
                whole pill when focus returns to it after a picker search submitted with a hardware
                Enter key (it was a grey square until the next touch). */}
            <View style={styles.chapterClip}>
              <Pressable
                testID="chapter-picker"
                accessibilityRole="button"
                accessibilityLabel={mode === 'surah' ? ui.selectSurah : ui.selectJuz}
                onPress={() => {
                  setBrowseMode(mode);
                  setPicker('chapter');
                }}
                style={({ pressed }) => [
                  controlRow,
                  styles.chapterButton,
                  { borderBottomWidth: pressed ? 1 : 3 },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Label muted style={{ fontSize: 11, lineHeight: 18 }}>
                    {mode === 'surah' || !currentJuz
                      ? ui.surah
                      : `${ui.juz} ${count(currentJuz.number)}`}
                  </Label>
                  <Label style={{ fontSize: 18, fontWeight: '700' }}>
                    {getSurahTitle(selectedSurah, language)}
                  </Label>
                </View>
                <AppIcon name="down" size={17} />
              </Pressable>
            </View>
            <Pressable
              testID="ayah-picker"
              accessibilityRole="button"
              accessibilityLabel={`${ui.selectAyah}, ${ui.ayah} ${count(ayah)}`}
              accessibilityState={{ disabled: !study }}
              disabled={!study}
              onPress={() => setPicker('ayah')}
              style={({ pressed }) => [
                controlRow,
                styles.ayahButton,
                { backgroundColor: pressed ? colors.lime : colors.wash },
              ]}
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
            {grammar && (
              <Pressable
                testID="filter-toggle"
                accessibilityRole="button"
                accessibilityLabel={ui.filters}
                accessibilityState={{ expanded: filtersOpen }}
                accessibilityValue={
                  filtersActive
                    ? { text: filters.find((filter) => filter.value === pos)?.label ?? '' }
                    : undefined
                }
                onPress={() => setFiltersOpen(!filtersOpen)}
                style={({ pressed }) => [
                  styles.filterButton,
                  {
                    backgroundColor:
                      filtersOpen || filtersActive
                        ? colors.lime
                        : pressed
                          ? colors.wash
                          : colors.paper,
                  },
                ]}
              >
                <AppIcon name="filter" />
                {filtersActive ? <View style={styles.filterDot} /> : null}
              </Pressable>
            )}
          </View>
        )}
      </View>
      {/* The study list stays mounted (but hidden) on other tabs so its position survives. */}
      <View style={[styles.fill, view !== 'words' && styles.hidden]}>
        {/* Above the list, not its header: the list keeps its visible ayah anchored while earlier
            ayahs are prepended, which would also hide a header that opens at the top. */}
        {listHeader}
        {study ? (
          <FlowCellLayouts.Provider value={recordCell}>
            <FlatList
              key={listKey}
              ref={list}
              testID="study-screen"
              data={data}
              renderItem={renderItem}
              keyExtractor={ayahKey}
              contentContainerStyle={listContent}
              contentInsetAdjustmentBehavior="automatic"
              keyboardShouldPersistTaps="handled"
              initialNumToRender={flow ? flowChunk : prependChunk}
              maxToRenderPerBatch={flow ? 1 : 3}
              updateCellsBatchingPeriod={60}
              windowSize={flow ? 5 : 7}
              CellRendererComponent={flow ? FlowCell : undefined}
              onScroll={flow ? onScroll : undefined}
              scrollEventThrottle={flow ? 100 : undefined}
              removeClippedSubviews={isAndroid}
              viewabilityConfig={viewabilityConfig}
              onViewableItemsChanged={onViewableItemsChanged}
              onScrollToIndexFailed={onScrollToIndexFailed}
              onStartReached={prependEarlier}
              onStartReachedThreshold={prependThreshold}
              maintainVisibleContentPosition={keepVisibleContent}
              onScrollBeginDrag={onScrollBeginDrag}
              onLayout={runJump}
            />
          </FlowCellLayouts.Provider>
        ) : (
          <InitialDataState />
        )}
      </View>
      {practiceVisited && (
        <ScrollView
          style={[styles.fill, view !== 'practice' && styles.hidden]}
          contentContainerStyle={listContent}
          keyboardShouldPersistTaps="handled"
        >
          <PracticeGrammar />
        </ScrollView>
      )}
      {view === 'settings' && (
        <ScrollView style={styles.fill} contentContainerStyle={listContent}>
          <Settings />
        </ScrollView>
      )}
      <FloatingNavigation value={view} onChange={changeView} />
      <StudyPicker
        kind={picker}
        mode={browseMode}
        ayah={ayah}
        ayahCount={study?.surah.ayahCount ?? 0}
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
          // Applied once that chapter's list is on screen; never to the chapter shown now.
          jump.request(number, startAyah);
          clearJumpTimer();
          setAyahSelection({ surah: number, number: startAyah });
          selectSurah(number);
        }}
      />
    </View>
  );
}

const noWords: readonly Word[] = [];
type ListItem = Ayah | FlowBlock;
const isFlowBlock = (item: ListItem): item is FlowBlock => 'ayahs' in item;
const ayahKey = (item: ListItem) => (isFlowBlock(item) ? item.key : String(item.number));

/** Records each flow cell's offset in the list (keyed by block), for the current-ayah label. */
const FlowCellLayouts = createContext<((key: string, y: number) => void) | null>(null);
type CellProps = ComponentProps<NonNullable<FlatListProps<ListItem>['CellRendererComponent']>>;
function FlowCell({ cellKey, item, index: _index, onLayout, ...props }: CellProps) {
  const record = useContext(FlowCellLayouts);
  const key = isFlowBlock(item) ? item.key : cellKey;
  return (
    <View
      {...props}
      onLayout={(event) => {
        record?.(key, event.nativeEvent.layout.y);
        onLayout?.(event);
      }}
    />
  );
}

type FlowTextProps = {
  ayahs: readonly number[];
  wordsOf: (ayah: number) => readonly Word[];
  selectedId: string | null;
  chrome: CardChrome;
  onOpen: (word: Word) => void;
  justify?: boolean;
  onTops?: (tops: AyahLine[]) => void;
};

/**
 * Running Quranic text: every word can be opened, and each ayah ends with its marker, kept on the
 * line of the ayah's last word by a no-break gap. IndoPak fonts get wider word gaps (see
 * quranWordGap) so pause marks do not overprint the next word.
 */
const FlowText = memo(function FlowText({
  ayahs,
  wordsOf,
  selectedId,
  chrome,
  onOpen,
  justify = false,
  onTops,
}: FlowTextProps) {
  const styles = studyStyles(useTheme().colors);
  const font = chrome.fonts.quranFont;
  const { pieces, starts } = useMemo(
    () =>
      flowBlockText(ayahs, wordsOf, (word) => unbrokenWord(quranText(word, font)), {
        word: (previous) => quranWordGap(previous, font),
        end: (lastWord) => quranAyahEndGap(lastWord, font),
        marker: (number) => `۝${formatCount(number, 'ur')}`,
      }),
    [ayahs, wordsOf, font],
  );
  const onTextLayout = useMemo(
    () =>
      onTops
        ? (event: TextLayoutEvent) => onTops(ayahLines(event.nativeEvent.lines, starts))
        : undefined,
    [onTops, starts],
  );
  return (
    <Text
      style={justify ? chrome.fonts.flowArabic : chrome.fonts.plainArabic}
      // Greedy line breaking (Android): the default breaker may plan a justified line slightly wider
      // than the box, counting on shrinking its spaces, and such RTL lines ran past the right edge
      // (seen with Al Qalam at 2:254-255). Greedy lines always fit; justification then stretches.
      textBreakStrategy="simple"
      onTextLayout={onTextLayout}
    >
      {pieces.map((piece) =>
        piece.kind === 'word' ? (
          <Fragment key={piece.word.id}>
            {piece.lead}
            <Text
              testID={`word-${piece.word.id}`}
              onPress={() => onOpen(piece.word)}
              style={piece.word.id === selectedId ? styles.plainSelected : undefined}
            >
              {piece.text}
            </Text>
          </Fragment>
        ) : (
          <Fragment key={`end-${piece.ayah}`}>
            {piece.lead}
            <Text testID={`ayah-end-${piece.ayah}`} style={styles.ayahEnd}>
              {piece.text}
            </Text>
          </Fragment>
        ),
      )}
    </Text>
  );
});

/** One cell of continuous reading: a block of whole ayahs as one justified text. */
const FlowBlockText = memo(function FlowBlockText({
  block,
  wordsByAyah,
  selectedId,
  chrome,
  onOpen,
  onTops,
}: {
  block: FlowBlock;
  wordsByAyah: ReadonlyMap<number, readonly Word[]>;
  selectedId: string | null;
  chrome: CardChrome;
  onOpen: (word: Word) => void;
  onTops: (key: string, ayahs: readonly number[], tops: AyahLine[]) => void;
}) {
  const wordsOf = useCallback((ayah: number) => wordsByAyah.get(ayah) ?? noWords, [wordsByAyah]);
  const reportTops = useCallback(
    (tops: AyahLine[]) => onTops(block.key, block.ayahs, tops),
    [onTops, block],
  );
  return (
    <View testID={`flow-block-${block.ayahs[0]}`}>
      <FlowText
        ayahs={block.ayahs}
        wordsOf={wordsOf}
        selectedId={selectedId}
        chrome={chrome}
        onOpen={onOpen}
        justify
        onTops={reportTops}
      />
    </View>
  );
});

type AyahCardProps = {
  ayah: Ayah;
  words: readonly Word[];
  study: StudyData;
  selectedId: string | null;
  pos: PartOfSpeechFilter;
  showMeanings: boolean;
  showTranslation: boolean;
  /** The selected ayah translation (shown when showTranslation and the ayah has its text). */
  translationId: string;
  grammar: boolean;
  chrome: CardChrome;
  onOpen: (word: Word) => void;
};

const AyahCard = memo(function AyahCard({
  ayah,
  words,
  study,
  selectedId,
  pos,
  showMeanings,
  showTranslation,
  translationId,
  grammar,
  chrome,
  onOpen,
}: AyahCardProps) {
  const styles = studyStyles(useTheme().colors);
  const translation = showTranslation ? translationText(ayah.translations, translationId) : '';
  const ayahs = useMemo(() => [ayah.number], [ayah.number]);
  const wordsOf = useCallback(() => words, [words]);
  if (!grammar) {
    return (
      <View style={styles.plainAyah} testID={`ayah-${ayah.number}`}>
        <FlowText
          ayahs={ayahs}
          wordsOf={wordsOf}
          selectedId={selectedId}
          chrome={chrome}
          onOpen={onOpen}
        />
        {!!translation && (
          <View style={styles.translationBody}>
            <Paragraph translation>{translation}</Paragraph>
          </View>
        )}
      </View>
    );
  }
  return (
    <View style={styles.ayahCard} testID={`ayah-${ayah.number}`}>
      <View style={[chrome.controlRow, { gap: spacing.sm }]}>
        <View style={styles.ayahNumber}>
          <Text style={chrome.ayahNumberText}>
            {formatCount(ayah.number, chrome.language)}
          </Text>
        </View>
        <Text style={chrome.ayahCaption}>{chrome.ayahLabel}</Text>
      </View>
      <View style={styles.wordRow}>
        {words.map((word) => (
          <WordToken
            key={word.id}
            word={word}
            selected={word.id === selectedId}
            matched={pos === 'all' || matchesWord(word, study, '', pos)}
            showMeaning={showMeanings}
            wordStudy={chrome.wordStudy}
            fonts={chrome.fonts}
            onOpen={onOpen}
          />
        ))}
      </View>
      {!!translation && (
        <View style={[styles.translation, styles.translationBody]}>
          <Paragraph translation>{translation}</Paragraph>
        </View>
      )}
    </View>
  );
});

const WordToken = memo(function WordToken({
  word,
  matched,
  selected,
  showMeaning,
  wordStudy,
  fonts,
  onOpen,
}: {
  word: Word;
  matched: boolean;
  selected: boolean;
  showMeaning: boolean;
  wordStudy: string;
  fonts: StudyFonts;
  onOpen: (word: Word) => void;
}) {
  const styles = studyStyles(useTheme().colors);
  const tone = word.pos === 'verb' ? fonts.verb : word.pos === 'particle' ? fonts.particle : fonts.noun;
  return (
    <Pressable
      testID={`word-${word.id}`}
      accessibilityRole="button"
      accessibilityLabel={[quranText(word, fonts.quranFont), word.meaningUrdu, word.posUrdu]
        .filter(Boolean)
        .join('، ')}
      accessibilityHint={wordStudy}
      accessibilityState={{ selected }}
      onPress={() => onOpen(word)}
      style={({ pressed }) => [
        styles.token,
        fonts.tokenSize,
        selected && styles.tokenSelected,
        pressed && styles.tokenPressed,
        !matched && styles.tokenDimmed,
      ]}
    >
      <Text style={fonts.tokenArabic}>
        {quranText(word, fonts.quranFont)}
        {quranWordSlack}
      </Text>
      {showMeaning && !!word.meaningUrdu && <Text style={fonts.tokenMeaning}>
          {word.meaningUrdu}
          {lineEndSlack}
        </Text>}
      {/* Stretch the label to the token: on Android a shrink-wrapped RTL label can be laid
          out wider than it was measured, which clipped its last word (e.g. 56:2:2). It sits at
          the bottom so blocks without a meaning line up with their neighbours. */}
      <View style={[tone.wash, styles.posLabel]}>
        <Text style={tone.text}>
          {word.posUrdu}
          {lineEndSlack}
        </Text>
      </View>
    </Pressable>
  );
});

const posLabel = {
  alignSelf: 'stretch',
  paddingHorizontal: spacing.sm,
  paddingVertical: 2,
  borderRadius: radius.sm,
} as const;

/** The study cards' font-dependent styles, built once per font pair (see fontStyles). */
function studyFonts(typography: Typography) {
  const { colors } = typography;
  const posText = { ...typography.small, ...typography.urduText(13, 22), textAlign: 'center' } as const;
  const tone = (backgroundColor: string, color: string) =>
    StyleSheet.create({
      wash: { ...posLabel, backgroundColor },
      text: { ...posText, color },
    });
  return {
    /** The Quran font in use: IndoPak fonts show the IndoPak text (see quranText). */
    quranFont: typography.quranFont,
    ...StyleSheet.create({
      // Above 100% a block may grow to the row width (a long word at 175% is wider than 208dp);
      // the meaning line keeps its own 180dp limit, so the block still wraps its label.
      tokenSize: typography.textSizes.quran > 1 ? { maxWidth: '100%' } : {},
      tokenArabic: { ...typography.arabic, textAlign: 'center' },
      tokenMeaning: { ...typography.small, color: colors.ink, textAlign: 'center', maxWidth: 180 },
      plainArabic: typography.arabic,
      // Justified like a printed mushaf (Android 8+ justifies between words; RTL keeps the last
      // line at the start).
      // Android: React Native lays a justified Text out with the paragraph's layout direction
      // (LTR in this app) against the RTL script and so aligns it ALIGN_OPPOSITE: lines that cannot
      // be stretched (a block's last line, one-word lines at large text sizes) sat at the left and
      // an overfull line overflowed (and was clipped) at the right. An RTL layout direction keeps
      // them at the start (right).
      flowArabic: {
        ...typography.arabic,
        textAlign: 'justify',
        ...(isAndroid ? { direction: 'rtl' } : null),
      },
    }),
    noun: tone(colors.wash, colors.primary),
    verb: tone(colors.blueWash, colors.blue),
    particle: tone(colors.amberWash, colors.amber),
  };
}
type StudyFonts = ReturnType<typeof studyFonts>;

const studyStyles = themed((colors) => StyleSheet.create({
  fill: { flex: 1 },
  hidden: { display: 'none' },
  header: {
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  chapterClip: { flex: 1, borderRadius: radius.lg, overflow: 'hidden' },
  chapterButton: {
    flex: 1,
    minHeight: 66,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.paper,
  },
  ayahButton: {
    minHeight: 66,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    borderRadius: radius.lg,
  },
  filterButton: {
    width: 48,
    minHeight: 66,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.lg,
  },
  filterDot: { width: 5, height: 5, borderRadius: radius.pill, backgroundColor: colors.primary },
  // No top padding: a jump puts its ayah exactly at offset 0 of the content (see onStartReached).
  listContent: {
    paddingHorizontal: spacing.lg,
    maxWidth: 860,
    width: '100%',
    alignSelf: 'center',
  },
  listHeader: {
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xs,
  },
  filterPanel: { ...cardStyle(colors), backgroundColor: colors.mint, gap: spacing.md, marginBottom: spacing.md },
  filterChip: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.paper,
  },
  filterChipActive: { backgroundColor: colors.primary },
  pressedFade: { opacity: 0.7 },
  // Cells carry their own spacing: a container gap would also space FlatList's spacer views.
  ayahCard: { ...cardStyle(colors), gap: spacing.md, marginBottom: spacing.lg },
  ayahNumber: {
    minWidth: 30,
    minHeight: 30,
    paddingHorizontal: 2,
    borderRadius: radius.sm,
    backgroundColor: colors.wash,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ayahNumberText: { fontWeight: '700', textAlign: 'center' },
  ayahCaption: { color: colors.muted },
  translationBody: { gap: 2 },
  posLabel: { marginTop: 'auto' },
  wordRow: { ...row, flexWrap: 'wrap', alignItems: 'stretch', gap: spacing.sm },
  translation: { borderTopWidth: 1, borderColor: colors.border, paddingTop: spacing.md },
  token: {
    minWidth: 84,
    // 180dp of label text plus padding; the widest Arabic word in the registry is ~125dp.
    maxWidth: 208,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderBottomWidth: 4,
    borderColor: colors.border,
    backgroundColor: colors.paper,
    alignItems: 'center',
    gap: spacing.xs,
  },
  tokenSelected: {
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: colors.primary,
    backgroundColor: colors.wash,
  },
  tokenPressed: { borderBottomWidth: 1, backgroundColor: colors.wash },
  tokenDimmed: { opacity: 0.35 },
  plainAyah: {
    paddingVertical: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  plainSelected: { color: colors.primary },
  ayahEnd: { color: colors.primary },
}));
