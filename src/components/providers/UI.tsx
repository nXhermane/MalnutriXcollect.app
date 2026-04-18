import { useFonts } from '@/hooks/useFonts';
import { isDark$, theme$ } from '@/store/ui/theme.store';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useValue } from '@legendapp/state/react';
import { HeroUINativeProvider } from 'heroui-native';
import React, { createContext, ReactNode, useCallback, useContext, useEffect } from 'react';
import { Appearance, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardAvoidingView, KeyboardProvider } from 'react-native-keyboard-controller';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { Uniwind } from 'uniwind';
import { StatusBar } from 'expo-status-bar';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export interface UIContextType {
  loaded: boolean;
  error: Error | null;
}

export const UIContext = createContext<UIContextType>({
  loaded: true,
  error: null,
} as UIContextType);

export interface UIContextProviderProps {
  children: ReactNode;
}

export const UIProvider: React.FC<UIContextProviderProps> = ({ children }) => {
  const isDark = useValue(() => isDark$.get());
  const { loaded: fontsLoaded } = useFonts();

  const contentWrapper = useCallback(
    (children: React.ReactNode) => (
      <KeyboardAvoidingView
        pointerEvents="box-none"
        behavior="padding"
        keyboardVerticalOffset={12}
        className="flex-1">
        {children}
      </KeyboardAvoidingView>
    ),
    [],
  );
  useEffect(() => {
    Uniwind.setTheme(isDark ? 'dark' : 'light');
  }, [isDark]);
  useEffect(() => {
    const subscribe = Appearance.addChangeListener(({ colorScheme }) => {
      if (theme$.get().isSystem && colorScheme !== 'unspecified') {
        theme$.mode.set(colorScheme);
      }
    });
    return () => subscribe.remove();
  }, []);

  return (
    <React.Fragment>
      <StatusBar style="auto" />

      <UIContext.Provider value={{ loaded: fontsLoaded, error: null }}>
        <KeyboardProvider>
          <GestureHandlerRootView style={styles.container}>
            <HeroUINativeProvider
              config={{
                toast: {
                  contentWrapper,
                },
              }}>
              <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
            </HeroUINativeProvider>
          </GestureHandlerRootView>
        </KeyboardProvider>
      </UIContext.Provider>
    </React.Fragment>
  );
};

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within UIProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
