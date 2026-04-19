import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { AppLogo } from '../shared/AppLogo';
import { MeshGradientBackground } from '../shared/MeshGradientBackground';

export function SplashScreen() {
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

  return (
    <View className="flex-1 items-center justify-center overflow-hidden bg-background">
      <MeshGradientBackground />
      <Animated.View style={logoAnimatedStyle} className="items-center">
        <AppLogo style={{ width: 128, height: 128 }} />
      </Animated.View>
      <View className="absolute bottom-12 items-center">
        <View className="flex-row items-start">
          <Text className="text-2xl font-bold text-foreground tracking-tighter">MalnutriX</Text>
          <Text className="ml-1 text-xs font-light text-accent">collect</Text>
        </View>
      </View>
    </View>
  );
}
