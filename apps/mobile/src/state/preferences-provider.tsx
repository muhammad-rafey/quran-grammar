import { createContext, use, useEffect, useRef, useState, type ReactNode } from 'react';
import { ActivityIndicator, View, type TextStyle, type ViewStyle } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatCount, getUiStrings, isUiLanguage, type UiLanguage } from '@quran-grammar/core';
import { colors } from '@/theme/tokens';

const languageKey = 'quran-grammar:interface-language';
type Preferences = {
  language: UiLanguage;
  setLanguage: (language: UiLanguage) => Promise<void>;
  saveError: boolean;
  saving: boolean;
};
const PreferencesContext = createContext<Preferences | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [language, updateLanguage] = useState<UiLanguage>('en');
  const [hydrated, setHydrated] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [saving, setSaving] = useState(false);
  const pending = useRef(false);
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(languageKey)
      .then((saved) => {
        if (active && isUiLanguage(saved)) updateLanguage(saved);
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

  const setLanguage = async (next: UiLanguage) => {
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
  };

  if (!hydrated)
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  return (
    <PreferencesContext value={{ language, setLanguage, saveError, saving }}>
      {children}
    </PreferencesContext>
  );
}

export function useInterface() {
  const preferences = use(PreferencesContext);
  if (!preferences) throw new Error('useInterface requires PreferencesProvider');
  const isUrdu = preferences.language === 'ur';
  const labelStyle: TextStyle = {
    color: colors.ink,
    fontFamily: isUrdu ? 'Naskh' : undefined,
    fontSize: 16,
    lineHeight: isUrdu ? 28 : 24,
    textAlign: isUrdu ? 'right' : 'left',
    writingDirection: isUrdu ? 'rtl' : 'ltr',
  };
  const controlRow: ViewStyle = {
    flexDirection: isUrdu ? 'row-reverse' : 'row',
    alignItems: 'center',
    gap: 10,
  };
  return {
    ...preferences,
    ui: getUiStrings(preferences.language),
    count: (value: number | string) => formatCount(value, preferences.language),
    isUrdu,
    labelStyle,
    controlRow,
  };
}
