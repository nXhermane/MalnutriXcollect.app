import {
  PatientDTO,
  CreatePatientDTO,
  ParentRelation,
  ParentDTO,
  ContactDTO,
  Sex,
} from '../schemas';
import { nanoid } from 'nanoid/non-secure';

export namespace PatientHelpers {
  export function create(input: CreatePatientDTO): PatientDTO {
    const now = new Date().toISOString();

    return {
      id: nanoid(),
      name: input.name,
      birthdate: input.birthdate.toISOString(),
      sex: input.sex,
      isLocked: false,
      contact: input.contact,
      parents: input.parents,
      address: input.address,
      createdAt: now,
      updatedAt: now,
    };
  }

  export function getAge(patient: PatientDTO): number {
    const birthDate = new Date(patient.birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  export function getInitials(patient: PatientDTO): string {
    return patient.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }

  export function getPrimaryContact(patient: PatientDTO): string | undefined {
    return patient.contact.email || patient.contact.tel;
  }

  export function getMotherInfo(patient: PatientDTO): ParentDTO | undefined {
    return patient.parents.find((p) => p.relation === ParentRelation.MOTHER);
  }

  export function getFatherInfo(patient: PatientDTO): ParentDTO | undefined {
    return patient.parents.find((p) => p.relation === ParentRelation.FATHER);
  }

  export function getFormattedBirthdate(patient: PatientDTO): string {
    return new Date(patient.birthdate).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  export function canBeModified(patient: PatientDTO): boolean {
    return !patient.isLocked;
  }

  export function updateName(patient: PatientDTO, newName: string): PatientDTO {
    if (!canBeModified(patient)) {
      throw new Error('Ce patient ne peut pas être modifié');
    }

    return {
      ...patient,
      name: newName,
      updatedAt: new Date().toISOString(),
    };
  }
  export function updateSex(patient: PatientDTO, newSex: Sex): PatientDTO {
    if (!canBeModified(patient)) {
      throw new Error('Ce patient ne peut pas être modifié');
    }
    return {
      ...patient,
      sex: newSex,
      updatedAt: new Date().toISOString(),
    };
  }

  export function updateContact(patient: PatientDTO, contact: Partial<ContactDTO>): PatientDTO {
    return {
      ...patient,
      contact: { ...patient.contact, ...contact },
      updatedAt: new Date().toISOString(),
    };
  }

  export function lock(patient: PatientDTO): PatientDTO {
    if (patient.isLocked) {
      throw new Error('Le patient est déjà verrouillé');
    }

    return {
      ...patient,
      isLocked: true,
      updatedAt: new Date().toISOString(),
    };
  }

  export function unlock(patient: PatientDTO): PatientDTO {
    if (!patient.isLocked) {
      throw new Error("Le patient n'est pas verrouillé");
    }

    return {
      ...patient,
      isLocked: false,
      updatedAt: new Date().toISOString(),
    };
  }

  export function addParent(patient: PatientDTO, parent: ParentDTO): PatientDTO {
    const existingParent = patient.parents.find((p) => p.relation === parent.relation);
    if (existingParent) {
      throw new Error(`Un ${parent.relation} existe déjà`);
    }

    return {
      ...patient,
      parents: [...patient.parents, parent],
      updatedAt: new Date().toISOString(),
    };
  }
}

export type Patient = PatientDTO;
