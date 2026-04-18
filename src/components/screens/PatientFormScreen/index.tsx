import * as v from 'valibot';
import { View, Text, Pressable } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Button, FieldError, Spinner } from 'heroui-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { DynamicForm, useDynamicFormHelpers } from '@/components/shared/forms';
import { BlurView } from '@/components/shared/BlurView';
import { vibrate, vibrateSuccess } from '@/lib/utils/haptics';
import { useToast } from '@/hooks/useToast';
import { toDatetime } from '@/lib/utils/date';
import { patients$ } from '@/store/patients/patients.store';
import { usePatientActions } from '@/hooks/usePatientActions';
import {
  CreatePatientDto,
  createPatientSchema,
  ParentRelation,
  parentSchema,
  Patient,
  Sex,
} from '@/schemas/patient.schema';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { addPatientFormConfig } from './form-config';
import { Icon } from '@/components/shared/icons';

const transformData = (data: { [x: string]: unknown }): CreatePatientDto => {
  const parents: CreatePatientDto['parents'] = [];
  const p1 = { name: data.parent_1_name, tel: data.parent_1_tel, relation: data.parent_1_relation };
  if (v.safeParse(parentSchema, p1).success)
    parents.push(p1 as CreatePatientDto['parents'][number]);
  if (data.has_parent_2 === 'oui' && data.parent_2_name) {
    const p2 = {
      name: data.parent_2_name,
      tel: data.parent_2_tel,
      relation: data.parent_2_relation,
    };
    if (v.safeParse(parentSchema, p2).success)
      parents.push(p2 as CreatePatientDto['parents'][number]);
  }
  return {
    name: data.name as string,
    birthdate: data.birthdate as string,
    sex: data.sex as Sex,
    contact: { email: data.email as string | undefined, tel: data.tel as string | undefined },
    address: { fullAddress: data.fullAddress as string, city: data.city as string },
    parents,
  };
};

const transformDataBack = (p: Patient): { [x: string]: unknown } => ({
  name: p.name,
  birthdate: toDatetime(new Date(p.birthdate)),
  sex: p.sex,
  email: p.contact?.email ?? '',
  tel: p.contact?.tel ?? '',
  fullAddress: p.address?.fullAddress ?? '',
  city: p.address?.city ?? '',
  parent_1_name: p.parents[0]?.name ?? '',
  parent_1_tel: p.parents[0]?.tel ?? '',
  parent_1_relation: p.parents[0]?.relation ?? ParentRelation.GUARDIAN,
  has_parent_2: p.parents.length > 1 ? 'oui' : 'non',
  parent_2_name: p.parents[1]?.name ?? '',
  parent_2_tel: p.parents[1]?.tel ?? '',
  parent_2_relation: p.parents[1]?.relation ?? ParentRelation.GUARDIAN,
});

export function PatientFormScreen() {
  const router = useRouter();
  const { id, readonly } = useLocalSearchParams<{ id?: string; readonly?: string }>();
  const toast = useToast();
  const { top } = useSafeAreaInsets();
  const { createPatient, updatePatient } = usePatientActions();

  const existingPatient = id ? (patients$[id].peek() as Patient | undefined) : undefined;
  const isUpdate = !!existingPatient;
  const isReadonly = readonly ? readonly === '1' : false;
  const { props, submit, loading, error, success, formReady, invalidInputCount } =
    useDynamicFormHelpers();

  const handleSubmit = async (data: CreatePatientDto) => {
    if (isUpdate && existingPatient) {
      updatePatient(existingPatient.id, data);
      toast.show('Success', 'Patient mis à jour avec succès');
    } else {
      createPatient(data);
      toast.show('Success', 'Patient ajouté avec succès');
    }
    vibrateSuccess();
    setTimeout(() => router.back(), 800);
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: top }}>
      <View className="absolute z-30 w-full overflow-hidden" style={{ top }}>
        <BlurView />
        <View className="flex-row items-center gap-3 px-4 pb-2 pt-2">
          <Pressable
            className="bg-surface/80 p-3 rounded-2xl shadow-sm active:bg-surface"
            accessibilityLabel="Fermer"
            onPress={() => {
              router.back();
              vibrate('soft');
            }}>
            <Icon name={'X'} sizeClassName="text-lg" className="text-foreground" />
          </Pressable>
          <View className="flex-1 bg-surface/80 h-12 rounded-2xl shadow-sm items-center justify-center">
            <Text className="text-foreground text-base font-bold tracking-tight">
              {isUpdate ? existingPatient.name : 'Ajouter un patient'}
            </Text>
          </View>
        </View>
      </View>

      <KeyboardAwareScrollView
        bottomOffset={40}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pt-20 pb-32 px-2">
        <DynamicForm
          {...props}
          sections={addPatientFormConfig}
          onSubmit={handleSubmit}
          transformData={transformData as never}
          outputSchema={createPatientSchema as never}
          initialValues={isUpdate ? (transformDataBack(existingPatient) as never) : undefined}
          containerClassName="px-0"
          readonly={isReadonly}
        />
      </KeyboardAwareScrollView>

      <View className="absolute -bottom-1 w-full overflow-hidden rounded-t-3xl">
        <BlurView />
        <View className="px-4 pt-4 pb-v-4">
          <Button
            variant={error ? 'danger' : 'primary'}
            className="w-full h-12 rounded-2xl shadow-lg"
            isDisabled={loading || formReady || isReadonly}
            onPress={submit}>
            {loading ? (
              <View className="flex-row items-center gap-2">
                <Spinner size="sm" color="white" />
                <Button.Label className="text-white font-bold text-base">
                  {isUpdate ? 'Mise à jour...' : 'Ajout...'}
                </Button.Label>
              </View>
            ) : (
              <View className="flex-row items-center gap-2">
                {error ? (
                  <Icon name={'TriangleAlert'} sizeClassName="text-lg" className="text-white" />
                ) : success ? (
                  <Icon name={'Check'} sizeClassName="text-lg" className="text-white" />
                ) : isUpdate ? (
                  <Icon name={'SquarePen'} sizeClassName="text-lg" className="text-white" />
                ) : (
                  <Icon name={'Plus'} sizeClassName="text-lg" className="text-white" />
                )}
                <Button.Label className="text-white font-bold text-base">
                  {error
                    ? 'Vérifier les erreurs'
                    : isUpdate
                      ? 'Mettre à jour le patient'
                      : 'Ajouter un patient'}
                </Button.Label>
              </View>
            )}
          </Button>
          <FieldError
            isInvalid={!!error && invalidInputCount > 0}
            classNames={{ text: 'text-center mt-2 text-red-500 font-medium' }}>
            {`${invalidInputCount} champ${invalidInputCount > 1 ? 's' : ''} invalide${invalidInputCount > 1 ? 's' : ''}`}
          </FieldError>
        </View>
      </View>
    </View>
  );
}
