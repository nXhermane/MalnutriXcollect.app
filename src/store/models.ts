import { Patient, PatientMeasure } from '@/models/entities';
import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv';

export interface PatientStore {
  patients: Patient[];
  total: number;
  lockeds: number;
}

export const patientStore$ = observable<PatientStore>({
  patients: [],
  total: (): number => {
    return patientStore$.patients.length;
  },
  lockeds: (): number => {
    return patientStore$.patients.length;
  },
});
export interface PatientMeasureStore {
  patientMeasures: PatientMeasure[];
}
export const patientMeasureStore$ = observable<PatientMeasureStore>({
  patientMeasures: [],
});

syncObservable(patientStore$.patients, {
  persist: {
    name: 'patients',
    plugin: ObservablePersistMMKV,
  },
});
syncObservable(patientMeasureStore$.patientMeasures, {
  persist: {
    name: 'patient_measures',
    plugin: ObservablePersistMMKV,
  },
});
