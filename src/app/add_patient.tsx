import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';
import * as Hapatic from 'expo-haptics';
import { Icon } from '@/components/ui/icon';
import { Check, X } from 'lucide-react-native';
import { DynamicForm, DynamicFromMethods } from '@/components/custom';
import { FormField } from '@/utils/field';
import { ScrollView } from 'react-native';
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { BlurView } from 'expo-blur';
import { useRef, useState } from 'react';
import { useValue } from '@legendapp/state/react';
import { isDark$ } from '@/store';
const simpleFormFields: FormField[] = [
  {
    type: 'text',
    name: 'nom',
    label: 'Nom complet',
    placeholder: 'Entrez votre nom',
    mode: 'input',
    validation: { required: true },
    alwaysShow: true,
  },
  {
    type: 'text',
    name: 'email',
    label: 'Email',
    placeholder: 'example@email.com',
    mode: 'input',
    validation: { required: true },
    alwaysShow: true,
  },
  {
    type: 'quantity',
    name: 'age',
    label: 'Age',
    placeholder: 'ex. 30 ans',
    unitOptions: [
      {
        value: 'm',
        label: 'Mois',
      },
      {
        value: 'y',
        label: 'Année',
      },
    ],
    default: {
      unit: 'y',
      value: 0,
    },
    validation: { required: true },
    alwaysShow: true,
  },
  {
    type: 'select',
    name: 'typeUtilisateur',
    label: "Type d'utilisateur",
    options: [
      { value: 'particulier', label: 'Particulier' },
      { value: 'entreprise', label: 'Entreprise' },
      { value: 'etudiant', label: 'Étudiant' },
    ],
    default: 'particulier',
    validation: { required: true },
    alwaysShow: true,
  },
  {
    type: 'date',
    mode: 'date',
    default: new Date(),
    label: 'date ',
    name: 'date',
  },
  {
    type: 'text',
    name: 'nomEntreprise',
    label: "Nom de l'entreprise",
    placeholder: 'Nom de votre entreprise',
    mode: 'input',
    validation: { required: true },
    condition: (data) => data.typeUtilisateur === 'entreprise',
  },
  {
    type: 'checkbox',
    name: 'interets',
    label: "Centres d'intérêt",
    options: [
      { value: 'sport', label: 'Sport' },
      { value: 'musique', label: 'Musique' },
      { value: 'lecture', label: 'Lecture' },
      { value: 'voyage', label: 'Voyage' },
    ],
    default: [],
  },
];
export default function AddPatient() {
  const isDark = useValue(isDark$);
  const dynamicFromRef = useRef<DynamicFromMethods>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [onSucess, setOnSucess] = useState<boolean>(false);
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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pt-18 pb-20">
        <DynamicForm
          ref={dynamicFromRef}
          sections={[{ fields: simpleFormFields, name: 'General' }]}
          onSubmit={(data) => console.log(data)}
          onError={(error) => setError(error)}
          onSucess={(state) => setOnSucess(state)}
          onLoading={(state) => setIsLoading(state)}
        />
      </ScrollView>
      <HStack className=" absolute bottom-0 w-full overflow-hidden rounded-xl">
        <BlurView
          tint={isDark ? 'dark' : 'light'}
          intensity={100}
          experimentalBlurMethod={'dimezisBlurView'}
          className="w-full px-4 py-v-2">
          <Button
            className={`h-v-12 w-full rounded-xl ${error ? 'bg-red-500' : 'bg-green-600'}`}
            onPress={handleSubmit}>
            {isLoading ? (
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
