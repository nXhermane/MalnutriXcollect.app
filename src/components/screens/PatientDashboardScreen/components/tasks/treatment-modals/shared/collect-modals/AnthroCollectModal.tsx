import { BlurView } from '@/components/shared/BlurView';
import { DynamicForm, useDynamicFormHelpers } from '@/components/shared/forms';
import { Icon } from '@/components/shared/icons';
import { AnthroSystemCodes, MonitoringElementCategory } from '@/constants';
import { useMeasureActions } from '@/hooks/useMeasureActions';
import { useToast } from '@/hooks/useToast';
import { getAnthropometryFormField } from '@/lib/helpers/forms/anthropometry';
import type { LocalTask } from '@/schemas/task.schema';
import { BottomSheet, Button, Spinner } from 'heroui-native';
import { useMemo } from 'react';
import { View } from 'react-native';
import { getFieldLabel } from '../../../shared/utils';
import { collectFieldForTask } from '@/hooks/useTaskActions';

interface Props {
  task: LocalTask;
  patientId: string;
  fieldCode: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AnthroCollectModal({ task, patientId, fieldCode, isOpen, onClose }: Props) {
  const { props, error, loading, submit } = useDynamicFormHelpers();
  const { addAnthropometricMeasure } = useMeasureActions();
  const toast = useToast();

  const sections = useMemo(
    () => [
      {
        name: 'Mesure',
        fields: getAnthropometryFormField(fieldCode as AnthroSystemCodes, false),
        disableName: true,
      },
    ],
    [fieldCode],
  );

  const handleSubmit = (formData: Record<string, unknown>) => {
    const entry = Object.values(formData).find(
      (v) => v && typeof v === 'object' && 'code' in (v as object),
    ) as { code: string; value: number; unit: string } | undefined;

    if (!entry) {
      toast.show('Error', 'Veuillez saisir une mesure');
      return;
    }

    const measure = addAnthropometricMeasure(patientId, {
      code: entry.code as AnthroSystemCodes,
      value: entry.value,
      unit: entry.unit as never,
    });

    collectFieldForTask(task.id, fieldCode, measure.id, entry.value);
    toast.show('Success', 'Mesure enregistrée');
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={(v) => !v && onClose()}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay>
          <BlurView />
        </BottomSheet.Overlay>
        <BottomSheet.Content
          snapPoints={['60%']}
          enableDynamicSizing={false}
          contentContainerClassName="py-0 px-0 pb-safe-offset-4 h-full">
          <View className="flex-row items-center gap-3 px-3 py-3 border-b border-border">
            <BottomSheet.Title className="flex-1 font-semibold text-base text-foreground">
              {getFieldLabel(fieldCode, MonitoringElementCategory.ANTHROPOMETRIC)}
            </BottomSheet.Title>
            <BottomSheet.Close />
          </View>
          <View className="flex-1 px-2 py-3">
            <DynamicForm
              {...props}
              sections={sections}
              containerClassName="px-0"
              onSubmit={handleSubmit as never}
            />
          </View>
          <View className="px-3 pb-3 border-t border-border pt-3">
            <Button
              variant={error ? 'danger' : 'primary'}
              isDisabled={loading}
              className="w-full h-12"
              onPress={submit}>
              {loading ? (
                <Spinner size="sm" color="white" />
              ) : error ? (
                <View className="flex-row items-center gap-2">
                  <Icon name="CircleAlert" className="text-white" sizeClassName="text-base" />
                  <Button.Label className="text-white font-bold">Vérifier</Button.Label>
                </View>
              ) : (
                <Button.Label className="text-white font-bold">Enregistrer</Button.Label>
              )}
            </Button>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
