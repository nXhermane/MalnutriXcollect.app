import { UIProvider, useUI } from '@/components/providers/UI';
import { SplashScreen } from '@/components/screens/SplashScreen';
import { theme_uni_sizes } from '@/config/theme';
import '@/global.css';
import { useAuthState } from '@/hooks/useAuthState';
import { seedRegistryWithBuiltins } from '@/store/registry/registry.seed';
import { isAccountActive$ } from '@/store/user/user.store';
import { useValue } from '@legendapp/state/react';
import { SplashScreen as ExpoSplashScreen, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import 'react-native-get-random-values';
import { Uniwind } from 'uniwind';

ExpoSplashScreen.preventAutoHideAsync();

Uniwind.updateCSSVariables('light', theme_uni_sizes);
Uniwind.updateCSSVariables('dark', theme_uni_sizes);

seedRegistryWithBuiltins();

export default function RootLayout() {
  return (
    <UIProvider>
      <Main />
    </UIProvider>
  );
}

function Main() {
  const { loaded } = useUI();
  const [minDelayDone, setMinDelayDone] = useState(false);
  const { isLoggedIn } = useAuthState();
  const isAccountActive = useValue(() => isAccountActive$.get());

  useEffect(() => {
    if (!loaded) return;
    ExpoSplashScreen.hide();
    const timer = setTimeout(() => setMinDelayDone(true), 500);
    return () => clearTimeout(timer);
  }, [loaded]);

  if (!loaded || !minDelayDone) {
    return <SplashScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isLoggedIn && isAccountActive}>
        <Stack.Screen name="index" />
        <Stack.Screen name="patient-form" />
        <Stack.Screen name="sync" />
        <Stack.Screen name="settings" />
      </Stack.Protected>

      <Stack.Protected guard={isLoggedIn && !isAccountActive}>
        <Stack.Screen name="deactivated" />
      </Stack.Protected>

      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="auth" />
      </Stack.Protected>
    </Stack>
  );
}
