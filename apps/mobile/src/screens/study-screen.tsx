import { useState } from 'react';
import { Keyboard, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Host, Switch } from '@expo/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { matchesWord, type PartOfSpeechFilter, type Word } from '@quran-grammar/core';
import { useStudy } from '@/state/study-provider';
import { useInterface } from '@/state/preferences-provider';
import {
  Action,
  DataStatus,
  InitialDataState,
  Label,
  Paragraph,
  Section,
  StudyFooter,
} from '@/components/study-ui';
import { card, colors, row, type } from '@/theme/tokens';

export default function StudyScreen() {
  const { study } = useStudy();
  const { ui, count, labelStyle, controlRow, isUrdu } = useInterface();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [view, setView] = useState<'words' | 'grammar' | 'settings'>('words');
  const [query, setQuery] = useState('');
  const [pos, setPos] = useState<PartOfSpeechFilter>('all');
  const [showMeanings, setShowMeanings] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  if (!study) return <InitialDataState />;
  const active = Boolean(query.trim()) || pos !== 'all';
  const matches = study.words.filter((word) => matchesWord(word, study, query, pos));
  const ids = new Set(matches.map((word) => word.id));
  const filters: { value: PartOfSpeechFilter; label: string }[] = [
    { value: 'all', label: ui.allWords },
    { value: 'noun', label: ui.noun },
    { value: 'verb', label: ui.verb },
    { value: 'particle', label: ui.particle },
    { value: 'pronoun', label: ui.pronoun },
  ];
  const openWord = (word: Word) => {
    Keyboard.dismiss();
    router.push({ pathname: '/word/[id]', params: { id: word.id } });
  };
  const clear = () => {
    setQuery('');
    setPos('all');
  };

  return (
    <ScrollView
      testID="study-screen"
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        padding: 16,
        paddingBottom: Math.max(insets.bottom, 20) + 12,
        gap: 14,
        maxWidth: 860,
        width: '100%',
        alignSelf: 'center',
      }}
    >
      <View
        accessibilityRole="tablist"
        style={{ ...controlRow, backgroundColor: '#e8ede6', borderRadius: 13, padding: 4, gap: 4 }}
      >
        {(
          [
            { value: 'words', title: ui.study },
            { value: 'grammar', title: ui.grammar },
            { value: 'settings', title: ui.settings },
          ] as const
        ).map((tab) => (
          <Pressable
            testID={`tab-${tab.value}`}
            key={tab.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: view === tab.value }}
            onPress={() => {
              Keyboard.dismiss();
              setView(tab.value);
            }}
            style={{
              flex: 1,
              minHeight: 44,
              padding: 8,
              borderRadius: 9,
              backgroundColor: view === tab.value ? colors.paper : 'transparent',
              justifyContent: 'center',
            }}
          >
            <Text
              style={[
                labelStyle,
                {
                  textAlign: 'center',
                  fontSize: 14,
                  fontWeight: view === tab.value ? '600' : '400',
                  color: view === tab.value ? colors.primary : colors.muted,
                },
              ]}
            >
              {tab.title}
            </Text>
          </Pressable>
        ))}
      </View>
      {view !== 'settings' && <DataStatus />}
      {view === 'words' ? (
        <>
          <View style={{ gap: 12 }}>
            <View style={{ ...controlRow, alignItems: 'stretch', gap: 8 }}>
              <TextInput
                testID="word-search"
                accessibilityLabel={ui.searchLabel}
                placeholder={ui.searchPlaceholder}
                placeholderTextColor={colors.muted}
                value={query}
                onChangeText={setQuery}
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="search"
                clearButtonMode="while-editing"
                style={{
                  ...labelStyle,
                  textAlign: /[\u0600-\u06ff]/.test(query) || isUrdu ? 'right' : 'left',
                  flex: 1,
                  minWidth: 0,
                  minHeight: 48,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  backgroundColor: colors.paper,
                  paddingHorizontal: 14,
                  paddingVertical: 9,
                  fontSize: 15,
                }}
              />
              <Pressable
                testID="filter-toggle"
                accessibilityRole="button"
                accessibilityLabel={ui.filters}
                accessibilityState={{ expanded: filtersOpen }}
                onPress={() => {
                  Keyboard.dismiss();
                  setFiltersOpen(!filtersOpen);
                }}
                style={{
                  minHeight: 48,
                  justifyContent: 'center',
                  paddingHorizontal: 14,
                  borderRadius: 12,
                  backgroundColor:
                    filtersOpen || pos !== 'all' || !showMeanings ? colors.primary : colors.wash,
                }}
              >
                <Text
                  style={[
                    labelStyle,
                    {
                      fontSize: 15,
                      color:
                        filtersOpen || pos !== 'all' || !showMeanings ? '#fff' : colors.primary,
                    },
                  ]}
                >
                  {ui.filters}
                  {pos !== 'all' || !showMeanings ? ' •' : ''}
                </Text>
              </Pressable>
            </View>
            {filtersOpen && (
              <View testID="filter-panel" style={{ ...card, padding: 14, gap: 14 }}>
                <Label muted>{ui.wordType}</Label>
                <View style={{ ...controlRow, flexWrap: 'wrap', gap: 8 }}>
                  {filters.map((filter) => (
                    <Pressable
                      testID={`filter-${filter.value}`}
                      key={filter.value}
                      accessibilityRole="button"
                      accessibilityState={{ selected: pos === filter.value }}
                      accessibilityLabel={filter.label}
                      onPress={() => setPos(filter.value)}
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 9,
                        minHeight: 44,
                        borderRadius: 22,
                        backgroundColor: pos === filter.value ? colors.primary : colors.wash,
                      }}
                    >
                      <Text
                        style={[
                          labelStyle,
                          { fontSize: 14, color: pos === filter.value ? '#fff' : colors.ink },
                        ]}
                      >
                        {filter.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <View style={{ ...controlRow, justifyContent: 'space-between', gap: 12 }}>
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
                </View>
                <Action
                  quiet
                  onPress={() => {
                    clear();
                    setShowMeanings(true);
                  }}
                >
                  {ui.reset}
                </Action>
              </View>
            )}
            {active && (
              <View style={{ ...controlRow, justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <Text
                  accessibilityLiveRegion="polite"
                  style={[labelStyle, { color: colors.muted, fontSize: 13 }]}
                >
                  {count(matches.length)} {ui.matches}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={clear}
                  style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 }}
                >
                  <Text style={[labelStyle, { color: colors.primary, fontSize: 14 }]}>
                    {ui.clearSearch}
                  </Text>
                </Pressable>
              </View>
            )}
            {active && !matches.length && (
              <View style={card}>
                <Label>{ui.noResults}</Label>
                <Action quiet onPress={clear}>
                  {ui.clearSearch}
                </Action>
              </View>
            )}
          </View>
          {study.ayahs.map((ayah) => (
            <View key={ayah.number} style={{ ...card, padding: 15 }} testID={`ayah-${ayah.number}`}>
              <Text style={[labelStyle, { color: colors.muted, fontSize: 13 }]}>
                {ui.ayah} {count(ayah.number)}
              </Text>
              <View style={{ ...row, flexWrap: 'wrap', alignItems: 'stretch', gap: 8 }}>
                {study.words
                  .filter((word) => word.ayah === ayah.number)
                  .map((word) => (
                    <WordToken
                      key={word.id}
                      word={word}
                      matched={ids.has(word.id)}
                      showMeaning={showMeanings}
                      onPress={() => openWord(word)}
                    />
                  ))}
              </View>
              <View style={{ borderTopWidth: 1, borderColor: colors.border, paddingTop: 10 }}>
                <Paragraph>{ayah.translationUrdu}</Paragraph>
              </View>
            </View>
          ))}
        </>
      ) : view === 'grammar' ? (
        <>
          {study.ayahs.map((ayah) => (
            <View key={ayah.number} style={card}>
              <Text style={[labelStyle, { color: colors.muted, fontSize: 13 }]}>
                {ui.ayah} {count(ayah.number)}
              </Text>
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
                  style={{ backgroundColor: colors.wash, borderRadius: 12, padding: 14, gap: 6 }}
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
                          onPress={() => openWord(word)}
                          style={{ minHeight: 48, paddingHorizontal: 7 }}
                        >
                          <Text
                            style={[
                              type.arabic,
                              { fontSize: 24, lineHeight: 56, color: colors.primary },
                            ]}
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
          ))}
        </>
      ) : (
        <Settings />
      )}
    </ScrollView>
  );
}

function Settings() {
  const { ui, language, setLanguage, saveError, saving, labelStyle, controlRow } = useInterface();
  const { bundled, hasApi, loading, retry } = useStudy();
  return (
    <View style={{ gap: 16 }}>
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
      <Section title={ui.dataStatus}>
        <Label muted>{bundled ? ui.offline : ui.connected}</Label>
        {hasApi && (
          <Action quiet disabled={loading} onPress={retry}>
            {loading ? ui.loading : ui.retry}
          </Action>
        )}
        <DataStatus />
      </Section>
      <StudyFooter />
    </View>
  );
}

function WordToken({
  word,
  matched,
  showMeaning,
  onPress,
}: {
  word: Word;
  matched: boolean;
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
      onPress={onPress}
      style={({ pressed }) => ({
        minWidth: 88,
        maxWidth: '100%',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: matched ? colors.border : '#edf0eb',
        backgroundColor: pressed ? colors.wash : colors.paper,
        opacity: matched ? 1 : 0.4,
        alignItems: 'center',
        gap: 3,
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
          paddingHorizontal: 8,
          paddingVertical: 3,
          borderRadius: 5,
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
