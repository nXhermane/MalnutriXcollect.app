import * as v from 'valibot';
import { baseMeasureSchema } from './base-measure.schema';

export const biologicalMeasureSchema = v.object({
  ...baseMeasureSchema.entries,
  code: v.pipe(v.string(), v.nonEmpty()),
  value: v.pipe(v.number(), v.minValue(0)),
  unit: v.pipe(v.string(), v.nonEmpty()),
});

export const createBiologicalMeasureSchema = v.object({
  code: v.pipe(v.string(), v.nonEmpty()),
  value: v.pipe(v.number(), v.minValue(0)),
  unit: v.pipe(v.string(), v.nonEmpty()),
});

export type BiologicalMeasure = v.InferOutput<typeof biologicalMeasureSchema>;
export type CreateBiologicalMeasureDto = v.InferOutput<typeof createBiologicalMeasureSchema>;
