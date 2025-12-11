import 'react-native-get-random-values';
import './../../global.css';
import 'cbor-rn-prereqs';
import { SplashScreen, Stack } from 'expo-router';
import { UIProvider, useUI } from '@/providers';
import React, { useState } from 'react';
import { SplashScreen as TemporalyOverlay } from '@/components/dashboard/SplashScreen';

export default function RootLayout() {
  return (
    <UIProvider>
      <Main />
    </UIProvider>
  );
}

function Main() {
  const { error, loaded } = useUI();
  const [showTempOverlay, setShowTempOverlay] = useState<boolean>(true);

  React.useEffect(() => {
    if (!loaded) return;
    SplashScreen.hide();
    const overlayTimerId = setTimeout(() => {
      setShowTempOverlay(false);
    }, 2000);

    return () => clearTimeout(overlayTimerId);
  }, [loaded]);

  if (error) {
    console.error(error);
    return null;
  }

  return showTempOverlay ? (
    <TemporalyOverlay />
  ) : (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        options={{
          sheetCornerRadius: 30,
          presentation: 'formSheet',
          animation: 'slide_from_bottom',
          sheetElevation: 0,
        }}
        name="import_patients"
      />
      <Stack.Screen
        options={{
          sheetCornerRadius: 30,
          presentation: 'formSheet',
          animation: 'slide_from_bottom',
          sheetElevation: 0,
        }}
        name="export_patients"
      />
      <Stack.Screen
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
        name="add_patient"
      />
      <Stack.Screen
        options={{
          sheetCornerRadius: 30,
          presentation: 'formSheet',
          animation: 'slide_from_bottom',
          sheetElevation: 0,
        }}
        name="[id]/index"
      />
      <Stack.Screen
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
        name="[id]/add_measure_to_patient"
      />
    </Stack>
  );
}
