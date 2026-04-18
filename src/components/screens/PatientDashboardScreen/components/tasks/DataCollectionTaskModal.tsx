import { BlurView } from '@/components/shared/BlurView';
import { Icon } from '@/components/shared/icons';
import { MonitoringElementCategory } from '@/constants';
import type { LocalTask, SyncDataCollectionTask } from '@/schemas/task.schema';
import { BottomSheet, Chip, Surface } from 'heroui-native';
import { ScrollView, Text, View } from 'react-native';
import { DataRequirementRow } from './data-collection-modals/DataRequirementRow';

interface Props {
  task: LocalTask;
  patientId: string;
  isOpen: boolean;
  onClose: () => void;
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

export function DataCollectionTaskModal({ task, patientId, isOpen, onClose }: Props) {
  const payload = task.payload as SyncDataCollectionTask;
  const conf = categoryConfig[payload.category as MonitoringElementCategory] ?? {
    icon: 'Database',
    label: payload.category,
  };
  const status = statusConfig[task.localStatus];
  const collectedCodes = new Set(task.collectedFields.map((f) => f.fieldCode));
  const total = payload.requirements.length;
  const collected = collectedCodes.size;

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={(v) => !v && onClose()}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay>
          <BlurView />
        </BottomSheet.Overlay>
        <BottomSheet.Content
          snapPoints={['80%']}
          enableDynamicSizing={false}
          contentContainerClassName="py-0 px-0 pb-safe-offset-2 h-full">
          <View className="flex-row items-center gap-3 px-3 py-3 border-b border-border bg-accent/5">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-accent/15 shrink-0">
              <Icon name={conf.icon as never} sizeClassName="text-sm" className="text-accent" />
            </View>
            <View className="flex-1 gap-0.5">
              <BottomSheet.Title className="text-base font-semibold text-foreground">
                {conf.label}
              </BottomSheet.Title>
              <BottomSheet.Description className="text-xs text-muted">
                Collecte de données initiale
              </BottomSheet.Description>
            </View>
            <BottomSheet.Close />
          </View>

          <ScrollView
            className="flex-1"
            contentContainerClassName="px-3 py-3 gap-3 pb-safe-offset-4"
            showsVerticalScrollIndicator={false}>
            <View className="rounded-xl bg-accent/5 border border-accent/20 p-3 gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-muted">Progression</Text>
                <Text className="text-xs font-bold text-accent">
                  {collected}/{total}
                </Text>
              </View>
              <View className="h-2 rounded-full bg-accent/15 overflow-hidden">
                <View
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${total > 0 ? (collected / total) * 100 : 0}%` }}
                />
              </View>
            </View>

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
                <Text className="text-xs text-muted">Mesures requises</Text>
                <Text className="text-xs font-bold text-foreground">{total}</Text>
              </View>
            </Surface>

            {payload.requirements.length > 0 && (
              <Surface variant="secondary" className="p-3 gap-3">
                <View className="flex-row items-center gap-2 pb-2 border-b border-border">
                  <Icon name="ListChecks" sizeClassName="text-sm" className="text-accent" />
                  <Text className="text-sm font-semibold text-foreground">
                    Données à collecter ({total})
                  </Text>
                </View>
                <View className="gap-2">
                  {payload.requirements.map((req) => (
                    <DataRequirementRow
                      key={req.code}
                      task={task}
                      patientId={patientId}
                      requirementCode={req.code}
                      freshnessWindowInMinutes={req.freshnessWindowInMinutes}
                      isCollected={collectedCodes.has(req.code)}
                    />
                  ))}
                </View>
              </Surface>
            )}
          </ScrollView>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
