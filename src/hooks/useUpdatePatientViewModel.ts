import { UpdatePatientDTO } from '@/models/schemas';
import { modeles$ } from '@/store';
import { useCallback, useState } from 'react';

export function useUpdatePatientViewModel() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const updatePatient = useCallback((patientId: string, input: UpdatePatientDTO) => {
    try {
      setIsLoading(true);
      if (!modeles$.patients[patientId].get()) {
        throw new Error('Patient not found');
      }
      modeles$.patients[patientId].assign({
        ...modeles$.patients[patientId].get(),
        ...input,
        updatedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  return { isLoading, updatePatient: updatePatient };
}
