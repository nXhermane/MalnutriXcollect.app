import { generateRandomId } from '@/lib/utils/random';
import { default as ObservablePersistMMKV } from './mmkv';
import { configureObservableSync } from '@legendapp/state/sync';
import { configureSyncedSupabase } from '@legendapp/state/sync-plugins/supabase';
import * as mmkv from 'react-native-mmkv';

configureObservableSync({
  persist: {
    plugin: ObservablePersistMMKV,
  },
  syncMode: 'auto',
});

configureSyncedSupabase({
  generateId: generateRandomId,
});

function clearAllPersist(): void {
  const storage = mmkv.createMMKV({ id: 'obsPersist' });
  storage.clearAll();
}

export { ObservablePersistMMKV, clearAllPersist };
