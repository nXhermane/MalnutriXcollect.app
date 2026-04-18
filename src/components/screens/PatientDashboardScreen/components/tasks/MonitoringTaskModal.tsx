import { BlurView } from '@/components/shared/BlurView';
import { Icon } from '@/components/shared/icons';
import { MonitoringElementCategory } from '@/constants';
import type { LocalTask, SyncMonitoringTask } from '@/schemas/task.schema';
import { BottomSheet, Chip, Surface } from 'heroui-native';
import { ScrollView, Text, View } from 'react-native';
import { getFieldLabel } from './shared/utils';

export interface Props {
  task: LocalTask;
  isOpen: boolean;
  onClose: () => void;
}

export const categoryConfig: Record<
  MonitoringElementCategory,
  { icon: string; label: string; colorClass: string; bgClass: string }
> = {
  [MonitoringElementCategory.ANTHROPOMETRIC]: {
    icon: 'Ruler',
    label: 'Anthropométrie',
    colorClass: 'text-accent',
    bgClass: 'bg-accent/15',
  },
  [MonitoringElementCategory.BIOCHEMICAL]: {
    icon: 'FlaskConical',
    label: 'Biochimie',
    colorClass: 'text-danger',
    bgClass: 'bg-danger/15',
  },
  [MonitoringElementCategory.CLINICAL_SIGNS]: {
    icon: 'Stethoscope',
    label: 'Signes cliniques',
    colorClass: 'text-warning',
    bgClass: 'bg-warning/15',
  },
  [MonitoringElementCategory.DATA_FIELD]: {
    icon: 'ClipboardList',
    label: 'Champ clinique',
    colorClass: 'text-muted',
    bgClass: 'bg-muted/15',
  },
  [MonitoringElementCategory.FORMULA_FIELD]: {
    icon: 'ClipboardList',
    label: 'Formule',
    colorClass: 'text-muted',
    bgClass: 'bg-muted/15',
  },
  [MonitoringElementCategory.APPETITE_TEST]: {
    icon: 'Apple',
    label: "Test d'appétit",
    colorClass: 'text-muted',
    bgClass: 'bg-muted/15',
  },
};

const statusConfig = {
  pending_execution: { label: 'À faire', color: 'warning' },
  completed: { label: 'Fait', color: 'success' },
  skipped: { label: 'Ignoré', color: 'default' },
  missed: { label: 'Manqué', color: 'danger' },
} as const;

export function MonitoringTaskModal({ task, isOpen, onClose }: Props) {
  const payload = task.payload as SyncMonitoringTask;
  const conf = categoryConfig[payload.category as MonitoringElementCategory] ?? {
    icon: 'Activity',
    label: payload.category,
    colorClass: 'text-muted',
    bgClass: 'bg-muted/15',
  };
  const status = statusConfig[task.localStatus];
  const collectedCodes = new Set(task.collectedFields.map((f) => f.fieldCode));

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={(v) => !v && onClose()}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay>
          <BlurView />
        </BottomSheet.Overlay>
        <BottomSheet.Content
          snapPoints={['70%']}
          enableDynamicSizing={false}
          contentContainerClassName="py-0 px-0 pb-safe-offset-2 h-full">
          <View className="flex-row items-center gap-3 px-3 py-3 border-b border-border">
            <View
              className={`h-10 w-10 items-center justify-center rounded-xl shrink-0 ${conf.bgClass}`}>
              <Icon name={conf.icon as never} sizeClassName="text-sm" className={conf.colorClass} />
            </View>
            <View className="flex-1 gap-0.5">
              <BottomSheet.Title
                className="text-base font-semibold text-foreground"
                numberOfLines={1}>
                {getFieldLabel(payload.monitoringCode, payload.category)}
              </BottomSheet.Title>
              <BottomSheet.Description className="text-xs text-muted">
                {conf.label}
              </BottomSheet.Description>
            </View>
            <BottomSheet.Close />
          </View>

          <ScrollView
            className="flex-1"
            contentContainerClassName="px-3 py-3 gap-3 pb-safe-offset-4"
            showsVerticalScrollIndicator={false}>
            <Surface variant="secondary" className="p-3 gap-3">
              <View className="flex-row items-center gap-2 pb-2 border-b border-border">
                <Icon name="Info" sizeClassName="text-sm" className="text-accent" />
                <Text className="text-sm font-semibold text-foreground">Informations</Text>
              </View>
              <View className="flex-row justify-between items-center bg-surface-tertiary p-2 rounded-lg">
                <Text className="text-xs text-muted">Statut</Text>
                <Chip size="sm" variant="soft" color={status.color as never}>
                  <Chip.Label className="text-2xs">{status.label}</Chip.Label>
                </Chip>
              </View>
              <View className="flex-row justify-between items-center bg-surface-tertiary p-2 rounded-lg">
                <Text className="text-xs text-muted">Champs requis</Text>
                <Text className="text-xs font-bold text-foreground">
                  {payload.resolvedTemplate.fields.length}
                </Text>
              </View>
              {task.completedAt && (
                <View className="flex-row justify-between items-center bg-surface-tertiary p-2 rounded-lg">
                  <Text className="text-xs text-muted">Complété à</Text>
                  <Text className="text-xs font-bold text-foreground">
                    {new Date(task.completedAt).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              )}
            </Surface>

            {payload.resolvedTemplate.fields.length > 0 && (
              <Surface variant="secondary" className="p-3 gap-3">
                <View className="flex-row items-center gap-2 pb-2 border-b border-border">
                  <Icon name="ListChecks" sizeClassName="text-sm" className="text-accent" />
                  <Text className="text-sm font-semibold text-foreground">
                    Champs à collecter ({payload.resolvedTemplate.fields.length})
                  </Text>
                </View>
                <View className="gap-2">
                  {payload.resolvedTemplate.fields.map((field) => {
                    const isCollected = collectedCodes.has(field);
                    return (
                      <View
                        key={field}
                        className="flex-row items-center gap-3 rounded-lg bg-surface-tertiary px-3 py-2.5">
                        <View
                          className={`h-6 w-6 rounded-full items-center justify-center ${isCollected ? 'bg-success/15' : 'bg-muted/10'}`}>
                          <Icon
                            name={isCollected ? 'Check' : 'Circle'}
                            sizeClassName="text-xs"
                            className={isCollected ? 'text-success' : 'text-muted'}
                          />
                        </View>
                        <Text className="flex-1 text-sm text-foreground">
                          {getFieldLabel(field, payload.category)}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </Surface>
            )}
          </ScrollView>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
