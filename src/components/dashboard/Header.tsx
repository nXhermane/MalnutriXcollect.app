import React from 'react';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { Pressable } from '../ui/pressable';
import { Icon } from '../ui/icon';
import { Search, Sun, Moon, X } from 'lucide-react-native';
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
      <HStack className={'p-safe h-v-18 w-full items-center justify-between bg-card shadow-sm'}>
        <HStack className={'w-full items-center justify-between px-4 pb-2'}>
          <Box>
            <HStack className="items-center">
              <Text className="font-h3 text-xl  font-semibold text-emerald-600 dark:text-emerald-400">
                MalnutriX
                <Text className="font-light text-xs text-muted-foreground">collect</Text>
              </Text>
            </HStack>
          </Box>
          <HStack className="gap-4">
            <Pressable
              onPress={toggleSearchBar}
              className={`size-9 items-center justify-center rounded-lg transition-colors ${
                searchBarIsVisible ? 'bg-green-50 dark:bg-green-950 ' : ''
              }`}>
              <Icon
                as={searchBarIsVisible ? X : Search}
                size="lg"
                className={`${
                  searchBarIsVisible
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-muted-foreground'
                }`}
              />
            </Pressable>
            <Pressable
              onPress={() =>
                theme$.set((prev) => {
                  if (prev === 'dark') return 'light';
                  else return 'dark';
                })
              }
              className="size-9 items-center justify-center rounded-lg">
              <Icon
                as={theme === 'dark' ? Sun : Moon}
                size="lg"
                className="text-muted-foreground"
              />
            </Pressable>
          </HStack>
        </HStack>
      </HStack>
    </React.Fragment>
  );
};
