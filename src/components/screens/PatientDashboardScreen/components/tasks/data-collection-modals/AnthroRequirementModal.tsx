import { DynamicForm, useDynamicFormHelpers } from '@/components/shared/forms';
import { AnthroSystemCodes, MeasureCategory } from '@/constants';
import { checkFreshMeasure, useMeasureActions } from '@/hooks/useMeasureActions';
import { useToast } from '@/hooks/useToast';
import { getAnthropometryFormField } from '@/lib/helpers/forms/anthropometry';
import type { LocalTask } from '@/schemas/task.schema';
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

export function AnthroRequirementModal({
  task,
  patientId,
  requirementCode,
  freshnessWindowInMinutes,
  isOpen,
  onClose,
}: Props) {
  const { props, error, loading, submit } = useDynamicFormHelpers();
  const { addAnthropometricMeasure } = useMeasureActions();
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
      MeasureCategory.ANTHRO,
      freshnessWindowInMinutes,
    );
    setFreshData(result);
    setIsCheckingFreshness(false);
  }, [isOpen, patientId, requirementCode, freshnessWindowInMinutes]);

  const sections = useMemo(
    () => [
      {
        name: 'Mesure',
        fields: getAnthropometryFormField(requirementCode as AnthroSystemCodes, false),
        disableName: true,
      },
    ],
    [requirementCode],
  );

  const title = getMeasureLabel(requirementCode, MeasureCategory.ANTHRO);

  const handleAcceptFreshData = () => {
    if (!freshData) return;
    collectFieldForTask(task.id, requirementCode, freshData.id, freshData.value);
    toast.show('Success', 'Donnée fraîche utilisée');
    onClose();
  };

  const handleSubmit = (formData: Record<string, unknown>) => {
    const entry = Object.values(formData).find(
      (v) => v && typeof v === 'object' && 'code' in (v as object),
    ) as { code: string; value: number; unit: string } | undefined;
    if (!entry) throw new Error('Veuillez saisir une mesure');

    const measure = addAnthropometricMeasure(patientId, {
      code: entry.code as AnthroSystemCodes,
      value: entry.value,
      unit: entry.unit as never,
    });

    collectFieldForTask(task.id, requirementCode, measure.id, entry.value);
    toast.show('Success', 'Mesure enregistrée');
    onClose();
  };

  return (
    <DataRequirementModalLayout
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description="Mesure anthropométrique"
      typeIcon="Ruler"
      iconColorClass="text-accent"
      iconBgClass="bg-accent/15"
      freshnessWindowInMinutes={freshnessWindowInMinutes}
      isCheckingFreshness={isCheckingFreshness}
      freshDataFound={!!freshData && !forceManual}
      renderFreshDataSummary={() => (
        <View className="bg-surface-secondary p-3 rounded-lg border border-border">
          <Text className="text-sm font-medium text-foreground">{title}</Text>
          <View className="flex-row items-baseline gap-1 mt-1">
            <Text className="text-lg font-bold text-foreground">
              {String(freshData?.value ?? '')}
            </Text>
            {freshData?.unit && <Text className="text-sm text-muted">{freshData.unit}</Text>}
          </View>
        </View>
      )}
      onAcceptFreshData={handleAcceptFreshData}
      onRejectFreshData={() => setForceManual(true)}
      onComplete={submit}
      completeLoading={loading}
      completeError={!!error}
      emptyState={
        sections[0]?.fields.length === 0
          ? { isMissing: true, title: 'Champ non supporté', description: '' }
          : undefined
      }>
      <DynamicForm
        {...props}
        sections={sections}
        containerClassName="px-0"
        onSubmit={handleSubmit as never}
      />
    </DataRequirementModalLayout>
  );
}
