import { Patient } from '@/models/schemas';
import { VStack } from '../ui/vstack';
import { Text } from '../ui/text';
import { Pressable } from '../ui/pressable';
import { router } from 'expo-router';
import { HStack } from '../ui/hstack';
import { Avatar, AvatarBadge, AvatarFallbackText } from '../ui/avatar';
import { HumanDateFormatter } from '@/utils/human-date-formatter';
import { LockKeyhole } from 'lucide-react-native';
import { Icon } from '../ui/icon';
import { Badge, BadgeText } from '../ui/badge';

export function PatientItem(patient: Patient) {
  const getAvatarColor = (nom: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
    ];
    const index = nom.charCodeAt(0) % colors.length;
    return colors[index];
  };
  return (
    <Pressable
      onPress={() =>
        router.navigate({
          pathname: '/[id]',
          params: {
            id: patient.id,
          },
        })
      }>
      <HStack
        className={`elevation-sm items-center justify-between rounded-xl border border-border bg-card p-4 `}>
        <HStack className="items-center gap-3">
          <Avatar
            className={`flex size-11 items-center   justify-center rounded-full  bg-green-500 text-white ${getAvatarColor(
              patient.name,
            )} `}>
            <AvatarFallbackText className="font-h4 text-base font-medium text-white">
              {patient.name}
            </AvatarFallbackText>
            {patient.isLocked && (
              <AvatarBadge className=" size-4 items-center justify-center border-transparent bg-transparent">
                <Icon as={LockKeyhole} className=" size-3.5 text-amber-600 dark:text-amber-500" />
              </AvatarBadge>
            )}
          </Avatar>
          <VStack className="">
            <Text className="font-h4 text-base font-medium text-foreground">{patient.name}</Text>
            <Text className="font-light text-xs font-normal text-muted-foreground">
              {new Date(patient.updatedAt).toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </Text>
          </VStack>
        </HStack>
        <HStack>
          <Badge className="rounded-xl bg-green-500/10">
            <BadgeText className="font-light text-2xs font-normal text-green-500">
              {HumanDateFormatter.formatAgeInMonths(patient.birthdate)}
            </BadgeText>
          </Badge>
        </HStack>
      </HStack>
    </Pressable>
  );
}
