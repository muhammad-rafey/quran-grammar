import { View } from 'react-native';
import { Host, Icon } from '@expo/ui';
import { useTheme } from '@/theme/theme';

const icons = {
  study: Icon.select({
    ios: 'book.closed',
    android: import('@expo/material-symbols/menu_book.xml'),
  }),
  grammar: Icon.select({
    ios: 'square.grid.2x2',
    android: import('@expo/material-symbols/school.xml'),
  }),
  settings: Icon.select({
    ios: 'slider.horizontal.3',
    android: import('@expo/material-symbols/tune.xml'),
  }),
  down: Icon.select({
    ios: 'chevron.down',
    android: import('@expo/material-symbols/keyboard_arrow_down.xml'),
  }),
  filter: Icon.select({
    ios: 'line.3.horizontal.decrease',
    android: import('@expo/material-symbols/filter_list.xml'),
  }),
  check: Icon.select({ ios: 'checkmark', android: import('@expo/material-symbols/check.xml') }),
  close: Icon.select({ ios: 'xmark', android: import('@expo/material-symbols/close.xml') }),
  search: Icon.select({
    ios: 'magnifyingglass',
    android: import('@expo/material-symbols/search.xml'),
  }),
  spark: Icon.select({ ios: 'sparkles', android: import('@expo/material-symbols/wand_stars.xml') }),
  chevronRight: Icon.select({
    ios: 'chevron.right',
    android: import('@expo/material-symbols/chevron_right.xml'),
  }),
  chevronLeft: Icon.select({
    ios: 'chevron.left',
    android: import('@expo/material-symbols/chevron_left.xml'),
  }),
} as const;

export function AppIcon({
  name,
  color,
  size = 22,
}: {
  name: keyof typeof icons;
  /** Defaults to the theme's primary colour. */
  color?: string;
  size?: number;
}) {
  const { colors, scheme } = useTheme();
  // The native Compose host consumes touches on Android even with pointerEvents="none",
  // so a tap on the icon never reached the surrounding button. React Native's own
  // hit-testing honours pointerEvents on a plain View and passes the touch to the parent.
  return (
    <View pointerEvents="none" style={{ width: size, height: size }}>
      <Host colorScheme={scheme} style={{ width: size, height: size }}>
        <Icon name={icons[name]} color={color ?? colors.primary} size={size} />
      </Host>
    </View>
  );
}
