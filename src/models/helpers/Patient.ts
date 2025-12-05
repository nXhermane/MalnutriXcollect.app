import { Patient, CreatePatientDTO, ParentRelation, ParentDTO } from '../schemas';
import { nanoid } from 'nanoid/non-secure';

export namespace PatientHelpers {
  export function create(input: CreatePatientDTO): Patient {
    const now = new Date().toISOString();

    return {
      id: nanoid(),
      name: input.name,
      birthdate: input.birthdate,
      sex: input.sex,
      isLocked: false,
      contact: input.contact,
      parents: input.parents,
      address: input.address,
      createdAt: now,
      updatedAt: now,
    };
  }

  export function getAge(patient: Patient): number {
    const birthDate = new Date(patient.birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  export function getAgeInDay(patient: Patient): number {
    const now = new Date();
    const birthDate = new Date(patient.birthdate);
    const diffInMs = now.getTime() - birthDate.getTime();

    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  }

  export function getInitials(patient: Patient): string {
    return patient.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }

  export function getPrimaryContact(patient: Patient): string | undefined {
    return patient.contact.email || patient.contact.tel;
  }

  export function getMotherInfo(patient: Patient): ParentDTO | undefined {
    return patient.parents.find((p) => p.relation === ParentRelation.MOTHER);
  }

  export function getFatherInfo(patient: Patient): ParentDTO | undefined {
    return patient.parents.find((p) => p.relation === ParentRelation.FATHER);
  }

  export function getFormattedBirthdate(patient: Patient): string {
    return new Date(patient.birthdate).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  export function canBeModified(patient: Patient): boolean {
    return !patient.isLocked;
  }

  export function lock(patient: Patient): Patient {
    if (patient.isLocked) {
      throw new Error('Le patient est déjà verrouillé');
    }

    return {
      ...patient,
      isLocked: true,
      updatedAt: new Date().toISOString(),
    };
  }

  export function unlock(patient: Patient): Patient {
    if (!patient.isLocked) {
      throw new Error("Le patient n'est pas verrouillé");
    }

    return {
      ...patient,
      isLocked: false,
      updatedAt: new Date().toISOString(),
    };
  }
}
