import { BlurView } from '@/components/shared/BlurView';
import { EmptyState } from '@/components/shared/EmptyState';
import { Icon } from '@/components/shared/icons';
import { evaluateMissedTask, useTaskActions } from '@/hooks/useTaskActions';
import { useToast } from '@/hooks/useToast';
import type { LocalTask, SyncMonitoringTask } from '@/schemas/task.schema';
import { BottomSheet, Button, Chip, Spinner } from 'heroui-native';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  task: LocalTask;
  title: string;
  description: string;
  typeIcon: string;
  iconColorClass: string;
  iconBgClass: string;
  children: React.ReactNode;
  onComplete?: () => void;
  completeLoading?: boolean;
  completeError?: boolean;
  emptyState?: { isMissing: boolean; title: string; description: string };
}

const statusConfig = {
  pending_execution: { label: 'À faire', color: 'warning' },
  completed: { label: 'Fait', color: 'success' },
  skipped: { label: 'Ignoré', color: 'default' },
  missed: { label: 'Manqué', color: 'danger' },
} as const;

function formatDateRange(from: string, to: string): string {
  const fmt = (d: Date) => d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return `${fmt(new Date(from))} – ${fmt(new Date(to))}`;
}

function MonitoringTaskModalLayoutContent({
  task,
  title,
  description,
  typeIcon,
  iconColorClass,
  iconBgClass,
  children,
  onComplete,
  completeLoading = false,
  completeError = false,
  emptyState,
  onClose,
}: {
  task: LocalTask;
  title: string;
  description: string;
  typeIcon: string;
  iconColorClass: string;
  iconBgClass: string;
  children: React.ReactNode;
  onComplete?: () => void;
  completeLoading?: boolean;
  completeError?: boolean;
  emptyState?: { isMissing: boolean; title: string; description: string };
  onClose: () => void;
}) {
  const payload = task.payload as SyncMonitoringTask;
  const status = statusConfig[task.localStatus];
  const { completeTask } = useTaskActions();
  const toast = useToast();
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    evaluateMissedTask(task.id);
  }, [task.id]);

  const now = new Date();
  const validFrom = new Date(payload.validFrom);
  const expiresAt = new Date(payload.expiresAt);
  const isInWindow = now >= validFrom && now <= expiresAt;
  const isBeforeWindow = now < validFrom;
  const isTerminal = task.localStatus === 'completed' || task.localStatus === 'skipped';

  const windowColor = isInWindow ? 'success' : isBeforeWindow ? 'accent' : 'default';
  const windowLabel = isInWindow ? 'En cours' : isBeforeWindow ? 'À venir' : 'Terminée';
  const windowIcon = isInWindow ? 'Circle' : isBeforeWindow ? 'Clock' : 'CircleCheck';

  const showCompleteBtn = !isTerminal && !isBeforeWindow;

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
      return;
    }
    setCompleting(true);
    completeTask(task.id);
    toast.show('Success', 'Surveillance complétée');
    setCompleting(false);
    onClose();
  };

  const collectedCount = task.collectedFields.length;
  const totalCount = payload.resolvedTemplate.fields.length;

  return (
    <BottomSheet.Content
      snapPoints={['85%']}
      enableDynamicSizing={false}
      enableOverDrag={false}
      contentContainerClassName="py-0 px-0 pb-safe-offset-4 h-full">
      <View className="flex-row items-center gap-3 px-3 py-3 border-b border-border">
        <View
          className={`h-10 w-10 items-center justify-center rounded-full shrink-0 ${iconBgClass}`}>
          <Icon name={typeIcon as never} sizeClassName="text-sm" className={iconColorClass} />
        </View>
        <View className="flex-1 gap-1">
          <BottomSheet.Title className="font-semibold text-base text-foreground" numberOfLines={1}>
            {title}
          </BottomSheet.Title>
          <View className="flex-row items-center gap-2 flex-wrap">
            <BottomSheet.Description className="text-muted text-xs font-normal">
              {description}
            </BottomSheet.Description>
            <Chip size="sm" variant="soft" color={status.color as never}>
              <Chip.Label>{status.label}</Chip.Label>
            </Chip>
          </View>
        </View>
        <BottomSheet.Close />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-4 gap-3 px-3 pt-3">
        <View className="flex-row items-center gap-3 rounded-xl px-3 py-2.5 border border-border bg-surface-secondary">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-surface-tertiary">
            <Icon name={windowIcon as never} sizeClassName="text-xs" className="text-muted" />
          </View>
          <View className="flex-1 gap-0.5">
            <Text className="text-xs text-muted">Fenêtre de réalisation</Text>
            <Text className="text-xs font-medium text-foreground">
              {formatDateRange(payload.validFrom, payload.expiresAt)}
            </Text>
          </View>
          <Chip size="sm" variant="soft" color={windowColor as never}>
            <Chip.Label>{windowLabel}</Chip.Label>
          </Chip>
        </View>

        {totalCount > 0 && (
          <View className="rounded-xl bg-accent/5 border border-accent/20 p-3 gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-muted">Progression</Text>
              <Text className="text-xs font-bold text-accent">
                {collectedCount}/{totalCount}
              </Text>
            </View>
            <View className="h-2 rounded-full bg-accent/15 overflow-hidden">
              <View
                className="h-full rounded-full bg-accent"
                style={{
                  width: `${totalCount > 0 ? (collectedCount / totalCount) * 100 : 0}%`,
                }}
              />
            </View>
          </View>
        )}

        {emptyState?.isMissing ? (
          <EmptyState
            iconName="Circle"
            title={emptyState.title}
            description={emptyState.description}
          />
        ) : (
          children
        )}
      </ScrollView>

      {showCompleteBtn && (
        <View className="w-full px-3 pt-3 border-t border-border">
          <Button
            variant={completeError ? 'danger' : 'primary'}
            isDisabled={completeLoading || completing}
            className="w-full h-12"
            onPress={handleComplete}>
            {completeLoading || completing ? (
              <Spinner className="text-white" />
            ) : completeError ? (
              <Icon name="CircleAlert" className="text-white" sizeClassName="text-base" />
            ) : (
              <Button.Label className="font-normal text-sm">Compléter</Button.Label>
            )}
          </Button>
        </View>
      )}
    </BottomSheet.Content>
  );
}

export function MonitoringTaskModalLayout({
  isOpen,
  onClose,
  task,
  title,
  description,
  typeIcon,
  iconColorClass,
  iconBgClass,
  children,
  onComplete,
  completeLoading = false,
  completeError = false,
  emptyState,
}: Props) {
  return (
    <BottomSheet isOpen={isOpen} onOpenChange={(v) => !v && onClose()}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay>
          <BlurView />
        </BottomSheet.Overlay>
        <MonitoringTaskModalLayoutContent
          task={task}
          title={title}
          description={description}
          typeIcon={typeIcon}
          iconColorClass={iconColorClass}
          iconBgClass={iconBgClass}
          onComplete={onComplete}
          completeLoading={completeLoading}
          completeError={completeError}
          emptyState={emptyState}
          onClose={onClose}>
          {children}
        </MonitoringTaskModalLayoutContent>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
