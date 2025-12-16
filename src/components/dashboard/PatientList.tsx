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
import { UserPlus } from 'lucide-react-native';
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
  const searchQuery = useValue(() => modeles$.search_text);
  const renderItem = useCallback(({ item }: ListRenderItemInfo<Patient>) => {
    return <PatientItem {...item} />;
  }, []);

  return (
    <VStack className="flex-1 overflow-y-auto  bg-bg  py-4">
      {filteredPatients.length > 0 && (
        <HStack className="absolute top-0 z-30 mb-4 w-full ">
          <BlurView
            intensity={100}
            experimentalBlurMethod={'dimezisBlurView'}
            tint={isDark ? 'dark' : 'light'}
            className="w-full flex-row items-center justify-between px-4 py-3 ">
            <Text className="font-h4 font-medium text-muted-foreground">
              {filteredPatients.length} patient{filteredPatients.length > 1 && 's'}
            </Text>
          </BlurView>
        </HStack>
      )}

      <FlatList
        contentContainerClassName="px-4 gap-4 pb-20 pt-10 "
        data={filteredPatients}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={onScrollStart}
        onScrollEndDrag={onScrollEnd}
        ListEmptyComponent={() => (
          <VStack className="elevation-sm mt-12 rounded-xl border-border bg-card p-8 text-center shadow-sm ">
            <Center className="gap-4">
              <Box className="flex h-v-14  w-v-14 items-center justify-center rounded-full  bg-emerald-100 dark:bg-emerald-900/20">
                <Icon as={UserPlus} size="xl" className="text-emerald-600 dark:text-emerald-400" />
              </Box>
              <VStack className="">
                <Text className="mb-1 text-center font-body text-sm text-muted-foreground">
                  {searchQuery.trim() === '' ? 'Aucun patient enregistré' : 'Aucun résultat'}
                </Text>
                <Text className="text-center font-body text-xs text-muted-foreground">
                  {searchQuery
                    ? 'Aucun patient ne correspond à votre recherche.'
                    : 'Commencez par créer votre premier patient pour collecter des données nutritionnelles.'}
                </Text>
              </VStack>
            </Center>
          </VStack>
        )}
      />
    </VStack>
  );
}
