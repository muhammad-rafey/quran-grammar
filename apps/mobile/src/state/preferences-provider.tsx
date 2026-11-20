import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { ActivityIndicator, I18nManager, View, type TextStyle, type ViewStyle } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  defaultFontIds,
  formatCount,
  getUiStrings,
  isUiLanguage,
  resolveFont,
  type FontRole,
  type ReadingFont,
  type UiLanguage,
  type UiStrings,
} from '@quran-grammar/core';
import { colors, urduTextStyle } from '@/theme/tokens';
import { physicalRowDirection } from '@/theme/physical-row';
import { isFontReady, loadReadingFont } from '@/theme/font-loading';

const languageKey = 'quran-grammar:interface-language';
const readingLayoutKey = 'quran-grammar:reading-layout';
const fontKeys: Record<FontRole, string> = {
  quran: 'quran-grammar:quran-font',
  urdu: 'quran-grammar:urdu-font',
};
/** How long the launch screen waits for a saved non-default font before showing the default. */
const savedFontWait = 1500;

/** How the study screen shows each ayah. Both default to on (the word-by-word grammar layout). */
export type ReadingLayout = { grammar: boolean; translation: boolean };
const defaultReadingLayout: ReadingLayout = { grammar: true, translation: true };

function parseReadingLayout(value: string | null): ReadingLayout {
  if (!value) return defaultReadingLayout;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== 'object') return defaultReadingLayout;
    const record = parsed as Record<string, unknown>;
    return {
      grammar: typeof record.grammar === 'boolean' ? record.grammar : true,
      translation: typeof record.translation === 'boolean' ? record.translation : true,
    };
  } catch {
    return defaultReadingLayout;
  }
}

/**
 * The font in use for a role: the chosen font once it is loaded. While a newly chosen font loads,
 * the previous font stays in use; if it cannot be loaded, the role default is used instead.
 */
function useActiveFont(role: FontRole, id: string) {
  const wanted = resolveFont(role, id);
  const [state, setState] = useState(() => ({
    font: isFontReady(wanted) ? wanted : resolveFont(role, null),
    failedId: null as string | null,
  }));
  const ready = state.font.id === wanted.id || isFontReady(wanted);
  const failed = state.failedId === wanted.id;
  useEffect(() => {
    // Remember a font that became ready elsewhere (e.g. a Settings preview) as the previous font.
    if (ready) {
      if (state.font !== wanted) setState({ font: wanted, failedId: null });
      return;
    }
    if (failed) return;
    let active = true;
    loadReadingFont(wanted).then(
      () => {
        if (active) setState({ font: wanted, failedId: null });
      },
      () => {
        if (active) setState({ font: resolveFont(role, null), failedId: wanted.id });
      },
    );
    return () => {
      active = false;
    };
  }, [role, wanted, ready, failed, state.font]);
  return {
    font: ready ? wanted : state.font,
    loading: !ready && !failed,
    failed,
  };
}

