import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';
import { Host, Switch } from '@expo/ui';
import {
  canStepTextSize,
  defaultTextSize,
  quranText,
  spaceQuranText,
  stepTextSize,
  textSizePercent,
  translationEditions,
  translationText,
  themePreferences,
  type FontRole,
  type ReadingFont,
  type TextSizeRole,
} from '@quran-grammar/core';
import { useInterface } from '@/state/preferences-provider';
import { useStudy } from '@/state/study-provider';
import { AboutSection, Action, Label, Paragraph, Section } from '@/components/study-ui';
import { lineEndSlack, quranTextStyle, radius, spacing, urduTextStyle } from '@/theme/tokens';
import { useTheme } from '@/theme/theme';
import { useTypography } from '@/theme/typography';
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
  const { colors } = useTheme();
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
                  // Each option in its own script: Latin set in the Urdu font fell back to a serif.
                  item.value === 'en' ? latinLabel : labelStyle,
                  { textAlign: 'center', color: language === item.value ? colors.onPrimary : colors.primary },
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
      <ThemeSettings />
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
      <TranslationSettings />
      <TextSizeSettings />
      <FontSettings />
      <AboutSection />
    </View>
  );
}

const latinLabel = { fontSize: 16, lineHeight: 24, writingDirection: 'ltr' } as const;

