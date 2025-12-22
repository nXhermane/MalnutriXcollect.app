import { observable } from '@legendapp/state';
import { synced } from '@legendapp/state/sync';
import { ObservablePersistMMKV } from './mmkv';

export const app_info$ = observable<{ client_id: string | null }>(
  synced({
    persist: {
      name: 'app.info',
      plugin: ObservablePersistMMKV,
    },
    initial: { client_id: null },
  }),
);
