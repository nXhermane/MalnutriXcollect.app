import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';
import * as Hapatic from 'expo-haptics';
import { Icon } from '@/components/ui/icon';
import { Check, X } from 'lucide-react-native';
import { DynamicForm, DynamicFromMethods, FormSection } from '@/components/custom';
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { BlurView } from 'expo-blur';
import { useRef, useState } from 'react';
import { useValue } from '@legendapp/state/react';
import { isDark$ } from '@/store';
import {
  CreatePatientDTO,
  createPatientSchema,
  ParentRelation,
  parentSchema,
  Sex,
} from '@/models/schemas';
import * as v from 'valibot';
import { useAddPatientViewModal } from '@/hooks/useAddPatientViewModel';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { verticalScale } from 'react-native-size-matters';

export default function AddPatient() {
  const isDark = useValue(isDark$);
  const dynamicFromRef = useRef<DynamicFromMethods>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [onSucess, setOnSucess] = useState<boolean>(false);
  const { addPatient, isLoading: addPatientLoading } = useAddPatientViewModal();
  const handleSubmit = () => {
    dynamicFromRef.current?.submit();
  };
  return (
    <VStack className="pt-safe flex-1 bg-background-50 dark:bg-background-0">
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
              className="size-12 items-center justify-center rounded-full bg-background-0 dark:bg-background-50">
              <Icon as={X} className="" />
            </Pressable>
            <HStack className="h-12 flex-1 items-center justify-center rounded-3xl bg-background-0 dark:bg-background-50">
              <Text className="text-center font-h4 text-typography-950 ">Ajouter un patient</Text>
            </HStack>
          </HStack>
        </BlurView>
      </VStack>
      <KeyboardAwareScrollView
        bottomOffset={verticalScale(40)}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pt-18 pb-20">
        <DynamicForm
          ref={dynamicFromRef}
          sections={addPatientFormConfig}
          onSubmit={(data) => addPatient(data as any)}
          onError={(error) => setError(error)}
          onSucess={(state) => {
            setOnSucess(state);
            if (state) dynamicFromRef.current?.reset({});
          }}
          onLoading={(state) => setIsLoading(state)}
          transformData={transformData}
          outputSchema={createPatientSchema}
        />
      </KeyboardAwareScrollView>
      <HStack className=" absolute bottom-0 w-full overflow-hidden rounded-xl">
        <BlurView
          tint={isDark ? 'dark' : 'light'}
          intensity={100}
          experimentalBlurMethod={'dimezisBlurView'}
          className="w-full px-4 py-v-2">
          <Button
            className={`h-v-12 w-full rounded-xl ${error ? 'bg-red-500' : 'bg-green-600'}`}
            onPress={handleSubmit}>
            {isLoading || addPatientLoading ? (
              <ButtonSpinner size={'small'} className="data-[active=true]:text-green-500" />
            ) : (
              <ButtonText className="font-h4 font-medium text-white data-[active=true]:text-green-500">
                Ajouter un nouveau patient
              </ButtonText>
            )}

            {onSucess && <ButtonIcon as={Check} className="text-white" />}
            {error && <ButtonIcon as={X} className="text-white" />}
          </Button>
        </BlurView>
      </HStack>
    </VStack>
  );
}

const addPatientFormConfig: FormSection[] = [
  {
    name: 'Informations de base',
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
        label: 'Adresse Complete',
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
    name: 'Parents',
    fields: [
      {
        type: 'text',
        label: 'Nom',
        name: 'parent1Nom',
        mode: 'input',
        default: '',
        alwaysShow: true,
        placeholder: 'Ex. John Doe',
        validation: { required: false },
      },
      {
        type: 'text',
        label: 'Numéro de téléphone',
        name: 'parent1Tel',
        mode: 'input',
        default: '',
        alwaysShow: true,
        placeholder: 'Ex. +229 80 1234 5678',
        validation: { required: false },
      },
      {
        type: 'select',
        label: 'Relation',
        name: 'parent1Relation',
        options: [
          { value: ParentRelation.FATHER, label: 'Père' },
          { value: ParentRelation.MOTHER, label: 'Mère' },
          { value: ParentRelation.GUARDIAN, label: 'Autre' },
        ],
        default: ParentRelation.GUARDIAN,
        alwaysShow: true,
      },
      {
        type: 'radio',
        name: 'hasParent2',
        label: 'Y a-t-il un deuxième parent ?',
        options: [
          { value: 'oui', label: 'Oui' },
          { value: 'non', label: 'Non' },
        ],
        default: 'non',
        validation: { required: false },
        alwaysShow: true,
      },
      {
        type: 'text',
        name: 'parent2Nom',
        label: 'Nom du parent 2',
        placeholder: 'Nom complet',
        mode: 'input',
        alwaysShow: false,
        validation: { required: false },
        condition: (data) => data.hasParent2 === 'oui',
      },
      {
        type: 'text',
        label: 'Numéro de téléphone',
        name: 'parent2Tel',
        mode: 'input',
        default: '',
        alwaysShow: false,
        placeholder: 'Ex. +229 80 1234 5678',
        validation: { required: false },
        condition: (data) => data.hasParent2 === 'oui',
      },
      {
        type: 'select',
        label: 'Relation',
        name: 'parent2Relation',
        options: [
          { value: ParentRelation.FATHER, label: 'Père' },
          { value: ParentRelation.MOTHER, label: 'Mère' },
          { value: ParentRelation.GUARDIAN, label: 'Autre' },
        ],
        default: ParentRelation.GUARDIAN,
        alwaysShow: false,
        condition: (data) => data.hasParent2 === 'oui',
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
    name: data?.parent1Nom,
    tel: data?.parent1Tel,
    relation: data?.parent1Relation,
  };
  const parentValidationResult = v.safeParse(parentSchema, parent1);
  if (parentValidationResult.success) {
    parents.push(parent1);
  }
  // Ajouter le parent 2 s'il existe
  if (data.hasParent2 === 'oui' && data.parent2Nom) {
    const parent2 = {
      name: data?.parent2Nom,
      tel: data?.parent2Tel,
      relation: data?.parent2Relation,
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
