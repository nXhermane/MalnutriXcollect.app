import { Icon } from '@/components/shared/icons';
import { formatAgeInMonths } from '@/lib/utils/date';
import { vibrate } from '@/lib/utils/haptics';
import { Patient, Sex } from '@/schemas/patient.schema';
import { useRouter } from 'expo-router';
import { Avatar, Surface } from 'heroui-native';
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

  return (
    <Pressable
      onPress={() => {
        vibrate('soft');
        router.push({
          pathname: '/patient-form',
          params: {
            id: patient.id,
            readonly: '1',
          },
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
            </View>

            <View className="flex-row items-center gap-1.5">
              <Icon name="Calendar" sizeClassName="text-xs" className="text-muted" />
              <Text className="text-xs text-muted font-light">
                {formatAgeInMonths(new Date(patient.birthdate))} • {isMale ? 'Masculin' : 'Féminin'}
              </Text>
            </View>

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
        </View>
      </Surface>
    </Pressable>
  );
}
