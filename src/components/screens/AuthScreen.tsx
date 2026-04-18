import { AppLogo } from '@/components/shared/AppLogo';
import { MeshGradientBackground } from '@/components/shared/MeshGradientBackground';
import { GoogleIcon } from '@/components/shared/icons/GoogleIcon';
import { useToast } from '@/hooks/useToast';
import { signInWithGoogle } from '@/services/supabase';
import { Button, LinkButton } from 'heroui-native';
import { useCallback, useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { BlurView } from '../shared/BlurView';

export function AuthScreen() {
  const toast = useToast();
  const logoTranslationY = useSharedValue(0);

  useEffect(() => {
    logoTranslationY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [logoTranslationY]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: logoTranslationY.value }],
  }));

  const login = useCallback(async () => {
    const result = await signInWithGoogle();
    if (result.error) {
      toast.show('Error', 'Erreur de connexion', result.error);
    }
  }, [toast]);

  return (
    <View className="flex-1 overflow-hidden bg-background">
      <MeshGradientBackground />

      <View className="flex-[0.6] items-center justify-center">
        <Animated.View style={logoAnimatedStyle} className="items-center">
          <AppLogo style={{ width: 128, height: 128 }} />
          <View className="mt-6 flex-row items-start">
            <Text className="text-4xl font-bold text-foreground">MalnutriX</Text>
            <Text className="ml-1 text-lg font-light text-accent">collect</Text>
          </View>
        </Animated.View>
      </View>

      <View className="flex-[0.4] justify-end px-4 pb-10">
        <BlurView />
        <View className="overflow-hidden rounded-[40px] border border-border/50 shadow-2xl">
          <View className="px-4 py-8">
            <View className="mb-8 items-center gap-y-2">
              <Text className="text-center text-2xl font-bold text-foreground">
                Collecte & Soin
              </Text>
              <Text className="px-4 text-center text-base leading-relaxed text-muted">
                Connectez-vous pour enregistrer et partager les données patients.
              </Text>
            </View>

            <Button
              onPress={login}
              className="h-14 rounded-2xl border border-border/20 bg-surface shadow-sm">
              <GoogleIcon />
              <Button.Label className="ml-2 font-semibold text-foreground">
                Continuer avec Google
              </Button.Label>
            </Button>

            <View className="mt-8">
              <Text className="px-8 text-center text-xs font-light leading-5 text-muted">
                En continuant, vous acceptez nos{' '}
                <LinkButton>
                  <LinkButton.Label className="text-xs font-light">
                    {"conditions d'utilisation"}
                  </LinkButton.Label>
                </LinkButton>
              </Text>
            </View>
          </View>
        </View>

        <Text className="mt-8 text-center text-2xs font-light text-muted">
          {'© 2025 Malnutrix — Tous droits réservés'}
        </Text>
      </View>
    </View>
  );
}
