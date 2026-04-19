import { DAY_IN_MONTHS, MAX_AGE_IN_MONTH_IN_PEDIATRIC } from '@/constants';
import * as v from 'valibot';

export enum ParentRelation {
  MOTHER = 'mother',
  FATHER = 'father',
  GUARDIAN = 'guardian',
}

export enum Sex {
  MALE = 'M',
  FEMALE = 'F',
}

export enum PatientStatus {
  NORMAL = 'NORMAL',
  NEW = 'NEW',
  SEVERE_ACUTE_MALNUTRITION = 'SEVERE_ACUTE_MALNUTRITION',
  MODERATE_ACUTE_MALNUTRITION = 'MODERATE_ACUTE_MALNUTRITION',
  SEVERE_CHRONIC_MALNUTRITION = 'SEVERE_CHRONIC_MALNUTRITION',
  MODERATE_CHRONIC_MALNUTRITION = 'MODERATE_CHRONIC_MALNUTRITION',
  SEVERE_UNDERWEIGHT = 'SEVERE_UNDERWEIGHT',
  MODERATE_UNDERWEIGHT = 'MODERATE_UNDERWEIGHT',
  OBESITY = 'OBESITY',
  OVERWEIGHT = 'OVERWEIGHT',
}

const contactSchema = v.object({
  email: v.optional(
    v.pipe(
      v.string(),
      v.transform((input) => (input === '' ? undefined : input)),
      v.optional(v.pipe(v.string(), v.email('Veuillez entrer un email valide'))),
    ),
  ),
  tel: v.optional(
    v.pipe(
      v.string(),
      v.transform((input) => (input === '' ? undefined : input)),
      v.optional(
        v.pipe(
          v.string(),
          v.regex(/^(?:\+229|00229)?\s*(01[0-9]{8})$/, 'Numéro de téléphone invalide'),
        ),
      ),
    ),
  ),
});

export const parentSchema = v.object({
  relation: v.enum(ParentRelation, 'Relation parent invalide'),
  name: v.pipe(
    v.string(),
    v.nonEmpty('Le nom du parent est requis'),
    v.minLength(3, 'Le nom doit contenir au moins 3 caractères'),
  ),
  tel: v.optional(
    v.pipe(
      v.string(),
      v.regex(/^(?:\+229|00229)?\s*(01[0-9]{8})$/, 'Numéro de téléphone invalide'),
    ),
  ),
});

const addressSchema = v.object({
  fullAddress: v.optional(v.string(), ''),
  city: v.optional(v.string(), ''),
});

const uniqueParentsCheck = v.check((parents: v.InferOutput<typeof parentSchema>[]) => {
  const seen: Partial<Record<ParentRelation, boolean>> = {};
  for (const parent of parents) {
    if (seen[parent.relation]) return false;
    seen[parent.relation] = true;
  }
  return true;
}, 'Plusieurs parents du même type sont présents');

const birthdateInPastCheck = v.check(
  (date: string) => new Date(date) <= new Date(),
  'La date de naissance ne peut pas être dans le futur',
);

const birthdatePediatricCheck = v.check(
  (date: string) => {
    const diffInMs = Date.now() - new Date(date).getTime();
    return (
      Math.floor(diffInMs / (1000 * 60 * 60 * 24)) / DAY_IN_MONTHS <= MAX_AGE_IN_MONTH_IN_PEDIATRIC
    );
  },
  `Ce patient ne peut être enregistré en pédiatrie (âge max ${Math.floor(MAX_AGE_IN_MONTH_IN_PEDIATRIC / 12)} ans)`,
);

export const patientSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  name: v.pipe(
    v.string(),
    v.nonEmpty('Veuillez entrer le nom du patient'),
    v.minLength(3, 'Le nom doit contenir au moins 3 caractères'),
  ),
  birthdate: v.pipe(v.string(), v.isoDateTime(), birthdateInPastCheck, birthdatePediatricCheck),
  sex: v.enum(Sex, 'Le sexe du patient est invalide'),
  isLocked: v.optional(v.boolean(), false),
  status: v.optional(v.enum(PatientStatus), PatientStatus.NEW),
  contact: v.optional(contactSchema),
  parents: v.pipe(v.array(parentSchema), uniqueParentsCheck),
  address: addressSchema,
  createdAt: v.pipe(v.string(), v.isoTimestamp()),
  updatedAt: v.pipe(v.string(), v.isoTimestamp()),
});

export const createPatientSchema = v.object({
  name: v.pipe(
    v.string(),
    v.nonEmpty('Veuillez entrer le nom du patient'),
    v.minLength(3, 'Le nom doit contenir au moins 3 caractères'),
  ),
  birthdate: v.pipe(v.string(), v.isoDateTime(), birthdateInPastCheck, birthdatePediatricCheck),
  sex: v.enum(Sex),
  status: v.optional(v.enum(PatientStatus), PatientStatus.NEW),
  contact: v.optional(contactSchema),
  parents: v.pipe(v.array(parentSchema), uniqueParentsCheck),
  address: addressSchema,
});

export const updatePatientSchema = v.partial(
  v.object({
    name: v.pipe(v.string(), v.nonEmpty(), v.minLength(3)),
    birthdate: v.pipe(v.string(), v.isoDateTime(), birthdateInPastCheck, birthdatePediatricCheck),
    sex: v.enum(Sex),
    isLocked: v.boolean(),
    status: v.enum(PatientStatus),
    contact: contactSchema,
    parents: v.pipe(v.array(parentSchema), uniqueParentsCheck),
    address: addressSchema,
  }),
);

export type Patient = v.InferOutput<typeof patientSchema>;
export type CreatePatientDto = v.InferOutput<typeof createPatientSchema>;
export type UpdatePatientDto = v.InferOutput<typeof updatePatientSchema>;
export type ContactDto = v.InferOutput<typeof contactSchema>;
export type ParentDto = v.InferOutput<typeof parentSchema>;
export type AddressDto = v.InferOutput<typeof addressSchema>;
