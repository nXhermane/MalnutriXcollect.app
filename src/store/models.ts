import { Patient, PatientMeasure } from '@/models/schemas';
import { staticPatientMeasures, staticPatients } from '@/utils/staticData';
import { computed, observable } from '@legendapp/state';
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv';
import { synced } from '@legendapp/state/sync';

export const modeles$ = observable({
  patients: synced<Record<string, Patient>>({
    persist: {
      name: 'patients',
      plugin: ObservablePersistMMKV,
    },
    initial: staticPatients.reduce(
      (acc, patient) => {
        acc[patient.id] = patient;
        return acc;
      },
      {} as Record<string, Patient>,
    ),
  }),
  patient_measures: synced<Record<string, PatientMeasure[]>>({
    persist: {
      name: 'patient_measures',
      plugin: ObservablePersistMMKV,
    },
    initial: staticPatientMeasures,
  }),
  search_text: '',
});
export const filtered_patients$ = computed(() => {
  const patients: Patient[] = Object.values(modeles$.patients?.get());
  const search = modeles$.search_text?.get().trim().toLowerCase();

  if (!search) return patients;

  return patients.filter((patient) => patient.name.toLowerCase().includes(search));
});
