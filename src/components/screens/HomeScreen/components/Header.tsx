import { BlurView } from '@/components/shared/BlurView';
import { Icon } from '@/components/shared/icons';
import { currentTime } from '@/lib/observables/current-time';
import { vibrate } from '@/lib/utils/haptics';
import { home$ } from '@/store/ui/home.store';
import { userProfile$ } from '@/store/user/user.store';
import { useValue } from '@legendapp/state/react';
import { useRouter } from 'expo-router';
import { Avatar, PressableFeedback, SearchField } from 'heroui-native';
import React, { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  Extrapolation,
  FadeInDown,
  FadeOutUp,
  LinearTransition,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const HEADER_EXPANDED_HEIGHT = 180;
export const HEADER_COLLAPSED_HEIGHT = 68;
export const SCROLL_THRESHOLD = 100;

const ANIMATION_CONFIG = { duration: 200, easing: Easing.out(Easing.cubic) };

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bonjour';
  if (h < 18) return 'Bon après-midi';
  return 'Bonsoir';
}

function getFirstName(fullName?: string | null): string {
  if (!fullName) return '';
  return fullName.split(' ')[0];
}

function getTodayLabel(): string {
  return new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function AnimatedDigit({ digit }: { digit: string }) {
  const prevDigit = useRef(digit);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (prevDigit.current === digit) return;
    prevDigit.current = digit;
    translateY.value = withTiming(-8, { duration: 80, easing: Easing.in(Easing.ease) }, () => {
      translateY.value = 8;
      opacity.value = 0;
      translateY.value = withTiming(0, { duration: 80, easing: Easing.out(Easing.ease) });
      opacity.value = withTiming(1, { duration: 80 });
    });
  }, [digit, translateY, opacity]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text style={style} className="text-xs font-light text-muted tabular-nums">
      {digit}
    </Animated.Text>
  );
}

function LiveClock() {
  const now = useValue(currentTime);
  const date = new Date(now);
  const hh = date.getHours().toString().padStart(2, '0');
  const mm = date.getMinutes().toString().padStart(2, '0');

  return (
    <View className="flex-row items-center gap-1">
      <Icon name="Clock" sizeClassName="text-xs" className="text-muted" />
      <View className="flex-row items-center overflow-hidden">
        <AnimatedDigit digit={hh[0]} />
        <AnimatedDigit digit={hh[1]} />
        <Text className="text-xs font-light text-muted mx-px">:</Text>
        <AnimatedDigit digit={mm[0]} />
        <AnimatedDigit digit={mm[1]} />
      </View>
    </View>
  );
}

interface HomeHeaderProps {
  scrollY: SharedValue<number>;
}

