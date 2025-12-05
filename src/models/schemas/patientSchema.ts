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

export const contactSchema = v.object({
  email: v.optional(v.pipe(v.string(), v.email('Veuillez entrer un email valide'))),
  tel: v.optional(v.pipe(v.string(), v.regex(/^[+]?[\d\s-()]+$/, 'Numéro de téléphone invalide'))),
});

export const parentSchema = v.object({
  relation: v.enum(ParentRelation, 'Relation parent invalide'),
  name: v.pipe(
    v.string(),
    v.nonEmpty('Le nom du parent est requis'),
    v.minLength(3, 'Le nom doit contenir au moins 3 caractères'),
  ),
  tel: v.optional(v.pipe(v.string(), v.regex(/^[+]?[\d\s-()]+$/, 'Numéro de téléphone invalide'))),
});

export const addressSchema = v.object({
  fullAddress: v.optional(v.pipe(v.string(), v.nonEmpty("L'adresse complète est requise"))),
  city: v.optional(v.string()),
});
export const patientSchema = v.object({
  id: v.pipe(v.string(), v.nanoid('ID invalide')),
  name: v.pipe(
    v.string('Le nom doit être une chaîne de caractères'),
    v.nonEmpty('Veuillez entrer le nom du patient'),
    v.minLength(3, 'Le nom doit contenir au moins 3 caractères'),
  ),
  birthdate: v.pipe(
    v.string(),
    v.isoDate(),
    v.check(
      (date) => new Date(date) <= new Date(),
      'La date de naissance ne peut pas être dans le futur',
    ),
  ),
  sex: v.enum(Sex, 'Le sex du patient est invalide'),
  isLocked: v.optional(v.boolean(),false),
  contact: v.optional(contactSchema),
  parents: v.pipe(
    v.array(parentSchema),
    v.check((parents) => {
      const obj: { [key in ParentRelation]: boolean } = {} as any;
      for (const parent of parents) {
        if (obj[parent.relation]) {
          return false;
        }
        obj[parent.relation] = true;
      }
      return true;
    }, 'Plusieurs parents du même type sont présents'),
    // v.nonEmpty('Au moins un parent est requis'),
  ),
  address: addressSchema,
  createdAt: v.pipe(v.string(), v.isoTimestamp()),
  updatedAt: v.pipe(v.string(), v.isoTimestamp()),
});

export const createPatientSchema = v.object({
  name: v.pipe(
    v.string('Le nom doit être une chaîne de caractères'),
    v.nonEmpty('Veuillez entrer le nom du patient'),
    v.minLength(3, 'Le nom doit contenir au moins 3 caractères'),
  ),
  birthdate: v.pipe(
    v.string(),
    v.isoDate(),
    v.check(
      (date) => new Date(date) <= new Date(),
      'La date de naissance ne peut pas être dans le futur',
    ),
  ),
  sex: v.enum(Sex, 'Le sex du patient est invalide'),
  contact: v.optional(contactSchema),
  parents: v.pipe(
    v.array(parentSchema),
    v.check((parents) => {
      const obj: { [key in ParentRelation]: boolean } = {} as any;
      for (const parent of parents) {
        if (obj[parent.relation]) {
          return false;
        }
        obj[parent.relation] = true;
      }
      return true;
    }, 'Plusieurs parents du même type sont présents'),
    // v.nonEmpty('Au moins un parent est requis'),
  ),
  address: addressSchema,
});

export const updatePatientSchema = v.object({
  name: v.optional(v.pipe(v.string(), v.nonEmpty('Le nom ne peut pas être vide'), v.minLength(3))),
  birthdate: v.optional(
    v.pipe(
      v.string(),
      v.isoDate(),
      v.check(
        (date) => new Date(date) <= new Date(),
        'La date de naissance ne peut pas être dans le futur',
      ),
    ),
  ),
  sex: v.optional(v.enum(Sex)),
  isLocked: v.optional(v.boolean()),
  contact: v.optional(contactSchema),
  parents: v.optional(
    v.pipe(
      v.array(parentSchema),
      v.check((parents) => {
        const obj: { [key in ParentRelation]: boolean } = {} as any;
        for (const parent of parents) {
          if (obj[parent.relation]) {
            return false;
          }
          obj[parent.relation] = true;
        }
        return true;
      }, 'Plusieurs parents du même type sont présents'),
      // v.nonEmpty('Au moins un parent est requis'),
    ),
  ),
  address: v.optional(addressSchema),
});

export type Patient = v.InferOutput<typeof patientSchema>;
export type CreatePatientDTO = v.InferOutput<typeof createPatientSchema>;
export type UpdatePatientDTO = v.InferOutput<typeof updatePatientSchema>;
export type ContactDTO = v.InferOutput<typeof contactSchema>;
export type ParentDTO = v.InferOutput<typeof parentSchema>;
export type AddressDTO = v.InferOutput<typeof addressSchema>;
