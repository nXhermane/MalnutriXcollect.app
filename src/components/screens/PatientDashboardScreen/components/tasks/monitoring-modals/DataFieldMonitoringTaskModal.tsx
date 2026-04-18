import { DynamicForm, useDynamicFormHelpers } from '@/components/shared/forms';
import { MeasureCategory } from '@/constants';
import { useMeasureActions } from '@/hooks/useMeasureActions';
import { useToast } from '@/hooks/useToast';
import { convertClinicalDataFieldsToFormConfigWithSchema } from '@/lib/helpers/forms/data-fields';
import type { LocalTask, SyncMonitoringTask } from '@/schemas/task.schema';
import { getDataFieldRef } from '@/services/registry/registry.service';
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

export function DataFieldMonitoringTaskModal({ task, patientId, isOpen, onClose }: Props) {
  const { props, error, loading, submit } = useDynamicFormHelpers();
  const { addClinicalFieldMeasure } = useMeasureActions();
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
      .map((code) => getDataFieldRef(code))
      .filter((r): r is NonNullable<typeof r> => r !== undefined)
      .map((r) => ({
        code: r.code,
        label: r.label,
        question: r.question,
        category: r.category as never,
        type: r.type as never,
        range: r.range ?? undefined,
        enum: r.enum ?? undefined,
        units: r.units ?? undefined,
        defaultValue: r.defaultValue,
        condition: r.condition
          ? {
              field: r.condition.field,
              fieldType: r.condition.fieldType as never,
              operator: r.condition.operator as never,
              value: r.condition.value,
            }
          : undefined,
        context: 'clinical' as never,
      }));
    return convertClinicalDataFieldsToFormConfigWithSchema(refs, false);
  }, [missingFields]);

  const title = getMeasureLabel(payload.monitoringCode, MeasureCategory.FIELD);

  const handleSubmit = (formData: Record<string, unknown>) => {
    const entries = Object.values(formData).filter(
      (v) => v && typeof v === 'object' && 'code' in (v as object),
    ) as { code: string; value: unknown }[];

    if (!entries.length) throw new Error('Veuillez remplir au moins un champ');

    entries.forEach((entry) => {
      const measure = addClinicalFieldMeasure(patientId, {
        code: entry.code,
        value: entry.value as never,
      });
      collectFieldForTask(task.id, entry.code, measure.id, entry.value);
    });

    toast.show(
      'Success',
      `${entries.length} champ${entries.length > 1 ? 's' : ''} enregistré${entries.length > 1 ? 's' : ''}`,
    );
    onClose();
  };

  return (
    <MonitoringTaskModalLayout
      isOpen={isOpen}
      onClose={onClose}
      task={task}
      title={title}
      description="Champ de données"
      typeIcon="ClipboardList"
      iconColorClass="text-muted"
      iconBgClass="bg-muted/15"
      onComplete={submit}
      completeLoading={loading}
      completeError={!!error}
      emptyState={
        missingFields.length === 0
          ? { isMissing: true, title: 'Tous les champs sont collectés', description: '' }
          : sections.length === 0
            ? {
                isMissing: true,
                title: 'Références introuvables',
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
