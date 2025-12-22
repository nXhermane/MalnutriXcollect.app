import { AnthroSystemCodes, AnthroUnit } from '@/constants';
import * as v from 'valibot';

export const anthropometricSchema = v.object({
  code: v.enum(AnthroSystemCodes),
  value: v.pipe(v.number(), v.minValue(0, 'La valeur anthropométrique ne peut être négative.')),
  unit: v.enum(AnthroUnit),
});

export const dataFieldValueSchema = v.object({
  value: v.pipe(v.any(), v.nonEmpty()),
  code: v.string(),
});
export const createPatientMeasureSchema = v.object({
  measures: v.pipe(
    v.array(anthropometricSchema),
    v.check((measures) => {
      const obj: Record<string, boolean> = {};
      for (const measure of measures) {
        if (obj[measure.code]) {
          return false;
        }
        obj[measure.code] = true;
      }
      return true;
    }, 'Les mesures anthropométriques ne peuvent pas être dupliquées'),
  ),
  fields: v.pipe(
    v.array(dataFieldValueSchema),
    v.check((fields) => {
      const obj: Record<string, boolean> = {};
      for (const field of fields) {
        if (obj[field.code]) {
          return false;
        }
        obj[field.code] = true;
      }
      return true;
    }, 'Les champs de données ne peuvent pas être dupliqués'),
  ),
});
export const updatePatientMeasureSchema = v.object({
  measures: v.pipe(
    v.array(anthropometricSchema),
    v.check((measures) => {
      const obj: Record<string, boolean> = {};
      for (const measure of measures) {
        if (obj[measure.code]) {
          return false;
        }
        obj[measure.code] = true;
      }
      return true;
    }, 'Les mesures anthropométriques ne peuvent pas être dupliquées'),
  ),
  fields: v.pipe(
    v.array(dataFieldValueSchema),
    v.check((fields) => {
      const obj: Record<string, boolean> = {};
      for (const field of fields) {
        if (obj[field.code]) {
          return false;
        }
        obj[field.code] = true;
      }
      return true;
    }, 'Les champs de données ne peuvent pas être dupliqués'),
  ),
});

export const patientMeasureSchema = v.object({
  id: v.pipe(v.string(), v.nanoid('ID invalide')),
  patientId: v.string(),
  measures: v.pipe(
    v.array(anthropometricSchema),
    v.check((measures) => {
      const obj: Record<string, boolean> = {};
      for (const measure of measures) {
        if (obj[measure.code]) {
          return false;
        }
        obj[measure.code] = true;
      }
      return true;
    }, 'Les mesures anthropométriques ne peuvent pas être dupliquées'),
  ),
  fields: v.pipe(
    v.array(dataFieldValueSchema),
    v.check((fields) => {
      const obj: Record<string, boolean> = {};
      for (const field of fields) {
        if (obj[field.code]) {
          return false;
        }
        obj[field.code] = true;
      }
      return true;
    }, 'Les champs de données ne peuvent pas être dupliqués'),
  ),
  isExported: v.boolean(),
  createdAt: v.pipe(v.string(), v.isoTimestamp()),
  updatedAt: v.pipe(v.string(), v.isoTimestamp()),
});

export type PatientMeasure = v.InferOutput<typeof patientMeasureSchema>;
export type CreatePatientMeasureDTO = v.InferOutput<typeof createPatientMeasureSchema>;

export type UpdatePatientMeasureDTO = v.InferOutput<typeof updatePatientMeasureSchema>;
export type AnthropometricDTO = v.InferOutput<typeof anthropometricSchema>;
export type DataFieldDTO = v.InferOutput<typeof dataFieldValueSchema>;
