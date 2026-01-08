import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { router, useLocalSearchParams } from 'expo-router';
import * as Hapatic from 'expo-haptics';
import { Icon } from '@/components/ui/icon';
import { Check, X } from 'lucide-react-native';
import { DynamicForm, FormSection, useDynamicFormHelpers } from '@/components/custom';
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { BlurView } from 'expo-blur';
import { isDark$, modeles$ } from '@/store';
import {
  CreatePatientDTO,
  createPatientSchema,
  ParentRelation,
  parentSchema,
  Sex,
  UpdatePatientDTO,
} from '@/models/schemas';
import * as v from 'valibot';
import { useAddPatientViewModal } from '@/hooks/useAddPatientViewModel';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { verticalScale } from 'react-native-size-matters';
import { useValue } from '@legendapp/state/react';
import { useUpdatePatientViewModel } from '@/hooks';
import { useEffect } from 'react';
import { useToast } from '@/providers/Toast';

export default function AddOrUpdatePatient() {
  const toast = useToast();
  const { id, readonly } = useLocalSearchParams<{ id: string; readonly: string }>();
  const isDark = useValue(isDark$);
  const { props, submit, reset, loading, error, sucess, formReady, invalidInputCount } =
    useDynamicFormHelpers();
  const { addPatient, isLoading: addPatientLoading } = useAddPatientViewModal();
  const { updatePatient, isLoading: updatePatientLoading } = useUpdatePatientViewModel();
  const isUpdate = !!id;
  const isReadOnly = Number(readonly) === 1;
  const patients = useValue(() => modeles$.patients.get());
  const isLoading = loading || addPatientLoading || updatePatientLoading;

  useEffect(() => {
    if (isUpdate) {
      reset && reset(transformDataBack(patients[id] as CreatePatientDTO));
    }
  }, [patients, reset, isUpdate, id]);
  return (
    <VStack className="pt-safe flex-1 bg-bg">
      <VStack className=" absolute  z-30  w-full  items-center justify-center">
        <BlurView
          tint={isDark ? 'dark' : 'light'}
          experimentalBlurMethod={'dimezisBlurView'}
          intensity={100}
          className="w-full">
          <HStack className="pt-safe w-full items-center gap-4 px-4 pb-2 ">
            <Pressable
              onPress={() => {
                router.back();
                Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
              }}
              className="elevation-sm size-12 items-center justify-center rounded-full bg-card ">
              <Icon as={X} className="text-muted-foreground" />
            </Pressable>
            <HStack className="elevation-sm h-12 flex-1 items-center justify-center rounded-3xl bg-card">
              <Text className="text-center font-h4 text-foreground">
                {isUpdate
                  ? isReadOnly
                    ? patients[id].name
                    : 'Mettre à jour'
                  : 'Ajouter un patient'}
              </Text>
            </HStack>
          </HStack>
        </BlurView>
      </VStack>
      <KeyboardAwareScrollView
        bottomOffset={verticalScale(40)}
        showsVerticalScrollIndicator={false}
        contentContainerClassName={`pt-18 ${isReadOnly ? 'pb-10' : 'pb-20'}`}>
        <DynamicForm
          {...props}
          sections={addPatientFormConfig}
          onSubmit={(data) => {
            if (isUpdate) {
              updatePatient(id, data as UpdatePatientDTO);
              console.log('Patient updated successfully');
              toast.show(
                'Success',
                'Patient mis à jour avec succès',
                undefined,
                'top',
                'patient_update_success',
              );
              setTimeout(() => {
                router.back();
              }, 1000);
            } else {
              addPatient(data as CreatePatientDTO);
              console.log('Patient added successfully');
              toast.show(
                'Success',
                'Patient créé avec succès',
                undefined,
                'top',
                'patient_creation_success',
              );
              setTimeout(() => {
                router.back();
              }, 1000);
            }
          }}
          transformData={transformData}
          outputSchema={createPatientSchema}
          {...{
            initialValues: isUpdate
              ? transformDataBack(patients[id] as CreatePatientDTO)
              : undefined,
          }}
          readonly={isReadOnly}
        />
      </KeyboardAwareScrollView>
      {!isReadOnly && (
        <HStack className=" absolute bottom-0 w-full overflow-hidden rounded-xl">
          <BlurView
            tint={isDark ? 'dark' : 'light'}
            intensity={100}
            experimentalBlurMethod={'dimezisBlurView'}
            className="w-full px-4 py-v-2">
            <Button
              className={`h-v-12 flex-1 rounded-xl  shadow-lg  shadow-emerald-600/20 hover:bg-emerald-700 dark:shadow-emerald-500/10 ${error ? 'bg-red-500' : 'bg-emerald-600 dark:bg-emerald-500'}`}
              isDisabled={formReady || isLoading}
              onPress={submit}>
              {isLoading ? (
                <ButtonSpinner
                  size={'small'}
                  className="text-white data-[active=true]:text-emerald-700"
                />
              ) : (
                <ButtonText className="font-h4 font-medium text-white data-[active=true]:text-emerald-700">
                  {isUpdate ? 'Mettre à jour' : 'Ajouter un nouveau patient'}
                </ButtonText>
              )}
              {sucess && <ButtonIcon as={Check} className="text-white" />}
              {error && <ButtonIcon as={X} className="text-white" />}
            </Button>
            {error && invalidInputCount > 0 && (
              <Text className="text-center font-h4 text-red-500">{`${invalidInputCount} champs invalides`}</Text>
            )}
          </BlurView>
        </HStack>
      )}
    </VStack>
  );
}

