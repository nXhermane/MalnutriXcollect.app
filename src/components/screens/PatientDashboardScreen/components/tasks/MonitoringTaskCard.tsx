import { Icon } from '@/components/shared/icons';
import { MeasureCategory, MonitoringElementCategory } from '@/constants';
import type { LocalTask, SyncMonitoringTask } from '@/schemas/task.schema';
import { getMeasureLabel } from '@/store/registry/registry.store';
import { Chip, PressableFeedback, Surface } from 'heroui-native';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { AnthroMonitoringTaskModal } from './monitoring-modals/AnthroMonitoringTaskModal';
import { BiochemicalMonitoringTaskModal } from './monitoring-modals/BiochemicalMonitoringTaskModal';
import { DataFieldMonitoringTaskModal } from './monitoring-modals/DataFieldMonitoringTaskModal';

interface Props {
  task: LocalTask;
  patientId: string;
}

const categoryConfig: Record<
  MonitoringElementCategory,
  { icon: string; label: string; colorClass: string }
> = {
  [MonitoringElementCategory.ANTHROPOMETRIC]: {
    icon: 'Ruler',
    label: 'Anthropométrie',
    colorClass: 'text-accent',
  },
  [MonitoringElementCategory.BIOCHEMICAL]: {
    icon: 'FlaskConical',
    label: 'Biochimie',
    colorClass: 'text-danger',
  },
  [MonitoringElementCategory.CLINICAL_SIGNS]: {
    icon: 'Stethoscope',
    label: 'Signes cliniques',
    colorClass: 'text-warning',
  },
  [MonitoringElementCategory.DATA_FIELD]: {
    icon: 'ClipboardList',
    label: 'Champ clinique',
    colorClass: 'text-muted',
  },
  [MonitoringElementCategory.FORMULA_FIELD]: {
    icon: 'ClipboardList',
    label: 'Formule',
    colorClass: 'text-muted',
  },
  [MonitoringElementCategory.APPETITE_TEST]: {
    icon: 'Apple',
    label: "Test d'appétit",
    colorClass: 'text-muted',
  },
};

const statusConfig = {
  pending_execution: { label: 'À faire', color: 'warning' },
  completed: { label: 'Fait', color: 'success' },
  skipped: { label: 'Ignoré', color: 'default' },
  missed: { label: 'Manqué', color: 'danger' },
} as const;

function getMonitoringLabel(payload: SyncMonitoringTask): string {
  for (const cat of [MeasureCategory.FIELD, MeasureCategory.BIOLOGICAL, MeasureCategory.ANTHRO]) {
    const label = getMeasureLabel(payload.monitoringCode, cat);
    if (label !== payload.monitoringCode) return label;
  }
  return payload.monitoringCode;
}

export function MonitoringTaskCard({ task, patientId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const payload = task.payload as SyncMonitoringTask;
  const category = payload.category as MonitoringElementCategory;
  const conf = categoryConfig[category] ?? {
    icon: 'Activity',
    label: payload.category,
    colorClass: 'text-muted',
  };
  const status = statusConfig[task.localStatus];
  const fieldCount = payload.resolvedTemplate.fields.length;

  return (
    <>
      <PressableFeedback onPress={() => setIsOpen(true)}>
        <Surface variant="secondary" className="flex-row items-center gap-3 p-3 rounded-xl">
          <View className="h-9 w-9 rounded-xl bg-accent/10 items-center justify-center shrink-0">
            <Icon name={conf.icon as never} sizeClassName="text-sm" className={conf.colorClass} />
          </View>
          <View className="flex-1 gap-0.5">
            <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
              {getMonitoringLabel(payload)}
            </Text>
            <View className="flex-row items-center gap-1.5">
              <Text className="text-2xs text-muted">{conf.label}</Text>
              <Text className="text-2xs text-muted">·</Text>
              <Text className="text-2xs text-muted">
                {fieldCount} champ{fieldCount > 1 ? 's' : ''}
              </Text>
            </View>
          </View>
          <Chip size="sm" variant="soft" color={status.color as never}>
            <Chip.Label className="text-2xs">{status.label}</Chip.Label>
          </Chip>
        </Surface>
      </PressableFeedback>

      {category === MonitoringElementCategory.ANTHROPOMETRIC && (
        <AnthroMonitoringTaskModal
          task={task}
          patientId={patientId}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
      {category === MonitoringElementCategory.BIOCHEMICAL && (
        <BiochemicalMonitoringTaskModal
          task={task}
          patientId={patientId}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
      {(category === MonitoringElementCategory.DATA_FIELD ||
        category === MonitoringElementCategory.FORMULA_FIELD ||
        category === MonitoringElementCategory.CLINICAL_SIGNS) && (
        <DataFieldMonitoringTaskModal
          task={task}
          patientId={patientId}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
