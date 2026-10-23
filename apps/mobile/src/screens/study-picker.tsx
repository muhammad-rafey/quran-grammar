import { BottomSheet, RNHostView } from '@expo/ui';
import { FlatList, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { juzCatalog, surahCatalog } from '@quran-grammar/core';
import { AppIcon } from '@/components/app-icon';
import { Label } from '@/components/study-ui';
import { useInterface } from '@/state/preferences-provider';
import { colors, radius, spacing, type } from '@/theme/tokens';

export type BrowseMode = 'surah' | 'juz';
export type PickerKind = 'chapter' | 'ayah' | null;

export function StudyPicker({
  kind,
  mode,
  ayah,
  onMode,
  onClose,
  onChoose,
}: {
  kind: PickerKind;
  mode: BrowseMode;
  ayah: number;
  onMode: (mode: BrowseMode) => void;
  onClose: () => void;
  onChoose: (ayah: number) => void;
}) {
  const { ui, count, isUrdu, labelStyle, controlRow } = useInterface();
  const { height } = useWindowDimensions();
  const entries =
    kind === 'ayah'
      ? Array.from({ length: 7 }, (_, i) => ({
          number: i + 1,
          title: `${ui.ayah} ${count(i + 1)}`,
          arabic: '',
          available: true,
        }))
      : mode === 'surah'
        ? surahCatalog.map((item) => ({
            ...item,
            title: isUrdu ? item.nameArabic : item.nameEnglish,
            arabic: isUrdu ? '' : item.nameArabic,
          }))
        : juzCatalog.map((item) => ({
            ...item,
            title: `${ui.juz} ${count(item.number)}`,
            arabic: '',
          }));

  return (
    <BottomSheet
      isPresented={kind !== null}
      onDismiss={onClose}
      snapPoints={['full']}
      containerColor={colors.background}
      contentPadding={0}
      testID="lesson-picker"
    >
      <RNHostView>
        <View
          style={{
            flex: 1,
            minHeight: height * 0.65,
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
            data={entries}
            key={`${kind}-${mode}`}
            keyExtractor={(item) => String(item.number)}
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{ paddingBottom: 48 }}
            renderItem={({ item }) => {
              const selected = item.number === (kind === 'ayah' ? ayah : 1);
              return (
                <Pressable
                  testID={`choose-${kind === 'ayah' ? 'ayah' : mode}-${item.number}`}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.title}${!item.available ? `, ${ui.comingSoon}` : mode === 'juz' && kind === 'chapter' ? `, ${ui.surahTitle}, ${ui.partialPreview}` : ''}`}
                  accessibilityState={{ disabled: !item.available, selected }}
                  disabled={!item.available}
                  onPress={() => onChoose(kind === 'ayah' ? item.number : 1)}
                  style={({ pressed }) => ({
                    ...controlRow,
                    minHeight: 78,
                    gap: spacing.md,
                    borderBottomWidth: 1,
                    borderColor: colors.border,
                    paddingVertical: spacing.md,
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
                          ? mode === 'juz'
                            ? `${ui.surahTitle} · ${ui.partialPreview}`
                            : ui.available
                          : ui.comingSoon}
                      </Label>
                    )}
                  </View>
                  {item.arabic ? (
                    <Text style={[type.small, { maxWidth: 110 }]}>{item.arabic}</Text>
                  ) : null}
                  {selected || !item.available ? (
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
    </BottomSheet>
  );
}
