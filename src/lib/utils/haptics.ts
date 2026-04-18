import * as Haptics from 'expo-haptics';

export const vibrate = (type: 'soft' | 'medium' | 'heavy' = 'soft') => {
  const map = {
    soft: Haptics.ImpactFeedbackStyle.Light,
    medium: Haptics.ImpactFeedbackStyle.Medium,
    heavy: Haptics.ImpactFeedbackStyle.Heavy,
  };
  Haptics.impactAsync(map[type]).catch(() => null);
};

export const vibrateSuccess = () =>
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => null);

export const vibrateError = () =>
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => null);

export const vibrateWarning = () =>
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => null);
