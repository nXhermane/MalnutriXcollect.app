import { observable } from '@legendapp/state';
import { synced } from '@legendapp/state/sync';
import { ObservablePersistMMKV } from '../config';
export const settings$ = observable(
  synced({
    initial: {
      haptics: {
        enabled: true,
      },
      ui: {
        // TODO: enable blur feature after refactoring of blur . and enable settings session ofblurview
        blurEnabled: false,
      },
      personalization: {
        workHours: {
          start: '08:00',
          end: '18:00',
        },
      },
    },
    persist: {
      name: 'settings',
      plugin: ObservablePersistMMKV,
    },
  }),
);
