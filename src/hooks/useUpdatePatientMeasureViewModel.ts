import { PatientMeasureHelpers } from '@/models/helpers/PatientMeasure';
import { UpdatePatientMeasureDTO, updatePatientMeasureSchema } from '@/models/schemas';
import { modeles$ } from '@/store';
import { useCallback, useState } from 'react';
import * as v from 'valibot';

export function useUpdatePatientMeasureViewModel() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updatePatientMeasure = useCallback(
    (patientId: string, measureId: string, input: UpdatePatientMeasureDTO) => {
      try {
        setIsLoading(true);
        const validationResult = v.safeParse(updatePatientMeasureSchema, input);
        if (!validationResult.success) {
          throw new Error(JSON.stringify(v.flatten(validationResult.issues).nested));
        }

        const currentMeasures = modeles$.patient_measures[patientId].get() || [];
        const measureIndex = currentMeasures.findIndex((m) => m.id === measureId);
        if (measureIndex === -1) {
          throw new Error('Measure not found');
        }
        const existingMeasure = currentMeasures[measureIndex];
        const updatedMeasure = PatientMeasureHelpers.updatePatientMeasure(existingMeasure, input);

        const updatedMeasures = [...currentMeasures];
        updatedMeasures[measureIndex] = updatedMeasure;
        modeles$.patient_measures[patientId].set(updatedMeasures);

        return { success: true, measure: updatedMeasure };
      } catch (e) {
        if (e instanceof v.ValiError) {
          throw new Error(JSON.stringify(v.flatten(e.issues).nested));
        }
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { isLoading, updatePatientMeasure };
}
