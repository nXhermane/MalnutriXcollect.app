import { DynamicForm, FormSection, useDynamicFormHelpers } from '@/components/custom';
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { AnthroSystemCodes, SystemCodes } from '@/constants';
import { useAddMeasureToPatientViewModel } from '@/hooks/useAddMeasureToPatientViewModel';
import { useUpdatePatientMeasureViewModel } from '@/hooks/useUpdatePatientMeasureViewModel';
import {
  CreatePatientMeasureDTO,
  createPatientMeasureSchema,
  UpdatePatientMeasureDTO,
} from '@/models/schemas';
import { isDark$, modeles$ } from '@/store';
import { anthropFromConfing } from '@/utils/anthroFromConfig';
import {
  clinicalDataFieldRefs,
  convertClinicalDataFieldsToFormConfigWithSchema,
} from '@/utils/dataFieldToFormConfig';
import { getAgeInDays } from '@/utils/human-date-formatter';
import { useValue } from '@legendapp/state/react';
import { BlurView } from 'expo-blur';
import * as Hapatic from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { Check, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { verticalScale } from 'react-native-size-matters';

export default function AddMeasureToPatient() {
  const { id, measureId, readonly } = useLocalSearchParams<{
    id: string;
    measureId: string;
    readonly: string;
  }>();
  const isDark = useValue(() => isDark$.get());
  const { props, loading, error, sucess, formReady, submit, invalidInputCount } =
    useDynamicFormHelpers();
  const isUpdate = !!measureId;
  const isReadOnly = Number(readonly) === 1;
  const isLoading = loading;

  const { addMeasureToPatient, isLoading: addLoading } = useAddMeasureToPatientViewModel();
  const { updatePatientMeasure, isLoading: updateLoading } = useUpdatePatientMeasureViewModel();

  const measure = useValue(() =>
    modeles$.patient_measures[id].get().find((m) => m.id === measureId),
  );
  const patient = useValue(() => modeles$.patients[id].get());

  const isProcessing = isLoading || addLoading || updateLoading;
  const [sections, setSections] = useState<FormSection[]>([]);
  const [onSessionGeneration, setOnSessionGeneration] = useState<boolean>(false);

  useEffect(() => {
    const generateSession = async () => {
      setOnSessionGeneration(true);
      const formConfig = convertClinicalDataFieldsToFormConfigWithSchema(clinicalDataFieldRefs);
      return [...anthropFromConfing, ...formConfig];
    };
    generateSession()
      .then((_sections) => {
        setSections(_sections);
      })
      .finally(() => setOnSessionGeneration(false));
  }, []);

  return (
    <VStack className="pt-safe flex-1  bg-bg">
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
                    ? 'Detail de la visite'
                    : 'Mettre à jour'
                  : 'Ajouter une visite'}
              </Text>
            </HStack>
          </HStack>
        </BlurView>
      </VStack>
      {onSessionGeneration ? (
        <Center className="flex-1">
          <Spinner size={'large'} className="text-emerald-700 dark:text-emerald-500" />
        </Center>
      ) : (
        <KeyboardAwareScrollView
          bottomOffset={verticalScale(40)}
          showsVerticalScrollIndicator={false}
          contentContainerClassName={`pt-18 ${isReadOnly ? 'pb-10' : 'pb-20'}`}>
          <DynamicForm
            {...props}
            sections={sections}
            onSubmit={(data) => {
              try {
                if (isUpdate && measureId) {
                  const result = updatePatientMeasure(
                    id,
                    measureId,
                    data as UpdatePatientMeasureDTO,
                  );
                  console.log('Measure updated successfully', result);
                  router.back();
                } else {
                  const result = addMeasureToPatient(id, data as CreatePatientMeasureDTO);
                  console.log('Measure added successfully', result);
                  router.back();
                }
              } catch (error: any) {
                console.error('Error submitting form:', error);
              }
            }}
            outputSchema={createPatientMeasureSchema}
            transformData={transformData}
            initialValues={{
              [SystemCodes.AGE_IN_DAY]: getAgeInDays(patient.birthdate),
              ...(isUpdate ? transformDataBack(measure as CreatePatientMeasureDTO) : {}),
            }}
            readonly={Number(readonly) === 1}
          />
        </KeyboardAwareScrollView>
      )}
      {!isReadOnly && (
        <HStack className=" absolute bottom-0 w-full overflow-hidden rounded-xl">
          <BlurView
            tint={isDark ? 'dark' : 'light'}
            intensity={100}
            experimentalBlurMethod={'dimezisBlurView'}
            className="w-full px-4 py-v-2">
            <Button
              className={`h-v-12 flex-1 rounded-xl  shadow-lg  shadow-emerald-600/20 hover:bg-emerald-700 dark:shadow-emerald-500/10 ${error ? 'bg-red-500' : 'bg-emerald-600 dark:bg-emerald-500'}`}
              isDisabled={formReady}
              onPress={submit}>
              {isProcessing ? (
                <ButtonSpinner
                  size={'small'}
                  className="text-white data-[active=true]:text-emerald-700"
                />
              ) : (
                <ButtonText className="font-h4 font-medium text-white data-[active=true]:text-emerald-700">
                  {isUpdate ? 'Mettre à jour' : 'Ajouter une nouvelle visite'}
                </ButtonText>
              )}
              {sucess && <ButtonIcon as={Check} className="text-white" />}
              {error && <ButtonIcon as={X} className="text-white" />}
            </Button>
            {error && (
              <Text className="text-center font-h4 text-red-500">{`${invalidInputCount} champs invalides`}</Text>
            )}
          </BlurView>
        </HStack>
      )}
    </VStack>
  );
}

