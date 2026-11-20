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
  surahCatalog,
} from '@quran-grammar/core';
import { AppIcon } from '@/components/app-icon';
import { Label } from '@/components/study-ui';
import { useInterface } from '@/state/preferences-provider';
import { colors, lineEndSlack, radius, spacing } from '@/theme/tokens';
import { useTypography } from '@/theme/typography';

export type BrowseMode = 'surah' | 'juz';
export type PickerKind = 'chapter' | 'ayah' | null;
type PickerEntryBase = {
  number: number;
  title: string;
  arabic: string;
  available: boolean;
};
type PickerEntry = PickerEntryBase & (
  | { kind: 'surah'; parentJuz?: number }
  | { kind: 'juz'; partial: boolean; parentJuz?: never }
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
  /** startAyah is the chapter's first ayah inside the chosen juz, or 1 from the surah list. */
  onChooseSurah: (surah: number, startAyah: number) => void;
};

export function StudyPicker(props: StudyPickerProps) {
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
  const { ui, count, isUrdu, language, labelStyle, controlRow } = useInterface();
  const typography = useTypography();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  // The native sheet sizes the host; fill it so the list never stops short of the sheet edge.
  const [hostHeight, setHostHeight] = useState(0);
  const selectedJuz = (
    getJuzForAyah(surah, ayah) ?? juzCatalog.find((item) => item.surahNumbers.includes(surah))
  )?.number;
  const [expandedJuz, setExpandedJuz] = useState<number | undefined>(selectedJuz);
  const surahEntry = (number: number, parentJuz?: number): PickerEntry => {
    const item = surahCatalog.find((entry) => entry.number === number)!;
    return {
      number,
      title: getSurahTitle(number, language),
      arabic: isUrdu ? '' : item.nameArabic,
      available: item.available,
      kind: 'surah',
      parentJuz,
    };
  };
  const entries: PickerEntry[] =
    kind === 'ayah'
      ? []
      : mode === 'surah'
        ? [...surahCatalog]
            .sort((a, b) => Number(b.available) - Number(a.available))
            .map((item) => surahEntry(item.number))
        : [...juzCatalog]
            .sort((a, b) => Number(b.available) - Number(a.available))
            .flatMap((item): PickerEntry[] => [
              {
                number: item.number,
                available: item.available,
                partial: item.partial,
                title: `${ui.juz} ${count(item.number)}`,
                arabic: '',
                kind: 'juz',
              },
              ...(expandedJuz === item.number
                ? item.surahNumbers.map((number) => surahEntry(number, item.number))
                : []),
            ]);

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
                onPress={() => onMode(item)}
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
                      color: mode === item ? colors.white : colors.primary,
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
        {kind === 'ayah' ? (
          <AyahGrid
            ayah={ayah}
            ayahCount={ayahCount}
            bottomPadding={Math.max(insets.bottom, spacing.lg) + spacing.xl}
            onChooseAyah={onChooseAyah}
          />
        ) : (
          <FlatList
            style={{ flex: 1 }}
            data={entries}
            key={`${kind}-${mode}`}
            keyExtractor={(item) => `${item.kind}-${item.number}`}
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.xl }}
            renderItem={({ item }) => {
              const selected = item.kind === 'surah' && item.number === surah;
              const groupExpanded = item.kind === 'juz' && expandedJuz === item.number;
              const availability = !item.available
                ? ui.comingSoon
                : item.kind === 'juz' && item.partial
                  ? ui.partialPreview
                  : ui.available;
              return (
                <Pressable
                  testID={`choose-${item.kind}-${item.number}`}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.title}${!item.available || item.kind === 'juz' ? `, ${availability}` : ''}`}
                  accessibilityState={{
                    disabled: !item.available,
                    selected,
                    ...(item.kind === 'juz' ? { expanded: groupExpanded } : {}),
                  }}
                  disabled={!item.available}
                  onPress={() => {
                    if (item.kind === 'surah')
                      onChooseSurah(
                        item.number,
                        item.parentJuz ? getJuzStartAyah(item.parentJuz, item.number) : 1,
                      );
                    else setExpandedJuz(groupExpanded ? undefined : item.number);
                  }}
                  style={({ pressed }) => ({
                    ...controlRow,
                    minHeight: 78,
                    gap: spacing.md,
                    borderBottomWidth: 1,
                    borderColor: colors.border,
                    paddingVertical: spacing.md,
                    paddingHorizontal: item.parentJuz ? spacing.sm : 0,
                    backgroundColor: item.parentJuz ? colors.mint : colors.transparent,
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
                    <Label
                      style={{
                        color: item.available ? colors.primary : colors.muted,
                        fontWeight: '600',
                        textAlign: 'center',
                      }}
                    >
                      {count(item.number)}
                    </Label>
                  </View>
                  <View style={{ flex: 1, gap: spacing.xs }}>
                    <Text
                      style={[
                        labelStyle,
                        {
                          color: item.available ? colors.ink : colors.muted,
                          fontWeight: item.available ? '600' : '400',
                        },
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Label muted style={{ fontSize: 12 }}>
                      {item.available && item.parentJuz
                        ? `${ui.surah} ${count(item.number)} · ${availability}`
                        : availability}
                    </Label>
                  </View>
                  {item.arabic ? (
                    <Text style={[typography.small, { maxWidth: 110 }]}>
                      {item.arabic}
                      {lineEndSlack}
                    </Text>
                  ) : null}
                  {item.kind === 'juz' && item.available ? (
                    <View style={{ transform: [{ rotate: groupExpanded ? '180deg' : '0deg' }] }}>
                      <AppIcon name="down" size={18} />
                    </View>
                  ) : selected || !item.available ? (
                    <AppIcon
                      name={selected ? 'check' : 'lock'}
                      color={selected ? colors.primary : colors.muted}
                      size={18}
                    />
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
