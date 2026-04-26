import { logger } from '@/lib/utils/logger';
import { supabase } from '@/services/supabase';
import ObservablePersistMMKV from '@/store/config/mmkv';
import { computed, observable } from '@legendapp/state';
import { synced } from '@legendapp/state/sync';
import { getDepartmentName, getFacilityName, getServiceName } from '../data/reference-data.store';

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
  is_active: boolean;
  department_id: string | null;
  department_name: string | null;
  facility_id: string | null;
  facility_level: string | null;
  facility_name: string | null;
  facility_short_name: string | null;
  facility_type: string | null;
  health_zone_id: string | null;
  health_zone_name: string | null;
  nutrition_unit_type: string | null;
  service_id: string | null;
  service_name: string | null;
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
          department_id: value.department_id,
          facility_id: value.facility_id,
          health_zone_id: value.health_zone_id,
          service_id: value.service_id,
        })
        .eq('id', id);
      if (error) {
        logger.warn('[userProfile$] Failed to update profile:', error.message);
      }
    },
    waitFor: () => user$.user.get() !== null && user$.user.id.get() !== undefined,
    persist: {
      plugin: ObservablePersistMMKV,
      name: 'profile',
      retrySync: true,
    },
  }),
);

export const isProfileLoaded$ = computed(() => userProfile$.get() !== null);

export const isAccountActive$ = computed(() => userProfile$.get()?.is_active ?? true);

export function clearUserProfile(): void {
  userProfile$.set(null);
  const storage = new ObservablePersistMMKV({ id: 'obsPersist' });
  storage.deleteTable('profile', { plugin: ObservablePersistMMKV, name: 'profile' });
  storage.deleteMetadata('profile', { plugin: ObservablePersistMMKV, name: 'profile' });
}

export const userProfileDepartmentName$ = computed(() => {
  const departmentId = userProfile$.department_id.get();
  if (!departmentId) return null;
  return getDepartmentName(departmentId);
});

export const userProfileFacilityName$ = computed(() => {
  const facilityId = userProfile$.facility_id.get();
  if (!facilityId) return null;
  return getFacilityName(facilityId);
});

export const userProfileServiceName$ = computed(() => {
  const serviceId = userProfile$.service_id.get();
  if (!serviceId) return null;
  return getServiceName(serviceId);
});