/** Light, dark or the device's setting (System, the default); the same choice pattern as the language. */
function ThemeSettings() {
  const { ui, labelStyle, controlRow } = useInterface();
  const { colors, preference, setPreference, saveError } = useTheme();
  const labels = { system: ui.themeSystem, light: ui.themeLight, dark: ui.themeDark } as const;
  return (
    <Section title={ui.theme}>
      <View accessibilityRole="radiogroup" style={{ ...controlRow, flexWrap: 'wrap' }}>
        {themePreferences.map((value) => {
          const checked = preference === value;
          return (
            <Pressable
              testID={`theme-${value}`}
              key={value}
              accessibilityRole="radio"
              accessibilityState={{ checked }}
              onPress={() => void setPreference(value)}
              style={({ pressed }) => ({
                flexGrow: 1,
                minHeight: 52,
                padding: 12,
                borderRadius: 12,
                backgroundColor: checked ? colors.primary : pressed ? colors.lime : colors.wash,
              })}
            >
              <Text
                style={[
                  labelStyle,
                  { textAlign: 'center', color: checked ? colors.onPrimary : colors.primary },
                ]}
              >
                {labels[value]}
                {lineEndSlack}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Label muted>{ui.themeHelp}</Label>
      {saveError && (
        <Text accessibilityRole="alert" style={labelStyle}>
          {ui.preferenceError}
        </Text>
      )}
    </Section>
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
  const { colors, scheme } = useTheme();
  // One accessibility element: screen readers announce the label with the switch state, and
  // activating it toggles (the native switch alone was announced without its label).
  return (
    <View
      accessible
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      accessibilityActions={toggleActions}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === 'activate') onValueChange(!value);
      }}
      style={[controlRow, { justifyContent: 'space-between', minHeight: 48 }]}
    >
      <Label style={{ flex: 1 }}>{label}</Label>
      <Host
        matchContents
        colorScheme={scheme}
        layoutDirection={isUrdu ? 'rightToLeft' : 'leftToRight'}
        seedColor={colors.primary}
      >
        <Switch testID={testID} value={value} onValueChange={onValueChange} />
      </Host>
    </View>
  );
}

const toggleActions = [{ name: 'activate' }] as const;

/** One option of a radio group: a bordered card with a radio mark, its name and any details. */
function RadioCard({
  testID,
  label,
  hint,
  checked,
  onPress,
  children,
}: {
  testID: string;
  label: string;
  hint?: string;
  checked: boolean;
  onPress: () => void;
  children?: ReactNode;
}) {
  const { controlRow } = useInterface();
  const { colors } = useTheme();
  return (
    <Pressable
      testID={testID}
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityState={{ checked }}
      onPress={onPress}
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
        <Label style={{ flex: 1, fontWeight: checked ? '700' : '400' }}>{label}</Label>
      </View>
      {children}
    </Pressable>
  );
}

/**
 * Whose Urdu ayah translation is shown (Quran.com editions, see translationEditions). Each option
 * previews its translation of the first ayah of the chapter being studied, when the data has it.
 */
function TranslationSettings() {
  const { ui, isUrdu, labelStyle, translationId, setTranslationId, translationError, activeFonts } =
    useInterface();
  const { colors } = useTheme();
  const { study } = useStudy();
  const first = study?.ayahs[0];
  const previewStyle = useMemo(() => urduTextStyle(activeFonts.urdu, 16, 28), [activeFonts.urdu]);
  return (
    <Section title={ui.translator}>
      <Label muted>{ui.translatorHelp}</Label>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={ui.translator}
        style={{ gap: spacing.sm }}
      >
        {translationEditions.map((edition) => {
          const name = isUrdu ? edition.nameUrdu : edition.nameEnglish;
          const sample = first ? translationText(first.translations, edition.id) : '';
          return (
            <RadioCard
              key={edition.id}
              testID={`translation-${edition.id}`}
              label={name}
              checked={edition.id === translationId}
              onPress={() => void setTranslationId(edition.id)}
            >
              {sample ? (
                <Text
                  accessibilityLabel={`${ui.fontPreview}: ${sample}`}
                  numberOfLines={2}
                  style={[
                    previewStyle,
                    { color: colors.muted, textAlign: 'right', writingDirection: 'rtl' },
                  ]}
                >
                  {sample}
                </Text>
              ) : null}
            </RadioCard>
          );
        })}
      </View>
      {translationError && (
        <Text accessibilityRole="alert" style={labelStyle}>
          {ui.preferenceError}
        </Text>
      )}
    </Section>
  );
}

/** Words of the first ayah in the text-size preview; longer ayahs end with an ellipsis. */
const textSizePreviewWords = 12;

/**
 * Quran and translation text sizes (core text-size.ts): − / + steps, a reset to 100%, and a live
 * preview of the chapter's first ayah in the Quran font and translation in use, drawn with the
 * same typography as the study screen.
 */
function TextSizeSettings() {
  const { ui, count, isUrdu, labelStyle, textSizes, setTextSizes, textSizeError, translationId } =
    useInterface();
  const type = useTypography();
  const { study } = useStudy();
  const preview = useMemo(() => {
    const first = study?.ayahs[0];
    if (!study || !first) return null;
    const words = study.words.filter((word) => word.ayah === first.number);
    const arabic = spaceQuranText(
      words
        .slice(0, textSizePreviewWords)
        .map((word) => quranText(word, type.quranFont))
        .join(' '),
      type.quranFont,
    );
    return {
      arabic: words.length > textSizePreviewWords ? `${arabic} …` : arabic,
      translation: translationText(first.translations, translationId),
    };
  }, [study, translationId, type.quranFont]);
  const rows: { role: TextSizeRole; label: string }[] = [
    { role: 'quran', label: ui.quranTextSize },
    { role: 'translation', label: ui.translationTextSize },
  ];
  const isDefault =
    textSizes.quran === defaultTextSize && textSizes.translation === defaultTextSize;
  return (
    <Section title={ui.textSize}>
      <Label muted>{ui.textSizeHelp}</Label>
      {rows.map(({ role, label }) => (
        <TextSizeStepper
          key={role}
          role={role}
          label={label}
          value={`${count(textSizePercent(textSizes[role]))}${isUrdu ? '٪' : '%'}`}
          size={textSizes[role]}
          onChange={(size) => void setTextSizes({ [role]: size })}
        />
      ))}
      {preview ? (
        <View
          testID="text-size-preview"
          style={{ gap: spacing.xs, padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: type.colors.border, backgroundColor: type.colors.background }}
        >
          <Text testID="text-size-preview-arabic" style={type.arabic}>
            {preview.arabic}
          </Text>
          {preview.translation ? (
            <Paragraph translation>{preview.translation}</Paragraph>
          ) : null}
        </View>
      ) : null}
      <Action
        quiet
        testID="text-size-reset"
        disabled={isDefault}
        onPress={() =>
          void setTextSizes({ quran: defaultTextSize, translation: defaultTextSize })
        }
      >
        {ui.resetTextSize}
      </Action>
      {textSizeError && (
        <Text accessibilityRole="alert" style={labelStyle}>
          {ui.preferenceError}
        </Text>
      )}
    </Section>
  );
}

function TextSizeStepper({
  role,
  label,
  value,
  size,
  onChange,
}: {
  role: TextSizeRole;
  label: string;
  /** The size as a localized percentage. */
  value: string;
  size: number;
  onChange: (size: number) => void;
}) {
  const { ui, controlRow, labelText } = useInterface();
  const { colors } = useTheme();
  const steps = [
    { direction: -1, name: 'smaller', glyph: '\u2212', text: ui.smaller },
    { direction: 1, name: 'larger', glyph: '+', text: ui.larger },
  ] as const;
  const button = ({ direction, name, glyph, text }: (typeof steps)[number]) => {
    const disabled = !canStepTextSize(size, direction);
    return (
      <Pressable
        key={name}
        testID={`text-size-${role}-${name}`}
        accessibilityRole="button"
        accessibilityLabel={`${text}: ${label}`}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => onChange(stepTextSize(size, direction))}
        style={({ pressed }) => ({
          width: 48,
          height: 48,
          borderRadius: radius.sm,
          borderWidth: 1,
          borderBottomWidth: pressed ? 1 : 3,
          borderColor: colors.edge,
          backgroundColor: pressed ? colors.mint : colors.paper,
          opacity: disabled ? 0.4 : 1,
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        <Text style={{ fontSize: 24, lineHeight: 28, color: colors.primary, fontWeight: '600' }}>
          {glyph}
        </Text>
      </Pressable>
    );
  };
  return (
    <View
      style={{
        ...controlRow,
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: spacing.sm,
        paddingStart: spacing.md,
        borderRadius: radius.md,
        backgroundColor: colors.wash,
      }}
    >
      <Label style={{ flexGrow: 1, flexShrink: 1, fontWeight: '600' }}>{label}</Label>
      <View style={{ ...controlRow, gap: spacing.sm }}>
        {button(steps[0])}
        <Text
          testID={`text-size-${role}-value`}
          accessibilityLiveRegion="polite"
          accessibilityLabel={`${label}: ${value}`}
          style={[labelText(16), { minWidth: 56, textAlign: 'center', fontWeight: '600' }]}
        >
          {value}
          {lineEndSlack}
        </Text>
        {button(steps[1])}
      </View>
    </View>
  );
}

/**
 * Quran and Urdu font choice. Each option previews the first ayah of the chapter being studied (its
 * words and the selected Urdu translation from the study data) in that font; previews load the
 * fonts on demand.
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
    translationId,
  } = useInterface();
  const { study } = useStudy();
  const preview = useMemo(() => {
    const first = study?.ayahs[0];
    if (!study || !first) return null;
    const words = study.words.filter((word) => word.ayah === first.number);
    return {
      // Each Quran option previews the text it will show (IndoPak fonts: the IndoPak text).
      arabic: (font: ReadingFont) =>
        spaceQuranText(words.map((word) => quranText(word, font)).join(' '), font),
      // An ayah without the selected translation is previewed with its word meanings instead.
      urdu: () =>
        translationText(first.translations, translationId) ||
        words.map((word) => word.meaningUrdu).join('، '),
    };
  }, [study, translationId]);
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
  /** The preview text for an option's font (absent while the chapter loads). */
  sample: ((font: ReadingFont) => string) | undefined;
  onSelect: (id: string) => Promise<void>;
}) {
  const { ui, isUrdu, labelText } = useInterface();
  const { colors } = useTheme();
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
          const preview = sample?.(font);
          return (
            <RadioCard
              key={font.id}
              testID={`font-${role}-${font.id}`}
              label={name}
              hint={note}
              checked={checked}
              onPress={() => void onSelect(font.id)}
            >
              {preview ? (
                ready.has(font.id) ? (
                  <Text
                    accessibilityLabel={`${ui.fontPreview}: ${preview}`}
                    numberOfLines={2}
                    style={[
                      sampleStyles.get(font.id),
                      { color: colors.ink, textAlign: 'right', writingDirection: 'rtl' },
                    ]}
                  >
                    {preview}
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
            </RadioCard>
          );
        })}
      </View>
    </View>
  );
}
