import { BlurView } from '@/components/shared/BlurView';
import { DynamicForm, useDynamicFormHelpers } from '@/components/shared/forms';
import { Icon } from '@/components/shared/icons';
import { MonitoringElementCategory } from '@/constants';
import { useMeasureActions } from '@/hooks/useMeasureActions';
import { collectFieldForTask } from '@/hooks/useTaskActions';
import { useToast } from '@/hooks/useToast';
import { convertClinicalDataFieldsToFormConfigWithSchema } from '@/lib/helpers/forms/data-fields';
import type { LocalTask } from '@/schemas/task.schema';
import { getDataFieldRef } from '@/services/registry/registry.service';
import { BottomSheet, Button, Spinner } from 'heroui-native';
import { useMemo } from 'react';
import { View } from 'react-native';
import { getFieldLabel } from '../../../shared/utils';

interface Props {
  task: LocalTask;
  patientId: string;
  fieldCode: string;
  isOpen: boolean;
  onClose: () => void;
}

function DataFieldCollectModalContent({
  task,
  patientId,
  fieldCode,
  onClose,
}: {
  task: LocalTask;
  patientId: string;
  fieldCode: string;
  onClose: () => void;
}) {
  const { props, error, loading, submit } = useDynamicFormHelpers();
  const { addClinicalFieldMeasure } = useMeasureActions();
  const toast = useToast();

  const sections = useMemo(() => {
    const ref = getDataFieldRef(fieldCode);
    if (!ref) return [];
    return convertClinicalDataFieldsToFormConfigWithSchema(
      [
        {
          code: ref.code,
          label: ref.label,
          question: ref.question,
          category: ref.category as never,
          type: ref.type as never,
          range: ref.range ?? undefined,
          enum: ref.enum ?? undefined,
          units: ref.units ?? undefined,
          defaultValue: ref.defaultValue,
          condition: ref.condition
            ? {
                field: ref.condition.field,
                fieldType: ref.condition.fieldType as never,
                operator: ref.condition.operator as never,
                value: ref.condition.value,
              }
            : undefined,
          context: 'clinical' as never,
        },
      ],
      false,
    );
  }, [fieldCode]);

  const handleSubmit = (formData: Record<string, unknown>) => {
    const entry = Object.values(formData).find(
      (v) => v && typeof v === 'object' && 'code' in (v as object),
    ) as { code: string; value: unknown } | undefined;

    if (!entry) {
      toast.show('Error', 'Veuillez remplir le champ');
      return;
    }

    const measure = addClinicalFieldMeasure(patientId, {
      code: entry.code,
      value: entry.value as never,
    });
    collectFieldForTask(task.id, fieldCode, measure.id, entry.value);
    toast.show('Success', 'Champ enregistré');
    onClose();
  };

  return (
    <BottomSheet.Content
      snapPoints={['60%']}
      enableDynamicSizing={false}
      contentContainerClassName="py-0 px-0 pb-safe-offset-4 h-full">
      <View className="flex-row items-center gap-3 px-3 py-3 border-b border-border">
        <BottomSheet.Title className="flex-1 font-semibold text-base text-foreground">
          {getFieldLabel(fieldCode, MonitoringElementCategory.DATA_FIELD)}
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
  );
}

export function DataFieldCollectModal({ task, patientId, fieldCode, isOpen, onClose }: Props) {
  return (
    <BottomSheet isOpen={isOpen} onOpenChange={(v) => !v && onClose()}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay>
          <BlurView />
        </BottomSheet.Overlay>
        <DataFieldCollectModalContent
          task={task}
          patientId={patientId}
          fieldCode={fieldCode}
          onClose={onClose}
        />
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
