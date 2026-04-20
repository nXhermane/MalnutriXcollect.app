import { settings$ } from '@/store/settings/settings.store';
import * as Haptics from 'expo-haptics';

export const vibrate = (type: 'soft' | 'medium' | 'heavy' = 'soft') => {
  if (!settings$.haptics.enabled.peek()) return;
  const map = {
    soft: Haptics.ImpactFeedbackStyle.Light,
    medium: Haptics.ImpactFeedbackStyle.Medium,
    heavy: Haptics.ImpactFeedbackStyle.Heavy,
  };
  Haptics.impactAsync(map[type]).catch(() => null);
};

export const vibrateSuccess = () => {
  if (!settings$.haptics.enabled.peek()) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => null);
};
export const vibrateError = () => {
  if (!settings$.haptics.enabled.peek()) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => null);
};
export const vibrateWarning = () => {
  if (!settings$.haptics.enabled.peek()) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => null);
};
