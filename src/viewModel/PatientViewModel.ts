import { MAX_AGE_IN_MONTH_IN_PEDIATRIC } from '@/constants';
import { PatientHelpers } from '@/models/helpers';
import { CreatePatientDTO, UpdatePatientDTO } from '@/models/schemas';
import { modeles$ } from '@/store';
import { observable } from '@legendapp/state';
import * as v from 'valibot';

export class PatientViewModel {
  isLoading$ = observable(false);

  createPatient(input: CreatePatientDTO) {
    try {
      this.isLoading$.set(true);
      const newPatient = PatientHelpers.create(input);
      if (PatientHelpers.getAgeInDay(newPatient) > MAX_AGE_IN_MONTH_IN_PEDIATRIC) {
        throw new Error('Ce patient ne peux être enrégistré en pediatrie');
      }
      modeles$.patients[newPatient.id].set(newPatient);
      return { success: true, patient: newPatient };
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
  updatePatient(id: string, input: UpdatePatientDTO) {
    try {
      this.isLoading$.set(true);
      if (!modeles$.patients[id].peek())
        return { success: false, errors: { id: 'Patient non trouvé' } };
      if (!PatientHelpers.canBeModified(modeles$.patients[id].peek())) {
        throw new Error('Ce patient ne peut pas être modifié');
      }
      modeles$.patients[id].assign({ ...input, updatedAt: new Date().toISOString() });
      return { success: true };
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
  searchPatients(query: string) {
    return Object.values(modeles$.patients.get()).filter((patient) =>
      patient.name.toLowerCase().includes(query.toLowerCase()),
    );
  }
  deletePatient(id: string) {
    try {
      this.isLoading$.set(true);
      modeles$.patients[id].delete();
      return { success: true };
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
  lockPatient(id: string) {
    try {
      this.isLoading$.set(true);
      const patient = modeles$.patients[id].peek();
      if (!patient) return { success: false, errors: { id: 'Patient non trouvé' } };
      if (patient.isLocked) {
        throw new Error('Le patient est déjà verrouillé');
      }
      modeles$.patients[id].assign({ isLocked: true, updatedAt: new Date().toISOString() });
      return { success: true };
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
}
