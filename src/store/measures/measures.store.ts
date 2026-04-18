import { MeasureCategory } from '@/constants';
import { PatientMeasures } from '@/schemas';
import ObservablePersistMMKV from '@/store/config/mmkv';
import { observable } from '@legendapp/state';
import { synced } from '@legendapp/state/sync';

export const emptyPatientMeasures = (): PatientMeasures => ({
  [MeasureCategory.ANTHRO]: [],
  [MeasureCategory.FIELD]: [],
  [MeasureCategory.BIOLOGICAL]: [],
});

export const measures$ = observable<Record<string, PatientMeasures>>(
  synced({
    persist: { name: 'measures', plugin: ObservablePersistMMKV },
    initial: {},
  }),
);

export function initPatientMeasures(patientId: string): void {
  const existing = measures$[patientId].peek();
  if (!existing) {
    measures$[patientId].set(emptyPatientMeasures());
  }
}

export function getOrInitPatientMeasures(patientId: string): PatientMeasures {
  const existing = measures$[patientId].peek();
  if (!existing) {
    const empty = emptyPatientMeasures();
    measures$[patientId].set(empty);
    return empty;
  }
  return existing;
}
