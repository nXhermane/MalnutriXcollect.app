import { MAX_AGE_IN_MONTH_IN_PEDIATRIC } from '@/constants';
import { PatientHelpers } from '@/models/helpers';
import { CreatePatientDTO } from '@/models/schemas';
import { modeles$ } from '@/store';
import { useCallback, useState } from 'react';
import * as v from 'valibot';

export function useAddPatientViewModal() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const addPatient = useCallback((input: CreatePatientDTO) => {
    try {
      setIsLoading(true);
      const newPatient = PatientHelpers.create(input);
      if (PatientHelpers.getAgeInDay(newPatient) > MAX_AGE_IN_MONTH_IN_PEDIATRIC) {
        throw new Error('Ce patient ne peux être enrégistré en pediatrie');
      }
      modeles$.patients[newPatient.id].set(newPatient);
      modeles$.patient_measures[newPatient.id].set([]);
      return { success: true, patient: newPatient };
    } catch (e) {
      if (e instanceof v.ValiError) {
        throw new Error(JSON.stringify(v.flatten(e.issues).nested));
      }
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, addPatient };
}
