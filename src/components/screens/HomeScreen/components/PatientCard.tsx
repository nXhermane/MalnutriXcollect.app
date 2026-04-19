import { Icon } from '@/components/shared/icons';
import { STATUS_CONFIG } from '@/constants';
import { usePatientActions } from '@/hooks/usePatientActions';
import { useToast } from '@/hooks/useToast';
import { formatAgeInMonths } from '@/lib/utils/date';
import { vibrate, vibrateError, vibrateSuccess } from '@/lib/utils/haptics';
import { logger } from '@/lib/utils/logger';
import { Patient, PatientStatus, Sex } from '@/schemas';
import { tasks$ } from '@/store/tasks/tasks.store';
import { Observable } from '@legendapp/state';
import { useValue } from '@legendapp/state/react';
import { Avatar, Button, PressableFeedback, Surface, cn } from 'heroui-native';
import React from 'react';
import { LayoutAnimation, Text, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

const TASK_TYPES = [
  { type: 'treatment_action', label: 'Trait.', icon: 'Pill' },
  { type: 'monitoring_task', label: 'Suivi', icon: 'Activity' },
  { type: 'data_collection_task', label: 'Collecte', icon: 'ClipboardList' },
] as const;

function isTodayTask(receivedAt: string): boolean {
  const d = new Date(receivedAt);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function TaskTypeRow({
  icon,
  label,
  done,
  total,
}: {
  icon: string;
  label: string;
  done: number;
  total: number;
}) {
  if (total === 0) return null;
  const pct = done / total;
  const countColor = done === 0 ? 'text-red-400' : done < total ? 'text-amber-400' : 'text-accent';
  const barColor = done === 0 ? 'bg-red-500/40' : done < total ? 'bg-amber-400' : 'bg-accent';

  return (
    <View className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-2 gap-1.5">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1">
          <Icon name={icon as never} size={9} className="text-muted/50" />
          <Text className="text-2xs font-bold uppercase tracking-wider text-muted/50">{label}</Text>
        </View>
        <Text className={cn('text-xs font-black', countColor)}>
          {done}/{total}
        </Text>
      </View>
      <View className="h-0.5 rounded-full bg-white/5 overflow-hidden">
        <View className={cn('h-full rounded-full', barColor)} style={{ width: `${pct * 100}%` }} />
      </View>
    </View>
  );
}

function RightAction(
  prog: SharedValue<number>,
  drag: SharedValue<number>,
  onDelete: () => void,
  onDeleteExported: () => void,
): React.ReactNode {
  const styleAnimation = useAnimatedStyle(() => ({ transform: [{ translateX: drag.value + 70 }] }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: prog.value }],
    opacity: prog.value,
  }));
  return (
    <View className="flex-row">
      <Reanimated.View style={styleAnimation} className="flex-row">
        <View className="h-full w-20 items-center justify-center bg-red-500/10 rounded-r-3xl border-l border-red-500/20">
          <Reanimated.View style={iconStyle}>
            <Button
              variant="danger"
              isIconOnly
              onPress={onDelete}
              onLongPress={onDeleteExported}
              className="h-10 w-10 rounded-full shadow-sm">
              <Icon name="Trash2" sizeClassName="text-lg" className="text-white" />
            </Button>
          </Reanimated.View>
        </View>
      </Reanimated.View>
    </View>
  );
}

interface PatientCardProps {
  patient$: Observable<Patient>;
  onPress: (id: string) => void;
}

