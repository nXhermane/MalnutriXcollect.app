import * as v from 'valibot';
import { baseMeasureSchema } from './base-measure.schema';

export const clinicalFieldValueSchema = v.union([
  v.boolean(),
  v.number(),
  v.string(),
  v.object({ value: v.number(), unit: v.string() }),
]);

export type ClinicalFieldValue = v.InferOutput<typeof clinicalFieldValueSchema>;

export const clinicalFieldMeasureSchema = v.object({
  ...baseMeasureSchema.entries,
  code: v.pipe(v.string(), v.nonEmpty()),
  value: clinicalFieldValueSchema,
});

export const createClinicalFieldMeasureSchema = v.object({
  code: v.pipe(v.string(), v.nonEmpty()),
  value: clinicalFieldValueSchema,
});

export type ClinicalFieldMeasure = v.InferOutput<typeof clinicalFieldMeasureSchema>;
export type CreateClinicalFieldMeasureDto = v.InferOutput<typeof createClinicalFieldMeasureSchema>;