export const HomeHeader = ({ scrollY }: HomeHeaderProps) => {
  const profile = useValue(userProfile$);
  const showSearchBar = useValue(() => home$.showSearchBar.get());
  const searchQuery = useValue(() => home$.searchQuery.get());
  const { top } = useSafeAreaInsets();
  const startY = useSharedValue(0);
  const router = useRouter();

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startY.value = scrollY.value;
    })
    .onUpdate((event) => {
      const extra = showSearchBar ? 70 : 0;
      const newValue = startY.value - event.translationY;
      scrollY.value = Math.max(0, Math.min(newValue, SCROLL_THRESHOLD + extra));
    })
    .onEnd((event) => {
      const extra = showSearchBar ? 70 : 0;
      if (event.velocityY < -300 || scrollY.value > (SCROLL_THRESHOLD + extra) / 2) {
        scrollY.value = withTiming(SCROLL_THRESHOLD + extra, ANIMATION_CONFIG);
      } else {
        scrollY.value = withTiming(0, ANIMATION_CONFIG);
      }
    });

  const animatedContainerStyle = useAnimatedStyle(() => {
    const extra = showSearchBar ? 70 : 0;
    return {
      height: interpolate(
        scrollY.value,
        [0, SCROLL_THRESHOLD + extra],
        [HEADER_EXPANDED_HEIGHT + extra, HEADER_COLLAPSED_HEIGHT + top],
        Extrapolation.CLAMP,
      ),
      borderBottomLeftRadius: interpolate(
        scrollY.value,
        [0, SCROLL_THRESHOLD],
        [24, 12],
        Extrapolation.CLAMP,
      ),
      borderBottomRightRadius: interpolate(
        scrollY.value,
        [0, SCROLL_THRESHOLD],
        [24, 12],
        Extrapolation.CLAMP,
      ),
    };
  });

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD * 0.4, SCROLL_THRESHOLD * 0.7],
      [1, 0, 0],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, SCROLL_THRESHOLD],
          [0, -30],
          Extrapolation.CLAMP,
        ),
      },
    ],
    display: scrollY.value > SCROLL_THRESHOLD ? 'none' : 'flex',
  }));

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(scrollY.value, [0, SCROLL_THRESHOLD], [1, 0.92], Extrapolation.CLAMP) },
      {
        translateY: interpolate(scrollY.value, [0, SCROLL_THRESHOLD], [0, 3], Extrapolation.CLAMP),
      },
    ],
  }));

  const animatedActionsStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(scrollY.value, [0, SCROLL_THRESHOLD], [0, 5], Extrapolation.CLAMP),
      },
      { scale: interpolate(scrollY.value, [0, SCROLL_THRESHOLD], [1, 0.9], Extrapolation.CLAMP) },
    ],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        className="absolute top-0 left-0 right-0 overflow-hidden z-50"
        style={[animatedContainerStyle, { paddingTop: top }]}>
        <BlurView />
        <View className="flex-1 px-4 pb-4">
          <View className="flex-row items-center justify-between h-v-16">
            <Animated.View style={animatedLogoStyle} className="flex-row ">
              <Text className="text-2xl font-bold tracking-tighter text-accent">MalnutriX</Text>
              <Text className="font-light ml-1 text-sm text-muted/70 top-0">collect</Text>
            </Animated.View>

            <Animated.View style={animatedActionsStyle} className="gap-3 flex-row items-center">
              <PressableFeedback
                onPress={() => home$.showSearchBar.set((prev) => !prev)}
                className={`size-v-8 items-center justify-center rounded-2xl ${
                  showSearchBar
                    ? 'bg-accent shadow-lg shadow-accent/20'
                    : 'bg-surface/90 border border-border/20 shadow-sm'
                }`}>
                {!showSearchBar ? (
                  <Icon name="Search" className="text-muted h-5 w-5" />
                ) : (
                  <Icon name="X" className="text-white h-5 w-5" />
                )}
              </PressableFeedback>
              <PressableFeedback
                onPress={() => {
                  vibrate('soft');
                  router.push('/settings');
                }}>
                <Avatar
                  className="size-v-8 rounded-2xl ring-2 ring-accent/20"
                  alt={profile?.display_name || 'User'}>
                  {profile?.avatar_url ? (
                    <Avatar.Image source={{ uri: profile.avatar_url }} />
                  ) : null}
                  {profile?.display_name && (
                    <Avatar.Fallback className="bg-accent/10">
                      <Text className="text-accent font-black text-xs">
                        {profile.display_name
                          .split(' ')
                          .map((n, i) => (i <= 1 ? n.charAt(0).toUpperCase() : ''))
                          .join('')}
                      </Text>
                    </Avatar.Fallback>
                  )}
                </Avatar>
              </PressableFeedback>
            </Animated.View>
          </View>

          <Animated.View style={animatedContentStyle} className="gap-4 flex-1">
            <View>
              <View className="flex-row items-center justify-between mb-1">
                <View className="flex-row items-center gap-1.5">
                  <Icon name="CalendarDays" sizeClassName="text-xs" className="text-muted" />

                  <Text className="text-muted text-xs font-light capitalize">
                    {getTodayLabel()}
                  </Text>
                </View>
                <LiveClock />
              </View>
              <Text className="text-foreground text-xl font-bold">
                {getGreeting()}
                {profile?.display_name ? `, ${getFirstName(profile.display_name)}` : ''}
              </Text>
            </View>

            {showSearchBar && (
              <Animated.View
                layout={LinearTransition}
                entering={FadeInDown.duration(300)}
                exiting={FadeOutUp.duration(200)}
                className="w-full">
                <SearchField
                  value={searchQuery}
                  onChange={(text: string) => home$.searchQuery.set(text)}>
                  <SearchField.Group>
                    <SearchField.SearchIcon />
                    <SearchField.Input placeholder="Chercher un patient par nom..." autoFocus />
                    <SearchField.ClearButton />
                  </SearchField.Group>
                </SearchField>
              </Animated.View>
            )}
          </Animated.View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};
