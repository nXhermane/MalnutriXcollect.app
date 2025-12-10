import { Patient, PatientMeasure } from '@/models/schemas';
import { modeles$ } from '@/store';
import { encode } from '@/utils/crypto';
import { formatForMalnutriX } from '@/utils/malnutrix_formt';
import { useValue } from '@legendapp/state/react';
import { useCallback, useState } from 'react';
import { useMarkPatientAsExportedViewModel } from './useMarkPatientAsExportedViewModel';

type ExportedPatient = Omit<Patient, 'isLocked'> & {
  measures: Omit<PatientMeasure, 'patientId' | 'isExported'>[];
};

export function useExportPatientViewModel() {
  const [exportedData, setExportedData] = useState<string>();
  const [exportIsLoading, setExportedIsLoading] = useState<boolean>(false);
  const [compiledPatientIds, setCompiledPatientIds] = useState<string[]>([]);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const patients = useValue(modeles$.patients);
  const patient_measures = useValue(modeles$.patient_measures);

  const { isLoading, markPatientAsExported } = useMarkPatientAsExportedViewModel();
  const exportPatient = useCallback(async () => {
    setExportedIsLoading(true);
    const data = compileUnExportedPatient(Object.values(patients), patient_measures);
    const formated_data = exportCompiledPatient(JSON.stringify(data.data));
    setCompiledPatientIds(data.exported_patient_ids);
    setExportedData(formated_data);
    setExportedIsLoading(false);
  }, [patients, patient_measures]);

  const confirmExport = useCallback(() => {
    setIsConfirmed(false);
    markPatientAsExported(compiledPatientIds);
    setIsConfirmed(true);
  }, [compiledPatientIds, markPatientAsExported]);
  return {
    exportPatient,
    confirmExport,
    isLoading: exportIsLoading,
    confirmIsLoading: isLoading,
    data: useValue(exportedData),
    isConfirmed,
  };
}

function compileUnExportedPatient(
  patients: Patient[],
  patient_measures: Record<string, PatientMeasure[]>,
): { data: ExportedPatient[]; exported_patient_ids: string[] } {
  const data: ExportedPatient[] = [];
  const exported_patient_ids: string[] = [];
  for (const { isLocked, ...patientInfo } of patients) {
    const measures = [];
    for (const { isExported, patientId, ...measure } of patient_measures[patientInfo.id]) {
      if (!isExported) {
        measures.push(measure);
      }
    }
    if (measures.length !== 0) {
      data.push({ ...patientInfo, measures });
      exported_patient_ids.push(patientInfo.id);
    }
  }
  return { data, exported_patient_ids };
}
function exportCompiledPatient(data: string): string {
  const cryptedData = encode(data, process.env.EXPO_PUBLIC_SECRET_KEY!);
  return formatForMalnutriX(cryptedData);
}
