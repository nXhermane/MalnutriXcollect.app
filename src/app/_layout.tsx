import 'react-native-get-random-values';
import './../../global.css';
import { SplashScreen, Stack } from 'expo-router';
import { UIProvider, useUI } from '@/providers';
import React, { useState } from 'react';
import { SplashScreen as TemporalyOverlay } from '@/components/dashboard/SplashScreen';
import { isCryptoAvailable } from '@/utils/crypto';
import { View, Text } from 'react-native';

export default function RootLayout() {
  if (!isCryptoAvailable()) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, color: 'red', textAlign: 'center' }}>
          ❌ Configuration Error
        </Text>
        <Text style={{ marginTop: 10, textAlign: 'center' }}>
          {__DEV__
            ? 'Please set EXPO_PUBLIC_SECRET_KEY in your .env file'
            : 'Please contact support'}
        </Text>
      </View>
    );
  }
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
        name="sync"
      />
      <Stack.Screen
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
        name="patient_form"
      />
      <Stack.Screen
        options={{
          sheetCornerRadius: 30,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
        name="[id]/index"
      />
      <Stack.Screen
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
        name="[id]/patient_measure_form"
      />
    </Stack>
  );
}
