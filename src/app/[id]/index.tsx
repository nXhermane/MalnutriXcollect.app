import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { router, useLocalSearchParams } from 'expo-router';
import { Center } from '@/components/ui/center';
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
      <VStack className="flex-1 bg-background-50 dark:bg-background-0 pt-safe">
        <VStack className=" h-18 w-full   justify-center items-center">
          <HStack className="px-4 items-center gap-4 w-full ">
            <Pressable
              onPress={() => {
                router.back();
                Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
              }}
              className="h-12 w-12 items-center justify-center bg-background-0 dark:bg-background-50 rounded-full">
              <Icon as={X} className="" />
            </Pressable>
            <HStack className="flex-1 h-12 justify-center bg-background-0 dark:bg-background-50 items-center rounded-3xl px-4">
              <Text className="font-h4 text-typography-950 text-center " numberOfLines={1}>
                {id ? patients[id].name : 'patient not found'}
              </Text>
            </HStack>
            <Pressable
              disabled={patients[id].isLocked}
              onPress={() => {
                router.back();
                Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
              }}
              className="h-12 w-12 items-center justify-center bg-green-600 hover:bg-green-700 rounded-full">
              <Icon as={Edit} className="text-white" />
            </Pressable>
          </HStack>
        </VStack>
        <Fab
          className="bottom-8 h-14 w-14 bg-green-600 hover:bg-green-700"
          onPress={() => {
            setShowAddMeasureToPatientModal(true);
            Hapatic.impactAsync(Hapatic.ImpactFeedbackStyle.Light);
          }}>
          <FabIcon as={Plus} className="text-white" />
          <FabLabel className="absolute -bottom-4 font-semibold font-light  text-gray-700 dark:text-gray-400 text-xs">
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
