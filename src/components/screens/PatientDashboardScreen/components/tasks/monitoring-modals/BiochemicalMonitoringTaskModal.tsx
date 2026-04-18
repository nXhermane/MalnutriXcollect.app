import { DynamicForm, useDynamicFormHelpers } from '@/components/shared/forms';
import { MeasureCategory } from '@/constants';
import { useMeasureActions } from '@/hooks/useMeasureActions';
import { useToast } from '@/hooks/useToast';
import { convertBiologyDataFieldsToFormConfig } from '@/lib/helpers/forms/biology';
import type { LocalTask, SyncMonitoringTask } from '@/schemas/task.schema';
import { getBiologicalRef } from '@/services/registry/registry.service';
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

export function BiochemicalMonitoringTaskModal({ task, patientId, isOpen, onClose }: Props) {
  const { props, error, loading, submit } = useDynamicFormHelpers();
  const { addBiologicalMeasure } = useMeasureActions();
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
    const refs = missingFields
      .map((code) => getBiologicalRef(code))
      .filter((r): r is NonNullable<typeof r> => r !== undefined)
      .map((r) => ({ code: r.code, name: r.name, unit: r.unit, availableUnits: r.availableUnits }));
    return convertBiologyDataFieldsToFormConfig(refs);
  }, [missingFields]);

  const title = getMeasureLabel(payload.monitoringCode, MeasureCategory.BIOLOGICAL);

  const handleSubmit = (formData: Record<string, unknown>) => {
    const entries = Object.values(formData).filter(
      (v) => v && typeof v === 'object' && 'code' in (v as object),
    ) as { code: string; value: number; unit: string }[];

    if (!entries.length) throw new Error('Veuillez saisir au moins un marqueur');

    entries.forEach((entry) => {
      const measure = addBiologicalMeasure(patientId, {
        code: entry.code,
        value: entry.value,
        unit: entry.unit,
      });
      collectFieldForTask(task.id, entry.code, measure.id, entry.value);
    });

    toast.show(
      'Success',
      `${entries.length} marqueur${entries.length > 1 ? 's' : ''} enregistré${entries.length > 1 ? 's' : ''}`,
    );
    onClose();
  };

  return (
    <MonitoringTaskModalLayout
      isOpen={isOpen}
      onClose={onClose}
      task={task}
      title={title}
      description="Marqueur biochimique"
      typeIcon="FlaskConical"
      iconColorClass="text-danger"
      iconBgClass="bg-danger/15"
      onComplete={submit}
      completeLoading={loading}
      completeError={!!error}
      emptyState={
        missingFields.length === 0
          ? { isMissing: true, title: 'Tous les marqueurs sont collectés', description: '' }
          : sections.length === 0
            ? {
                isMissing: true,
                title: 'Références biologiques introuvables',
                description: 'Synchronisez avec Pro pour obtenir les références.',
              }
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
