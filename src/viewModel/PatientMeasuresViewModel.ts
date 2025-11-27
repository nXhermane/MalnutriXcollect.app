import { PatientMeasureHelpers } from '@/models/entities';
import {
  CreatePatientMeasureDTO,
  createPatientMeasureSchema,
  updatePatientMeasureSchema,
} from '@/models/schemas';
import { patientMeasureStore$, patientStore$ } from '@/store';
import { observable } from '@legendapp/state';
import * as v from 'valibot';
export class PatientMeasuresViewModel {
  isLoading$ = observable(false);

  createMeasure(patientId: string, input: CreatePatientMeasureDTO) {
    try {
      this.isLoading$.set(true);
      if (patientStore$.patients.findIndex((p) => p.id.get() === patientId) === -1) {
        throw new Error('Patient not found');
      }
      const validatedData = v.parse(createPatientMeasureSchema, input);
      const measure = PatientMeasureHelpers.create(patientId, validatedData);
      patientMeasureStore$.patientMeasures.push(measure);
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
  
  updateMeasure(patientId: string, measureId: string, input: Partial<CreatePatientMeasureDTO>) {
    try {
      this.isLoading$.set(true);
      if (patientStore$.patients.findIndex((p) => p.id.get() === patientId) === -1) {
        throw new Error('Patient not found');
      }
      const measure = patientMeasureStore$.patientMeasures.find((m) => m.id.get() === measureId);
      if (!measure) {
        throw new Error('Measure not found');
      }
      if(!PatientMeasureHelpers.canBeModified(measure.peek())) {
        throw new Error('Measure cannot be modified');
      }
      const validatedData = v.parse(updatePatientMeasureSchema, input);
      const updatedMeasure = { ...measure.peek(), ...validatedData };
      measure.assign(updatedMeasure);
      return { success: true, measure: updatedMeasure };
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
      if (patientStore$.patients.findIndex((p) => p.id.get() === patientId) === -1) {
        throw new Error('Patient not found');
      }
      const measureIndex = patientMeasureStore$.patientMeasures.findIndex((m) => m.id.get() === measureId);
      if (measureIndex === -1) {
        throw new Error('Measure not found');
      }
  
      patientMeasureStore$.patientMeasures.splice(measureIndex, 1);
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
      if (patientStore$.patients.findIndex((p) => p.id.get() === patientId) === -1) {
        throw new Error('Patient not found');
      }
      const measure = patientMeasureStore$.patientMeasures.find((m) => m.id.get() === measureId);
      if (!measure) {
        throw new Error('Measure not found');
      }
      measure.assign(PatientMeasureHelpers.markAsExported(measure.peek()));
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
  getPatientMeasures(patientId: string) {
    try {
      this.isLoading$.set(true);
      if (patientStore$.patients.findIndex((p) => p.id.get() === patientId) === -1) {
        throw new Error('Patient not found');
      }

      return { success: true, measures: patientMeasureStore$.patientMeasures.filter((m) => m.patientId.get() === patientId) };
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
  getExportableMeasures(patientId: string) {
    try {
      this.isLoading$.set(true);
      if (patientStore$.patients.findIndex((p) => p.id.get() === patientId) === -1) {
        throw new Error('Patient not found');
      }
      const measures = patientMeasureStore$.patientMeasures.filter((m) => m.patientId.get() === patientId && !m.isExported.get());
      return { success: true, measures: measures };
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
