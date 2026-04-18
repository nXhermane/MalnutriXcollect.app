import {
  Lato_100Thin,
  Lato_100Thin_Italic,
  Lato_300Light,
  Lato_300Light_Italic,
  Lato_400Regular,
  Lato_700Bold,
  Lato_700Bold_Italic,
  Lato_900Black,
  Lato_900Black_Italic,
  useFonts as useExpoFonts,
} from '@expo-google-fonts/lato';

export function useFonts() {
  const [loaded, error] = useExpoFonts({
    'Lato-Thin': Lato_100Thin,
    'Lato-ThinItalic': Lato_100Thin_Italic,
    'Lato-Light': Lato_300Light,
    'Lato-LightItalic': Lato_300Light_Italic,
    'Lato-Regular': Lato_400Regular,
    'Lato-Bold': Lato_700Bold,
    'Lato-BoldItalic': Lato_700Bold_Italic,
    'Lato-Black': Lato_900Black,
    'Lato-BlackItalic': Lato_900Black_Italic,
  });

  return { loaded, error };
}
