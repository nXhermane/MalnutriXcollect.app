import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import React, { createContext, ReactNode, useContext, useEffect, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Appearance, View } from 'react-native';
import { vars } from 'nativewind';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import variables from '@/utils/sizes';
import {
  Lato_700Bold,
  Lato_400Regular,
  Lato_100Thin,
  Lato_300Light_Italic,
  Lato_300Light,
  Lato_900Black,
  Lato_900Black_Italic,
  useFonts,
} from '@expo-google-fonts/lato';
import { theme$ } from '@/store';
import { useValue } from '@legendapp/state/react';
import { ToastProvider } from './Toast';
import { KeyboardProvider } from 'react-native-keyboard-controller';

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
  const [loaded, error] = useFonts({
    SemiBold: Lato_700Bold,
    Medium: Lato_700Bold,
    Regular: Lato_400Regular,
    Thin: Lato_100Thin,
    ExtraLightItalic: Lato_300Light_Italic,
    Light: Lato_300Light,
    LightItalic: Lato_300Light_Italic,
    Bold: Lato_700Bold,
    ExtraBold: Lato_900Black,
    ExtraBoldItalic: Lato_900Black_Italic,
    Black: Lato_900Black,
    BlackItalic: Lato_900Black_Italic,
  });
  const generatedVars = useMemo(() => vars(variables), []);
  const theme = useValue(theme$);
  useEffect(() => {
    Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme) theme$.set(colorScheme);
    });
  }, []);
  return (
    <React.Fragment>
      <StatusBar style="auto" />
      <KeyboardProvider>
        <UIContext.Provider value={{ loaded, error }}>
          <View style={[{ flex: 1, height: '100%', width: '100%' }, generatedVars]}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <GluestackUIProvider mode={theme}>
                <ToastProvider>
                  <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
                </ToastProvider>
              </GluestackUIProvider>
            </GestureHandlerRootView>
          </View>
        </UIContext.Provider>
      </KeyboardProvider>
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
