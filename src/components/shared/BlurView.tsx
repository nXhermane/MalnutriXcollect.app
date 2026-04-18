import { settings$ } from '@/store/settings/settings.store';
import { isDark$ } from '@/store/ui/theme.store';
import { useValue } from '@legendapp/state/react';
import { BlurTargetView, BlurViewProps, BlurView as ExpoBlurView } from 'expo-blur';
import { StyleSheet, View } from 'react-native';

export { BlurTargetView };
export type { BlurViewProps };

interface Props extends Omit<BlurViewProps, 'blurTarget'> {
  blurTarget?: React.RefObject<View | null>;
}

/**
 * Shared BlurView overlay — position absolute, covers parent entirely.
 *
 * Android: pass `blurTarget` (ref to a `BlurTargetView`) for real blur.
 * Without it, falls back to semi-transparent background on Android.
 *
 * Usage with target:
 *   const blurRef = useRef<View>(null);
 *   <BlurTargetView ref={blurRef} style={StyleSheet.absoluteFill}>...</BlurTargetView>
 *   <BlurView blurTarget={blurRef} />
 */
export const BlurView = ({ children, blurTarget, style, ...props }: Props) => {
  const isDark = useValue(() => isDark$.get());
  const blurEnabled = useValue(settings$.ui.blurEnabled);

  if (!blurEnabled) {
    return (
      <View style={[styles.container, style]} className="bg-background/90">
        {children}
      </View>
    );
  }

  return (
    <ExpoBlurView
      style={[styles.container, style]}
      intensity={100}
      tint={isDark ? 'dark' : 'light'}
      blurMethod="dimezisBlurView"
      blurTarget={blurTarget}
      {...props}>
      {children}
    </ExpoBlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
