import { DynamicForm, useDynamicFormHelpers } from '@/components/shared/forms';
import { MeasureCategory } from '@/constants';
import { checkFreshMeasure, useMeasureActions } from '@/hooks/useMeasureActions';
import { useToast } from '@/hooks/useToast';
import { convertClinicalDataFieldsToFormConfigWithSchema } from '@/lib/helpers/forms/data-fields';
import type { LocalTask } from '@/schemas/task.schema';
import { getDataFieldRef } from '@/services/registry/registry.service';
import { getMeasureLabel } from '@/store/registry/registry.store';
import { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { DataRequirementModalLayout } from './DataRequirementModalLayout';
import { collectFieldForTask } from '@/hooks/useTaskActions';

interface Props {
  task: LocalTask;
  patientId: string;
  requirementCode: string;
  freshnessWindowInMinutes: number;
  isOpen: boolean;
  onClose: () => void;
}

export function DataFieldRequirementModal({
  task,
  patientId,
  requirementCode,
  freshnessWindowInMinutes,
  isOpen,
  onClose,
}: Props) {
  const { props, error, loading, submit } = useDynamicFormHelpers();
  const { addClinicalFieldMeasure } = useMeasureActions();
  const toast = useToast();

  const [isCheckingFreshness, setIsCheckingFreshness] = useState(false);
  const [freshData, setFreshData] = useState<{ id: string; value: unknown; unit?: string } | null>(
    null,
  );
  const [forceManual, setForceManual] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setForceManual(false);
    setIsCheckingFreshness(true);
    const result = checkFreshMeasure(
      patientId,
      requirementCode,
      MeasureCategory.FIELD,
      freshnessWindowInMinutes,
    );
    setFreshData(result);
    setIsCheckingFreshness(false);
  }, [isOpen, patientId, requirementCode, freshnessWindowInMinutes]);

  const sections = useMemo(() => {
    const ref = getDataFieldRef(requirementCode);
    if (!ref) return [];
    return convertClinicalDataFieldsToFormConfigWithSchema(
      [
        {
          code: ref.code,
          label: ref.label,
          question: ref.question,
          category: ref.category,
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
  }, [requirementCode]);

  const title = getMeasureLabel(requirementCode, MeasureCategory.FIELD);

  const handleAcceptFreshData = () => {
    if (!freshData) return;
    collectFieldForTask(task.id, requirementCode, freshData.id, freshData.value);
    toast.show('Success', 'Donnée fraîche utilisée');
    onClose();
  };

  const handleSubmit = (formData: Record<string, unknown>) => {
    const entry = Object.values(formData).find(
      (v) => v && typeof v === 'object' && 'code' in (v as object),
    ) as { code: string; value: unknown } | undefined;
    if (!entry) throw new Error('Veuillez remplir le champ');

    const measure = addClinicalFieldMeasure(patientId, {
      code: entry.code,
      value: entry.value as never,
    });
    collectFieldForTask(task.id, requirementCode, measure.id, entry.value);
    toast.show('Success', 'Champ enregistré');
    onClose();
  };

  const freshValueDisplay = (() => {
    if (!freshData) return '';
    const v = freshData.value;
    if (typeof v === 'boolean') return v ? 'Oui' : 'Non';
    if (typeof v === 'object' && v !== null && 'value' in v)
      return `${(v as { value: number; unit: string }).value} ${(v as { value: number; unit: string }).unit}`;
    return String(v);
  })();

  return (
    <DataRequirementModalLayout
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description="Champ clinique"
      typeIcon="ClipboardList"
      iconColorClass="text-warning"
      iconBgClass="bg-warning/15"
      freshnessWindowInMinutes={freshnessWindowInMinutes}
      isCheckingFreshness={isCheckingFreshness}
      freshDataFound={!!freshData && !forceManual}
      renderFreshDataSummary={() => (
        <View className="bg-surface-secondary p-3 rounded-lg border border-border">
          <Text className="text-sm font-medium text-foreground">{title}</Text>
          <Text className="text-lg font-bold text-foreground mt-1">{freshValueDisplay}</Text>
        </View>
      )}
      onAcceptFreshData={handleAcceptFreshData}
      onRejectFreshData={() => setForceManual(true)}
      onComplete={submit}
      completeLoading={loading}
      completeError={!!error}
      emptyState={
        sections.length === 0
          ? {
              isMissing: true,
              title: 'Référence introuvable',
              description: 'Synchronisez avec Pro.',
            }
          : undefined
      }>
      <DynamicForm
        {...props}
        sections={sections}
        containerClassName="px-0"
        onSubmit={handleSubmit}
      />
    </DataRequirementModalLayout>
  );
}
