import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV({
  id: 'supabase-storage',
  encryptionKey: process.env.EXPO_PUBLIC_SUPABASE_STORAGE_ENCRYPTION_KEY,
});

export const supabaseStorage = {
  getItem: (key: string): string | null => {
    return storage.getString(key) ?? null;
  },
  setItem: (key: string, value: string): void => {
    storage.set(key, value);
  },
  removeItem: (key: string): void => {
    storage.remove(key);
  },
  clearStore: (): void => {
    storage.clearAll();
  },
};
