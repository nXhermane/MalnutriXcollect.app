import { nanoid } from 'nanoid/non-secure';
import {
  AnthropometricDTO,
  CreatePatientMeasureDTO,
  DataFieldDTO,
  PatientMeasureDTO,
} from '../schemas';

export namespace PatientMeasureHelpers {
  export function create(input: CreatePatientMeasureDTO): PatientMeasureDTO {
    const now = new Date().toISOString();
    return {
      id: nanoid(),
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
  export function addMeasure(
    patientMeasure: PatientMeasureDTO,
    newMeasure: AnthropometricDTO,
  ): PatientMeasureDTO {
    if (!canBeModified(patientMeasure)) {
      throw new Error('Cette measure ne peut plus etre modifier');
    }
    const existingMeasure = patientMeasure.measures.find((m) => m.code === newMeasure.code);
    if (existingMeasure) {
      throw new Error(`La mesure anthropométrique ${newMeasure.code} existe déjà`);
    }

    return {
      ...patientMeasure,
      measures: [...patientMeasure.measures, newMeasure],
      updatedAt: new Date().toISOString(),
    };
  }

  export function addField(
    patientMeasure: PatientMeasureDTO,
    newField: DataFieldDTO,
  ): PatientMeasureDTO {
    if (!canBeModified(patientMeasure)) {
      throw new Error('Cette measure ne peut plus etre modifier');
    }
    const existingField = patientMeasure.fields.find((f) => f.code === newField.code);
    if (existingField) {
      throw new Error(`Le field ${newField.code} existe déjà`);
    }
    return {
      ...patientMeasure,
      fields: [...patientMeasure.fields, newField],
      updatedAt: new Date().toISOString(),
    };
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
