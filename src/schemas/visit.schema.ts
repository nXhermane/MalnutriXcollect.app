import { MeasureCategory } from '@/constants';
import * as v from 'valibot';

const measureIdsSchema = v.object({
  [MeasureCategory.ANTHRO]: v.array(v.string()),
  [MeasureCategory.FIELD]: v.array(v.string()),
  [MeasureCategory.BIOLOGICAL]: v.array(v.string()),
});

export const visitSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  patientId: v.pipe(v.string(), v.nonEmpty()),
  measureIds: measureIdsSchema,
  isExported: v.boolean(),
  isLocked: v.boolean(),
  createdAt: v.pipe(v.string(), v.isoTimestamp()),
  updatedAt: v.pipe(v.string(), v.isoTimestamp()),
});

export const createVisitSchema = v.object({
  patientId: v.pipe(v.string(), v.nonEmpty()),
});

export type Visit = v.InferOutput<typeof visitSchema>;
export type CreateVisitDto = v.InferOutput<typeof createVisitSchema>;

export const emptyMeasureIds = () => ({
  [MeasureCategory.ANTHRO]: [],
  [MeasureCategory.FIELD]: [],
  [MeasureCategory.BIOLOGICAL]: [],
});
