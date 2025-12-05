import { filtered_patients$, modeles$ } from '@/store';
import { useCallback } from 'react';
import { VStack } from '../ui/vstack';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { Patient } from '@/models/schemas';
import { PatientItem } from './PatientItem';
import { HStack } from '../ui/hstack';
import { Text } from '../ui/text';

export function PatientList() {
  const filteredPatients = filtered_patients$.get();

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Patient>) => {
    return <PatientItem {...item} />;
  }, []);

  return (
    <VStack className="flex-1">
      <HStack className="px-4 py-3">
        <Text>
          {filteredPatients.length} patient{filteredPatients.length > 1 && 's'}
        </Text>
      </HStack>

      <FlatList contentContainerClassName="px-4" data={filteredPatients} renderItem={renderItem} />
    </VStack>
  );
}
