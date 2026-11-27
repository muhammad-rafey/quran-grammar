import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from '@/components/app-icon';
import { useInterface } from '@/state/preferences-provider';
import { backArrow } from '@/state/back-navigation';
import { lineEndSlack, radius, spacing } from '@/theme/tokens';
import { themed, useTheme } from '@/theme/theme';

/**
 * The top bar of a pushed practice-flow screen (topic, quiz): a large Back button (arrow + label in
 * the interface language, on the reading-start side) and the screen title. It stays above the
 * scrolling content, so Back is always in view. `onBack` is the same function the Android back
 * button runs (useStackBack).
 */
export function BackBar({ onBack, title }: { onBack: () => void; title?: string }) {
  const { ui, labelText, controlRow, isUrdu } = useInterface();
  const { colors } = useTheme();
  const styles = barStyles(colors);
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingTop: insets.top }]}>
      <View style={[controlRow, styles.content]}>
        <Pressable
          testID="back-button"
          accessibilityRole="button"
          accessibilityLabel={ui.back}
          onPress={onBack}
          hitSlop={6}
          style={({ pressed }) => [
            controlRow,
            styles.button,
            pressed && { backgroundColor: colors.lime, borderBottomWidth: 1 },
          ]}
        >
          <AppIcon name={backArrow(isUrdu)} size={22} />
          <Text style={[labelText(17), styles.label]}>
            {ui.back}
            {lineEndSlack}
          </Text>
        </Pressable>
        {title ? (
          <Text
            accessibilityRole="header"
            numberOfLines={1}
            style={[labelText(17), styles.title]}
          >
            {title}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const barStyles = themed(
  (colors) =>
    ({
      bar: {
        backgroundColor: colors.paper,
        borderBottomWidth: 1,
        borderColor: colors.border,
      },
      content: {
        gap: spacing.md,
        minHeight: 64,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        width: '100%',
        maxWidth: 760,
        alignSelf: 'center',
      },
      button: {
        gap: spacing.sm,
        minHeight: 48,
        minWidth: 48,
        paddingHorizontal: spacing.lg,
        justifyContent: 'center',
        borderRadius: radius.pill,
        borderWidth: 1,
        borderBottomWidth: 3,
        borderColor: colors.edge,
        backgroundColor: colors.wash,
      },
      label: { color: colors.primary, fontWeight: '700' },
      title: { flex: 1, fontWeight: '600' },
    }) as const,
);
