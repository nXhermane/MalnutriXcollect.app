import { nanoid } from 'nanoid/non-secure';
import {
  AnthropometricDTO,
  CreatePatientMeasureDTO,
  DataFieldDTO,
  PatientMeasureDTO,
} from '../schemas';

export namespace PatientMeasureHelpers {
  export function create(patientId: string,input: CreatePatientMeasureDTO): PatientMeasureDTO {
    const now = new Date().toISOString();
    return {
      id: nanoid(),
      patientId: patientId,
      measures: input.measures,
      fields: input.fields,
      isExported: false,
      createdAt: now,
      updatedAt: now,
    };
  }
  export function canBeModified(patientMeasure: PatientMeasureDTO): boolean {
    return !patientMeasure.isExported;
  }

  export function markAsExported(patientMeasure: PatientMeasureDTO): PatientMeasureDTO {
    if (!canBeModified(patientMeasure)) {
      throw new Error('Cette measure ne peut plus etre modifier');
    }

    return {
      ...patientMeasure,
      isExported: true,
      updatedAt: new Date().toISOString(),
    };
  }
}

export type PatientMeasure = PatientMeasureDTO;
