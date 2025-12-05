import { Patient } from '@/models/schemas';
import { VStack } from '../ui/vstack';
import { Text } from '../ui/text';
import { Pressable } from '../ui/pressable';
import { router } from 'expo-router';
import { HStack } from '../ui/hstack';
import { Avatar, AvatarBadge, AvatarFallbackText } from '../ui/avatar';
import { HumanDateFormatter } from '@/utils/human-date-formatter';
import { useState } from 'react';
import { MotiView } from 'moti';
import { ChevronRight, LockKeyhole } from 'lucide-react-native';
import { Icon } from '../ui/icon';
import { Badge, BadgeText } from '../ui/badge';

export function PatientItem(patient: Patient) {
  const [pressed, setPressed] = useState<boolean>(false);
  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={() =>
        router.navigate({
          pathname: '/[id]',
          params: {
            id: patient.id,
          },
        })
      }>
      <HStack
        key={patient.id}
        className={`elevation-sm h-v-14 items-center justify-between rounded-xl bg-background-50 px-2 py-2`}>
        <HStack className="items-center gap-2">
          <Avatar className="h-10 w-10 rounded-full bg-primary-c_light/10">
            <AvatarFallbackText className="font-h3 text-base font-semibold text-primary-c_light">
              {patient.name}
            </AvatarFallbackText>
            {patient.isLocked && (
              <AvatarBadge className=" border-transparent justify-center items-center h-4 w-4 bg-transparent">
                <Icon as={LockKeyhole} className="h-3 w-3" />
              </AvatarBadge>
            )}
          </Avatar>
          <VStack className="">
            <Text className="font-h4 text-base font-medium text-typography-950">
              {patient.name}
            </Text>
            <Text className="font-light text-xs font-normal text-typography-500">
              {new Date(patient.updatedAt).toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </Text>
          </VStack>
        </HStack>
        <HStack>
          <Badge className="bg-primary-c_light/10 rounded-xl">
            <BadgeText className="font-light text-2xs font-normal text-primary-c_light">
              {HumanDateFormatter.formatAgeInMonths(patient.birthdate)}
            </BadgeText>
          </Badge>
          <MotiView
            transition={{
              type: 'timing',
              duration: 200,
            }}
            animate={{ translateX: pressed ? 5 : 0 }}
            className={'items-end justify-center'}>
            <Icon as={ChevronRight} />
          </MotiView>
        </HStack>
      </HStack>
    </Pressable>
  );
}
