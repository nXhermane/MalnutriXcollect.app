import { modeles$ } from '@/store';
import { useCallback, useState } from 'react';

export function useDeletePatientViewModel() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const deletePatient = useCallback((id: string) => {
    try {
      setIsLoading(true);
      if (!modeles$.patients[id].get()) {
        throw new Error('Patient not found');
      }
      modeles$.patient_measures[id].delete();
      modeles$.patients[id].delete();

      return { success: true };
    } catch (e) {
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);
  return { isLoading, deletePatient };
}
