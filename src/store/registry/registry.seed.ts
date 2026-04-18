import { dataFieldRefs } from '@/data/fields';
import type { SyncDataFieldRef } from '@/schemas/registry.schema';
import { ObservablePersistMMKV } from '@/store/config';
import { observable } from '@legendapp/state';
import { synced } from '@legendapp/state/sync';
import { registry$ } from './registry.store';

const BUILTIN_HASH_PREFIX = 'builtin';

const registrySeedState$ = observable(
  synced({
    persist: { name: 'registry_seed', plugin: ObservablePersistMMKV },
    initial: { seeded: false },
  }),
);

function mapToSyncDataFieldRef(field: (typeof dataFieldRefs)[number]): SyncDataFieldRef {
  return {
    id: `${BUILTIN_HASH_PREFIX}:${field.code}`,
    code: field.code,
    label: field.label,
    question: field.question,
    category: field.category,
    type: field.type,
    range: field.range ?? null,
    enum: field.enum ?? null,
    units: field.units ?? null,
    defaultValue: field.defaultValue,
    condition: field.condition
      ? {
          field: field.condition.field,
          fieldType: field.condition.fieldType,
          operator: field.condition.operator,
          value: field.condition.value,
        }
      : null,
  };
}

export function seedRegistryWithBuiltins(): void {
  if (registrySeedState$.seeded.peek()) return;

  for (const field of dataFieldRefs) {
    registry$.dataField[field.code].set({
      hash: `${BUILTIN_HASH_PREFIX}:${field.code}`,
      data: mapToSyncDataFieldRef(field),
    });
  }

  registrySeedState$.seeded.set(true);
}

export function resetAndReseedRegistry(): void {
  registry$.set({
    medicine: {},
    therapeutic: {},
    biological: {},
    indicator: {},
    clinicalSign: {},
    dataField: {},
  });
  registrySeedState$.seeded.set(false);
  seedRegistryWithBuiltins();
}