const PatientCardComponent = ({ patient$, onPress }: PatientCardProps) => {
  const toast = useToast();
  const patient = useValue(patient$);
  const { deletePatient } = usePatientActions();

  const todayTasks = useValue(() => {
    const all = Object.values(tasks$.get());
    return all.filter((t) => t.patientId === patient.id && isTodayTask(t.receivedAt));
  });

  const status = patient.status ?? PatientStatus.NEW;
  const cfg = STATUS_CONFIG[status];
  const isMale = patient.sex === Sex.MALE;

  const initials = patient.name
    .split(' ')
    .map((n, i) => (i <= 1 ? n.charAt(0).toUpperCase() : ''))
    .join('');

  const totalTasks = todayTasks.length;
  const doneTasks = todayTasks.filter((t) => t.localStatus === 'completed').length;
  const progressPct = totalTasks > 0 ? doneTasks / totalTasks : 0;
  const hasTasks = totalTasks > 0;

  const taskStats = TASK_TYPES.map(({ type, label, icon }) => {
    const ofType = todayTasks.filter((t) => t.taskType === type);
    return {
      type,
      label,
      icon,
      done: ofType.filter((t) => t.localStatus === 'completed').length,
      total: ofType.length,
    };
  });

  const handleDelete = React.useCallback(async () => {
    try {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const res = deletePatient(patient.id);
      if (res === null) {
        vibrateError();
        toast.show('Error', 'Patient non trouvé');
        return;
      }
      if (res === false) {
        vibrateError();
        toast.show(
          'Info',
          'Patient déjà exporté',
          'Effectuer un appui long pour forcer la suppression',
          'top',
          undefined,
          { actionLabel: undefined },
        );
        return;
      }
      vibrateSuccess();
      toast.show('Success', 'Patient supprimé');
    } catch (error) {
      vibrateError();
      logger.error('Failed to delete patient', error);
      toast.show('Error', 'Erreur lors de la suppression');
    }
  }, [patient.id, toast, deletePatient]);

  const handleDeleteExportedPatient = React.useCallback(async () => {
    try {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const res = deletePatient(patient.id, true);
      if (!res) {
        vibrateError();
        toast.show('Error', 'Patient non trouvé');
        return;
      }
      vibrateSuccess();
      toast.show('Success', 'Patient supprimé');
    } catch (error) {
      vibrateError();
      logger.error('Failed to delete patient', error);
      toast.show('Error', 'Erreur lors de la suppression');
    }
  }, [patient.id, toast, deletePatient]);

  return (
    <Swipeable
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={(prog, drag) =>
        RightAction(prog, drag, handleDelete, handleDeleteExportedPatient)
      }>
      <PressableFeedback
        onPress={() => {
          onPress(patient.id);
          vibrate('soft');
        }}>
        <Surface className="overflow-hidden">
          {/* <View className={cn('absolute left-0 top-0 bottom-0 w-0.5 rounded-full', cfg.leftBar)} /> */}

          <View className="gap-3">
            <View className="flex-row items-start gap-3">
              <View className="relative">
                <Avatar className="w-11 h-11 rounded-2xl" alt={patient.name}>
                  <Avatar.Fallback className={isMale ? 'bg-blue-500/10' : 'bg-pink-500/10'}>
                    <Text
                      className={cn(
                        'text-sm font-bold',
                        isMale ? 'text-blue-600' : 'text-pink-600',
                      )}>
                      {initials}
                    </Text>
                  </Avatar.Fallback>
                </Avatar>
                {cfg.pulse && (
                  <View className="absolute -inset-1 rounded-[18px] border border-red-500/40" />
                )}
              </View>

              <View className="flex-1 min-w-0 gap-1.5">
                <Text className="text-sm font-bold text-foreground" numberOfLines={1}>
                  {patient.name}
                </Text>
                <View className="flex-row flex-wrap gap-1.5 items-center">
                  <View
                    className={cn(
                      'px-1.5 py-0.5 rounded-md border',
                      isMale
                        ? 'bg-blue-500/10 border-blue-500/20'
                        : 'bg-pink-500/10 border-pink-500/20',
                    )}>
                    <Text
                      className={cn(
                        'text-2xs font-bold uppercase tracking-wider',
                        isMale ? 'text-blue-400' : 'text-pink-400',
                      )}>
                      {isMale ? 'Masculin' : 'Féminin'}
                    </Text>
                  </View>
                  <View className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10">
                    <Text className="text-2xs font-bold text-muted/70">
                      {formatAgeInMonths(new Date(patient.birthdate))}
                    </Text>
                  </View>
                  {patient.isLocked && (
                    <View className="px-1.5 py-0.5 rounded-md bg-muted/10 border border-muted/20">
                      <Text className="text-2xs font-bold text-muted/60 uppercase tracking-wider">
                        Exporté
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <View className={cn('px-2.5 py-1 rounded-lg border', cfg.pillBg, cfg.pillBorder)}>
                <Text className={cn('text-[10px] font-black tracking-wide', cfg.pillText)}>
                  {cfg.label}
                </Text>
              </View>
            </View>

            {hasTasks ? (
              <View className="gap-2">
                <View className="h-px bg-border/50" />

                <View className="flex-row items-center justify-between">
                  <Text className="text-2xs font-bold uppercase tracking-widest text-muted/50">
                    Tâches du jour
                  </Text>
                  <Text className="text-[10px] font-black">
                    <Text
                      className={
                        doneTasks === totalTasks
                          ? 'text-accent'
                          : doneTasks === 0
                            ? 'text-red-400'
                            : 'text-amber-400'
                      }>
                      {doneTasks}
                    </Text>
                    <Text className="text-muted/40"> / </Text>
                    <Text className="text-muted/60">{totalTasks}</Text>
                  </Text>
                </View>

                <View className="h-1 rounded-full bg-white/5 overflow-hidden">
                  <View
                    className={cn(
                      'h-full rounded-full',
                      doneTasks === 0
                        ? 'bg-red-500/50'
                        : doneTasks < totalTasks
                          ? 'bg-amber-400'
                          : 'bg-accent',
                    )}
                    style={{ width: `${progressPct * 100}%` }}
                  />
                </View>

                <View className="flex-row gap-1.5">
                  {taskStats.map((s) => (
                    <TaskTypeRow
                      key={s.type}
                      icon={s.icon}
                      label={s.label}
                      done={s.done}
                      total={s.total}
                    />
                  ))}
                </View>
              </View>
            ) : (
              <View className="gap-2">
                <View className="h-px bg-border/50" />
                <View className="flex-row items-center gap-2 py-1">
                  <Icon name="ClipboardX" size={13} className="text-muted/30" />
                  <Text className="text-2xs font-medium text-muted/40">
                    {"Aucune tâche assignée pour aujourd'hui"}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </Surface>
      </PressableFeedback>
    </Swipeable>
  );
};

export const PatientCard = React.memo(PatientCardComponent);
PatientCard.displayName = 'PatientCard';
