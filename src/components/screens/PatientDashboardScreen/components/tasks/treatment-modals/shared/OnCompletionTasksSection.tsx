import { Icon } from '@/components/shared/icons';
import { MonitoringElementCategory } from '@/constants';
import type { LocalTask, SyncTreatmentAction } from '@/schemas/task.schema';
import { Surface } from 'heroui-native';
import { Text, View } from 'react-native';
import { CompletionFieldRow } from './CompletionFieldRow';

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

export function OnCompletionTasksSection({ task, patientId }: Props) {
  const payload = task.payload as SyncTreatmentAction;
  const completionTasks = payload.onCompletionTasks;

  if (completionTasks.length === 0) return null;

  const totalFields = completionTasks.reduce((sum, t) => sum + t.fields.length, 0);
  const collectedCodes = new Set(task.collectedFields.map((f) => f.fieldCode));
  const collectedCount = completionTasks
    .flatMap((t) => t.fields)
    .filter((f) => collectedCodes.has(f)).length;
  const isFullyCollected = collectedCount === totalFields;

  return (
    <Surface variant="secondary" className="gap-3 p-3">
      <View className="flex-row items-center gap-2">
        <View
          className={`h-6 w-6 items-center justify-center rounded-full ${isFullyCollected ? 'bg-success/15' : 'bg-warning/15'}`}>
          <Icon
            name={isFullyCollected ? 'CircleCheck' : 'ListChecks'}
            sizeClassName="text-xs"
            className={isFullyCollected ? 'text-success' : 'text-warning'}
          />
        </View>
        <Text className="text-xs font-bold uppercase tracking-wider text-muted flex-1">
          Données à fournir
        </Text>
        <Text className={`text-xs font-bold ${isFullyCollected ? 'text-success' : 'text-warning'}`}>
          {collectedCount}/{totalFields}
        </Text>
      </View>

      <View className="gap-2">
        {completionTasks.map((completionTask, taskIndex) => {
          const category = completionTask.category as MonitoringElementCategory;
          const conf = categoryConfig[category] ?? {
            icon: 'Circle',
            label: completionTask.category,
            colorClass: 'text-muted',
          };
          return (
            <View key={taskIndex} className="gap-1.5">
              {completionTasks.length > 1 && (
                <View className="flex-row items-center gap-1.5">
                  <Icon
                    name={conf.icon as never}
                    sizeClassName="text-2xs"
                    className={conf.colorClass}
                  />
                  <Text className="text-2xs font-semibold text-muted uppercase tracking-wide">
                    {conf.label}
                  </Text>
                </View>
              )}
              {completionTask.fields.map((fieldCode) => (
                <CompletionFieldRow
                  key={fieldCode}
                  task={task}
                  patientId={patientId}
                  fieldCode={fieldCode}
                  category={category}
                  isCollected={collectedCodes.has(fieldCode)}
                />
              ))}
            </View>
          );
        })}
      </View>
    </Surface>
  );
}
