import { Icon } from '@/components/shared/icons';
import type { LocalTask, SyncTreatmentAction } from '@/schemas/task.schema';
import { getTreatmentLabel } from '@/store/registry/registry.store';
import { Chip, PressableFeedback, Surface } from 'heroui-native';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { MedicationTreatmentActionModal } from './treatment-modals/MedicationTreatmentActionModal';
import { NutritionalTreatmentActionModal } from './treatment-modals/NutritionalTreatmentActionModal';
import { SupportiveTreatmentActionModal } from './treatment-modals/SupportiveTreatmentActionModal';

interface Props {
  task: LocalTask;
  patientId: string;
}

const treatmentConfig = {
  medication: {
    icon: 'Pill',
    colorClass: 'text-accent',
    bgClass: 'bg-accent/10',
    label: 'Médicament',
  },
  nutritional: {
    icon: 'Milk',
    colorClass: 'text-success',
    bgClass: 'bg-success/10',
    label: 'Nutritionnel',
  },
  supportive: {
    icon: 'HeartPulse',
    colorClass: 'text-blue-500',
    bgClass: 'bg-blue-500/10',
    label: 'Supportif',
  },
} as const;

const statusConfig = {
  pending_execution: { label: 'À faire', color: 'warning' },
  completed: { label: 'Fait', color: 'success' },
  skipped: { label: 'Ignoré', color: 'default' },
  missed: { label: 'Manqué', color: 'danger' },
} as const;

function getDosageSummary(payload: SyncTreatmentAction): string | null {
  if (payload.treatmentType === 'medication' && payload.resolvedDosage) {
    const d = payload.resolvedDosage.dosage.computedDosage;
    if (d) {
      const dose =
        d.totalDosePerIntake.kind === 'fixed'
          ? `${d.totalDosePerIntake.value} ${d.totalDoseUnit}`
          : `${d.totalDosePerIntake.min}–${d.totalDosePerIntake.max} ${d.totalDoseUnit}`;
      return `${dose} · ${d.globalFrequency.label}`;
    }
    return `${payload.resolvedDosage.dosage.dosage.value} ${payload.resolvedDosage.dosage.dosage.unit}`;
  }
  if (payload.treatmentType === 'nutritional' && payload.resolvedDosage) {
    const d = payload.resolvedDosage.dosage.computedDosage;
    if (d?.practicalPrescription.totalPerDay) {
      return `${d.practicalPrescription.totalPerDay} ${d.practicalPrescription.unit}/jour`;
    }
    return `${payload.resolvedDosage.dosage.dosage.value} ${payload.resolvedDosage.dosage.dosage.unit}`;
  }
  if (payload.treatmentType === 'supportive') {
    const count = payload.indications?.length ?? 0;
    return `${count} instruction${count > 1 ? 's' : ''}`;
  }
  return null;
}

export function TreatmentActionCard({ task, patientId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const payload = task.payload as SyncTreatmentAction;
  const config = treatmentConfig[payload.treatmentType];
  const status = statusConfig[task.localStatus];
  const dosageSummary = getDosageSummary(payload);

  return (
    <>
      <PressableFeedback onPress={() => setIsOpen(true)}>
        <Surface variant="secondary" className="flex-row items-center gap-3 p-3 rounded-xl">
          <View
            className={`h-9 w-9 rounded-xl items-center justify-center shrink-0 ${config.bgClass}`}>
            <Icon
              name={config.icon as never}
              sizeClassName="text-sm"
              className={config.colorClass}
            />
          </View>
          <View className="flex-1 gap-0.5">
            <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
              {getTreatmentLabel(payload.treatmentType, payload.treatmentCode)}
            </Text>
            <View className="flex-row items-center gap-1.5">
              <Text className="text-2xs text-muted">{config.label}</Text>
              {dosageSummary && (
                <>
                  <Text className="text-2xs text-muted">·</Text>
                  <Text className="text-2xs text-muted" numberOfLines={1}>
                    {dosageSummary}
                  </Text>
                </>
              )}
            </View>
          </View>
          <Chip size="sm" variant="soft" color={status.color as never}>
            <Chip.Label className="text-2xs">{status.label}</Chip.Label>
          </Chip>
        </Surface>
      </PressableFeedback>

      {payload.treatmentType === 'medication' && (
        <MedicationTreatmentActionModal
          task={task}
          patientId={patientId}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
      {payload.treatmentType === 'nutritional' && (
        <NutritionalTreatmentActionModal
          task={task}
          patientId={patientId}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
      {payload.treatmentType === 'supportive' && (
        <SupportiveTreatmentActionModal
          task={task}
          patientId={patientId}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
