import { observable, computed } from '@legendapp/state';
import { synced } from '@legendapp/state/sync';
import { ObservablePersistMMKV } from '../config';

export type Theme = { mode: 'dark' | 'light'; isSystem: boolean };
export const theme$ = observable<Theme>(
  synced({
    persist: {
      name: 'theme',
      plugin: ObservablePersistMMKV,
    },
    initial: {
      mode: 'dark',
      isSystem: true,
    },
  }),
);
export const isDark$ = computed(() => {
  const theme = theme$.mode.get();
  return theme === 'dark';
});
