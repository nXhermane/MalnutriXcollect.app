import { logger } from '@/lib/utils/logger';
import { supabase } from '@/services/supabase';
import ObservablePersistMMKV from '@/store/config/mmkv';
import { computed, observable } from '@legendapp/state';
import { synced } from '@legendapp/state/sync';

export interface User {
  id: string;
  email?: string | null;
  phone?: string | null;
}

export interface UserState {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
}

export const user$ = observable<UserState>({
  isLoading: true,
  isLoggedIn: false,
  user: null,
});

export const PROFESSION_OPTIONS = [
  { label: 'Infirmier(e)', value: 'nurse' },
  { label: 'Aide-soignant(e)', value: 'aide_soignant' },
  { label: 'Assistant(e) social(e)', value: 'social_worker' },
  { label: 'Autre', value: 'other' },
] as const;

export interface UserProfile {
  id: string;
  display_name: string | null;
  profession: (typeof PROFESSION_OPTIONS)[number]['value'];
  specialty: string | null;
  phone: string | null;
  bio: string | null;
  role: string | null;
  avatar_url: string | null;
}

export const userProfile$ = observable<UserProfile | null>(
  synced({
    get: async () => {
      const id = user$.user.id.peek();
      if (!id) return null;
      const { data, error } = await supabase.from('v_soignants').select('*').eq('id', id).single();
      if (error) {
        logger.warn('[userProfile$] Failed to fetch profile:', error.message);
        throw new Error(error.message);
      }
      return data as UserProfile;
    },
    set: async ({ value }: { value: UserProfile | null }) => {
      const id = user$.user.id.peek();
      if (!id || !value) return;
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: value.display_name,
          profession: value.profession,
          specialty: value.specialty,
          phone: value.phone,
          bio: value.bio,
        })
        .eq('id', id);
      if (error) {
        console.warn('[userProfile$] Failed to update profile:', error.message);
      }
    },
    waitFor: () => user$.user.id.get() !== undefined,
    persist: {
      plugin: ObservablePersistMMKV,
      name: 'profile',
      retrySync: true,
    },
  }),
);

export const isProfileLoaded$ = computed(() => userProfile$.get() !== null);
