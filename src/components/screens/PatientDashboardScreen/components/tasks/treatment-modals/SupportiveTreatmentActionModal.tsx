import { Icon } from '@/components/shared/icons';
import { MarkdownText } from '@/components/shared/MarkdownText';
import type { LocalTask, SyncSupportiveTreatmentAction } from '@/schemas/task.schema';
import { Surface } from 'heroui-native';
import { Text, View } from 'react-native';
import { OnCompletionTasksSection } from './shared/OnCompletionTasksSection';
import { TreatmentActionModalLayout } from './shared/TreatmentActionModalLayout';

interface Props {
  task: LocalTask;
  patientId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function SupportiveTreatmentActionModal({ task, patientId, isOpen, onClose }: Props) {
  const payload = task.payload as SyncSupportiveTreatmentAction;
  const indications = payload.indications ?? [];

  const requiredFields = payload.onCompletionTasks.flatMap((t) => t.fields);
  const collectedCodes = new Set(task.collectedFields.map((f) => f.fieldCode));
  const isFullyCollected =
    requiredFields.length === 0 || requiredFields.every((f) => collectedCodes.has(f));

  return (
    <TreatmentActionModalLayout
      isOpen={isOpen}
      onClose={onClose}
      task={task}
      title="Traitement supportif"
      description="Intervention de support"
      typeIcon="HeartPulse"
      iconColorClass="text-blue-500"
      iconBgClass="bg-blue-500/15"
      isFullyCollected={isFullyCollected}
      emptyState={
        indications.length === 0
          ? {
              isMissing: true,
              title: 'Aucune indication',
              description: "Il n'y a pas d'indications enregistrées pour ce traitement.",
            }
          : undefined
      }
      completionTasksSection={
        payload.onCompletionTasks.length > 0 ? (
          <OnCompletionTasksSection task={task} patientId={patientId} />
        ) : undefined
      }>
      {indications.length > 0 && (
        <Surface variant="secondary" className="p-3 gap-3">
          <View className="flex-row items-center gap-2">
            <View className="h-6 w-6 items-center justify-center rounded-full bg-blue-500/15">
              <Icon name="HeartPulse" sizeClassName="text-xs" className="text-blue-500" />
            </View>
            <Text className="text-xs font-bold uppercase tracking-wider text-muted">
              Instructions
            </Text>
          </View>
          <MarkdownText markdown={indications.join('\n\n---\n\n')} />
        </Surface>
      )}
    </TreatmentActionModalLayout>
  );
}
