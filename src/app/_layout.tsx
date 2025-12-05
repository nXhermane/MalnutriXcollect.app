import 'react-native-get-random-values';
import './../../global.css';
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
      }}
    />
  );
}
