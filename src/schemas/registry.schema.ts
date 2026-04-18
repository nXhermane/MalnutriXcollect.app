import { DataFieldCategory, DataFieldConditionOperator, FieldDataType } from '@/constants';
import * as v from 'valibot';

export const syncMedicineRefSchema = v.object({
  id: v.string(),
  code: v.string(),
  name: v.string(),
});

export const syncTherapeuticRefSchema = v.object({
  id: v.string(),
  code: v.string(),
  name: v.string(),
});

export const syncIndicatorRefSchema = v.object({
  id: v.string(),
  code: v.string(),
  name: v.string(),
});

export const syncClinicalSignRefSchema = v.object({
  id: v.string(),
  code: v.string(),
  name: v.string(),
});

export const syncBiologicalRefSchema = v.object({
  id: v.string(),
  code: v.string(),
  name: v.string(),
  unit: v.string(),
  availableUnits: v.array(v.string()),
});

export const syncDataFieldRefSchema = v.object({
  id: v.string(),
  code: v.string(),
  label: v.string(),
  question: v.string(),
  category: v.enum(DataFieldCategory),
  type: v.string(),
  range: v.nullable(v.tuple([v.number(), v.number()])),
  enum: v.nullable(v.array(v.object({ label: v.string(), value: v.string() }))),
  units: v.nullable(
    v.object({
      default: v.string(),
      available: v.array(v.string()),
    }),
  ),
  defaultValue: v.unknown(),
  condition: v.nullable(
    v.object({
      field: v.string(),
      fieldType: v.enum(FieldDataType),
      operator: v.enum(DataFieldConditionOperator),
      value: v.unknown(),
    }),
  ),
});

const registryCacheEntrySchema = <T extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(
  dataSchema: T,
) =>
  v.object({
    hash: v.string(),
    data: dataSchema,
  });

export const registryCacheSchema = v.object({
  medicine: v.record(v.string(), registryCacheEntrySchema(syncMedicineRefSchema)),
  therapeutic: v.record(v.string(), registryCacheEntrySchema(syncTherapeuticRefSchema)),
  biological: v.record(v.string(), registryCacheEntrySchema(syncBiologicalRefSchema)),
  indicator: v.record(v.string(), registryCacheEntrySchema(syncIndicatorRefSchema)),
  clinicalSign: v.record(v.string(), registryCacheEntrySchema(syncClinicalSignRefSchema)),
  dataField: v.record(v.string(), registryCacheEntrySchema(syncDataFieldRefSchema)),
});

export type SyncMedicineRef = v.InferOutput<typeof syncMedicineRefSchema>;
export type SyncTherapeuticRef = v.InferOutput<typeof syncTherapeuticRefSchema>;
export type SyncBiologicalRef = v.InferOutput<typeof syncBiologicalRefSchema>;
export type SyncIndicatorRef = v.InferOutput<typeof syncIndicatorRefSchema>;
export type SyncClinicalSignRef = v.InferOutput<typeof syncClinicalSignRefSchema>;
export type SyncDataFieldRef = v.InferOutput<typeof syncDataFieldRefSchema>;
export type RegistryCache = v.InferOutput<typeof registryCacheSchema>;
export type RegistryType = keyof RegistryCache;
