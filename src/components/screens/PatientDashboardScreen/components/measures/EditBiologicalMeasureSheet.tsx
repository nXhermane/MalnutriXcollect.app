import { BlurView } from '@/components/shared/BlurView';
import { DynamicForm, useDynamicFormHelpers } from '@/components/shared/forms';
import { Icon } from '@/components/shared/icons';
import { convertBiologyDataFieldsToFormConfig } from '@/lib/helpers/forms/biology';
import { BiologicalMeasure } from '@/schemas/biological-measure.schema';
import { getBiologicalRef } from '@/services/registry/registry.service';
import { BottomSheet, Button, FieldError, Spinner } from 'heroui-native';
import { useMemo } from 'react';
import { View } from 'react-native';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  measure: BiologicalMeasure;
  onSave: (value: number, unit: string) => void;
}

function EditBiologicalMeasureSheetContent({
  measure,
  onClose,
  onSave,
}: {
  measure: BiologicalMeasure;
  onClose: () => void;
  onSave: (value: number, unit: string) => void;
}) {
  const { props, error, formReady, invalidInputCount, loading, submit, success } =
    useDynamicFormHelpers();

  const sections = useMemo(() => {
    const ref = getBiologicalRef(measure.code);
    if (ref) {
      return convertBiologyDataFieldsToFormConfig([
        {
          code: ref.code,
          name: ref.name,
          unit: ref.unit,
          availableUnits: ref.availableUnits,
        },
      ]);
    }
    return convertBiologyDataFieldsToFormConfig([
      {
        code: measure.code,
        name: measure.code,
        unit: measure.unit,
        availableUnits: [measure.unit],
      },
    ]);
  }, [measure.code, measure.unit]);

  return (
    <BottomSheet.Content
      snapPoints={['45%']}
      contentContainerClassName="py-0 px-0 pb-safe-offset-4">
      <View className="flex-row items-center justify-between py-3 border-b border-border px-4">
        <BottomSheet.Title>Modifier la mesure biologique</BottomSheet.Title>
        <BottomSheet.Close />
      </View>

      <View className="flex-1 px-2 py-4">
        <DynamicForm
          {...props}
          sections={sections}
          containerClassName="px-0"
          initialValues={{ [measure.code]: { value: measure.value, unit: measure.unit } }}
          onSubmit={async (formData) => {
            const entry = Object.values(
              formData as Record<string, { code: string; value: number; unit: string } | undefined>,
            ).find((v) => v?.code === measure.code);
            if (!entry) throw new Error('Mesure introuvable');
            onSave(entry.value, entry.unit);
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

export function EditBiologicalMeasureSheet({ isOpen, onClose, measure, onSave }: Props) {
  return (
    <BottomSheet isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay>
          <BlurView />
        </BottomSheet.Overlay>
        <EditBiologicalMeasureSheetContent measure={measure} onClose={onClose} onSave={onSave} />
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
