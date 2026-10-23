import { ActivityIndicator, Linking, Pressable, Text, View, type TextStyle } from 'react-native';
import type { ReactNode } from 'react';
import { useStudy } from '@/state/study-provider';
import { useInterface } from '@/state/preferences-provider';
import { card, colors, type } from '@/theme/tokens';

export function Action({
  children,
  onPress,
  disabled = false,
  quiet = false,
  label,
}: {
  children: ReactNode;
  onPress: () => void;
  disabled?: boolean;
  quiet?: boolean;
  label?: string;
}) {
  const { labelStyle } = useInterface();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => ({
        minHeight: 46,
        paddingHorizontal: 16,
        paddingVertical: 9,
        borderRadius: 16,
        borderBottomWidth: pressed ? 1 : 4,
        borderColor: quiet ? colors.edge : colors.primaryEdge,
        backgroundColor: quiet ? colors.wash : colors.primary,
        opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
        justifyContent: 'center',
      })}
    >
      <Text style={[labelStyle, { textAlign: 'center', color: quiet ? colors.primary : '#fff' }]}>
        {children}
      </Text>
    </Pressable>
  );
}

export function Label({
  children,
  muted = false,
  style,
}: {
  children: ReactNode;
  muted?: boolean;
  style?: TextStyle;
}) {
  const { labelStyle } = useInterface();
  return (
    <Text style={[labelStyle, muted && { color: colors.muted, fontSize: 14 }, style]}>
      {children}
    </Text>
  );
}

export function Paragraph({
  children,
  muted = false,
  style,
}: {
  children: ReactNode;
  muted?: boolean;
  style?: TextStyle;
}) {
  return (
    <Text selectable style={[muted ? type.small : type.body, style]}>
      {children}
    </Text>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  const { labelStyle } = useInterface();
  return (
    <View style={card}>
      <Text accessibilityRole="header" style={[labelStyle, { fontSize: 18, fontWeight: '600' }]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

export function DataStatus() {
  const { error, loading, retry } = useStudy();
  const { ui, labelStyle, controlRow } = useInterface();
  if (!error && !loading) return null;
  return (
    <View style={{ padding: 12, borderRadius: 12, backgroundColor: colors.amberWash, gap: 8 }}>
      {error && (
        <Text accessibilityRole="alert" style={labelStyle}>
          {ui.loadError}
        </Text>
      )}
      {loading && (
        <View style={controlRow}>
          <ActivityIndicator color={colors.primary} />
          <Label muted>{ui.loading}</Label>
        </View>
      )}
      {error && !loading && (
        <Action quiet onPress={retry}>
          {ui.retry}
        </Action>
      )}
    </View>
  );
}

export function InitialDataState() {
  const { loading, retry, useBundled } = useStudy();
  const { ui, labelStyle } = useInterface();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: 26,
        gap: 20,
        backgroundColor: colors.background,
      }}
    >
      {loading ? (
        <>
          <ActivityIndicator size="large" color={colors.primary} />
          <Label style={{ textAlign: 'center' }}>{ui.loading}</Label>
        </>
      ) : (
        <>
          <Text accessibilityRole="alert" style={[labelStyle, { textAlign: 'center' }]}>
            {ui.loadError}
          </Text>
          <Action onPress={retry}>{ui.retry}</Action>
          <Action quiet onPress={useBundled}>
            {ui.useOffline}
          </Action>
        </>
      )}
    </View>
  );
}

export function StudyFooter() {
  const { ui } = useInterface();
  return (
    <View style={{ gap: 4, paddingTop: 10, paddingBottom: 16 }}>
      <Label muted style={{ textAlign: 'center', fontSize: 12 }}>
        {ui.educationalDraft}
      </Label>
      <Text
        onPress={() => void Linking.openURL('https://corpus.quran.com')}
        accessibilityRole="link"
        style={{
          fontSize: 11,
          color: colors.muted,
          textAlign: 'center',
          padding: 12,
          minHeight: 44,
        }}
      >
        Morphology: Quranic Arabic Corpus
      </Text>
    </View>
  );
}
