import { supabase } from '@/services/supabase';
import { observable } from '@legendapp/state';
import { user$ } from '../user/user.store';
import { ObservablePersistMMKV } from '../config';
import { Database } from '@/services/supabase/database.types';
import { logger } from '@/lib/utils/logger';
import { synced } from '@legendapp/state/sync';

export type DepartmentRef = Database['public']['Tables']['departments']['Row'];
export type FacilityRef = Database['public']['Tables']['facilities']['Row'];
export type ServiceRef = Database['public']['Tables']['hospital_services']['Row'];

export const departments$ = observable(
  synced({
    get: async () => {
      const user = user$.user.get();
      if (!user) return [];
      logger.debug('[departments$] Fetching departments');
      const { data, error } = await supabase.from('departments').select('*');
      if (error) {
        logger.error('[departments$] Error fetching departments', error);
        return [];
      }
      return data;
    },
    waitFor: () => user$.user.get() !== null && user$.user.id.get() !== undefined,
    persist: {
      plugin: ObservablePersistMMKV,
      name: 'departments',
    },
    initial: [],
  }),
);

export const facilities$ = observable(
  synced({
    get: async () => {
      const user = user$.user.get();
      if (!user) return [];
      logger.debug('[facilities$] Fetching facilities');
      const { data, error } = await supabase.from('facilities').select('*');
      if (error) {
        logger.error('[facilities$] Error fetching facilities', error);
        return [];
      }
      return data;
    },
    waitFor: () => user$.user.get() !== null && user$.user.id.get() !== undefined,
    persist: {
      plugin: ObservablePersistMMKV,
      name: 'facilities',
    },
    initial: [],
  }),
);

export const services$ = observable(
  synced({
    get: async () => {
      const user = user$.user.get();
      if (!user) return [];
      logger.debug('[services$] Fetching services');
      const { data, error } = await supabase.from('hospital_services').select('*');
      if (error) {
        logger.error('[services$] Error fetching services', error);
        return [];
      }
      return data;
    },
    waitFor: () => user$.user.get() !== null && user$.user.id.get() !== undefined,
    persist: {
      plugin: ObservablePersistMMKV,
      name: 'services',
    },
    initial: [],
  }),
);

export function getFacilitiesByDepartment(departmentId: string) {
  return facilities$.get().filter((facility) => facility.department_id === departmentId);
}

export function getServicesByFacility(facilityId: string) {
  return services$.get().filter((service) => service.facility_id === facilityId);
}
