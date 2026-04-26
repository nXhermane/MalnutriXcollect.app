import { BlurView } from '@/components/shared/BlurView';
import { EmptyState } from '@/components/shared/EmptyState';
import { Icon } from '@/components/shared/icons';
import { evaluateMissedTask, useTaskActions } from '@/hooks/useTaskActions';
import { useToast } from '@/hooks/useToast';
import type { LocalTask, SyncTreatmentAction } from '@/schemas/task.schema';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BottomSheet, Button, Chip, Spinner } from 'heroui-native';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

type TreatmentIcon = 'Pill' | 'Milk' | 'HeartPulse';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  task: LocalTask;
  title: string;
  description: string;
  typeIcon: TreatmentIcon;
  iconColorClass: string;
  iconBgClass: string;
  children: React.ReactNode;
  completionTasksSection?: React.ReactNode;
  isFullyCollected?: boolean;
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

function TreatmentActionModalLayoutContent({
  task,
  title,
  description,
  typeIcon,
  iconColorClass,
  iconBgClass,
  children,
  completionTasksSection,
  isFullyCollected = false,
  emptyState,
  onClose,
}: {
  task: LocalTask;
  title: string;
  description: string;
  typeIcon: TreatmentIcon;
  iconColorClass: string;
  iconBgClass: string;
  children: React.ReactNode;
  completionTasksSection?: React.ReactNode;
  isFullyCollected?: boolean;
  emptyState?: { isMissing: boolean; title: string; description: string };
  onClose: () => void;
}) {
  const payload = task.payload as SyncTreatmentAction;
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
    setCompleting(true);
    completeTask(task.id);
    toast.show('Success', 'Traitement complété');
    setCompleting(false);
    onClose();
  };

  return (
    <BottomSheet.Content
      snapPoints={['95%']}
      enableDynamicSizing={false}
      enableOverDrag={false}
      contentContainerClassName="py-0 px-0 pb-safe-offset-4 h-full">
      <View className="flex-row items-center gap-3 px-3 py-3 border-b border-border">
        <View
          className={`h-10 w-10 items-center justify-center rounded-full shrink-0 ${iconBgClass}`}>
          <Icon name={typeIcon} sizeClassName="text-sm" className={iconColorClass} />
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

      <BottomSheetScrollView
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

        {emptyState?.isMissing ? (
          <EmptyState
            iconName="Circle"
            title={emptyState.title}
            description={emptyState.description}
          />
        ) : (
          <>
            {children}
            {completionTasksSection}
          </>
        )}
      </BottomSheetScrollView>

      {showCompleteBtn && (
        <View className="w-full px-3 pt-3 border-t border-border">
          <Button
            variant="primary"
            isDisabled={completing || !isFullyCollected}
            className="w-full h-12"
            onPress={handleComplete}>
            {completing ? (
              <Spinner className="text-white" />
            ) : !isFullyCollected ? (
              <Button.Label className="font-normal text-sm text-white">
                Collecte requise
              </Button.Label>
            ) : (
              <Button.Label className="font-normal text-sm text-white">Compléter</Button.Label>
            )}
          </Button>
        </View>
      )}
    </BottomSheet.Content>
  );
}

export function TreatmentActionModalLayout({
  isOpen,
  onClose,
  task,
  title,
  description,
  typeIcon,
  iconColorClass,
  iconBgClass,
  children,
  completionTasksSection,
  isFullyCollected = false,
  emptyState,
}: Props) {
  return (
    <BottomSheet isOpen={isOpen} onOpenChange={(v) => !v && onClose()}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay>
          <BlurView />
        </BottomSheet.Overlay>
        <TreatmentActionModalLayoutContent
          task={task}
          title={title}
          description={description}
          typeIcon={typeIcon}
          iconColorClass={iconColorClass}
          iconBgClass={iconBgClass}
          completionTasksSection={completionTasksSection}
          isFullyCollected={isFullyCollected}
          emptyState={emptyState}
          onClose={onClose}>
          {children}
        </TreatmentActionModalLayoutContent>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
