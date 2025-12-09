import React from 'react';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { Pressable } from '../ui/pressable';
import { Icon } from '../ui/icon';
import { Search, SearchX, Sun, Moon } from 'lucide-react-native';
import { theme$ } from '@/store';
import { useValue } from '@legendapp/state/react';

export const Header = ({
  searchBarIsVisible = false,
  toggleSearchBar,
}: {
  toggleSearchBar?: () => void;
  searchBarIsVisible?: boolean;
}) => {
  const theme = useValue(theme$);
  return (
    <React.Fragment>
      <HStack
        className={
          'p-safe dark:elevation-md h-v-18 w-full items-center justify-between bg-background-0 dark:bg-background-50'
        }>
        <HStack className={'items-center w-full justify-between px-4 pb-2'}>
          <Box>
            <HStack className="items-center">
              <Text className="font-h3 text-xl  font-semibold dark:text-white text-black">
                MalnutriX
                <Text className="text-2xs font-light text-black dark:text-white">collect</Text>
              </Text>
            </HStack>
          </Box>
          <HStack className="gap-4">
            <Pressable onPress={toggleSearchBar}>
              <Icon
                as={searchBarIsVisible ? SearchX : Search}
                size="lg"
                className="text-typography-600"
              />
            </Pressable>
            <Pressable
              onPress={() =>
                theme$.set((prev) => {
                  if (prev === 'dark') return 'light';
                  else return 'dark';
                })
              }>
              <Icon as={theme === 'dark' ? Sun : Moon} size="lg" className="text-typography-600" />
            </Pressable>
          </HStack>
        </HStack>
      </HStack>
    </React.Fragment>
  );
};
