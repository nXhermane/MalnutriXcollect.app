import { modeles$ } from '@/store';
import { useCallback, useState } from 'react';

export function useDeletePatientMeasureViewModel() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const deletePatientMeasure = useCallback((id: string, measureId: string) => {
    try {
      setIsLoading(true);
      if (!modeles$.patients[id].get()) {
        throw new Error('Patient not found');
      }
      const findedIndex = modeles$.patient_measures[id].findIndex(
        (_m) => _m.id.get() === measureId,
      );
      if (findedIndex === -1) {
        throw new Error('Patient Measure not found');
      }
      modeles$.patient_measures[id].set([
        ...modeles$.patient_measures[id].get().filter((_m) => _m.id !== measureId),
      ]);

      return { success: true };
    } catch (e) {
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);
  return { isLoading, deletePatientMeasure };
}
