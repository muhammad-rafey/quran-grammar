import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  Text,
  View,
  type TextStyle,
} from 'react-native';
import type { ReactNode } from 'react';
import { useStudy } from '@/state/study-provider';
import { useInterface } from '@/state/preferences-provider';
import { cardStyle, lineEndSlack } from '@/theme/tokens';
import { themed, useTheme } from '@/theme/theme';
import { useTypography } from '@/theme/typography';

export function Action({
  children,
  onPress,
  disabled = false,
  quiet = false,
  label,
  testID,
}: {
  children: ReactNode;
  onPress: () => void;
  disabled?: boolean;
  quiet?: boolean;
  label?: string;
  testID?: string;
}) {
  const { labelStyle } = useInterface();
  const { colors } = useTheme();
  return (
    <Pressable
      testID={testID}
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
      <Text style={[labelStyle, { textAlign: 'center', color: quiet ? colors.primary : colors.onPrimary }]}>
        {children}
        {lineEndSlack}
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
  const { labelText } = useInterface();
  const { colors } = useTheme();
  // The size goes through labelText so Urdu text gets a lineHeight its font needs.
  const { fontSize = muted ? 14 : 16, lineHeight, ...rest } = style ?? {};
  return (
    <Text style={[labelText(fontSize, lineHeight), muted && { color: colors.muted }, rest]}>
      {children}
      {lineEndSlack}
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
  const typography = useTypography();
  return (
    <Text selectable style={typography.safe([muted ? typography.small : typography.body, style])}>
      {children}
      {lineEndSlack}
    </Text>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  const { labelText } = useInterface();
  const { colors } = useTheme();
  return (
    <View style={cardStyle(colors)}>
      <Text accessibilityRole="header" style={[labelText(18), { fontWeight: '600' }]}>
        {title}
        {lineEndSlack}
      </Text>
      {children}
    </View>
  );
}

export function DataStatus() {
  const { error, loading, retry } = useStudy();
  const { ui, labelStyle, controlRow } = useInterface();
  const { colors } = useTheme();
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

export function InitialDataState({
  pending = false,
  state,
}: {
  pending?: boolean;
  /** Overrides the selected chapter's state, e.g. for a word screen showing another chapter. */
  state?: { loading: boolean; retry: () => void };
}) {
  const selected = useStudy();
  const { loading, retry } = state ?? selected;
  const { ui, labelStyle } = useInterface();
  const { colors } = useTheme();
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
      {loading || pending ? (
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
        </>
      )}
    </View>
  );
}

/** One source credit in Settings → About: a link of at least the minimum touch height. */
function CreditLink({
  url,
  style,
  children,
}: {
  url: string;
  style: TextStyle;
  children: ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <Text
      onPress={() => void Linking.openURL(url)}
      accessibilityRole="link"
      style={[style, { color: colors.muted, paddingVertical: 10, minHeight: 44 }]}
    >
      {children}
      {lineEndSlack}
    </Text>
  );
}

const linkStyles = themed((colors) => {
  const link = { color: colors.primary, textDecorationLine: 'underline' } as const;
  return {
    link,
    // "Quran.com" inside an Urdu credit: the Urdu font has no Latin, and Android's fallback is serif.
    latin: {
      ...link,
      ...(Platform.OS === 'android' ? { fontFamily: 'sans-serif' } : null),
    } as TextStyle,
  };
});

/**
 * Settings → About: the required Quranic Arabic Corpus credit (morphology and grammar) and the
 * Quran.com credit for the ayah translations and Urdu word-by-word meanings.
 */
export function AboutSection() {
  const { ui, labelText } = useInterface();
  const links = linkStyles(useTheme().colors);
  return (
    <Section title={ui.about}>
      <CreditLink
        url="https://corpus.quran.com"
        style={{ fontSize: 14, lineHeight: 20, textAlign: 'left', writingDirection: 'ltr' }}
      >
        {'Morphology: '}
        <Text style={links.link}>Quranic Arabic Corpus</Text>
      </CreditLink>
      <CreditLink url="https://quran.com" style={labelText(14)}>
        {`${ui.translationSource}: `}
        <Text style={links.latin}>Quran.com</Text>
      </CreditLink>
    </Section>
  );
}
