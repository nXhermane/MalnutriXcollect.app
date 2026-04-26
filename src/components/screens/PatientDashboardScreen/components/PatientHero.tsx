import { Icon } from '@/components/shared/icons';
import { STATUS_CONFIG } from '@/constants';
import { formatAgeInMonths } from '@/lib/utils/date';
import { vibrate } from '@/lib/utils/haptics';
import { Patient, Sex } from '@/schemas/patient.schema';
import { patientDayStats$ } from '@/store/tasks/tasks.store';
import { useValue } from '@legendapp/state/react';
import { useRouter } from 'expo-router';
import { Avatar, Surface, cn } from 'heroui-native';
import { Pressable, Text, View } from 'react-native';

interface PatientHeroProps {
  patient: Patient;
}

export function PatientHero({ patient }: PatientHeroProps) {
  const router = useRouter();
  const isMale = patient.sex === Sex.MALE;
  const initials = patient.name
    .split(' ')
    .map((n, i) => (i <= 1 ? n.charAt(0).toUpperCase() : ''))
    .join('');

  const cfg = STATUS_CONFIG[patient.status ?? 'NEW'];

  const { todayDone, todayTotal } = useValue(() => {
    const stats = patientDayStats$[patient.id].get();
    return { todayTotal: stats?.total ?? 0, todayDone: stats?.done ?? 0 };
  });

  const taskColor =
    todayTotal === 0
      ? 'text-muted/40'
      : todayDone === todayTotal
        ? 'text-accent'
        : todayDone === 0
          ? 'text-red-400'
          : 'text-amber-400';

  return (
    <Pressable
      onPress={() => {
        vibrate('soft');
        router.push({
          pathname: '/patient-form',
          params: { id: patient.id, readonly: '1' },
        });
      }}>
      <Surface>
        <View className="flex-row items-center gap-4">
          <Avatar className="w-16 h-16 rounded-2xl" alt={patient.name}>
            <Avatar.Fallback className={isMale ? 'bg-blue-500/10' : 'bg-pink-500/10'}>
              <Text className={`text-xl font-bold ${isMale ? 'text-blue-600' : 'text-pink-600'}`}>
                {initials}
              </Text>
            </Avatar.Fallback>
          </Avatar>

          <View className="flex-1 gap-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-base font-bold text-foreground flex-1" numberOfLines={1}>
                {patient.name}
              </Text>
              {patient.isLocked && (
                <Icon name="LockKeyhole" sizeClassName="text-xs" className="text-muted" />
              )}
              <View className={cn('px-2 py-0.5 rounded-lg border', cfg.pillBg, cfg.pillBorder)}>
                <Text className={cn('text-xs font-bold tracking-wide', cfg.pillText)}>
                  {cfg.label}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-1.5">
              <Icon name="Calendar" sizeClassName="text-xs" className="text-muted" />
              <Text className="text-xs text-muted font-light">
                {formatAgeInMonths(new Date(patient.birthdate))} · {isMale ? 'Masculin' : 'Féminin'}
              </Text>
            </View>

            {todayTotal > 0 && (
              <View className="flex-row items-center gap-1.5">
                <Icon name="ClipboardList" sizeClassName="text-xs" className="text-muted" />
                <Text className="text-xs font-light text-muted">
                  Tâches du jour :{' '}
                  <Text className={cn('font-bold', taskColor)}>
                    {todayDone}/{todayTotal}
                  </Text>
                </Text>
              </View>
            )}

            {patient.contact?.tel && (
              <View className="flex-row items-center gap-1.5">
                <Icon name="Phone" sizeClassName="text-xs" className="text-muted" />
                <Text className="text-xs text-muted font-light">{patient.contact.tel}</Text>
              </View>
            )}

            {(patient.address?.city || patient.address?.fullAddress) && (
              <View className="flex-row items-center gap-1.5">
                <Icon name="MapPin" sizeClassName="text-xs" className="text-muted" />
                <Text className="text-xs text-muted font-light" numberOfLines={1}>
                  {patient.address.city || patient.address.fullAddress}
                </Text>
              </View>
            )}
          </View>

          <Icon name="ChevronRight" sizeClassName="text-sm" className="text-muted/30 shrink-0" />
        </View>
      </Surface>
    </Pressable>
  );
}
