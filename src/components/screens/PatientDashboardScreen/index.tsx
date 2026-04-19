import { BlurView } from '@/components/shared/BlurView';
import { Icon } from '@/components/shared/icons';
import { vibrate } from '@/lib/utils/haptics';
import { Patient } from '@/schemas/patient.schema';
import { Visit } from '@/schemas/visit.schema';
import { patients$ } from '@/store/patients/patients.store';
import { visits$ } from '@/store/visits/visits.store';
import { observable } from '@legendapp/state';
import { useValue } from '@legendapp/state/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { cn, PressableFeedback, Tabs } from 'heroui-native';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PatientHero } from './components/PatientHero';
import { TasksTab } from './components/TasksTab';
import { VisitsTab } from './components/VisitsTab';
import { MeasuresTab } from './components/MeasuresTab';

type TabName = 'visits' | 'tasks' | 'measures';

const active_tab$ = observable<TabName>('visits');

export function PatientDashboardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const activeTab = useValue(active_tab$);
  const patient = useValue(() => patients$[id].get() as Patient | undefined);
  const visits = useValue(() => (visits$[id].get() ?? []) as Visit[]);

  if (!patient) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted">Patient introuvable</Text>
      </View>
    );
  }

  const handleNewVisit = () => {
    router.push({
      pathname: '/patient/[id]/visit-form',
      params: { id },
    });
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: top }}>
      <View className="absolute z-30 w-full overflow-hidden" style={{ top }}>
        <BlurView />
        <View className="flex-row items-center gap-3 px-4 pb-2 pt-2">
          <Pressable
            className="bg-surface/80 p-3 rounded-2xl shadow-sm active:bg-surface"
            accessibilityLabel="Retour"
            onPress={() => {
              router.back();
              vibrate('soft');
            }}>
            <Icon name="X" sizeClassName="text-lg" className="text-foreground" />
          </Pressable>

          <View className="flex-1 bg-surface/80 h-12 rounded-2xl shadow-sm items-center justify-center px-4">
            <Text className="text-foreground text-base font-bold tracking-tight" numberOfLines={1}>
              {patient.name}
            </Text>
          </View>

          {!patient.isLocked && (
            <PressableFeedback
              className={`p-3 rounded-2xl shadow-sm ${patient.isLocked ? 'bg-muted/10' : 'bg-surface/80 active:bg-surface'}`}
              accessibilityLabel="Modifier le patient"
              isDisabled={patient.isLocked}
              onPress={() => {
                vibrate('soft');
                router.push({
                  pathname: '/patient-form',
                  params: { id },
                });
              }}>
              <Icon
                name="SquarePen"
                sizeClassName="text-lg"
                className={patient.isLocked ? 'text-muted/40' : 'text-foreground'}
              />
            </PressableFeedback>
          )}
        </View>
      </View>
      <View className="mt-v-18 px-2 mb-v-3">
        <PatientHero patient={patient} />
      </View>
      <Tabs
        value={activeTab}
        onValueChange={(value) => active_tab$.set(value as TabName)}
        className="flex-1">
        <Tabs.List className="mx-2">
          <Tabs.Indicator />
          <Tabs.Trigger value="visits" className="flex-1 flex-row items-center gap-1.5 h-v-7">
            {({ isSelected }) => (
              <>
                <Icon
                  name="Activity"
                  sizeClassName="text-sm"
                  className={cn(isSelected ? 'text-accent' : 'text-muted')}
                />
                <Tabs.Label
                  className={cn('text-xs font-normal text-muted', isSelected && 'text-accent')}>
                  Visites
                </Tabs.Label>
                {visits.length > 0 && (
                  <View className="min-w-5 h-5 px-1 rounded-full bg-accent/15 items-center justify-center">
                    <Text className="text-2xs text-accent font-bold">{visits.length}</Text>
                  </View>
                )}
              </>
            )}
          </Tabs.Trigger>

          <Tabs.Trigger value="tasks" className="flex-1 flex-row items-center gap-1.5 h-v-7">
            {({ isSelected }) => (
              <>
                <Icon
                  name="ClipboardList"
                  sizeClassName="text-sm"
                  className={cn(isSelected ? 'text-accent' : 'text-muted')}
                />
                <Tabs.Label
                  className={cn('text-xs font-normal text-muted', isSelected && 'text-accent')}>
                  Tâches
                </Tabs.Label>
              </>
            )}
          </Tabs.Trigger>

          <Tabs.Trigger value="measures" className="flex-1 flex-row items-center gap-1.5 h-v-7">
            {({ isSelected }) => (
              <>
                <Icon
                  name="Ruler"
                  sizeClassName="text-sm"
                  className={cn(isSelected ? 'text-accent' : 'text-muted')}
                />
                <Tabs.Label
                  className={cn('text-xs font-normal text-muted', isSelected && 'text-accent')}>
                  Mesures
                </Tabs.Label>
              </>
            )}
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content className="px-0 py-0 flex-1 border-0" value="visits">
          <VisitsTab visits={visits} patientId={id} onNewVisit={handleNewVisit} />
        </Tabs.Content>

        <Tabs.Content className="px-0 py-0 flex-1 border-0" value="tasks">
          <TasksTab patientId={id} />
        </Tabs.Content>

        <Tabs.Content className="px-0 py-0 flex-1 border-0" value="measures">
          <MeasuresTab patientId={id} />
        </Tabs.Content>
      </Tabs>
    </View>
  );
}
