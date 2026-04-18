import { Icon } from '@/components/shared/icons';
import { MonitoringElementCategory } from '@/constants';
import type { LocalTask, SyncDataCollectionTask } from '@/schemas/task.schema';
import { PressableFeedback } from 'heroui-native';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { getFieldLabel } from '../shared/utils';
import { AnthroRequirementModal } from './AnthroRequirementModal';
import { BiologicalRequirementModal } from './BiologicalRequirementModal';
import { DataFieldRequirementModal } from './DataFieldRequirementModal';

interface Props {
  task: LocalTask;
  patientId: string;
  requirementCode: string;
  freshnessWindowInMinutes: number;
  isCollected: boolean;
}

function formatFreshness(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  return `${h}h`;
}

export function DataRequirementRow({
  task,
  patientId,
  requirementCode,
  freshnessWindowInMinutes,
  isCollected,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const payload = task.payload as SyncDataCollectionTask;
  const category = payload.category as MonitoringElementCategory;

  const label = getFieldLabel(requirementCode, category);

  return (
    <>
      <PressableFeedback
        isDisabled={isCollected}
        onPress={() => !isCollected && setIsOpen(true)}
        className={`flex-row items-center gap-3 bg-surface-tertiary rounded-xl p-3 ${isCollected ? 'opacity-60' : 'active:opacity-80'}`}>
        <View
          className={`h-8 w-8 rounded-lg items-center justify-center shrink-0 ${isCollected ? 'bg-success/15' : 'bg-accent/10'}`}>
          <Icon
            name={isCollected ? 'Check' : 'Circle'}
            sizeClassName="text-sm"
            className={isCollected ? 'text-success' : 'text-accent'}
          />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-semibold text-foreground" numberOfLines={2}>
            {label}
          </Text>
        </View>
        <View className="flex-row items-center gap-1 shrink-0">
          {isCollected ? (
            <Icon name="CircleCheck" sizeClassName="text-sm" className="text-success" />
          ) : (
            <>
              <Icon name="Clock" sizeClassName="text-2xs" className="text-muted" />
              <Text className="text-2xs text-muted">
                {formatFreshness(freshnessWindowInMinutes)}
              </Text>
            </>
          )}
        </View>
      </PressableFeedback>

      {category === MonitoringElementCategory.ANTHROPOMETRIC && (
        <AnthroRequirementModal
          task={task}
          patientId={patientId}
          requirementCode={requirementCode}
          freshnessWindowInMinutes={freshnessWindowInMinutes}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
      {category === MonitoringElementCategory.BIOCHEMICAL && (
        <BiologicalRequirementModal
          task={task}
          patientId={patientId}
          requirementCode={requirementCode}
          freshnessWindowInMinutes={freshnessWindowInMinutes}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
      {(category === MonitoringElementCategory.DATA_FIELD ||
        category === MonitoringElementCategory.FORMULA_FIELD ||
        category === MonitoringElementCategory.CLINICAL_SIGNS) && (
        <DataFieldRequirementModal
          task={task}
          patientId={patientId}
          requirementCode={requirementCode}
          freshnessWindowInMinutes={freshnessWindowInMinutes}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
