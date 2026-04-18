import * as v from 'valibot';
import { anthropometricMeasureSchema } from './anthropometric-measure.schema';
import { biologicalMeasureSchema } from './biological-measure.schema';
import { clinicalFieldMeasureSchema } from './clinical-field-measure.schema';
import { MeasureCategory } from '@/constants';

export const patientMeasuresSchema = v.object({
  [MeasureCategory.ANTHRO]: v.array(anthropometricMeasureSchema),
  [MeasureCategory.FIELD]: v.array(clinicalFieldMeasureSchema),
  [MeasureCategory.BIOLOGICAL]: v.array(biologicalMeasureSchema),
});

export type PatientMeasures = v.InferOutput<typeof patientMeasuresSchema>;
