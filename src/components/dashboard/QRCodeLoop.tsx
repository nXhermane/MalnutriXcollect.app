import { VStack } from '../ui/vstack';
import { useEffect } from 'react';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnUI } from 'react-native-worklets';
import { AnimatedQRItem } from './AnimatedQRItem';

const INTERVAL_MS = 1000;
export function QrCodeLoop({ frames }: { frames: string[] }) {
  const currentIndex = useSharedValue(0);
  function animateLoop() {
    'worklet';
    const nextIndex = (currentIndex.value + 1) % frames.length;
    currentIndex.value = withTiming(
      nextIndex,
      // Turn animation 30 fps
      { duration: INTERVAL_MS / 30, easing: Easing.linear },
      (finished) => {
        'worklet';
        if (finished) {
          animateLoop();
        }
      },
    );
  }
  useEffect(() => {
    const timerId = setTimeout(() => {
      scheduleOnUI(animateLoop);
    }, INTERVAL_MS);
    return () => clearTimeout(timerId);
  });

  return (
    <VStack className="size-60 items-center justify-center bg-white  p-1">
      {frames.map((data, index) => {
        return (
          <AnimatedQRItem
            currentIndex={currentIndex}
            index={index}
            value={data}
            size={220}
            key={index}
          />
        );
      })}
    </VStack>
  );
}
