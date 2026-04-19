import { EmptyState } from '@/components/shared/EmptyState';
import { Icon } from '@/components/shared/icons';
import type { LocalTask } from '@/schemas/task.schema';
import { tasks$ } from '@/store/tasks/tasks.store';
import { observable } from '@legendapp/state';
import { useValue } from '@legendapp/state/react';
import { FlashList } from '@shopify/flash-list';
import { cn, Tabs } from 'heroui-native';
import { useCallback } from 'react';
import { Text, View } from 'react-native';
import { DataCollectionTaskCard } from './tasks/DataCollectionTaskCard';
import { MonitoringTaskCard } from './tasks/MonitoringTaskCard';
import { TreatmentActionCard } from './tasks/TreatmentActionCard';

type TaskTabName = 'treatments' | 'monitoring' | 'data_collection';

const active_task_tab$ = observable<TaskTabName>('treatments');

interface Props {
  patientId: string;
}

function TaskList<T extends LocalTask>({
  data,
  patientId,
  renderItem,
  emptyTitle,
  emptyDescription,
}: {
  data: T[];
  patientId: string;
  renderItem: (item: T, patientId: string) => React.ReactNode;
  emptyTitle: string;
  emptyDescription: string;
}) {
  const render = useCallback(
    ({ item }: { item: T }) => renderItem(item, patientId) as React.ReactElement,
    [patientId, renderItem],
  );

  if (data.length === 0) {
    return (
      <View className="flex-1 px-2 py-v-4">
        <EmptyState iconName="ClipboardList" title={emptyTitle} description={emptyDescription} />
      </View>
    );
  }

  return (
    <FlashList
      data={data}
      renderItem={render}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <View className="h-2" />}
      contentContainerClassName="px-2 pt-4 pb-v-18"
      showsVerticalScrollIndicator={false}
    />
  );
}

export function TasksTab({ patientId }: Props) {
  const allTasks = useValue(() =>
    Object.values(tasks$.get()).filter((t) => t.patientId === patientId),
  );
  const activeTab = useValue(active_task_tab$);

  const treatmentTasks = allTasks.filter((t) => t.taskType === 'treatment_action');
  const monitoringTasks = allTasks.filter((t) => t.taskType === 'monitoring_task');
  const dataCollectionTasks = allTasks.filter((t) => t.taskType === 'data_collection_task');

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => active_task_tab$.set(v as TaskTabName)}
      className="flex-1">
      <Tabs.List className="mx-2 mt-2">
        <Tabs.Indicator />

        <Tabs.Trigger value="treatments" className="flex-1 flex-row items-center gap-1 h-v-7">
          {({ isSelected }) => (
            <>
              <Icon
                name="Pill"
                sizeClassName="text-sm"
                className={cn(isSelected ? 'text-accent' : 'text-muted')}
              />
              <Tabs.Label
                className={cn('text-xs font-normal text-muted', isSelected && 'text-accent')}>
                Trait.
              </Tabs.Label>
              {treatmentTasks.length > 0 && (
                <View className="min-w-4 h-4 px-1 rounded-full bg-accent/15 items-center justify-center">
                  <Text className="text-2xs text-accent font-bold">{treatmentTasks.length}</Text>
                </View>
              )}
            </>
          )}
        </Tabs.Trigger>

        <Tabs.Trigger value="monitoring" className="flex-1 flex-row items-center gap-1 h-v-7">
          {({ isSelected }) => (
            <>
              <Icon
                name="Activity"
                sizeClassName="text-sm"
                className={cn(isSelected ? 'text-accent' : 'text-muted')}
              />
              <Tabs.Label
                className={cn('text-xs font-normal text-muted', isSelected && 'text-accent')}>
                Surv.
              </Tabs.Label>
              {monitoringTasks.length > 0 && (
                <View className="min-w-4 h-4 px-1 rounded-full bg-accent/15 items-center justify-center">
                  <Text className="text-2xs text-accent font-bold">{monitoringTasks.length}</Text>
                </View>
              )}
            </>
          )}
        </Tabs.Trigger>

        <Tabs.Trigger value="data_collection" className="flex-1 flex-row items-center gap-1 h-v-7">
          {({ isSelected }) => (
            <>
              <Icon
                name="Database"
                sizeClassName="text-sm"
                className={cn(isSelected ? 'text-accent' : 'text-muted')}
              />
              <Tabs.Label
                className={cn('text-xs font-normal text-muted', isSelected && 'text-accent')}>
                Coll.
              </Tabs.Label>
              {dataCollectionTasks.length > 0 && (
                <View className="min-w-4 h-4 px-1 rounded-full bg-accent/15 items-center justify-center">
                  <Text className="text-2xs text-accent font-bold">
                    {dataCollectionTasks.length}
                  </Text>
                </View>
              )}
            </>
          )}
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="treatments" className="flex-1 px-0 py-0 border-0">
        <TaskList
          data={treatmentTasks}
          patientId={patientId}
          renderItem={(item, pid) => <TreatmentActionCard task={item} patientId={pid} />}
          emptyTitle="Aucun traitement assigné"
          emptyDescription="Les traitements apparaîtront ici après la prochaine synchronisation."
        />
      </Tabs.Content>

      <Tabs.Content value="monitoring" className="flex-1 px-0 py-0 border-0">
        <TaskList
          data={monitoringTasks}
          patientId={patientId}
          renderItem={(item, pid) => <MonitoringTaskCard task={item} patientId={pid} />}
          emptyTitle="Aucune surveillance assignée"
          emptyDescription="Les tâches de monitoring apparaîtront ici après la prochaine synchronisation."
        />
      </Tabs.Content>

      <Tabs.Content value="data_collection" className="flex-1 px-0 py-0 border-0">
        <TaskList
          data={dataCollectionTasks}
          patientId={patientId}
          renderItem={(item, pid) => <DataCollectionTaskCard task={item} patientId={pid} />}
          emptyTitle="Aucune collecte assignée"
          emptyDescription="Les tâches de collecte apparaîtront ici après la prochaine synchronisation."
        />
      </Tabs.Content>
    </Tabs>
  );
}
