import { Patient, PatientMeasure } from '@/models/schemas';
import { observable } from '@legendapp/state';
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv';
import { synced } from '@legendapp/state/sync';

export const modeles$ = observable({
  patients: synced<Record<string, Patient>>({
    persist: {
      name: 'patients',
      plugin: ObservablePersistMMKV,
    },
    initial: {},
  }),
  patient_measures: synced<Record<string, PatientMeasure[]>>({
    persist: {
      name: 'patient_measures',
      plugin: ObservablePersistMMKV,
    },
    initial: {},
  }),
});
