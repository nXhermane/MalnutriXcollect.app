import { Patient, PatientMeasure } from '@/models/schemas';
import { formatForMalnutriX } from './malnutrix_formt';
import { encode } from './crypto';
export type ExportedPatient = Omit<Patient, 'isLocked'> & {
  measures: Omit<PatientMeasure, 'patientId' | 'isExported'>[];
};
export function compileUnExportedPatient(
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
export function exportCompiledPatient(data: string): string {
  const cryptedData = encode(data, process.env.EXPO_PUBLIC_SECRET_KEY!);
  return formatForMalnutriX(cryptedData);
}
