import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from '@/components/app-icon';
import { useInterface } from '@/state/preferences-provider';
import { colors, radius, shadows, spacing } from '@/theme/tokens';

export type StudyView = 'words' | 'grammar' | 'settings';

export function FloatingNavigation({
  value,
  onChange,
}: {
  value: StudyView;
  onChange: (view: StudyView) => void;
}) {
  const { ui, labelStyle, controlRow } = useInterface();
  const insets = useSafeAreaInsets();
  const tabs = [
    { value: 'words', title: ui.study, icon: 'study' },
    { value: 'grammar', title: ui.grammar, icon: 'grammar' },
    { value: 'settings', title: ui.settings, icon: 'settings' },
  ] as const;
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        bottom: Math.max(insets.bottom, 12),
        left: 16,
        right: 16,
        alignItems: 'center',
      }}
    >
      <View
        accessibilityRole="tablist"
        style={{
          ...controlRow,
          gap: spacing.xs,
          padding: spacing.sm,
          borderRadius: radius.pill,
          backgroundColor: colors.paper,
          borderWidth: 1,
          borderColor: colors.border,
          boxShadow: shadows.floating,
          maxWidth: 380,
        }}
      >
        {tabs.map((tab) => {
          const active = value === tab.value;
          return (
            <Pressable
              key={tab.value}
              testID={`tab-${tab.value}`}
              accessibilityRole="tab"
              accessibilityLabel={tab.title}
              accessibilityState={{ selected: active }}
              onPress={() => onChange(tab.value)}
              style={({ pressed }) => ({
                ...controlRow,
                minHeight: 50,
                minWidth: 64,
                justifyContent: 'center',
                gap: spacing.sm,
                paddingHorizontal: active ? spacing.lg : spacing.md,
                borderRadius: radius.pill,
                backgroundColor: active
                  ? colors.lime
                  : pressed
                    ? colors.wash
                    : colors.transparent,
              })}
            >
              <AppIcon name={tab.icon} color={active ? colors.primary : colors.muted} />
              {active && (
                <Text
                  style={[labelStyle, { color: colors.primary, fontSize: 15, fontWeight: '600' }]}
                >
                  {tab.title}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
