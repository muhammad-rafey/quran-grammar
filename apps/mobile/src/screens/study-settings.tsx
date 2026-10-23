import { Pressable, Text, View } from 'react-native';
import { useStudy } from '@/state/study-provider';
import { useInterface } from '@/state/preferences-provider';
import { Action, DataStatus, Label, Section, StudyFooter } from '@/components/study-ui';
import { colors } from '@/theme/tokens';

export function Settings() {
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
