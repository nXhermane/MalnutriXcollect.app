import * as v from 'valibot';

export const baseMeasureSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  isLocked: v.boolean(),
  createdAt: v.pipe(v.string(), v.isoTimestamp()),
  updatedAt: v.pipe(v.string(), v.isoTimestamp()),
});

export type BaseMeasure = v.InferOutput<typeof baseMeasureSchema>;