type Interface = {
  language: UiLanguage;
  setLanguage: (language: UiLanguage) => Promise<void>;
  saveError: boolean;
  saving: boolean;
  readingLayout: ReadingLayout;
  setReadingLayout: (change: Partial<ReadingLayout>) => Promise<void>;
  readingLayoutError: boolean;
  /** Chosen font ids (registry ids, see packages/core/src/fonts.ts). */
  quranFont: string;
  urduFont: string;
  setQuranFont: (id: string) => Promise<void>;
  setUrduFont: (id: string) => Promise<void>;
  /** The fonts in use: the chosen ones once loaded (use useTypography() for text styles). */
  activeFonts: Readonly<Record<FontRole, ReadingFont>>;
  /** Roles whose chosen font is still loading / could not be loaded (the default is shown). */
  fontLoading: Readonly<Record<FontRole, boolean>>;
  fontFailed: Readonly<Record<FontRole, boolean>>;
  fontSaveError: boolean;
  ui: UiStrings;
  count: (value: number | string) => string;
  isUrdu: boolean;
  /** Interface label: the system font in English, the chosen Urdu font in Urdu. */
  labelStyle: TextStyle;
  /** labelStyle at another size; in Urdu the lineHeight is raised to what the font needs. */
  labelText: (fontSize: number, lineHeight?: number) => TextStyle;
  controlRow: ViewStyle;
};
const PreferencesContext = createContext<Interface | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [language, updateLanguage] = useState<UiLanguage>('en');
  const [readingLayout, updateReadingLayout] = useState<ReadingLayout>(defaultReadingLayout);
  const [hydrated, setHydrated] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [readingLayoutError, setReadingLayoutError] = useState(false);
  const [fontIds, updateFontIds] = useState<Record<FontRole, string>>(defaultFontIds);
  const [fontSaveError, setFontSaveError] = useState(false);
  const pending = useRef(false);
  const layoutRef = useRef(defaultReadingLayout);
  useEffect(() => {
    let active = true;
    AsyncStorage.multiGet([languageKey, readingLayoutKey, fontKeys.quran, fontKeys.urdu])
      .then(async (entries) => {
        if (!active) return;
        const saved = new Map(entries);
        const savedLanguage = saved.get(languageKey) ?? null;
        if (isUiLanguage(savedLanguage)) updateLanguage(savedLanguage);
        const layout = parseReadingLayout(saved.get(readingLayoutKey) ?? null);
        layoutRef.current = layout;
        updateReadingLayout(layout);
        const quran = resolveFont('quran', saved.get(fontKeys.quran));
        const urdu = resolveFont('urdu', saved.get(fontKeys.urdu));
        updateFontIds({ quran: quran.id, urdu: urdu.id });
        // A saved non-default font is loaded before the first screen (briefly), so the reader
        // does not see the text reflow from the default font; a slow or failed load falls back.
        const custom = [quran, urdu].filter((font) => !isFontReady(font));
        if (custom.length > 0) {
          await Promise.race([
            Promise.allSettled(custom.map(loadReadingFont)),
            new Promise((resolve) => setTimeout(resolve, savedFontWait)),
          ]);
        }
      })
      .catch(() => {
        if (active) setSaveError(true);
      })
      .finally(() => {
        if (active) setHydrated(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const setLanguage = useCallback(async (next: UiLanguage) => {
    if (pending.current) return;
    pending.current = true;
    setSaving(true);
    setSaveError(false);
    updateLanguage(next);
    try {
      await AsyncStorage.setItem(languageKey, next);
    } catch {
      setSaveError(true);
    } finally {
      pending.current = false;
      setSaving(false);
    }
  }, []);

  const setReadingLayout = useCallback(async (change: Partial<ReadingLayout>) => {
    const next = { ...layoutRef.current, ...change };
    layoutRef.current = next;
    updateReadingLayout(next);
    setReadingLayoutError(false);
    try {
      await AsyncStorage.setItem(readingLayoutKey, JSON.stringify(next));
    } catch {
      setReadingLayoutError(true);
    }
  }, []);

  const setFont = useCallback(async (role: FontRole, id: string) => {
    const font = resolveFont(role, id);
    updateFontIds((current) => ({ ...current, [role]: font.id }));
    setFontSaveError(false);
    try {
      await AsyncStorage.setItem(fontKeys[role], font.id);
    } catch {
      setFontSaveError(true);
    }
  }, []);
  const setQuranFont = useCallback((id: string) => setFont('quran', id), [setFont]);
  const setUrduFont = useCallback((id: string) => setFont('urdu', id), [setFont]);
  const quran = useActiveFont('quran', fontIds.quran);
  const urdu = useActiveFont('urdu', fontIds.urdu);
  const quranFont = quran.font;
  const urduFont = urdu.font;

  // One stable value per preference change, so memoized study cards can rely on referential equality.
  const value = useMemo<Interface>(() => {
    const isUrdu = language === 'ur';
    const labelStyle: TextStyle = {
      color: colors.ink,
      ...(isUrdu ? urduTextStyle(urduFont, 16, 28) : { fontSize: 16, lineHeight: 24 }),
      textAlign: isUrdu ? 'right' : 'left',
      writingDirection: isUrdu ? 'rtl' : 'ltr',
    };
    const labelSizes = new Map<string, TextStyle>([['16', labelStyle]]);
    const labelText = (fontSize: number, lineHeight?: number) => {
      const key = lineHeight === undefined ? `${fontSize}` : `${fontSize}/${lineHeight}`;
      let style = labelSizes.get(key);
      if (!style) {
        style = {
          ...labelStyle,
          ...(isUrdu
            ? urduTextStyle(urduFont, fontSize, lineHeight ?? 28)
            : { fontSize, ...(lineHeight === undefined ? null : { lineHeight }) }),
        };
        labelSizes.set(key, style);
      }
      return style;
    };
    return {
      language,
      setLanguage,
      saveError,
      saving,
      readingLayout,
      setReadingLayout,
      readingLayoutError,
      ui: getUiStrings(language),
      count: (input: number | string) => formatCount(input, language),
      isUrdu,
      quranFont: fontIds.quran,
      urduFont: fontIds.urdu,
      setQuranFont,
      setUrduFont,
      activeFonts: { quran: quranFont, urdu: urduFont },
      fontLoading: { quran: quran.loading, urdu: urdu.loading },
      fontFailed: { quran: quran.failed, urdu: urdu.failed },
      fontSaveError,
      labelStyle,
      labelText,
      controlRow: {
        flexDirection: physicalRowDirection(isUrdu, I18nManager.isRTL),
        alignItems: 'center',
        gap: 10,
      },
    };
  }, [
    language,
    setLanguage,
    saveError,
    saving,
    readingLayout,
    setReadingLayout,
    readingLayoutError,
    fontIds,
    setQuranFont,
    setUrduFont,
    quranFont,
    urduFont,
    quran.loading,
    urdu.loading,
    quran.failed,
    urdu.failed,
    fontSaveError,
  ]);

  if (!hydrated)
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  return <PreferencesContext value={value}>{children}</PreferencesContext>;
}

export function useInterface() {
  const preferences = use(PreferencesContext);
  if (!preferences) throw new Error('useInterface requires PreferencesProvider');
  return preferences;
}
