import type {
  RegistryType,
  SyncBiologicalRef,
  SyncClinicalSignRef,
  SyncDataFieldRef,
  SyncIndicatorRef,
  SyncMedicineRef,
  SyncTherapeuticRef,
} from '@/schemas/registry.schema';
import { registry$ } from '@/store/registry/registry.store';

interface RegistryEntry<T> {
  code: string;
  hash: string;
  data: T;
}

export interface ServerRegistryPayload {
  medicine: RegistryEntry<SyncMedicineRef>[];
  therapeutic: RegistryEntry<SyncTherapeuticRef>[];
  biological: RegistryEntry<SyncBiologicalRef>[];
  indicator: RegistryEntry<SyncIndicatorRef>[];
  clinicalSign: RegistryEntry<SyncClinicalSignRef>[];
  dataField: RegistryEntry<SyncDataFieldRef>[];
}

export function mergeRegistryDiff(payload: ServerRegistryPayload): Record<RegistryType, string[]> {
  const updatedCodes: Record<RegistryType, string[]> = {
    medicine: [],
    therapeutic: [],
    biological: [],
    indicator: [],
    clinicalSign: [],
    dataField: [],
  };

  for (const entry of payload.medicine) {
    registry$.medicine[entry.code].set({ hash: entry.hash, data: entry.data });
    updatedCodes.medicine.push(entry.code);
  }
  for (const entry of payload.therapeutic) {
    registry$.therapeutic[entry.code].set({ hash: entry.hash, data: entry.data });
    updatedCodes.therapeutic.push(entry.code);
  }
  for (const entry of payload.biological) {
    registry$.biological[entry.code].set({ hash: entry.hash, data: entry.data });
    updatedCodes.biological.push(entry.code);
  }
  for (const entry of payload.indicator) {
    registry$.indicator[entry.code].set({ hash: entry.hash, data: entry.data });
    updatedCodes.indicator.push(entry.code);
  }
  for (const entry of payload.clinicalSign) {
    registry$.clinicalSign[entry.code].set({ hash: entry.hash, data: entry.data });
    updatedCodes.clinicalSign.push(entry.code);
  }
  for (const entry of payload.dataField) {
    registry$.dataField[entry.code].set({ hash: entry.hash, data: entry.data });
    updatedCodes.dataField.push(entry.code);
  }

  return updatedCodes;
}

export function buildCacheManifest(): Record<RegistryType, { code: string; hash: string }[]> {
  const cache = registry$.peek();
  return (Object.keys(cache) as RegistryType[]).reduce(
    (acc, type) => {
      acc[type] = Object.entries(cache[type]).map(([code, entry]) => ({
        code,
        hash: entry.hash,
      }));
      return acc;
    },
    {} as Record<RegistryType, { code: string; hash: string }[]>,
  );
}

export function getDataFieldRef(code: string): SyncDataFieldRef | undefined {
  return registry$.dataField[code].peek()?.data;
}

export function getBiologicalRef(code: string): SyncBiologicalRef | undefined {
  return registry$.biological[code].peek()?.data;
}

export function getMedicineRef(code: string): SyncMedicineRef | undefined {
  return registry$.medicine[code].peek()?.data;
}

export function getTherapeuticRef(code: string): SyncTherapeuticRef | undefined {
  return registry$.therapeutic[code].peek()?.data;
}

export function getIndicatorRef(code: string): SyncIndicatorRef | undefined {
  return registry$.indicator[code].peek()?.data;
}

export function getClinicalSignRef(code: string): SyncClinicalSignRef | undefined {
  return registry$.clinicalSign[code].peek()?.data;
}
