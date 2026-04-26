import { BlurView } from '@/components/shared/BlurView';
import { DynamicForm, useDynamicFormHelpers } from '@/components/shared/forms';
import { Icon } from '@/components/shared/icons';
import { AnthroSystemCodes } from '@/constants/anthropometric';
import { getAnthropometryFormField } from '@/lib/helpers/forms/anthropometry';
import { AnthropometricMeasure } from '@/schemas/anthropometric-measure.schema';
import { BottomSheet, Button, FieldError, Spinner } from 'heroui-native';
import { View } from 'react-native';
import * as v from 'valibot';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  measure: AnthropometricMeasure;
  onSave: (value: number, unit: string) => void;
}

const outputSchema = v.record(
  v.enum(AnthroSystemCodes),
  v.optional(
    v.object({
      code: v.string(),
      value: v.number(),
      unit: v.string(),
    }),
  ),
);

function EditAnthropometricMeasureSheetContent({
  measure,
  onClose,
  onSave,
}: {
  measure: AnthropometricMeasure;
  onClose: () => void;
  onSave: (value: number, unit: string) => void;
}) {
  const { props, error, formReady, invalidInputCount, loading, submit, success } =
    useDynamicFormHelpers();

  const formFields = getAnthropometryFormField(measure.code as AnthroSystemCodes, false);

  return (
    <BottomSheet.Content
      snapPoints={['50%']}
      contentContainerClassName="py-0 px-0 pb-safe-offset-4">
      <View className="flex-row items-center justify-between py-3 border-b border-border px-4">
        <BottomSheet.Title>Modifier la mesure</BottomSheet.Title>
        <BottomSheet.Close />
      </View>

      <View className="flex-1 px-2 py-4">
        <DynamicForm
          {...props}
          sections={[{ name: 'Mesure', fields: formFields, disableName: true }]}
          containerClassName="px-0"
          initialValues={{
            [measure.code]: { value: measure.value, unit: measure.unit },
          }}
          onSubmit={async (formData) => {
            const parsed = v.safeParse(outputSchema, formData);
            if (!parsed.success) throw new Error('Données invalides');
            const entry = Object.values(parsed.output).find((v) => v?.code === measure.code);
            if (!entry) throw new Error('Mesure introuvable');
            onSave(entry.value, entry.unit);
            onClose();
          }}
          outputSchema={outputSchema as never}
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

export function EditAnthropometricMeasureSheet({ isOpen, onClose, measure, onSave }: Props) {
  return (
    <BottomSheet isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay>
          <BlurView />
        </BottomSheet.Overlay>
        <EditAnthropometricMeasureSheetContent
          measure={measure}
          onClose={onClose}
          onSave={onSave}
        />
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
