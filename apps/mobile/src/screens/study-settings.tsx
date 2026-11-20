import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';
import { Host, Switch } from '@expo/ui';
import type { FontRole, ReadingFont } from '@quran-grammar/core';
import { useInterface } from '@/state/preferences-provider';
import { useStudy } from '@/state/study-provider';
import { Action, DataStatus, Label, Section, StudyFooter } from '@/components/study-ui';
import { colors, quranTextStyle, radius, spacing, urduTextStyle } from '@/theme/tokens';
import { isFontReady, loadReadingFont, selectableFonts } from '@/theme/font-loading';

export function Settings() {
  const {
    ui,
    language,
    setLanguage,
    saveError,
    saving,
    labelStyle,
    controlRow,
    readingLayout,
    setReadingLayout,
    readingLayoutError,
  } = useInterface();
  return (
    <View style={{ gap: 16 }}>
      <Image
        source={require('../../assets/logo.png')}
        accessible={false}
        resizeMode="contain"
        style={{ width: 80, height: 80, alignSelf: 'center' }}
      />
      <Section title={ui.interfaceLanguage}>
        <View style={{ ...controlRow, flexWrap: 'wrap' }}>
          {(
            [
              { value: 'en', label: ui.english },
              { value: 'ur', label: ui.urdu },
            ] as const
          ).map((item) => (
            <Pressable
              testID={`language-${item.value}`}
              key={item.value}
              accessibilityRole="radio"
              accessibilityState={{ checked: language === item.value, disabled: saving }}
              disabled={saving}
              onPress={() => void setLanguage(item.value)}
              style={{
                flexGrow: 1,
                minHeight: 52,
                padding: 12,
                borderRadius: 12,
                backgroundColor: language === item.value ? colors.primary : colors.wash,
              }}
            >
              <Text
                style={[
                  labelStyle,
                  { textAlign: 'center', color: language === item.value ? '#fff' : colors.primary },
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <Label muted>{ui.languageHelp}</Label>
        {saveError && (
          <View style={{ gap: 8 }}>
            <Text accessibilityRole="alert" style={labelStyle}>
              {ui.preferenceError}
            </Text>
            <Action quiet onPress={() => void setLanguage(language)}>
              {ui.retry}
            </Action>
          </View>
        )}
      </Section>
      <Section title={ui.readingLayout}>
        <Label muted>{ui.readingLayoutHelp}</Label>
        {(
          [
            {
              key: 'grammar',
              label: ui.showGrammarAnalysis,
              help: ui.showGrammarAnalysisHelp,
            },
            { key: 'translation', label: ui.showTranslation, help: ui.showTranslationHelp },
          ] as const
        ).map((item) => (
          <View key={item.key} style={{ gap: 4 }}>
            <ToggleRow
              testID={`layout-${item.key}`}
              label={item.label}
              value={readingLayout[item.key]}
              onValueChange={(value) => void setReadingLayout({ [item.key]: value })}
            />
            <Label muted>{item.help}</Label>
          </View>
        ))}
        {readingLayoutError && (
          <Text accessibilityRole="alert" style={labelStyle}>
            {ui.preferenceError}
          </Text>
        )}
      </Section>
      <FontSettings />
      <Section title={ui.dataStatus}>
        <Label muted>{ui.offline}</Label>
        <DataStatus />
      </Section>
      <StudyFooter />
    </View>
  );
}

/**
 * A labelled native switch. The label is a React Native Text rather than the @expo/ui Switch
 * `label`: that variant lays its Compose Row out with an intrinsic-size width modifier which the
 * Expo Go build of @expo/ui rejects (Android crash: "Cannot cast value for field 'width'").
 */
export function ToggleRow({
  label,
  value,
  onValueChange,
  testID,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  testID?: string;
}) {
  const { controlRow, isUrdu } = useInterface();
  return (
    <View style={[controlRow, { justifyContent: 'space-between', minHeight: 48 }]}>
      <Label style={{ flex: 1 }}>{label}</Label>
      <Host
        matchContents
        colorScheme="light"
        layoutDirection={isUrdu ? 'rightToLeft' : 'leftToRight'}
        seedColor={colors.primary}
      >
        <Switch testID={testID} value={value} onValueChange={onValueChange} />
      </Host>
    </View>
  );
}

/**
 * Quran and Urdu font choice. Each option previews the first ayah of the chapter being studied (its
 * words and Urdu translation from the study data) in that font; previews load the fonts on demand.
 */
function FontSettings() {
  const {
    ui,
    labelStyle,
    quranFont,
    urduFont,
    setQuranFont,
    setUrduFont,
    fontSaveError,
    fontFailed,
  } = useInterface();
  const { study } = useStudy();
  const preview = useMemo(() => {
    const first = study?.ayahs[0];
    if (!study || !first) return null;
    const words = study.words.filter((word) => word.ayah === first.number);
    return {
      arabic: words.map((word) => word.arabic).join(' '),
      urdu: first.translationUrdu,
    };
  }, [study]);
  return (
    <Section title={ui.fonts}>
      <Label muted>{ui.fontsHelp}</Label>
      <FontChoice
        role="quran"
        title={ui.quranFont}
        selected={quranFont}
        failed={fontFailed.quran}
        sample={preview?.arabic}
        onSelect={setQuranFont}
      />
      <FontChoice
        role="urdu"
        title={ui.urduFont}
        selected={urduFont}
        failed={fontFailed.urdu}
        sample={preview?.urdu}
        onSelect={setUrduFont}
      />
      {fontSaveError && (
        <Text accessibilityRole="alert" style={labelStyle}>
          {ui.preferenceError}
        </Text>
      )}
    </Section>
  );
}

function FontChoice({
  role,
  title,
  selected,
  failed,
  sample,
  onSelect,
}: {
  role: FontRole;
  title: string;
  selected: string;
  failed: boolean;
  sample: string | undefined;
  onSelect: (id: string) => Promise<void>;
}) {
  const { ui, isUrdu, labelText, controlRow } = useInterface();
  const fonts = selectableFonts(role);
  // Load every option's font so its preview is drawn in it; a font that fails shows no preview.
  const [ready, setReady] = useState<ReadonlySet<string>>(
    () => new Set(fonts.filter(isFontReady).map((font) => font.id)),
  );
  useEffect(() => {
    let active = true;
    for (const font of fonts) {
      if (isFontReady(font)) continue;
      loadReadingFont(font).then(
        () => {
          if (active) setReady((current) => new Set(current).add(font.id));
        },
        () => undefined,
      );
    }
    return () => {
      active = false;
    };
  }, [fonts]);
  const sampleStyles = useMemo(
    () =>
      new Map(
        fonts.map((font) => [
          font.id,
          role === 'quran' ? quranTextStyle(font, 26) : urduTextStyle(font, 17, 30),
        ]),
      ),
    [fonts, role],
  );
  return (
    <View style={{ gap: spacing.sm }}>
      <Text accessibilityRole="header" style={[labelText(16), { fontWeight: '600' }]}>
        {title}
      </Text>
      <View accessibilityRole="radiogroup" accessibilityLabel={title} style={{ gap: spacing.sm }}>
        {fonts.map((font) => {
          const checked = font.id === selected;
          const name = isUrdu ? font.labelUrdu : font.label;
          const note = isUrdu ? (font.coverageNoteUrdu ?? font.coverageNote) : font.coverageNote;
          return (
            <Pressable
              key={font.id}
              testID={`font-${role}-${font.id}`}
              accessibilityRole="radio"
              accessibilityLabel={name}
              accessibilityHint={note}
              accessibilityState={{ checked }}
              onPress={() => void onSelect(font.id)}
              style={({ pressed }) => ({
                minHeight: 64,
                padding: spacing.md,
                gap: spacing.xs,
                borderRadius: radius.md,
                borderWidth: 2,
                borderColor: checked ? colors.primary : colors.border,
                backgroundColor: checked ? colors.wash : pressed ? colors.mint : colors.paper,
              })}
            >
              <View style={controlRow}>
                <View
                  accessible={false}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: radius.pill,
                    borderWidth: 2,
                    borderColor: checked ? colors.primary : colors.muted,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {checked ? (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: radius.pill,
                        backgroundColor: colors.primary,
                      }}
                    />
                  ) : null}
                </View>
                <Label style={{ flex: 1, fontWeight: checked ? '700' : '400' }}>{name}</Label>
              </View>
              {sample ? (
                ready.has(font.id) ? (
                  <Text
                    accessibilityLabel={`${ui.fontPreview}: ${sample}`}
                    numberOfLines={2}
                    style={[
                      sampleStyles.get(font.id),
                      { color: colors.ink, textAlign: 'right', writingDirection: 'rtl' },
                    ]}
                  >
                    {sample}
                  </Text>
                ) : (
                  <ActivityIndicator color={colors.primary} style={{ alignSelf: 'flex-start' }} />
                )
              ) : null}
              {note ? <Label muted>{note}</Label> : null}
              {checked && failed ? (
                <Label muted style={{ color: colors.amber }}>
                  {ui.loadFailed}
                </Label>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
