import { Patient, PatientMeasure, patientSchema } from '@/models/schemas';
import { modeles$ } from '@/store';
import { Observable, observable } from '@legendapp/state';
import * as v from 'valibot';

type ImportedPatient = Omit<Patient, 'isLocked' | 'parents' | 'contact'>[];
type ExportedPatient = Omit<Patient, 'isLocked'> & {
  measures: Omit<PatientMeasure, 'patientId' | 'isExported'>[];
};
export class CrossViewModel {
  public isLoading$: Observable<boolean> = observable(false);
  
  export() {
    try {
      return JSON.stringify(this.exportUnExportedPatient());
    } catch (error) {}
  }
  import(raw: string) {
    try {
      this.isLoading$.set(true);
      const importedData = JSON.parse(raw) as ImportedPatient;
      const validatedPatients = v.parse(v.array(patientSchema), importedData);
      // Lock every imported patients
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
        return {
          success: false,
          errors: v.flatten(e.issues).nested,
        };
      }
      throw e;
    } finally {
      this.isLoading$.set(false);
    }
  }

  private exportUnExportedPatient(patientLimit?: number, measureLimit?: number): ExportedPatient[] {
    const obj: ExportedPatient[] = [];
    let patientCounter = 0;
    let measureCounter = 0;
    for (const { isLocked, ...patientInfo } of Object.values(modeles$.patients.peek())) {
      const measures = [];
      for (const { isExported, patientId, ...measureExportableProps } of modeles$.patient_measures[
        patientInfo.id
      ].peek()) {
        if (!isExported || (measureLimit !== undefined && measureCounter <= measureLimit)) {
          measures.push(measureExportableProps);
          measureCounter++;
        }
      }
      if (measures.length !== 0) {
        obj.push({ ...patientInfo, measures });
        patientCounter++;
      }
      if (patientLimit !== undefined && patientCounter >= patientLimit) {
        return obj;
      }
    }
    return obj;
  }
}
