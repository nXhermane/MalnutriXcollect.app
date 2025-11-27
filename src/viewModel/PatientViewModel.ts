import { MAX_AGE_IN_MONTH_IN_PEDIATRIC } from '@/constants';
import { PatientHelpers } from '@/models/entities';
import {
  CreatePatientDTO,
  createPatientSchema,
  UpdatePatientDTO,
  updatePatientSchema,
} from '@/models/schemas';
import { patientStore$ } from '@/store';
import { observable } from '@legendapp/state';
import * as v from 'valibot';

export class PatientViewModel {
  isLoading$ = observable(false);

  createPatient(input: CreatePatientDTO) {
    try {
      this.isLoading$.set(true);
      const validatedData = v.parse(createPatientSchema, input);
      const newPatient = PatientHelpers.create(validatedData);
      if (PatientHelpers.getAgeInDay(newPatient) > MAX_AGE_IN_MONTH_IN_PEDIATRIC) {
        throw new Error('Ce patient ne peux être enrégistré en pediatrie');
      }
      patientStore$.patients.push(newPatient);
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
      const validatedData = v.parse(updatePatientSchema, input);
      const patient = patientStore$.patients.find((p) => p.id.get() === id);
      if (!patient) return { success: false, errors: { id: 'Patient non trouvé' } };
      let updatedPatient = patient.peek();
      if (input?.name) {
        updatedPatient = PatientHelpers.updateName(updatedPatient, input.name);
      }
      if (input?.contact) {
        updatedPatient = PatientHelpers.updateContact(updatedPatient, input.contact);
      }
      if (input?.sex) {
        updatedPatient = PatientHelpers.updateSex(updatedPatient, input.sex);
      }
      if (input?.birthdate) {
        updatedPatient = PatientHelpers.updateBirthdate(updatedPatient, input.birthdate);
      }
      if (input?.address) {
        updatedPatient = PatientHelpers.updateAddress(updatedPatient, input.address);
      }
      if (input?.parents) {
        updatedPatient = PatientHelpers.updateParent(updatedPatient, input.parents);
      }
      patient.assign(updatedPatient);
      return { success: true, patient: updatedPatient };
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
    return patientStore$.patients.filter((patient) =>
      patient.name.get().toLowerCase().includes(query.toLowerCase()),
    );
  }
  deletePatient(id: string) {
    try {
      this.isLoading$.set(true);
      const patientIndex = patientStore$.patients.findIndex((p) => p.id.get() === id);
      if (!patientIndex) return { success: false, errors: { id: 'Patient non trouvé' } };
      patientStore$.patients.splice(patientIndex, 1);
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
      const patient = patientStore$.patients.find((p) => p.id.get() === id);
      if (!patient) return { success: false, errors: { id: 'Patient non trouvé' } };
      const lockedPatient = PatientHelpers.lock(patient.peek());
      patient.assign(lockedPatient);
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
