import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';
import * as Hapatic from 'expo-haptics';
import { Icon } from '@/components/ui/icon';
import { X } from 'lucide-react-native';

export default function AddPatient() {
  return (
    <VStack className="flex-1 bg-background-50 dark:bg-background-0">
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
          <HStack className="flex-1 h-12 justify-center bg-background-0 dark:bg-background-50 items-center rounded-3xl">
            <Text className="font-h4 text-typography-950 text-center ">Ajouter un patient</Text>
          </HStack>
        </HStack>
      </VStack>
    </VStack>
  );
}
