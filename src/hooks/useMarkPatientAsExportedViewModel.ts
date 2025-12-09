import { modeles$ } from '@/store';
import { useCallback, useState } from 'react';

export function useMarkPatientAsExportedViewModel() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const markPatientAsExported = useCallback(async (ids: string[]) => {
    setIsLoading(true);
    for (const patientId of ids) {
      if (!modeles$.patients[patientId].peek()) {
        throw new Error('Patient not found');
      }
      if (!modeles$.patients[patientId].isLocked.get())
        modeles$.patients[patientId].assign({
          isLocked: true,
          updatedAt: new Date().toISOString(),
        });
      for (const measure of modeles$.patient_measures[patientId]) {
        if (!measure.isExported)
          measure.assign({
            isExported: true,
            updatedAt: new Date().toISOString(),
          });
      }
    }
    setIsLoading(false);
  }, []);

  return { markPatientAsExported, isLoading };
}
