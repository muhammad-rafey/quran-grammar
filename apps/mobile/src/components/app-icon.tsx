import { Host, Icon } from '@expo/ui';
import { colors } from '@/theme/tokens';

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
  lock: Icon.select({ ios: 'lock', android: import('@expo/material-symbols/lock.xml') }),
  spark: Icon.select({ ios: 'sparkles', android: import('@expo/material-symbols/wand_stars.xml') }),
} as const;

export function AppIcon({
  name,
  color = colors.primary,
  size = 22,
}: {
  name: keyof typeof icons;
  color?: string;
  size?: number;
}) {
  return (
    <Host colorScheme="light" pointerEvents="none" style={{ width: size, height: size }}>
      <Icon name={icons[name]} color={color} size={size} />
    </Host>
  );
}
