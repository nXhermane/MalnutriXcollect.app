import { AnthroSystemCodes, AnthroUnit } from '@/constants';
import * as v from 'valibot';
import { baseMeasureSchema } from './base-measure.schema';

export const anthropometricMeasureSchema = v.object({
  ...baseMeasureSchema.entries,
  code: v.enum(AnthroSystemCodes),
  value: v.pipe(v.number(), v.minValue(0)),
  unit: v.enum(AnthroUnit),
});

export const createAnthropometricMeasureSchema = v.object({
  code: v.enum(AnthroSystemCodes),
  value: v.pipe(v.number(), v.minValue(0)),
  unit: v.enum(AnthroUnit),
});

export type AnthropometricMeasure = v.InferOutput<typeof anthropometricMeasureSchema>;
export type CreateAnthropometricMeasureDto = v.InferOutput<
  typeof createAnthropometricMeasureSchema
>;
