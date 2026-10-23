import { useState } from 'react';
import { BottomSheet, RNHostView } from '@expo/ui';
import { FlatList, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { getSurahTitle, juzCatalog, surahCatalog } from '@quran-grammar/core';
import { AppIcon } from '@/components/app-icon';
import { Label } from '@/components/study-ui';
import { useInterface } from '@/state/preferences-provider';
import { colors, radius, spacing, type } from '@/theme/tokens';

export type BrowseMode = 'surah' | 'juz';
export type PickerKind = 'chapter' | 'ayah' | null;
type PickerEntry = {
  number: number;
  title: string;
  arabic: string;
  available: boolean;
  kind: 'surah' | 'juz' | 'ayah';
  parentJuz?: number;
};

type StudyPickerProps = {
  kind: PickerKind;
  mode: BrowseMode;
  ayah: number;
  ayahCount: number;
  surah: number;
  onMode: (mode: BrowseMode) => void;
  onClose: () => void;
  onChooseAyah: (ayah: number) => void;
  onChooseSurah: (surah: number) => void;
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
  const { height } = useWindowDimensions();
  const selectedJuz = juzCatalog.find((item) => item.surahNumbers.includes(surah))?.number;
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
      ? Array.from({ length: ayahCount }, (_, i) => ({
          number: i + 1,
          title: `${ui.ayah} ${count(i + 1)}`,
          arabic: '',
          available: true,
          kind: 'ayah',
        }))
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
                title: `${ui.juz} ${count(item.number)}`,
                arabic: '',
                kind: 'juz',
              },
              ...(expandedJuz === item.number
                ? item.surahNumbers.map((number) => surahEntry(number, item.number))
                : []),
            ]);

  return (
    <RNHostView>
      <View
        style={{
          height: height * 0.8,
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
        <FlatList
          style={{ flex: 1 }}
          data={entries}
          key={`${kind}-${mode}`}
          keyExtractor={(item) => `${item.kind}-${item.number}`}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{ paddingBottom: 48 }}
          renderItem={({ item }) => {
            const selected =
              item.kind === 'ayah'
                ? item.number === ayah
                : item.kind === 'surah' && item.number === surah;
            const groupExpanded = item.kind === 'juz' && expandedJuz === item.number;
            return (
              <Pressable
                testID={`choose-${item.kind}-${item.number}`}
                accessibilityRole="button"
                accessibilityLabel={`${item.title}${!item.available ? `, ${ui.comingSoon}` : item.kind === 'juz' ? `, ${ui.partialPreview}` : ''}`}
                accessibilityState={{
                  disabled: !item.available,
                  selected,
                  ...(item.kind === 'juz' ? { expanded: groupExpanded } : {}),
                }}
                disabled={!item.available}
                onPress={() => {
                  if (item.kind === 'ayah') onChooseAyah(item.number);
                  else if (item.kind === 'surah') onChooseSurah(item.number);
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
                  {kind === 'chapter' && (
                    <Label muted style={{ fontSize: 12 }}>
                      {item.available
                        ? item.kind === 'juz'
                          ? ui.partialPreview
                          : item.parentJuz
                            ? `${ui.surah} ${count(item.number)} · ${ui.available}`
                            : ui.available
                        : ui.comingSoon}
                    </Label>
                  )}
                </View>
                {item.arabic ? (
                  <Text style={[type.small, { maxWidth: 110 }]}>{item.arabic}</Text>
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
      </View>
    </RNHostView>
  );
}
