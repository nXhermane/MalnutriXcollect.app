import { useIsFocused } from 'expo-router';
import { Button, Surface } from 'heroui-native';
import { icons } from 'lucide-react-native';
import { useCallback, useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Icon } from './icons';

function PulseButton({ iconName, onPress }: { iconName: keyof typeof icons; onPress: () => void }) {
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.3);
  const isFocused = useIsFocused();

  const startAnimation = useCallback(() => {
    scale.value = withRepeat(
      withSequence(withTiming(1.08, { duration: 600 }), withTiming(1, { duration: 600 })),
      -1,
      false,
    );
    shadowOpacity.value = withRepeat(
      withSequence(withTiming(0.7, { duration: 600 }), withTiming(0.3, { duration: 600 })),
      -1,
      false,
    );
  }, [scale, shadowOpacity]);

  const stopAnimation = useCallback(() => {
    cancelAnimation(scale);
    cancelAnimation(shadowOpacity);
    scale.value = withTiming(1, { duration: 200 });
    shadowOpacity.value = withTiming(0.3, { duration: 200 });
  }, [scale, shadowOpacity]);

  useEffect(() => {
    if (isFocused) {
      startAnimation();
    } else {
      stopAnimation();
    }
  }, [isFocused, startAnimation, stopAnimation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: shadowOpacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Button onPress={onPress} className="h-v-14 w-v-14 rounded-full" isIconOnly>
        <Icon name={iconName} size={24} className="text-white h-5 w-5" />
      </Button>
    </Animated.View>
  );
}

export function EmptyState({
  iconName,
  title,
  description,
  onPressIcon,
  isAnimated = false,
  children,
}: {
  iconName: keyof typeof icons;
  title: string;
  description: string;
  onPressIcon?: () => void;
  isAnimated?: boolean;
  children?: React.ReactNode | React.ReactElement;
}) {
  return (
    <Surface className="p-8 text-center shadow-sm">
      <View className="gap-4 justify-center items-center">
        {!onPressIcon ? (
          <View className="flex h-v-14 w-v-14 items-center justify-center rounded-full bg-accent-soft">
            <Icon name={iconName} size={24} className="text-accent h-5 w-5" />
          </View>
        ) : isAnimated ? (
          <PulseButton iconName={iconName} onPress={onPressIcon} />
        ) : (
          <Button onPress={onPressIcon} className="h-v-14 w-v-14 rounded-full" isIconOnly>
            <Icon name={iconName} size={24} className="text-white h-5 w-5" />
          </Button>
        )}
        <View className="flex flex-col items-center justify-center">
          <Text className="mb-1 text-center font-body text-sm text-muted">{title}</Text>
          <Text className="text-center font-body text-xs text-muted">{description}</Text>
        </View>
      </View>
      {children && children}
    </Surface>
  );
}
