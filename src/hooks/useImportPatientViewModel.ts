import { patientSchema } from '@/models/schemas';
import { modeles$ } from '@/store';
import { decode } from '@/utils/crypto';
import { getMalnutriXCollectPayload } from '@/utils/malnutrix_formt';
import { useCallback, useState } from 'react';
import * as v from 'valibot';

export function useImportPatientViewModel() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  function importPatient(uri: string) {
    try {
      setError(null);
      setIsLoading(true);
      // TODO: Change to getMalnutriXPayload before prod
      const payload = getMalnutriXCollectPayload(uri);
      if (!payload) throw new Error('Les données de MalnutriX sont invalides.');
      const data = JSON.stringify(decode(payload, process.env.EXPO_PUBLIC_SECRET_KEY!));
      const validatedPatients = v.parse(v.array(patientSchema), data);
      const lockedPatients = validatedPatients.map((patient) => ({
        ...patient,
        isLocked: true,
      }));
      for (const patient of lockedPatients) {
        if (!modeles$.patients[patient.id]) {
          modeles$.patients[patient.id].set(patient);
        }
      }
    } catch (e) {
      if (e instanceof v.ValiError) {
      } else if (e instanceof Error) {
        setError(e.message);
      } else {
        console.warn(e);
        setError(`Unexpected Error : ${e}`);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return {
    importPatient: useCallback(importPatient, []),
    isLoading,
    error,
  };
}
