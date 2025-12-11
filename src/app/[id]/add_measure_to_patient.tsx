import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import * as Hapatic from 'expo-haptics';

export default function AddMeasureToPatient() {
  return (
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
          <HStack className="h-12 flex-1 items-center justify-center rounded-3xl bg-background-0 dark:bg-background-50">
            <Text className="text-center font-h4 text-typography-950 ">Ajouter une visite</Text>
          </HStack>
        </HStack>
      </VStack>
    </VStack>
  );
}
