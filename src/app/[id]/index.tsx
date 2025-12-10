import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { router, useLocalSearchParams } from 'expo-router';
import { Fab, FabIcon, FabLabel } from '@/components/ui/fab';
import { Edit, Plus, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { AddMeasureToPatientModal } from '@/components/dashboard/AddMeasureToPatientModal';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';
import * as Hapatic from 'expo-haptics';
import { useValue } from '@legendapp/state/react';
import { modeles$ } from '@/store';

export default function PatientScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const patients = useValue(() => modeles$.patients);
  const [showAddMeasureToPatientModal, setShowAddMeasureToPatientModal] = useState<boolean>(false);
  return (
    <React.Fragment>
      <VStack className="pt-safe flex-1 bg-background-50 dark:bg-background-0">
        <VStack className=" h-18 w-full   items-center justify-center">
          <HStack className="w-full items-center gap-4 px-4 ">
            <Pressable
              onPress={() => {
                router.back();
                Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
              }}
              className="size-12 items-center justify-center rounded-full bg-background-0 dark:bg-background-50">
              <Icon as={X} className="" />
            </Pressable>
            <HStack className="h-12 flex-1 items-center justify-center rounded-3xl bg-background-0 px-4 dark:bg-background-50">
              <Text className="text-center font-h4 text-typography-950 " numberOfLines={1}>
                {id ? patients[id].name : 'patient not found'}
              </Text>
            </HStack>
            <Pressable
              disabled={patients[id].isLocked}
              onPress={() => {
                router.back();
                Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
              }}
              className="size-12 items-center justify-center rounded-full bg-green-600 hover:bg-green-700">
              <Icon as={Edit} className="text-white" />
            </Pressable>
          </HStack>
        </VStack>
        <Fab
          className="bottom-8 size-14 bg-green-600 hover:bg-green-700"
          onPress={() => {
            setShowAddMeasureToPatientModal(true);
            Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
          }}>
          <FabIcon as={Plus} className="text-white" />
          <FabLabel className="absolute -bottom-4 font-light text-xs  font-semibold text-gray-700 dark:text-gray-400">
            Nouvelle visite
          </FabLabel>
        </Fab>
      </VStack>
      {showAddMeasureToPatientModal && (
        <AddMeasureToPatientModal
          patientId={id}
          isVisible={showAddMeasureToPatientModal}
          onClose={() => setShowAddMeasureToPatientModal(false)}
        />
      )}
    </React.Fragment>
  );
}
