import { Patient } from '@/models/schemas';
import { VStack } from '../ui/vstack';
import { Text } from '../ui/text';
import { Pressable } from '../ui/pressable';
import { router } from 'expo-router';

export function PatientItem(patient: Patient) {
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
      <VStack key={patient.id} className="border border-gray-300/05 rounded-lg p-4 mb-3 bg-background-0">
        <Text className="font-semibold">{patient.name}</Text>
        <Text>Born: {new Date(patient.birthdate).toLocaleDateString()}</Text>
        <Text>Sex: {patient.sex}</Text>
        {patient.contact?.email && <Text>Email: {patient.contact.email}</Text>}
        {patient.contact?.tel && <Text>Phone: {patient.contact.tel}</Text>}
      </VStack>
    </Pressable>
  );
}
