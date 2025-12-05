import { AppLogo } from '../custom';
import { Center } from '../ui/center';
import { VStack } from '../ui/vstack';
import { Text } from '../ui/text';

export function SplashScreen() {
  return (
    <Center className={'bg-background-primary flex-1'}>
      <AppLogo className={'aspect-[320/320] h-v-32'} />
      <VStack className={' absolute bottom-8  items-center gap-4'}>
        <Text className=" font-h3 font-semibold text-xl  dark:text-white text-black">
          MalnutriX<Text className="text-2xs font-light text-black dark:text-white">collect</Text>
        </Text>
      </VStack>
    </Center>
  );
}
