import { Patient } from '@/schemas';
import ObservablePersistMMKV from '@/store/config/mmkv';
import { observable } from '@legendapp/state';
import { synced } from '@legendapp/state/sync';

export const patients$ = observable<Record<string, Patient>>(
  synced({
    persist: { name: 'patients', plugin: ObservablePersistMMKV },
    initial: {},
  }),
);
