import { DynamicForm, useDynamicFormHelpers } from '@/components/shared/forms';
import { AnthroSystemCodes, MeasureCategory } from '@/constants';
import { useMeasureActions } from '@/hooks/useMeasureActions';
import { useToast } from '@/hooks/useToast';
import { getAnthropometryFormField } from '@/lib/helpers/forms/anthropometry';
import type { LocalTask, SyncMonitoringTask } from '@/schemas/task.schema';
import { getMeasureLabel } from '@/store/registry/registry.store';
import { useMemo } from 'react';
import { MonitoringTaskModalLayout } from './MonitoringTaskModalLayout';
import { collectFieldForTask } from '@/hooks/useTaskActions';

interface Props {
  task: LocalTask;
  patientId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AnthroMonitoringTaskModal({ task, patientId, isOpen, onClose }: Props) {
  const { props, error, loading, submit } = useDynamicFormHelpers();
  const { addAnthropometricMeasure } = useMeasureActions();
  const toast = useToast();
  const payload = task.payload as SyncMonitoringTask;

  const collectedCodes = useMemo(
    () => new Set(task.collectedFields.map((f) => f.fieldCode)),
    [task.collectedFields],
  );
  const missingFields = useMemo(
    () => payload.resolvedTemplate.fields.filter((f) => !collectedCodes.has(f)),
    [payload.resolvedTemplate.fields, collectedCodes],
  );

  const sections = useMemo(() => {
    const fields = missingFields.flatMap((f) =>
      getAnthropometryFormField(f as AnthroSystemCodes, false),
    );
    return [{ name: 'Mesures', fields, disableName: true }];
  }, [missingFields]);

  const title = getMeasureLabel(payload.monitoringCode, MeasureCategory.ANTHRO);

  const handleSubmit = (formData: Record<string, unknown>) => {
    const entries = Object.values(formData).filter(
      (v) => v && typeof v === 'object' && 'code' in (v as object),
    ) as { code: string; value: number; unit: string }[];

    if (!entries.length) throw new Error('Veuillez saisir au moins une mesure');

    entries.forEach((entry) => {
      const measure = addAnthropometricMeasure(patientId, {
        code: entry.code as AnthroSystemCodes,
        value: entry.value,
        unit: entry.unit as never,
      });
      collectFieldForTask(task.id, entry.code, measure.id, entry.value);
    });

    toast.show(
      'Success',
      `${entries.length} mesure${entries.length > 1 ? 's' : ''} enregistrée${entries.length > 1 ? 's' : ''}`,
    );
    onClose();
  };

  return (
    <MonitoringTaskModalLayout
      isOpen={isOpen}
      onClose={onClose}
      task={task}
      title={title}
      description="Mesure anthropométrique"
      typeIcon="Ruler"
      iconColorClass="text-accent"
      iconBgClass="bg-accent/15"
      onComplete={submit}
      completeLoading={loading}
      completeError={!!error}
      emptyState={
        missingFields.length === 0
          ? { isMissing: true, title: 'Toutes les mesures sont collectées', description: '' }
          : undefined
      }>
      <DynamicForm
        {...props}
        sections={sections}
        containerClassName="px-0"
        onSubmit={handleSubmit as never}
      />
    </MonitoringTaskModalLayout>
  );
}
