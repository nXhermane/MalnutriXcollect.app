import { Icon } from '@/components/shared/icons';
import { MonitoringElementCategory } from '@/constants';
import type { LocalTask } from '@/schemas/task.schema';
import { PressableFeedback, Surface } from 'heroui-native';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { getFieldLabel } from '../../shared/utils';
import { AnthroCollectModal } from './collect-modals/AnthroCollectModal';
import { BiologicalCollectModal } from './collect-modals/BiologicalCollectModal';
import { DataFieldCollectModal } from './collect-modals/DataFieldCollectModal';

interface Props {
  task: LocalTask;
  patientId: string;
  fieldCode: string;
  category: MonitoringElementCategory;
  isCollected: boolean;
}

const categoryConfig: Record<MonitoringElementCategory, { colorClass: string; icon: string }> = {
  [MonitoringElementCategory.ANTHROPOMETRIC]: { colorClass: 'text-accent', icon: 'Ruler' },
  [MonitoringElementCategory.BIOCHEMICAL]: { colorClass: 'text-danger', icon: 'FlaskConical' },
  [MonitoringElementCategory.CLINICAL_SIGNS]: { colorClass: 'text-warning', icon: 'Stethoscope' },
  [MonitoringElementCategory.DATA_FIELD]: { colorClass: 'text-muted', icon: 'ClipboardList' },
  [MonitoringElementCategory.FORMULA_FIELD]: { colorClass: 'text-muted', icon: 'ClipboardList' },
  [MonitoringElementCategory.APPETITE_TEST]: { colorClass: 'text-muted', icon: 'Apple' },
};

export function CompletionFieldRow({ task, patientId, fieldCode, category, isCollected }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const conf = categoryConfig[category] ?? { colorClass: 'text-muted', icon: 'Circle' };
  return (
    <>
      <PressableFeedback isDisabled={isCollected} onPress={() => !isCollected && setIsOpen(true)}>
        <Surface
          className={`flex-row items-center gap-2.5 ${isCollected ? 'bg-success/5' : 'bg-surface-tertiary'}`}>
          <View
            className={`h-6 w-6 items-center justify-center rounded-full shrink-0 ${isCollected ? 'bg-success/15' : 'bg-surface-secondary'}`}>
            <Icon
              name={isCollected ? 'Check' : (conf.icon as never)}
              sizeClassName="text-2xs"
              className={isCollected ? 'text-success' : conf.colorClass}
            />
          </View>
          <Text
            className={`flex-1 text-xs font-medium ${isCollected ? 'text-success' : 'text-foreground'}`}>
            {getFieldLabel(fieldCode, category)}
          </Text>
          {!isCollected && (
            <Icon name="ChevronRight" sizeClassName="text-xs" className="text-muted shrink-0" />
          )}
          {isCollected && <Text className="text-2xs text-success font-semibold">Collecté</Text>}
        </Surface>
      </PressableFeedback>

      {category === MonitoringElementCategory.ANTHROPOMETRIC && (
        <AnthroCollectModal
          task={task}
          patientId={patientId}
          fieldCode={fieldCode}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
      {category === MonitoringElementCategory.BIOCHEMICAL && (
        <BiologicalCollectModal
          task={task}
          patientId={patientId}
          fieldCode={fieldCode}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
      {(category === MonitoringElementCategory.DATA_FIELD ||
        category === MonitoringElementCategory.FORMULA_FIELD) && (
        <DataFieldCollectModal
          task={task}
          patientId={patientId}
          fieldCode={fieldCode}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
