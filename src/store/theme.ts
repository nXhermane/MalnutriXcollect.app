import { observable, computed } from '@legendapp/state';
import { Appearance } from 'react-native';

export type Theme = 'dark' | 'light' | 'system';
export const theme$ = observable<Theme>('system');
export const isDark$ = computed(() => {
  const theme = theme$.get();
  return theme === 'dark' || (theme === 'system' && Appearance.getColorScheme() === 'dark');
});
