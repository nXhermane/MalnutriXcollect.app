import { isDark$, modeles$ } from '@/store';
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
import { BlurView } from 'expo-blur';

export function PatientList({
  onScrollEnd,
  onScrollStart,
}: {
  onScrollStart?: () => void;
  onScrollEnd?: () => void;
}) {
  const isDark = useValue(isDark$);
  const filteredPatients = useValue(() => modeles$.filtered_patients());
  const nonExportedPatientsCount = useValue(() => modeles$.non_exported_patients().length);
  const renderItem = useCallback(({ item }: ListRenderItemInfo<Patient>) => {
    return <PatientItem {...item} />;
  }, []);

  return (
    <VStack className="flex-1 py-4">
      <HStack className="absolute top-0 z-30 mb-4 w-full ">
        <BlurView
          intensity={100}
          experimentalBlurMethod={'dimezisBlurView'}
          tint={isDark ? 'dark' : 'light'}
          className="w-full flex-row items-center justify-between px-4 py-3 ">
          <Text className="font-h4 font-medium text-gray-700 dark:text-typography-800">
            {filteredPatients.length} patient{filteredPatients.length > 1 && 's'}
          </Text>
          {nonExportedPatientsCount > 0 && (
            <Text className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 font-body text-xs text-orange-600 dark:border-orange-100/20 dark:bg-orange-600/10 dark:text-orange-600">
              {nonExportedPatientsCount} mésure{nonExportedPatientsCount > 1 ? 's' : ''} à exporter
            </Text>
          )}
        </BlurView>
      </HStack>

      <FlatList
        contentContainerClassName="px-4 gap-4 pb-20 pt-10"
        data={filteredPatients}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={onScrollStart}
        onScrollEndDrag={onScrollEnd}
        ListEmptyComponent={() => (
          <VStack className="rounded-xl border-gray-100 bg-background-0 p-8 text-center shadow-sm dark:bg-background-50">
            <Center className="gap-4">
              <Box className="flex size-14 items-center justify-center rounded-full bg-background-100">
                <Icon as={User} className="size-7 text-gray-400" />
              </Box>
              <VStack className="">
                <Text className="mb-1 text-center font-body text-gray-600 dark:text-typography-600">
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
