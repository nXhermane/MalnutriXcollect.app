import { BlurView } from '@/components/shared/BlurView';
import { DynamicForm, useDynamicFormHelpers } from '@/components/shared/forms';
import { Icon } from '@/components/shared/icons';
import { DataFieldRefDto } from '@/data/fields';
import { convertClinicalDataFieldsToFormConfigWithSchema } from '@/lib/helpers/forms/data-fields';
import { ClinicalFieldMeasure, ClinicalFieldValue } from '@/schemas/clinical-field-measure.schema';
import { BottomSheet, Button, FieldError, Spinner } from 'heroui-native';
import { useMemo } from 'react';
import { View } from 'react-native';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  measure: ClinicalFieldMeasure;
  fieldRef: DataFieldRefDto | undefined;
  onSave: (value: ClinicalFieldValue) => void;
}

function EditClinicalFieldMeasureSheetContent({
  measure,
  fieldRef,
  onClose,
  onSave,
}: {
  measure: ClinicalFieldMeasure;
  fieldRef: DataFieldRefDto | undefined;
  onClose: () => void;
  onSave: (value: ClinicalFieldValue) => void;
}) {
  const { props, error, formReady, invalidInputCount, loading, submit, success } =
    useDynamicFormHelpers();

  const sections = useMemo(() => {
    if (!fieldRef) return [];
    return convertClinicalDataFieldsToFormConfigWithSchema([fieldRef], false);
  }, [fieldRef]);

  const initialValues = useMemo(() => {
    if (!fieldRef) return {};
    const val = measure.value;
    if (typeof val === 'object' && val !== null && 'value' in val && 'unit' in val) {
      return { [measure.code]: val };
    }
    return { [measure.code]: val };
  }, [measure, fieldRef]);

  return (
    <BottomSheet.Content
      snapPoints={['50%']}
      contentContainerClassName="py-0 px-0 pb-safe-offset-4">
      <View className="flex-row items-center justify-between py-3 border-b border-border px-4">
        <BottomSheet.Title>Modifier le champ clinique</BottomSheet.Title>
        <BottomSheet.Close />
      </View>

      <View className="flex-1 px-2 py-4">
        <DynamicForm
          {...props}
          sections={sections}
          containerClassName="px-0"
          initialValues={initialValues as never}
          onSubmit={async (formData) => {
            const entry = Object.values(
              formData as Record<string, { code: string; value: ClinicalFieldValue } | undefined>,
            ).find((v) => v?.code === measure.code);
            if (!entry) throw new Error('Champ introuvable');
            onSave(entry.value);
            onClose();
          }}
        />
      </View>

      <View className="px-2 py-3 flex-row items-center gap-2">
        <Button variant="secondary" className="flex-1 h-12" onPress={onClose}>
          <Button.Label className="font-bold">Annuler</Button.Label>
        </Button>
        <Button
          variant={error ? 'danger' : 'primary'}
          className="flex-1 h-12"
          isDisabled={loading || formReady}
          onPress={submit}>
          {loading ? (
            <Spinner size="sm" color="white" />
          ) : (
            <View className="flex-row items-center gap-2">
              {error ? (
                <Icon name="TriangleAlert" className="text-white" sizeClassName="text-base" />
              ) : success ? (
                <Icon name="Check" className="text-white" sizeClassName="text-base" />
              ) : null}
              <Button.Label className="text-white font-bold">
                {error ? 'Vérifier' : 'Mettre à jour'}
              </Button.Label>
            </View>
          )}
        </Button>
      </View>

      <FieldError
        isInvalid={!!error && invalidInputCount > 0}
        classNames={{ text: 'text-center mb-2 text-red-500 font-medium text-xs' }}>
        {`${invalidInputCount} champ${invalidInputCount > 1 ? 's' : ''} invalide${invalidInputCount > 1 ? 's' : ''}`}
      </FieldError>
    </BottomSheet.Content>
  );
}

export function EditClinicalFieldMeasureSheet({
  isOpen,
  onClose,
  measure,
  fieldRef,
  onSave,
}: Props) {
  return (
    <BottomSheet isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay>
          <BlurView />
        </BottomSheet.Overlay>
        <EditClinicalFieldMeasureSheetContent
          measure={measure}
          fieldRef={fieldRef}
          onClose={onClose}
          onSave={onSave}
        />
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
