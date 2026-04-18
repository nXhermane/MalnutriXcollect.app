import { FormSection } from '@/components/shared/forms';
import { ParentRelation, Sex } from '@/schemas/patient.schema';
import * as v from 'valibot';

export const addPatientFormConfig: FormSection[] = [
  {
    name: 'Informations personnelles',
    fields: [
      {
        type: 'text',
        label: 'Nom complet du patient',
        name: 'name',
        mode: 'input',
        default: '',
        alwaysShow: true,
        placeholder: 'Ex. John Doe',
        validation: { required: true },
      },
      {
        type: 'date',
        label: 'Date de naissance',
        name: 'birthdate',
        mode: 'date',
        default: undefined,
        alwaysShow: true,
        validation: { required: true },
      },
      {
        type: 'radio',
        label: 'Sexe du patient',
        name: 'sex',
        options: [
          { value: Sex.MALE, label: 'Masculin' },
          { value: Sex.FEMALE, label: 'Féminin' },
        ],
        default: Sex.MALE,
        alwaysShow: true,
      },
    ],
  },
  {
    name: 'Contact',
    fields: [
      {
        type: 'text',
        label: 'Téléphone',
        name: 'tel',
        mode: 'input',
        keyboardType: 'phone-pad',
        default: '',
        alwaysShow: true,
        help: 'Format: +229 01XXXXXXXX',
        placeholder: 'Ex. +229 0123456789',
        validation: { required: false },
        schema: v.optional(
          v.union([
            v.pipe(
              v.literal(''),
              v.transform(() => undefined),
            ),
            v.pipe(v.string(), v.regex(/^(?:\+229|00229)?(01[0-9]{8})$/, 'Numéro invalide')),
          ]),
        ),
      },
      {
        type: 'text',
        label: 'Email',
        name: 'email',
        mode: 'input',
        keyboardType: 'email-address',
        default: '',
        alwaysShow: true,
        placeholder: 'Ex. john.doe@example.com',
        validation: { required: false },
      },
    ],
  },
  {
    name: 'Adresse',
    fields: [
      {
        type: 'text',
        label: 'Adresse complète',
        name: 'fullAddress',
        mode: 'input',
        default: '',
        alwaysShow: true,
        placeholder: 'Ex. 123 Rue Principale',
        validation: { required: false },
      },
      {
        type: 'text',
        label: 'Ville',
        name: 'city',
        mode: 'input',
        default: '',
        alwaysShow: true,
        placeholder: 'Ex. Cotonou',
        validation: { required: true },
      },
    ],
  },
  {
    name: 'Parents / Tuteurs',
    fields: [
      {
        type: 'text',
        label: 'Nom du parent ou tuteur',
        name: 'parent_1_name',
        mode: 'input',
        default: '',
        alwaysShow: true,
        placeholder: 'Ex. Jane Doe',
        validation: { required: false },
      },
      {
        type: 'text',
        label: 'Téléphone du parent',
        name: 'parent_1_tel',
        mode: 'input',
        keyboardType: 'phone-pad',
        default: '',
        alwaysShow: true,
        help: 'Format: +229 01XXXXXXXX',
        placeholder: 'Ex. +229 0123456786',
        validation: { required: false },
        schema: v.optional(
          v.union([
            v.pipe(
              v.literal(''),
              v.transform(() => undefined),
            ),
            v.pipe(v.string(), v.regex(/^(?:\+229|00229)?(01[0-9]{8})$/, 'Numéro invalide')),
          ]),
        ),
      },
      {
        type: 'select',
        label: 'Lien de parenté',
        name: 'parent_1_relation',
        options: [
          { value: ParentRelation.FATHER, label: 'Père' },
          { value: ParentRelation.MOTHER, label: 'Mère' },
          { value: ParentRelation.GUARDIAN, label: 'Tuteur / Autre' },
        ],
        default: ParentRelation.GUARDIAN,
        alwaysShow: true,
      },
      {
        type: 'radio',
        name: 'has_parent_2',
        label: 'Ajouter un second parent ?',
        options: [
          { value: 'oui', label: 'Oui' },
          { value: 'non', label: 'Non' },
        ],
        default: 'non',
        alwaysShow: true,
      },
      {
        type: 'text',
        name: 'parent_2_name',
        label: 'Nom du parent 2',
        placeholder: 'Nom complet',
        mode: 'input',
        alwaysShow: false,
        validation: { required: false },
        condition: (data: unknown) =>
          typeof data === 'object' && data !== null && 'has_parent_2' in data
            ? (data as Record<string, unknown>).has_parent_2 === 'oui'
            : false,
      },
      {
        type: 'text',
        label: 'Téléphone du parent 2',
        name: 'parent_2_tel',
        mode: 'input',
        keyboardType: 'phone-pad',
        default: '',
        alwaysShow: false,
        placeholder: 'Ex. +229 0123456789',
        validation: { required: false },
        condition: (data: unknown) =>
          typeof data === 'object' && data !== null && 'has_parent_2' in data
            ? (data as Record<string, unknown>).has_parent_2 === 'oui'
            : false,
      },
      {
        type: 'select',
        label: 'Lien de parenté (parent 2)',
        name: 'parent_2_relation',
        options: [
          { value: ParentRelation.FATHER, label: 'Père' },
          { value: ParentRelation.MOTHER, label: 'Mère' },
          { value: ParentRelation.GUARDIAN, label: 'Tuteur / Autre' },
        ],
        default: ParentRelation.GUARDIAN,
        alwaysShow: false,
        condition: (data: unknown) =>
          typeof data === 'object' && data !== null && 'has_parent_2' in data
            ? (data as Record<string, unknown>).has_parent_2 === 'oui'
            : false,
      },
    ],
  },
];
