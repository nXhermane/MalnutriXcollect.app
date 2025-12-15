import { Patient } from '@/models/schemas';
import { VStack } from '../ui/vstack';
import { Text } from '../ui/text';
import { Pressable } from '../ui/pressable';
import { router } from 'expo-router';
import { HStack } from '../ui/hstack';
import { Avatar, AvatarFallbackText } from '../ui/avatar';
import { HumanDateFormatter } from '@/utils/human-date-formatter';
import { Delete, LockKeyhole } from 'lucide-react-native';
import { Icon } from '../ui/icon';
import { Badge, BadgeText } from '../ui/badge';
import { useDeletePatientViewModel } from '@/hooks';
import { Spinner } from '../ui/spinner';
import { modeles$ } from '@/store';
import { useValue } from '@legendapp/state/react';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Button, ButtonIcon } from '../ui/button';

export function PatientItem(patient: Patient) {
  const { isLoading, deletePatient } = useDeletePatientViewModel();
  const measureCounter = useValue(() => modeles$.patient_measures[patient.id].get()?.length || 0);
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

  function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value + 50 }],
      };
    });

    return (
      <Reanimated.View style={styleAnimation}>
        <VStack className=" h-full w-v-14 items-center justify-center">
          <Button
            onPress={() => {
              deletePatient(patient.id);
            }}
            className="h-v-12 w-v-12 rounded-full bg-red-500">
            <ButtonIcon as={Delete} size="sm" className="text-white" />
          </Button>
        </VStack>
      </Reanimated.View>
    );
  }
  if (isLoading) return <Spinner size={'large'} className="text-blue-500" />;
  return (
    <Swipeable
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={RightAction}>
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
            </Avatar>
            <VStack className="">
              <HStack className="items-center gap-1">
                <Text className="font-h4 text-base font-medium text-foreground">
                  {patient.name}
                </Text>
                {patient.isLocked && (
                  <Icon
                    as={LockKeyhole}
                    size="xs"
                    className=" size-3.5 shrink-0 text-muted-foreground"
                  />
                )}
              </HStack>
              <Text className="font-light text-xs font-normal text-muted-foreground">
                {HumanDateFormatter.formatAgeInMonths(patient.birthdate)}
                {' • '}
                {patient.sex === 'M' ? 'Garçon' : 'Fille'}
              </Text>
            </VStack>
          </HStack>
          <HStack>
            {measureCounter > 0 && (
              <Badge className="rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <BadgeText className="font-light text-2xs font-normal text-emerald-700  dark:text-emerald-400">
                  {measureCounter}
                </BadgeText>
              </Badge>
            )}
          </HStack>
        </HStack>
      </Pressable>
    </Swipeable>
  );
}
