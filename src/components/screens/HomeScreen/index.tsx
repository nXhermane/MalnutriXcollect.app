import { useLocationPrompt } from '@/hooks/useLocationPrompt';
import { vibrate } from '@/lib/utils/haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { HomeBottom, HomeHeader, LocationPromptSheet, PatientList } from './components';
import { View } from 'react-native';

export function HomeScreen() {
  const scrollY = useSharedValue(0);
  const router = useRouter();

  useLocationPrompt();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <React.Fragment>
      <View className="flex-1 bg-background">
        <HomeHeader scrollY={scrollY} />
        <PatientList
          scrollY={scrollY}
          onScroll={scrollHandler}
          onPatientPress={(id: string) => {
            vibrate('soft');
            router.push({
              pathname: '/patient/[id]',
              params: { id },
            });
          }}
          onPressEmptyStateBtn={() => {
            vibrate('soft');
            router.push('/patient-form');
          }}
        />
        <HomeBottom />
      </View>
      <LocationPromptSheet />
    </React.Fragment>
  );
}
