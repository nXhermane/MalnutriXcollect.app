import { modeles$ } from '@/store';
import { useCallback } from 'react';
import { VStack } from '../ui/vstack';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { Patient } from '@/models/schemas';
import { PatientItem } from './PatientItem';
import { useValue } from '@legendapp/state/react';
import { HStack } from '../ui/hstack';
import { Text } from '../ui/text';
import { Box } from '../ui/box';
import { Center } from '../ui/center';
import { Icon } from '../ui/icon';
import { User } from 'lucide-react-native';

export function PatientList() {
  const filteredPatients = useValue(() => modeles$.filtered_patients());
  const nonExportedPatientsCount = useValue(() => modeles$.non_exported_patients().length);
  const renderItem = useCallback(({ item }: ListRenderItemInfo<Patient>) => {
    return <PatientItem {...item} />;
  }, []);

  return (
    <VStack className="flex-1 py-4">
      <HStack className="px-4 justify-between items-center mb-4  ">
        <Text className="text-gray-700 dark:text-typography-800 font-h4 font-medium">
          {filteredPatients.length} patient{filteredPatients.length > 1 && 's'}
        </Text>
        {nonExportedPatientsCount > 0 && (
          <Text className="px-2.5 py-1 font-body bg-orange-50 dark:bg-orange-600/10 dark:text-orange-600 text-orange-600 rounded-full border border-orange-200 dark:border-orange-100/20 text-xs">
            {nonExportedPatientsCount} mésure{nonExportedPatientsCount > 1 ? 's' : ''} à exporter
          </Text>
        )}
      </HStack>

      <FlatList
        contentContainerClassName="px-4 gap-4 "
        data={filteredPatients}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <VStack className="p-8 text-center border-gray-100 bg-background-0 dark:bg-background-50 rounded-xl shadow-sm">
            <Center className="gap-4">
              <Box className="w-14 h-14 bg-background-100 rounded-full flex items-center justify-center">
                <Icon as={User} className="h-7 w-7 text-gray-400" />
              </Box>
              <VStack className="">
                <Text className="text-gray-600 dark:text-typography-600 mb-1 text-center font-body">
                  Aucun patient enregistré
                </Text>
              </VStack>
            </Center>
          </VStack>
        )}
      />
    </VStack>
  );
}
