import { Visit } from '@/schemas';
import ObservablePersistMMKV from '@/store/config/mmkv';
import { observable } from '@legendapp/state';
import { synced } from '@legendapp/state/sync';

export const visits$ = observable<Record<string, Visit[]>>(
  synced({
    persist: { name: 'visits', plugin: ObservablePersistMMKV },
    initial: {},
  }),
);
