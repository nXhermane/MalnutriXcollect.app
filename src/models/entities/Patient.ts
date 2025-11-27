import {
  PatientDTO,
  CreatePatientDTO,
  ParentRelation,
  ParentDTO,
  ContactDTO,
  Sex,
  AddressDTO,
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

  export function getAgeInDay(patient: PatientDTO): number {
    const now = new Date();
    const birthDate = new Date(patient.birthdate);
    const diffInMs = now.getTime() - birthDate.getTime();

    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
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
    if (!canBeModified(patient)) {
      throw new Error('Ce patient ne peut pas être modifié');
    }
    return {
      ...patient,
      contact: { ...patient.contact, ...contact },
      updatedAt: new Date().toISOString(),
    };
  }
  export function updateBirthdate(patient: PatientDTO, birthdate: Date): PatientDTO {
    if (!canBeModified(patient)) {
      throw new Error('Ce patient ne peut pas être modifié');
    }
    return {
      ...patient,
      birthdate: birthdate.toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  export function updateAddress(patient: PatientDTO, address: Partial<AddressDTO>): PatientDTO {
    if (!canBeModified(patient)) {
      throw new Error('Ce patient ne peut pas être modifié');
    }
    return {
      ...patient,
      address: { ...patient.address, ...address },
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

  export function updateParent(patient: PatientDTO, parents: ParentDTO[]): PatientDTO {
    return {
      ...patient,
      parents: parents,
      updatedAt: new Date().toISOString(),
    };
  }
}

export type Patient = PatientDTO;
