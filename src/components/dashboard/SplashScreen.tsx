import { AppLogo } from '../custom';
import { Center } from '../ui/center';
import { VStack } from '../ui/vstack';
import { Text } from '../ui/text';
import { HStack } from '../ui/hstack';

export function SplashScreen() {
  return (
    <Center className={'flex-1 bg-bg'}>
      <AppLogo className={'aspect-[320/320] h-v-32'} />
      <VStack className={'absolute bottom-8  items-center gap-4'}>
        <HStack>
          <Text className="font-h2 text-xl font-bold  text-emerald-600 dark:text-emerald-400">
            MalnutriX
          </Text>
          <Text className="top-0 font-light text-xs text-muted-foreground">collect</Text>
        </HStack>
      </VStack>
    </Center>
  );
}
