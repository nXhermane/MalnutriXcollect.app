import React from 'react';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { Pressable } from '../ui/pressable';
import { Icon } from '../ui/icon';
import { Camera, ScanQrCode, Search, SearchX } from 'lucide-react-native';

export const Header = ({
  searchBarIsVisible = false,
  toggleSearchBar,
}: {
  toggleSearchBar?: () => void;
  searchBarIsVisible?: boolean;
}) => {
  return (
    <React.Fragment>
      <HStack
        className={
          'p-safe dark:elevation-md h-v-18 w-full items-center justify-between bg-background-0'
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
            <Pressable onPress={() => alert('Show the camera bottom sheet')}>
              <Icon as={ScanQrCode} size="md" className="text-typography-600" />
            </Pressable>
            <Pressable onPress={toggleSearchBar}>
              <Icon
                as={searchBarIsVisible ? SearchX : Search}
                size="md"
                className="text-typography-600"
              />
            </Pressable>
          </HStack>
        </HStack>
      </HStack>
    </React.Fragment>
  );
};
