import { Patient, PatientMeasure } from '@/models/schemas';
import { observable } from '@legendapp/state';
import { synced, configureObservableSync } from '@legendapp/state/sync';
import { ObservablePersistMMKV } from './mmkv';

configureObservableSync({
  persist: {
    plugin: ObservablePersistMMKV,
  },
  syncMode: 'auto',
});
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
  search_text: '',
  filtered_patients: () => {
    const patientsObj = modeles$.patients.get();
    const patients: Patient[] = Object.values(patientsObj);
    const search = modeles$.search_text.get()?.trim().toLowerCase() || '';
    if (!search) {
      return patients;
    } else {
      return patients.filter((patient) => patient.name.toLowerCase().includes(search));
    }
  },
  non_exported_patients: () => {
    const unexported_patients_ids = [];
    for (const [patientId, measures] of Object.entries(modeles$.patient_measures)) {
      if (measures.some((measure) => !measure.isExported.get())) {
        unexported_patients_ids.push(patientId);
      }
    }
    return unexported_patients_ids;
  },
});
