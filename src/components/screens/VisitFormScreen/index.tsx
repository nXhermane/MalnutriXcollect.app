import { BlurView } from '@/components/shared/BlurView';
import { DynamicForm, useDynamicFormHelpers } from '@/components/shared/forms';
import { Icon } from '@/components/shared/icons';
import { MeasureCategory, SystemCodes } from '@/constants';
import { AnthroSystemCodes, AnthroUnit } from '@/constants/anthropometric';
import { useMeasureActions } from '@/hooks/useMeasureActions';
import { useToast } from '@/hooks/useToast';
import { useVisitActions } from '@/hooks/useVisitActions';
import { visitFormSections } from '@/lib/helpers/forms/visit-form-config';
import { getAgeInDayAndMonth } from '@/lib/utils/get-age-in-month';
import { vibrate, vibrateSuccess } from '@/lib/utils/haptics';
import { logger } from '@/lib/utils/logger';
import { ClinicalFieldValue } from '@/schemas';
import { Patient } from '@/schemas/patient.schema';
import { measures$ } from '@/store/measures/measures.store';
import { patients$ } from '@/store/patients/patients.store';
import { visits$ } from '@/store/visits/visits.store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, FieldError, Spinner } from 'heroui-native';
import { Pressable, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type RawFormData = Record<string, unknown>;

interface AnthroResult {
  code: AnthroSystemCodes;
  value: number;
  unit: AnthroUnit;
}

interface ClinicalResult {
  code: string;
  value: ClinicalFieldValue;
}

function parseFormData(data: RawFormData): {
  anthropometrics: AnthroResult[];
  clinicalFields: ClinicalResult[];
} {
  const anthropometrics: AnthroResult[] = [];
  const clinicalFields: ClinicalResult[] = [];
  const anthroKeys = new Set<string>(Object.values(AnthroSystemCodes));

  for (const [key, val] of Object.entries(data)) {
    if (val === undefined || val === null) continue;
    if (anthroKeys.has(key)) {
      if (typeof val === 'object' && 'code' in val) {
        anthropometrics.push(val as AnthroResult);
      }
    } else {
      if (typeof val === 'object' && 'code' in val) {
        clinicalFields.push(val as ClinicalResult);
      } else {
        clinicalFields.push({ code: key, value: val as ClinicalFieldValue });
      }
    }
  }
  return { anthropometrics, clinicalFields };
}

function buildInitialValues(visitId: string, patientId: string): RawFormData {
  const visit = (visits$[patientId].peek() ?? []).find((v) => v.id === visitId);
  if (!visit) return {};

  const patientMeasures = measures$[patientId].peek();
  if (!patientMeasures) return {};

  const result: RawFormData = {};

  for (const m of patientMeasures[MeasureCategory.ANTHRO]) {
    if (visit.measureIds[MeasureCategory.ANTHRO].includes(m.id)) {
      result[m.code] = { value: m.value, unit: m.unit };
    }
  }
  for (const m of patientMeasures[MeasureCategory.FIELD]) {
    if (visit.measureIds[MeasureCategory.FIELD].includes(m.id)) {
      result[m.code] = m.value;
    }
  }
  return result;
}

export function VisitFormScreen() {
  const router = useRouter();
  const {
    id: patientId,
    visitId,
    readonly,
  } = useLocalSearchParams<{
    id: string;
    visitId?: string;
    readonly?: string;
  }>();
  const { top } = useSafeAreaInsets();
  const toast = useToast();
  const { addAnthropometricMeasure, addClinicalFieldMeasure } = useMeasureActions();
  const { createVisit } = useVisitActions();

  const isReadOnly = readonly === '1';
  const patient = patients$[patientId].peek() as Patient | undefined;

  const existingVisit = visitId
    ? (visits$[patientId].peek() ?? []).find((v) => v.id === visitId)
    : undefined;

  const { props, submit, loading, error, success, formReady, invalidInputCount } =
    useDynamicFormHelpers();

  const handleSubmit = async (data: RawFormData) => {
    const visit = existingVisit ?? createVisit(patientId);
    const { anthropometrics, clinicalFields } = parseFormData(data);

    for (const anthro of anthropometrics) {
      addAnthropometricMeasure(
        patientId,
        { code: anthro.code, value: anthro.value, unit: anthro.unit },
        visit.id,
      );
    }
    for (const field of clinicalFields) {
      addClinicalFieldMeasure(patientId, { code: field.code, value: field.value }, visit.id);
    }

    logger.info('[VisitFormScreen] Visit saved', {
      visitId: visit.id,
      anthro: anthropometrics.length,
      clinical: clinicalFields.length,
    });
    vibrateSuccess();
    toast.show('Success', 'Visite enregistrée avec succès');
    router.back();
  };

  const title = isReadOnly
    ? 'Détail de la visite'
    : existingVisit
      ? `Visite du ${new Date(existingVisit.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}`
      : 'Nouvelle visite';

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
            <Icon name="X" sizeClassName="text-lg" className="text-foreground" />
          </Pressable>

          <View className="flex-1 bg-surface/80 h-12 rounded-2xl shadow-sm items-center justify-center px-4">
            <Text className="text-foreground text-base font-bold tracking-tight" numberOfLines={1}>
              {title}
            </Text>
            {patient && (
              <Text className="text-muted text-xs font-light" numberOfLines={1}>
                {patient.name}
              </Text>
            )}
          </View>

          {isReadOnly && (
            <View className="px-3 py-2 rounded-2xl bg-muted/10">
              <Icon name="LockKeyhole" sizeClassName="text-lg" className="text-muted" />
            </View>
          )}
        </View>
      </View>

      <KeyboardAwareScrollView
        bottomOffset={40}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pt-20 pb-32 px-2">
        <DynamicForm
          {...props}
          sections={visitFormSections}
          onSubmit={handleSubmit}
          initialValues={{
            ...(visitId ? buildInitialValues(visitId, patientId) : {}),
          }}
          extraData={{
            [SystemCodes.AGE_IN_DAY]: getAgeInDayAndMonth(
              new Date(patient?.birthdate || Date.now()),
            ).inDays,
          }}
          readonly={isReadOnly}
          submitOnlyDirty={true}
          containerClassName="px-0"
        />
      </KeyboardAwareScrollView>

      {!isReadOnly && (
        <View className="absolute -bottom-1 w-full overflow-hidden rounded-t-3xl">
          <BlurView />
          <View className="px-4 pt-4 pb-v-4">
            <Button
              variant={error ? 'danger' : 'primary'}
              className="w-full h-12 rounded-2xl shadow-lg"
              isDisabled={loading || formReady}
              onPress={submit}>
              {loading ? (
                <View className="flex-row items-center gap-2">
                  <Spinner size="sm" color="white" />
                  <Button.Label className="text-white font-bold text-base">
                    Enregistrement...
                  </Button.Label>
                </View>
              ) : (
                <View className="flex-row items-center gap-2">
                  {error ? (
                    <Icon name="TriangleAlert" sizeClassName="text-lg" className="text-white" />
                  ) : success ? (
                    <Icon name="Check" sizeClassName="text-lg" className="text-white" />
                  ) : (
                    <Icon name="Save" sizeClassName="text-lg" className="text-white" />
                  )}
                  <Button.Label className="text-white font-bold text-base">
                    {error ? 'Vérifier les erreurs' : 'Enregistrer la visite'}
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
      )}
    </View>
  );
}