const addPatientFormConfig: FormSection[] = [
  {
    name: 'Informations personnelles',
    fields: [
      {
        type: 'text',
        label: 'Nom complet',
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
        default: new Date(),
        alwaysShow: true,
        validation: { required: true },
      },
      {
        type: 'radio',
        label: 'Sexe',
        name: 'sex',
        options: [
          { value: Sex.MALE, label: 'Homme' },
          { value: Sex.FEMALE, label: 'Femme' },
        ],
        default: Sex.MALE,
        alwaysShow: true,
        validation: { required: true },
      },
    ],
  },
  {
    name: 'Informations de contact',
    fields: [
      {
        type: 'text',
        label: 'Numéro de téléphone',
        name: 'tel',
        mode: 'input',
        default: '',
        alwaysShow: true,
        placeholder: 'Ex. +229 80 1234 5678',
        validation: { required: false },
        schema: v.optional(
          v.union([
            v.pipe(
              v.union([v.literal('')]),
              v.transform((value) => undefined),
            ),
            v.pipe(
              v.string(),
              v.regex(/^(?:\+229|00229)?(01[0-9]{8})$/, 'Numéro de téléphone invalide'),
            ),
          ]),
        ),
      },
      {
        type: 'text',
        label: 'Email',
        name: 'email',
        mode: 'input',
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
        label: 'Adresse Complète',
        name: 'fullAddress',
        mode: 'input',
        default: '',
        alwaysShow: true,
        placeholder: 'Ex. 123 Main St',
        validation: { required: true },
      },
      {
        type: 'text',
        label: 'Ville',
        name: 'city',
        mode: 'input',
        default: '',
        alwaysShow: true,
        placeholder: 'Ex. Cotonou',
        validation: { required: false },
      },
    ],
  },
  {
    name: 'Parents / Tuteurs',
    fields: [
      {
        type: 'text',
        label: 'Nom du parent 1',
        name: 'parent_1_name',
        mode: 'input',
        default: '',
        alwaysShow: true,
        placeholder: 'Ex. John Doe',
        validation: { required: false },
      },
      {
        type: 'text',
        label: 'Numéro de téléphone',
        name: 'parent_1_tel',
        mode: 'input',
        default: '',
        alwaysShow: true,
        placeholder: 'Ex. +229 80 1234 5678',
        validation: { required: false },
        schema: v.optional(
          v.union([
            v.pipe(
              v.union([v.literal('')]),
              v.transform((value) => undefined),
            ),
            v.pipe(
              v.string(),
              v.regex(/^(?:\+229|00229)?\s*(01[0-9]{8})$/, 'Numéro de téléphone invalide'),
            ),
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
          { value: 'yes', label: 'Oui' },
          { value: 'no', label: 'Non' },
        ],
        default: 'no',
        validation: { required: false },
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
        condition: (data) => data.has_parent_2 === 'yes',
      },
      {
        type: 'text',
        label: 'Numéro de téléphone',
        name: 'parent_2_tel',
        mode: 'input',
        default: '',
        alwaysShow: false,
        placeholder: 'Ex. +229 80 1234 5678',
        validation: { required: false },
        condition: (data) => data.has_parent_2 === 'yes',
        schema: v.optional(
          v.union([
            v.pipe(
              v.union([v.literal('')]),
              v.transform((value) => undefined),
            ),
            v.pipe(
              v.string(),
              v.regex(/^(?:\+229|00229)?\s*(01[0-9]{8})$/, 'Numéro de téléphone invalide'),
            ),
          ]),
        ),
      },
      {
        type: 'select',
        label: 'Lien de parenté',
        name: 'parent_2_relation',
        options: [
          { value: ParentRelation.FATHER, label: 'Père' },
          { value: ParentRelation.MOTHER, label: 'Mère' },
          { value: ParentRelation.GUARDIAN, label: 'Tuteur / Autre' },
        ],
        default: ParentRelation.GUARDIAN,
        alwaysShow: false,
        condition: (data) => data.has_parent_2 === 'yes',
      },
    ],
  },
];

const transformData = (data: any): CreatePatientDTO => {
  const contact = {
    email: data?.email,
    tel: data?.tel,
  };
  const address = {
    fullAddress: data?.fullAddress,
    city: data?.city,
  };
  const name = data.name;
  const birthdate = data.birthdate;
  const sex = data.sex;
  const parents = [];
  const parent1 = {
    name: data?.parent_1_name,
    tel: data?.parent_1_tel,
    relation: data?.parent_1_relation,
  };
  const parentValidationResult = v.safeParse(parentSchema, parent1);
  if (parentValidationResult.success) {
    parents.push(parent1);
  }
  // Ajouter le parent 2 s'il existe
  if (data.has_parent_2 === 'yes' && data.parent_2_name) {
    const parent2 = {
      name: data?.parent_2_name,
      tel: data?.parent_2_tel,
      relation: data?.parent_2_relation,
    };
    const parent2ValidationResult = v.safeParse(parentSchema, parent2);
    if (parent2ValidationResult.success) {
      parents.push(parent2);
    }
  }
  return {
    name,
    birthdate,
    sex,
    contact,
    address,
    parents,
  };
};
const transformDataBack = (data: CreatePatientDTO): any => {
  const name = data.name || '';
  const birthdate = data.birthdate || '';
  const sex = data.sex || '';
  const contact = {
    email: data.contact?.email || '',
    tel: data.contact?.tel || '',
  };
  const address = {
    fullAddress: data.address?.fullAddress || '',
    city: data.address?.city || '',
  };

  const parents = data.parents.map((parent, index) => ({
    [`parent_${index + 1}_name`]: parent.name || '',
    [`parent_${index + 1}_tel`]: parent.tel || '',
    [`parent_${index + 1}_relation`]: parent.relation || '',
  }));
  return {
    name,
    birthdate,
    sex,
    ...contact,
    ...address,
    ...parents,
  };
};
