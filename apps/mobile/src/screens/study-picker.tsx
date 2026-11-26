import { useMemo, useRef, useState } from 'react';
import { BottomSheet, RNHostView } from '@expo/ui';
import { FlatList, Pressable, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  formatCount,
  getJuzForAyah,
  getJuzStartAyah,
  getSurahTitle,
  juzCatalog,
  searchSurahs,
  surahCatalog,
} from '@quran-grammar/core';
import { AppIcon } from '@/components/app-icon';
import { Label } from '@/components/study-ui';
import { useInterface } from '@/state/preferences-provider';
import { lineEndSlack, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/theme';
import { useTypography } from '@/theme/typography';

export type BrowseMode = 'surah' | 'juz';
export type PickerKind = 'chapter' | 'ayah' | null;
type PickerEntry = {
  number: number;
  title: string;
  /** Meaning and ayah count, the transliteration in Urdu, or a juz's chapters. */
  subtitle: string;
  /** The Arabic name beside an English title; empty when the title is already Arabic. */
  arabic: string;
} & (
  | { kind: 'surah'; parentJuz?: number; startAyah: number; jumpAyah?: number }
  | { kind: 'juz'; parentJuz?: never }
);

type StudyPickerProps = {
  kind: PickerKind;
  mode: BrowseMode;
  ayah: number;
  ayahCount: number;
  surah: number;
  onMode: (mode: BrowseMode) => void;
  onClose: () => void;
  onChooseAyah: (ayah: number) => void;
  /** startAyah is the chapter's first ayah inside the chosen juz, a searched ayah, or 1. */
  onChooseSurah: (surah: number, startAyah: number) => void;
};

export function StudyPicker(props: StudyPickerProps) {
  const { colors } = useTheme();
  return (
    <BottomSheet
      isPresented={props.kind !== null}
      onDismiss={props.onClose}
      snapPoints={['full']}
      containerColor={colors.background}
      contentPadding={0}
      testID="lesson-picker"
    >
      <PickerContent key={`${props.kind}-${props.surah}`} {...props} />
    </BottomSheet>
  );
}

/** Latin typed in the Urdu interface reads left to right, Arabic script right to left. */
function queryIsRtl(query: string, fallback: boolean): boolean {
  const first = /[a-zÀ-ɏ]|[؀-ۿ]/i.exec(query)?.[0];
  return first ? /[؀-ۿ]/.test(first) : fallback;
}

function PickerContent({
  kind,
  mode,
  ayah,
  ayahCount,
  surah,
  onMode,
  onClose,
  onChooseAyah,
  onChooseSurah,
}: StudyPickerProps) {
  const { ui, count, isUrdu, language, labelStyle, labelText, controlRow } = useInterface();
  const { colors, scheme } = useTheme();
  const typography = useTypography();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  // The native sheet sizes the host; fill it so the list never stops short of the sheet edge.
  const [hostHeight, setHostHeight] = useState(0);
  const [query, setQuery] = useState('');
  const listRef = useRef<FlatList<PickerEntry>>(null);
  const selectedJuz = (
    getJuzForAyah(surah, ayah) ?? juzCatalog.find((item) => item.surahNumbers.includes(surah))
  )?.number;
  const [expandedJuz, setExpandedJuz] = useState<number | undefined>(selectedJuz);
  const searching = mode === 'surah' && query.trim() !== '';
  const results = useMemo(() => searchSurahs(mode === 'surah' ? query : ''), [mode, query]);
  const entries = useMemo((): PickerEntry[] => {
    const surahEntry = (
      number: number,
      detail: string | undefined,
      startAyah: number,
      extra: { parentJuz?: number; jumpAyah?: number } = {},
    ): PickerEntry => {
      const item = surahCatalog[number - 1]!;
      const ayahs = detail ?? `${count(item.ayahCount)} ${ui.ayahs}`;
      return {
        kind: 'surah',
        number,
        title: getSurahTitle(number, language),
        subtitle: isUrdu ? `${item.nameEnglish} · ${ayahs}` : `${item.meaningEnglish} · ${ayahs}`,
        arabic: isUrdu ? '' : item.nameArabic,
        startAyah,
        ...extra,
      };
    };
    if (kind === 'ayah') return [];
    if (mode === 'surah')
      return results.map((result) =>
        surahEntry(result.surah.number, undefined, result.ayah ?? 1, { jumpAyah: result.ayah }),
      );
    return juzCatalog.flatMap((item): PickerEntry[] => {
      const names = item.surahNumbers.map((number) => getSurahTitle(number, language));
      return [
        {
          kind: 'juz',
          number: item.number,
          title: `${ui.juz} ${count(item.number)}`,
          subtitle: names.length > 2 ? `${names[0]} – ${names.at(-1)}` : names.join(' · '),
          arabic: '',
        },
        ...(expandedJuz === item.number
          ? item.ranges.map((range) =>
              surahEntry(
                range.surah,
                `${ui.ayahRange} ${count(range.firstAyah)}–${count(range.lastAyah)}`,
                getJuzStartAyah(item.number, range.surah),
                { parentJuz: item.number },
              ),
            )
          : []),
      ];
    });
  }, [kind, mode, results, expandedJuz, isUrdu, language, ui, count]);
  const changeQuery = (value: string) => {
    setQuery(value);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  };
  const rtlQuery = queryIsRtl(query, isUrdu);

  return (
    <RNHostView onLayout={(event) => setHostHeight(event.nativeEvent.layout.height)}>
      <View
        style={{
          height: hostHeight > 0 ? hostHeight : height * 0.8,
          paddingHorizontal: spacing.xl,
          paddingTop: spacing.lg,
        }}
      >
        <View
          style={{
            ...controlRow,
            justifyContent: 'space-between',
            gap: spacing.md,
            paddingBottom: spacing.lg,
          }}
        >
          <Label style={{ fontSize: 22, fontWeight: '700' }}>
            {kind === 'ayah' ? ui.selectAyah : mode === 'surah' ? ui.selectSurah : ui.selectJuz}
          </Label>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={ui.close}
            onPress={onClose}
            testID="picker-close"
            style={{
              width: 48,
              height: 48,
              borderRadius: radius.pill,
              backgroundColor: colors.wash,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppIcon name="close" />
          </Pressable>
        </View>
        {kind === 'chapter' && (
          <View
            style={{
              ...controlRow,
              borderRadius: radius.pill,
              backgroundColor: colors.wash,
              padding: spacing.xs,
              marginBottom: spacing.lg,
            }}
          >
            {(['surah', 'juz'] as const).map((item) => (
              <Pressable
                key={item}
                testID={`browse-${item}`}
                accessibilityRole="tab"
                accessibilityState={{ selected: mode === item }}
                onPress={() => {
                  changeQuery('');
                  onMode(item);
                }}
                style={({ pressed }) => ({
                  flex: 1,
                  minHeight: 48,
                  justifyContent: 'center',
                  borderRadius: radius.pill,
                  backgroundColor: mode === item ? colors.primary : colors.transparent,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Text
                  style={[
                    labelStyle,
                    {
                      textAlign: 'center',
                      color: mode === item ? colors.onPrimary : colors.primary,
                      fontWeight: '600',
                    },
                  ]}
                >
                  {ui[item]}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
        {kind === 'chapter' && mode === 'surah' && (
          <View
            style={{
              ...controlRow,
              gap: spacing.xs,
              minHeight: 52,
              marginBottom: spacing.md,
              paddingHorizontal: spacing.md,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.paper,
            }}
          >
            <AppIcon name="search" size={18} color={colors.muted} />
            <TextInput
              testID="surah-search"
              value={query}
              onChangeText={changeQuery}
              onSubmitEditing={() => {
                const first = searching ? results[0] : undefined;
                if (first) onChooseSurah(first.surah.number, first.ayah ?? 1);
              }}
              placeholder={ui.searchSurah}
              placeholderTextColor={colors.muted}
              selectionColor={colors.primary}
              keyboardAppearance={scheme}
              accessibilityLabel={ui.searchSurahLabel}
              keyboardType="default"
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="off"
              spellCheck={false}
              style={[
                labelStyle,
                {
                  flex: 1,
                  minHeight: 48,
                  paddingVertical: 0,
                  textAlign: rtlQuery ? 'right' : 'left',
                  writingDirection: rtlQuery ? 'rtl' : 'ltr',
                },
              ]}
            />
            {query ? (
              <Pressable
                testID="surah-search-clear"
                accessibilityRole="button"
                accessibilityLabel={ui.clearSearch}
                onPress={() => changeQuery('')}
                hitSlop={4}
                style={({ pressed }) => ({
                  width: 44,
                  height: 44,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.6 : 1,
                })}
              >
                <AppIcon name="close" size={18} color={colors.muted} />
              </Pressable>
            ) : null}
          </View>
        )}
        {kind === 'ayah' ? (
          <AyahGrid
            ayah={ayah}
            ayahCount={ayahCount}
            bottomPadding={Math.max(insets.bottom, spacing.lg) + spacing.xl}
            onChooseAyah={onChooseAyah}
          />
        ) : (
          <FlatList
            ref={listRef}
            style={{ flex: 1 }}
            data={entries}
            key={`${kind}-${mode}`}
            keyExtractor={(item) => `${item.kind}-${item.parentJuz ?? 0}-${item.number}`}
            initialNumToRender={12}
            maxToRenderPerBatch={16}
            windowSize={9}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.xl }}
            ListEmptyComponent={
              <View testID="surah-no-match" style={{ paddingVertical: spacing.xl, gap: spacing.xs }}>
                <Label style={{ textAlign: 'center', fontWeight: '600' }}>{ui.noSurahMatch}</Label>
                <Label muted style={{ textAlign: 'center', fontSize: 13 }}>
                  {ui.surahSearchHelp}
                </Label>
              </View>
            }
            renderItem={({ item, index }) => {
              const selected = item.kind === 'surah' && item.number === surah;
              const suggested = searching && index === 0;
              const groupExpanded = item.kind === 'juz' && expandedJuz === item.number;
              return (
                <Pressable
                  testID={`choose-${item.kind}-${item.number}`}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.title}${item.arabic ? `, ${item.arabic}` : ''}, ${item.subtitle}${item.kind === 'surah' && item.jumpAyah ? `, ${ui.ayah} ${count(item.jumpAyah)}` : ''}`}
                  accessibilityState={{
                    selected,
                    ...(item.kind === 'juz' ? { expanded: groupExpanded } : {}),
                  }}
                  onPress={() => {
                    if (item.kind === 'surah') onChooseSurah(item.number, item.startAyah);
                    else setExpandedJuz(groupExpanded ? undefined : item.number);
                  }}
                  style={({ pressed }) => ({
                    ...controlRow,
                    minHeight: 72,
                    gap: spacing.md,
                    borderBottomWidth: 1,
                    borderColor: colors.border,
                    paddingVertical: spacing.sm,
                    paddingHorizontal: item.parentJuz || suggested ? spacing.sm : 0,
                    backgroundColor: item.parentJuz || suggested ? colors.mint : colors.transparent,
                    opacity: pressed ? 0.6 : 1,
                  })}
                >
                  <View
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: radius.md,
                      backgroundColor: selected ? colors.lime : colors.wash,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Label style={{ color: colors.primary, fontWeight: '600', textAlign: 'center' }}>
                      {count(item.number)}
                    </Label>
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={[labelText(16), { color: colors.ink, fontWeight: '600' }]} numberOfLines={1}>
                      {item.title}
                      {lineEndSlack}
                    </Text>
                    <Text style={[labelText(12), { color: colors.muted }]} numberOfLines={1}>
                      {item.subtitle}
                      {lineEndSlack}
                    </Text>
                  </View>
                  {item.arabic ? (
                    <Text style={[typography.small, { maxWidth: 120, color: colors.ink }]}>
                      {item.arabic}
                      {lineEndSlack}
                    </Text>
                  ) : null}
                  {item.kind === 'surah' && item.jumpAyah ? (
                    <View
                      style={{
                        borderRadius: radius.pill,
                        backgroundColor: colors.primary,
                        paddingHorizontal: spacing.sm,
                        paddingVertical: 2,
                      }}
                    >
                      <Text style={[labelText(12), { color: colors.onPrimary, fontWeight: '600' }]}>
                        {ui.ayah} {count(item.jumpAyah)}
                        {lineEndSlack}
                      </Text>
                    </View>
                  ) : null}
                  {item.kind === 'juz' ? (
                    <View style={{ transform: [{ rotate: groupExpanded ? '180deg' : '0deg' }] }}>
                      <AppIcon name="down" size={18} />
                    </View>
                  ) : selected ? (
                    <AppIcon name="check" color={colors.primary} size={18} />
                  ) : null}
                </Pressable>
              );
            }}
          />
        )}
      </View>
    </RNHostView>
  );
}

const gridGap = spacing.sm;
const minCellSize = 52;
const maxCellHeight = 64;
const maxGridColumns = 12;

/** ASCII digits of a typed ayah number; Urdu (۰-۹) and Arabic-Indic (٠-٩) digits are accepted. */
function ayahSearchDigits(input: string): string {
  return formatCount(input, 'en').replace(/[^0-9]/g, '');
}

/** Ayahs whose number starts with the typed digits: "1" gives 1, 10-19 and 100-199. */
function matchingAyahs(ayahCount: number, digits: string): number[] {
  const all = Array.from({ length: ayahCount }, (_, i) => i + 1);
  return digits ? all.filter((number) => String(number).startsWith(digits)) : all;
}

function AyahGrid({
  ayah,
  ayahCount,
  bottomPadding,
  onChooseAyah,
}: {
  ayah: number;
  ayahCount: number;
  bottomPadding: number;
  onChooseAyah: (ayah: number) => void;
}) {
  const { ui, count, labelStyle, controlRow } = useInterface();
  const { colors, scheme } = useTheme();
  const [query, setQuery] = useState('');
  const [grid, setGrid] = useState({ width: 0, height: 0 });
  const { width } = grid;
  const listRef = useRef<FlatList<number>>(null);
  const digits = ayahSearchDigits(query);
  const ayahs = useMemo(() => matchingAyahs(ayahCount, digits), [ayahCount, digits]);
  const exact = digits && String(Number(digits)) === digits ? Number(digits) : 0;
  const exactValid = exact >= 1 && exact <= ayahCount;

  const columns =
    width > 0
      ? Math.min(maxGridColumns, Math.max(1, Math.floor((width + gridGap) / (minCellSize + gridGap))))
      : 0;
  const cellWidth = columns > 0 ? (width - gridGap * (columns - 1)) / columns : 0;
  const cellHeight = Math.min(maxCellHeight, Math.max(minCellSize, Math.round(cellWidth)));
  const rowHeight = cellHeight + gridGap;
  // Open with the current ayah's row near the top (one row of context above it), but never past
  // the last screenful so short surahs and late ayahs do not open on blank space.
  const lastStartRow =
    columns > 0
      ? Math.max(0, Math.ceil(ayahCount / columns) - Math.floor(grid.height / rowHeight))
      : 0;
  const initialRow =
    columns > 0 ? Math.min(lastStartRow, Math.max(0, Math.floor((ayah - 1) / columns) - 1)) : 0;

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          ...controlRow,
          gap: spacing.xs,
          minHeight: 52,
          marginBottom: spacing.lg,
          paddingHorizontal: spacing.md,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.paper,
        }}
      >
        <TextInput
          testID="ayah-search"
          value={query}
          onChangeText={(value) => {
            // Keep only digits (any script) and show them in the interface's numerals.
            setQuery(count(value.replace(/[^0-9۰-۹٠-٩]/g, '')));
            listRef.current?.scrollToOffset({ offset: 0, animated: false });
          }}
          onSubmitEditing={() => {
            if (exactValid) onChooseAyah(exact);
          }}
          placeholder={ui.searchAyah}
          placeholderTextColor={colors.muted}
          selectionColor={colors.primary}
          keyboardAppearance={scheme}
          accessibilityLabel={ui.searchAyah}
          keyboardType="number-pad"
          returnKeyType="go"
          maxLength={String(ayahCount).length}
          autoCorrect={false}
          style={[
            labelStyle,
            { flex: 1, minHeight: 48, paddingVertical: 0 },
          ]}
        />
        {query ? (
          <Pressable
            testID="ayah-search-clear"
            accessibilityRole="button"
            accessibilityLabel={ui.clearSearch}
            onPress={() => {
              setQuery('');
              listRef.current?.scrollToOffset({ offset: 0, animated: false });
            }}
            hitSlop={4}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <AppIcon name="close" size={18} color={colors.muted} />
          </Pressable>
        ) : null}
      </View>
      <View style={{ flex: 1 }} onLayout={(event) => {
          const { width: w, height: h } = event.nativeEvent.layout;
          setGrid((current) =>
            current.width === w && current.height === h ? current : { width: w, height: h },
          );
        }}>
        {columns > 0 && (
          <FlatList
            ref={listRef}
            key={`ayah-grid-${columns}`}
            style={{ flex: 1 }}
            data={ayahs}
            numColumns={columns}
            keyExtractor={(number) => String(number)}
            getItemLayout={(_, index) => ({ length: rowHeight, offset: rowHeight * index, index })}
            initialScrollIndex={initialRow}
            initialNumToRender={Math.ceil(800 / rowHeight) + 2}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{ paddingBottom: bottomPadding }}
            columnWrapperStyle={{
              flexDirection: controlRow.flexDirection,
              gap: gridGap,
              height: rowHeight,
              alignItems: 'flex-start',
            }}
            ListEmptyComponent={
              <View testID="ayah-no-match" style={{ paddingVertical: spacing.xl }}>
                <Label muted style={{ textAlign: 'center' }}>
                  {ui.noAyahMatch}
                </Label>
              </View>
            }
            renderItem={({ item: number }) => {
              const selected = number === ayah;
              const highlighted = selected || (exactValid && number === exact);
              return (
                <Pressable
                  testID={`ayah-cell-${number}`}
                  accessibilityRole="button"
                  accessibilityLabel={`${ui.ayah} ${count(number)}`}
                  accessibilityState={{ selected }}
                  onPress={() => onChooseAyah(number)}
                  style={({ pressed }) => ({
                    width: cellWidth,
                    height: cellHeight,
                    borderRadius: radius.sm,
                    borderCurve: 'continuous',
                    borderWidth: 2,
                    borderColor: highlighted ? colors.primary : colors.transparent,
                    backgroundColor: selected ? colors.lime : colors.wash,
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: pressed ? 0.6 : 1,
                  })}
                >
                  <Label
                    style={{
                      color: colors.primary,
                      fontWeight: selected ? '700' : '600',
                      textAlign: 'center',
                    }}
                  >
                    {count(number)}
                  </Label>
                </Pressable>
              );
            }}
          />
        )}
      </View>
    </View>
  );
}
