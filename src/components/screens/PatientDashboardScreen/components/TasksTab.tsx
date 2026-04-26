import { EmptyState } from '@/components/shared/EmptyState';
import { Icon } from '@/components/shared/icons';
import type { LocalTask } from '@/schemas/task.schema';
import { allTasksByPatient$ } from '@/store/tasks/tasks.store';
import { useObservable, useValue } from '@legendapp/state/react';
import { FlashList } from '@shopify/flash-list';
import { cn, Tabs } from 'heroui-native';
import { useCallback } from 'react';
import { Text, View } from 'react-native';
import { DataCollectionTaskCard } from './tasks/DataCollectionTaskCard';
import { MonitoringTaskCard } from './tasks/MonitoringTaskCard';
import { TreatmentActionCard } from './tasks/TreatmentActionCard';

type TaskTabName = 'treatments' | 'monitoring' | 'data_collection';

function badgeColor(done: number, total: number): string {
  if (total === 0) return 'bg-accent/15 text-accent';
  if (done === total) return 'bg-accent/15 text-accent';
  if (done === 0) return 'bg-red-500/15 text-red-400';
  return 'bg-amber-500/15 text-amber-400';
}

function badgeLabel(done: number, total: number): string {
  if (total === 0) return '0';
  return `${done}/${total}`;
}

function renderTreatment(item: LocalTask, patientId: string) {
  return <TreatmentActionCard task={item} patientId={patientId} />;
}
function renderMonitoring(item: LocalTask, patientId: string) {
  return <MonitoringTaskCard task={item} patientId={patientId} />;
}
function renderDataCollection(item: LocalTask, patientId: string) {
  return <DataCollectionTaskCard task={item} patientId={patientId} />;
}

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
  const activeTab$ = useObservable<TaskTabName>('treatments');
  const activeTab = useValue(activeTab$);

  const {
    treatmentTasks,
    monitoringTasks,
    dataCollectionTasks,
    treatmentDone,
    monitoringDone,
    dataCollectionDone,
  } = useValue(() => {
    const all = allTasksByPatient$[patientId].get() ?? [];
    return all.reduce(
      (acc, t) => {
        if (t.taskType === 'treatment_action') {
          acc.treatmentTasks.push(t);
          if (t.localStatus === 'completed') acc.treatmentDone++;
        } else if (t.taskType === 'monitoring_task') {
          acc.monitoringTasks.push(t);
          if (t.localStatus === 'completed') acc.monitoringDone++;
        } else if (t.taskType === 'data_collection_task') {
          acc.dataCollectionTasks.push(t);
          if (t.localStatus === 'completed') acc.dataCollectionDone++;
        }
        return acc;
      },
      {
        treatmentTasks: [] as LocalTask[],
        monitoringTasks: [] as LocalTask[],
        dataCollectionTasks: [] as LocalTask[],
        treatmentDone: 0,
        monitoringDone: 0,
        dataCollectionDone: 0,
      },
    );
  });

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => activeTab$.set(v as TaskTabName)}
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
                <View
                  className={cn(
                    'min-w-4 h-4 px-1 rounded-full items-center justify-center',
                    badgeColor(treatmentDone, treatmentTasks.length),
                  )}>
                  <Text
                    className={cn(
                      'text-2xs font-bold',
                      badgeColor(treatmentDone, treatmentTasks.length).split(' ')[1],
                    )}>
                    {badgeLabel(treatmentDone, treatmentTasks.length)}
                  </Text>
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
                <View
                  className={cn(
                    'min-w-4 h-4 px-1 rounded-full items-center justify-center',
                    badgeColor(monitoringDone, monitoringTasks.length),
                  )}>
                  <Text
                    className={cn(
                      'text-2xs font-bold',
                      badgeColor(monitoringDone, monitoringTasks.length).split(' ')[1],
                    )}>
                    {badgeLabel(monitoringDone, monitoringTasks.length)}
                  </Text>
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
                <View
                  className={cn(
                    'min-w-4 h-4 px-1 rounded-full items-center justify-center',
                    badgeColor(dataCollectionDone, dataCollectionTasks.length),
                  )}>
                  <Text
                    className={cn(
                      'text-2xs font-bold',
                      badgeColor(dataCollectionDone, dataCollectionTasks.length).split(' ')[1],
                    )}>
                    {badgeLabel(dataCollectionDone, dataCollectionTasks.length)}
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
          renderItem={renderTreatment}
          emptyTitle="Aucun traitement assigné"
          emptyDescription="Les traitements apparaîtront ici après la prochaine synchronisation."
        />
      </Tabs.Content>

      <Tabs.Content value="monitoring" className="flex-1 px-0 py-0 border-0">
        <TaskList
          data={monitoringTasks}
          patientId={patientId}
          renderItem={renderMonitoring}
          emptyTitle="Aucune surveillance assignée"
          emptyDescription="Les tâches de monitoring apparaîtront ici après la prochaine synchronisation."
        />
      </Tabs.Content>

      <Tabs.Content value="data_collection" className="flex-1 px-0 py-0 border-0">
        <TaskList
          data={dataCollectionTasks}
          patientId={patientId}
          renderItem={renderDataCollection}
          emptyTitle="Aucune collecte assignée"
          emptyDescription="Les tâches de collecte apparaîtront ici après la prochaine synchronisation."
        />
      </Tabs.Content>
    </Tabs>
  );
}
