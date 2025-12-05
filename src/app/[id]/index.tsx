import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { useLocalSearchParams } from 'expo-router';
import { Center } from '@/components/ui/center';
import { Fab, FabIcon } from '@/components/ui/fab';
import { Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { AddMeasureToPatientModal } from '@/components/dashboard/AddMeasureToPatientModal';

export default function PatientScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showAddMeasureToPatientModal, setShowAddMeasureToPatientModal] = useState<boolean>(false);
  return (
    <React.Fragment>
      <VStack className="flex-1 bg-background-0">
        <Center className="flex-1">
          <Text>Patient Id: {id}</Text>
        </Center>
        <Fab
          className=" w-12 h-12 bg-primary-c_light"
          onPress={() => setShowAddMeasureToPatientModal(true)}>
          <FabIcon as={Plus} className="text-white" />
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
