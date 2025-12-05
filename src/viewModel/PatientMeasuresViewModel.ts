import { PatientMeasureHelpers } from '@/models/helpers';
import { CreatePatientMeasureDTO, UpdatePatientMeasureDTO } from '@/models/schemas';
import { modeles$ } from '@/store';
import { observable } from '@legendapp/state';
import * as v from 'valibot';
export class PatientMeasuresViewModel {
  isLoading$ = observable(false);

  createMeasure(patientId: string, input: CreatePatientMeasureDTO) {
    try {
      this.isLoading$.set(true);
      if (!modeles$.patients[patientId].peek()) {
        throw new Error('Patient not found');
      }
      const measure = PatientMeasureHelpers.create(patientId, input);
      if (!modeles$.patient_measures[patientId].peek()) {
        modeles$.patient_measures[patientId].set([measure]);
      } else {
        modeles$.patient_measures[patientId].push(measure);
      }
      return { success: true, measure: measure };
    } catch (e) {
      if (e instanceof v.ValiError) {
        return {
          success: false,
          errors: v.flatten(e.issues).nested,
        };
      }
      throw e;
    } finally {
      this.isLoading$.set(false);
    }
  }

  updateMeasure(patientId: string, measureId: string, input: UpdatePatientMeasureDTO) {
    try {
      this.isLoading$.set(true);

      if (!modeles$.patients[patientId].peek()) {
        throw new Error('Patient not found');
      }
      const measureIndex = modeles$.patient_measures[patientId].findIndex(
        (m) => m.id.get() === measureId,
      );
      if (measureIndex === -1) {
        throw new Error('Measure not found');
      }
      if (
        !PatientMeasureHelpers.canBeModified(
          modeles$.patient_measures[patientId][measureIndex].peek(),
        )
      ) {
        throw new Error('Cette measure ne peut plus etre modifier');
      }
      modeles$.patient_measures[patientId][measureIndex].assign({
        ...input,
        updatedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (e) {
      if (e instanceof v.ValiError) {
        return {
          success: false,
          errors: v.flatten(e.issues).nested,
        };
      }
      throw e;
    } finally {
      this.isLoading$.set(false);
    }
  }
  deleteMeasure(patientId: string, measureId: string) {
    try {
      this.isLoading$.set(true);
      if (!modeles$.patients[patientId].peek()) {
        throw new Error('Patient not found');
      }
      const measureIndex = modeles$.patient_measures[patientId].findIndex(
        (m) => m.id.get() === measureId,
      );
      if (measureIndex === -1) {
        throw new Error('Measure not found');
      }

      modeles$.patient_measures[patientId].splice(measureIndex, 1);
      return { success: true };
    } catch (e) {
      if (e instanceof v.ValiError) {
        return {
          success: false,
          errors: v.flatten(e.issues).nested,
        };
      }
      throw e;
    } finally {
      this.isLoading$.set(false);
    }
  }
  markMeasureAsExported(patientId: string, measureId: string) {
    try {
      this.isLoading$.set(true);
      if (!modeles$.patients[patientId].peek()) {
        throw new Error('Patient not found');
      }
      const measureIndex = modeles$.patient_measures[patientId].findIndex(
        (m) => m.id.get() === measureId,
      );
      if (measureIndex === -1) {
        throw new Error('Measure not found');
      }
      if (
        !PatientMeasureHelpers.canBeModified(
          modeles$.patient_measures[patientId][measureIndex].peek(),
        )
      ) {
        throw new Error('Cette measure ne peut plus etre modifier');
      }
      if (modeles$.patient_measures[patientId][measureIndex].isExported.peek()) {
        throw new Error('This measure are already exported.');
      }
      modeles$.patient_measures[patientId][measureIndex].assign({
        isExported: true,
        updatedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (e) {
      if (e instanceof v.ValiError) {
        return {
          success: false,
          errors: v.flatten(e.issues).nested,
        };
      }
      throw e;
    } finally {
      this.isLoading$.set(false);
    }
  }
}
