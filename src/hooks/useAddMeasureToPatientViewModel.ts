import { PatientMeasureHelpers } from '@/models/helpers/PatientMeasure';
import { CreatePatientMeasureDTO, createPatientMeasureSchema } from '@/models/schemas';
import { modeles$ } from '@/store';
import { useCallback, useState } from 'react';
import * as v from 'valibot';

export function useAddMeasureToPatientViewModel() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addMeasureToPatient = useCallback((patientId: string, input: CreatePatientMeasureDTO) => {
    try {
      setIsLoading(true);
      const validationResult = v.safeParse(createPatientMeasureSchema, input);
      if (!validationResult.success) {
        throw new Error(JSON.stringify(v.flatten(validationResult.issues).nested));
      }

      const newMeasure = PatientMeasureHelpers.create(patientId, input);
      const currentMeasures = modeles$.patient_measures[patientId].get() || [];
      modeles$.patient_measures[patientId].set([...currentMeasures, newMeasure]);

      return { success: true, measure: newMeasure };
    } catch (e) {
      if (e instanceof v.ValiError) {
        throw new Error(JSON.stringify(v.flatten(e.issues).nested));
      }
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, addMeasureToPatient };
}
