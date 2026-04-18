import { Icon } from '@/components/shared/icons';
import { MonitoringElementCategory } from '@/constants';
import type { LocalTask, SyncDataCollectionTask } from '@/schemas/task.schema';
import { Chip, PressableFeedback, Surface } from 'heroui-native';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { DataCollectionTaskModal } from './DataCollectionTaskModal';

interface Props {
  task: LocalTask;
  patientId: string;
}

const categoryConfig: Record<MonitoringElementCategory, { icon: string; label: string }> = {
  [MonitoringElementCategory.ANTHROPOMETRIC]: { icon: 'Ruler', label: 'Données anthropométriques' },
  [MonitoringElementCategory.BIOCHEMICAL]: { icon: 'FlaskConical', label: 'Analyses biologiques' },
  [MonitoringElementCategory.CLINICAL_SIGNS]: { icon: 'Stethoscope', label: 'Signes cliniques' },
  [MonitoringElementCategory.DATA_FIELD]: { icon: 'ClipboardList', label: 'Champ de données' },
  [MonitoringElementCategory.FORMULA_FIELD]: { icon: 'ClipboardList', label: 'Formule' },
  [MonitoringElementCategory.APPETITE_TEST]: { icon: 'Apple', label: "Test d'appétit" },
};

const statusConfig = {
  pending_execution: { label: 'À faire', color: 'warning' },
  completed: { label: 'Fait', color: 'success' },
  skipped: { label: 'Ignoré', color: 'default' },
  missed: { label: 'Manqué', color: 'danger' },
} as const;

export function DataCollectionTaskCard({ task, patientId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const payload = task.payload as SyncDataCollectionTask;
  const conf = categoryConfig[payload.category] ?? {
    icon: 'Database',
    label: payload.category,
  };
  const status = statusConfig[task.localStatus];
  const count = payload.requirements.length;
  const collectedCount = task.collectedFields.length;

  return (
    <>
      <PressableFeedback onPress={() => setIsOpen(true)}>
        <Surface variant="secondary" className="flex-row items-center gap-3 p-3 rounded-xl">
          <View className="h-9 w-9 rounded-xl bg-accent/10 items-center justify-center shrink-0">
            <Icon name={conf.icon as never} sizeClassName="text-sm" className="text-accent" />
          </View>
          <View className="flex-1 gap-0.5">
            <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
              {conf.label}
            </Text>
            <View className="flex-row items-center gap-1.5">
              <Icon name="Database" sizeClassName="text-2xs" className="text-muted" />
              <Text className="text-2xs text-muted">
                {collectedCount}/{count} mesure{count > 1 ? 's' : ''}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <Chip size="sm" variant="soft" color={status.color as never}>
              <Chip.Label className="text-2xs">{status.label}</Chip.Label>
            </Chip>
            <Icon name="ChevronRight" sizeClassName="text-xs" className="text-muted" />
          </View>
        </Surface>
      </PressableFeedback>

      <DataCollectionTaskModal
        task={task}
        patientId={patientId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
