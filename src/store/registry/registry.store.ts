import { MeasureCategory } from '@/constants';
import { anthroLabels, clinicalLabels } from '@/data/visit-labels';
import type { RegistryCache, RegistryType } from '@/schemas/registry.schema';
import { ObservablePersistMMKV } from '@/store/config';
import { observable } from '@legendapp/state';
import { synced } from '@legendapp/state/sync';

const emptyRegistry = (): RegistryCache => ({
  medicine: {},
  therapeutic: {},
  biological: {},
  indicator: {},
  clinicalSign: {},
  dataField: {},
});

export const registry$ = observable<RegistryCache>(
  synced({
    persist: { name: 'registry', plugin: ObservablePersistMMKV },
    initial: emptyRegistry(),
  }),
);

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

export function getRef<T extends RegistryType>(
  type: T,
  code: string,
): RegistryCache[T][string] | undefined {
  return registry$[type][code].peek() as RegistryCache[T][string] | undefined;
}

export function getMeasureLabel(code: string, category: MeasureCategory): string {
  switch (category) {
    case MeasureCategory.FIELD:
      return registry$.dataField[code].peek()?.data.label ?? clinicalLabels[code] ?? code;
    case MeasureCategory.BIOLOGICAL:
      return registry$.biological[code].peek()?.data.name ?? code;
    case MeasureCategory.ANTHRO:
      return registry$.indicator[code].peek()?.data.name ?? anthroLabels[code] ?? code;
    case MeasureCategory.CLINICAL:
      return registry$.clinicalSign[code].peek()?.data.name ?? code;
  }
}
export function getTreatmentLabel(
  treatmentType: 'medication' | 'nutritional' | 'supportive',
  treatmentCode: string | null,
): string {
  if (treatmentType === 'supportive') return 'Traitement supportif';
  if (!treatmentCode) return treatmentType;

  if (treatmentType === 'medication') {
    const medicine = registry$.medicine[treatmentCode].peek();
    return medicine?.data.name ?? treatmentCode;
  }

  return registry$.therapeutic[treatmentCode].peek()?.data.name ?? treatmentCode;
}