const transformData = (data: any): CreatePatientMeasureDTO => {
  const anthropometricMeasures: any[] = [];
  const clinicalFields: { value: any; code: string }[] = [];

  if (data[AnthroSystemCodes.WEIGHT]) {
    anthropometricMeasures.push(data[AnthroSystemCodes.WEIGHT]);
  }
  if (data[AnthroSystemCodes.HEIGHT]) {
    anthropometricMeasures.push(data[AnthroSystemCodes.HEIGHT]);
  }
  if (data[AnthroSystemCodes.LENGTH]) {
    anthropometricMeasures.push(data[AnthroSystemCodes.LENGTH]);
  }
  if (data[AnthroSystemCodes.MUAC]) {
    anthropometricMeasures.push(data[AnthroSystemCodes.MUAC]);
  }
  if (data[AnthroSystemCodes.HEAD_CIRCUMFERENCE]) {
    anthropometricMeasures.push(data[AnthroSystemCodes.HEAD_CIRCUMFERENCE]);
  }
  if (data[AnthroSystemCodes.TSF]) {
    anthropometricMeasures.push(data[AnthroSystemCodes.TSF]);
  }
  if (data[AnthroSystemCodes.SSF]) {
    anthropometricMeasures.push(data[AnthroSystemCodes.SSF]);
  }
  Object.keys(data).forEach((key) => {
    if (
      key === AnthroSystemCodes.WEIGHT ||
      key === AnthroSystemCodes.HEIGHT ||
      key === AnthroSystemCodes.LENGTH ||
      key === AnthroSystemCodes.MUAC ||
      key === AnthroSystemCodes.HEAD_CIRCUMFERENCE ||
      key === AnthroSystemCodes.TSF ||
      key === AnthroSystemCodes.SSF ||
      key === SystemCodes.AGE_IN_DAY
    ) {
      return;
    }

    if (data[key] && typeof data[key] === 'object' && 'value' in data[key] && 'code' in data[key]) {
      clinicalFields.push({
        value: data[key].value,
        code: data[key].code,
      });
    } else if (data[key] !== undefined && data[key] !== null) {
      clinicalFields.push({
        value: data[key],
        code: key,
      });
    }
  });
  return {
    measures: anthropometricMeasures,
    fields: clinicalFields,
  };
};

const transformDataBack = (data: CreatePatientMeasureDTO): any => {
  const result: any = {};

  if (Array.isArray(data.measures)) {
    data.measures.forEach((measure: any) => {
      if (measure && measure.code && measure.value !== undefined && measure.unit) {
        result[measure.code] = {
          value: measure.value,
          unit: measure.unit,
        };
      }
    });
  }

  if (Array.isArray(data.fields)) {
    data.fields.forEach((field: any) => {
      if (field && field.code !== undefined && field.value !== undefined) {
        if (typeof field.value === 'boolean') {
          result[field.code] = field.value ? ['true'] : [];
        } else {
          result[field.code] = field.value;
        }
      }
    });
  }

  return result;
};
