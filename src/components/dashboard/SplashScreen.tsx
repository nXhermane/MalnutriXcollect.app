import { AppLogo } from '../custom';
import { Center } from '../ui/center';
import { VStack } from '../ui/vstack';
import { Text } from '../ui/text';

export function SplashScreen() {
  return (
    <Center className={'flex-1 bg-background-50 dark:bg-background-0'}>
      <AppLogo className={'aspect-[320/320] h-v-32'} />
      <VStack className={' absolute bottom-8  items-center gap-4'}>
        <Text className=" font-h3 text-xl font-semibold  text-black dark:text-white">
          MalnutriX<Text className="font-light text-2xs text-black dark:text-white">collect</Text>
        </Text>
      </VStack>
    </Center>
  );
}
