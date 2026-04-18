import { EmptyState } from '@/components/shared/EmptyState';
import { Icon } from '@/components/shared/icons';
import { MeasureCategory } from '@/constants';
import { AnthropometricMeasure } from '@/schemas/anthropometric-measure.schema';
import { BiologicalMeasure } from '@/schemas/biological-measure.schema';
import { ClinicalFieldMeasure } from '@/schemas/clinical-field-measure.schema';
import { measures$ } from '@/store/measures/measures.store';
import { observable } from '@legendapp/state';
import { useValue } from '@legendapp/state/react';
import { FlashList } from '@shopify/flash-list';
import { cn, Tabs } from 'heroui-native';
import { useCallback } from 'react';
import { Text, View } from 'react-native';
import { AnthropometricMeasureCard } from './measures/AnthropometricMeasureCard';
import { BiologicalMeasureCard } from './measures/BiologicalMeasureCard';
import { ClinicalFieldMeasureCard } from './measures/ClinicalFieldMeasureCard';

type MeasureTabName = 'anthro' | 'clinical' | 'biological';

const active_measure_tab$ = observable<MeasureTabName>('anthro');

interface Props {
  patientId: string;
}

function MeasureList<T extends { id: string; isLocked?: boolean }>({
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
        <EmptyState iconName="Activity" title={emptyTitle} description={emptyDescription} />
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

export function MeasuresTab({ patientId }: Props) {
  const patientMeasures = useValue(() => measures$[patientId].get());
  const activeTab = useValue(active_measure_tab$);

  const sortByNewest = (a: { createdAt: string }, b: { createdAt: string }) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

  const anthros = [...(patientMeasures?.[MeasureCategory.ANTHRO] ?? [])].sort(
    sortByNewest,
  ) as AnthropometricMeasure[];
  const clinicals = [...(patientMeasures?.[MeasureCategory.FIELD] ?? [])].sort(
    sortByNewest,
  ) as ClinicalFieldMeasure[];
  const biologicals = [...(patientMeasures?.[MeasureCategory.BIOLOGICAL] ?? [])].sort(
    sortByNewest,
  ) as BiologicalMeasure[];

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => active_measure_tab$.set(v as MeasureTabName)}
      className="flex-1">
      <Tabs.List className="mx-2 mt-2">
        <Tabs.Indicator />

        <Tabs.Trigger value="anthro" className="flex-1 flex-row items-center gap-1 h-v-7">
          {({ isSelected }) => (
            <>
              <Icon
                name="Ruler"
                sizeClassName="text-sm"
                className={cn(isSelected ? 'text-accent' : 'text-muted')}
              />
              <Tabs.Label
                className={cn('text-xs font-normal text-muted', isSelected && 'text-accent')}>
                Anthro.
              </Tabs.Label>
              {anthros.length > 0 && (
                <View className="min-w-4 h-4 px-1 rounded-full bg-accent/15 items-center justify-center">
                  <Text className="text-2xs text-accent font-bold">{anthros.length}</Text>
                </View>
              )}
            </>
          )}
        </Tabs.Trigger>

        <Tabs.Trigger value="clinical" className="flex-1 flex-row items-center gap-1 h-v-7">
          {({ isSelected }) => (
            <>
              <Icon
                name="Stethoscope"
                sizeClassName="text-sm"
                className={cn(isSelected ? 'text-accent' : 'text-muted')}
              />
              <Tabs.Label
                className={cn('text-xs font-normal text-muted', isSelected && 'text-accent')}>
                Clinique
              </Tabs.Label>
              {clinicals.length > 0 && (
                <View className="min-w-4 h-4 px-1 rounded-full bg-accent/15 items-center justify-center">
                  <Text className="text-2xs text-accent font-bold">{clinicals.length}</Text>
                </View>
              )}
            </>
          )}
        </Tabs.Trigger>

        <Tabs.Trigger value="biological" className="flex-1 flex-row items-center gap-1 h-v-7">
          {({ isSelected }) => (
            <>
              <Icon
                name="FlaskConical"
                sizeClassName="text-sm"
                className={cn(isSelected ? 'text-accent' : 'text-muted')}
              />
              <Tabs.Label
                className={cn('text-xs font-normal text-muted', isSelected && 'text-accent')}>
                Biolog.
              </Tabs.Label>
              {biologicals.length > 0 && (
                <View className="min-w-4 h-4 px-1 rounded-full bg-accent/15 items-center justify-center">
                  <Text className="text-2xs text-accent font-bold">{biologicals.length}</Text>
                </View>
              )}
            </>
          )}
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="anthro" className="flex-1 px-0 py-0 border-0">
        <MeasureList
          data={anthros}
          patientId={patientId}
          renderItem={(item, pid) => (
            <AnthropometricMeasureCard
              surfaceVariant="default"
              measure={item}
              patientId={pid}
              isLocked={item.isLocked}
            />
          )}
          emptyTitle="Aucune mesure anthropométrique"
          emptyDescription="Les mesures anthropométriques apparaîtront ici."
        />
      </Tabs.Content>

      <Tabs.Content value="clinical" className="flex-1 px-0 py-0 border-0">
        <MeasureList
          data={clinicals}
          patientId={patientId}
          renderItem={(item, pid) => (
            <ClinicalFieldMeasureCard
              surfaceVariant="default"
              measure={item}
              patientId={pid}
              isLocked={item.isLocked}
            />
          )}
          emptyTitle="Aucune mesure clinique"
          emptyDescription="Les mesures de champs cliniques apparaîtront ici."
        />
      </Tabs.Content>

      <Tabs.Content value="biological" className="flex-1 px-0 py-0 border-0">
        <MeasureList
          data={biologicals}
          patientId={patientId}
          renderItem={(item, pid) => (
            <BiologicalMeasureCard
              surfaceVariant="default"
              measure={item}
              patientId={pid}
              isLocked={item.isLocked}
            />
          )}
          emptyTitle="Aucune mesure biologique"
          emptyDescription="Les mesures biologiques apparaîtront ici."
        />
      </Tabs.Content>
    </Tabs>
  );
}
