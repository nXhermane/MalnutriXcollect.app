import { Icon, IconName } from '@/components/shared/icons';
import type { SyncPhaseId } from '@/store/sync/sync-session.store';
import { useEffect } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface SyncProgressViewProps {
  currentPhase: SyncPhaseId;
  currentPhaseMessage: string;
  confirmedPatientIds: string[];
  wifiError: string | null;
  onDisconnect: () => void;
}

const PHASE_ICONS: Record<SyncPhaseId, IconName> = {
  idle: 'Timer',
  wifi_connecting: 'Wifi',
  wifi_ready: 'Wifi',
  tcp_connecting: 'Server',
  handshake: 'Handshake',
  update_locked: 'RefreshCw',
  export_patients: 'Upload',
  export_measures: 'Upload',
  import_patients: 'Download',
  passive_wait: 'MoveHorizontal',
  import_references: 'Database',
  import_tasks: 'ListTodo',
  export_results: 'CloudUpload',
  completed: 'CircleCheckBig',
};

const PHASE_LABELS: Partial<Record<SyncPhaseId, string>> = {
  wifi_connecting: 'Connexion WiFi',
  tcp_connecting: 'Connexion réseau',
  handshake: 'Négociation',
  update_locked: 'Mise à jour distants',
  export_patients: 'Export patients',
  export_measures: 'Export mesures',
  import_patients: 'Import patients',
  passive_wait: 'En attente',
  import_references: 'Import références',
  import_tasks: 'Import tâches',
  export_results: 'Export résultats',
  completed: 'Terminé',
};

export function SyncProgressView({
  currentPhase,
  currentPhaseMessage,
  confirmedPatientIds,
  wifiError,
  onDisconnect,
}: SyncProgressViewProps) {
  const hasError = wifiError !== null;
  const isCompleted = currentPhase === 'completed';

  const rippleScale = useSharedValue(1);
  const rippleOpacity = useSharedValue(0.5);
  const iconScale = useSharedValue(1);
  const prevPhase = useSharedValue(currentPhase);

  useEffect(() => {
    if (!hasError && !isCompleted) {
      rippleScale.value = 1;
      rippleOpacity.value = 0.5;
      rippleScale.value = withRepeat(
        withTiming(1.7, { duration: 1600, easing: Easing.out(Easing.ease) }),
        -1,
        false,
      );
      rippleOpacity.value = withRepeat(
        withTiming(0, { duration: 1600, easing: Easing.out(Easing.ease) }),
        -1,
        false,
      );
    } else {
      rippleScale.value = withTiming(1);
      rippleOpacity.value = withTiming(0);
    }
  }, [hasError, isCompleted, rippleScale, rippleOpacity]);

  useEffect(() => {
    if (prevPhase.value !== currentPhase) {
      iconScale.value = withSequence(
        withTiming(0.65, { duration: 90 }),
        withSpring(1.25, { damping: 5, stiffness: 120 }),
        withSpring(1, { damping: 12, stiffness: 80 }),
      );
      prevPhase.value = currentPhase;
    } else if ((hasError || isCompleted) && iconScale.value === 1) {
      iconScale.value = withSequence(withTiming(1.15, { duration: 150 }), withSpring(1));
    }
  }, [currentPhase, hasError, isCompleted, iconScale, prevPhase]);

  const animatedRippleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rippleScale.value }],
    opacity: rippleOpacity.value,
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const getIconName = (): IconName => {
    if (hasError) return 'WifiOff';
    return PHASE_ICONS[currentPhase] ?? 'Activity';
  };

  const getColor = () => {
    if (hasError)
      return {
        icon: 'text-danger',
        bg: 'bg-danger/10',
        badge: 'bg-danger/10 text-danger',
        border: 'border-danger/20',
      };
    if (isCompleted)
      return {
        icon: 'text-success',
        bg: 'bg-success/10',
        badge: 'bg-success/10 text-success',
        border: 'border-success/20',
      };
    return {
      icon: 'text-accent',
      bg: 'bg-accent/10',
      badge: 'bg-accent/10 text-accent',
      border: 'border-accent/20',
    };
  };

  const colors = getColor();
  const phaseLabel = PHASE_LABELS[currentPhase];

  return (
    <View className="flex-1 px-6 pt-6 pb-8 flex-col">
      <View className="flex-1 items-center justify-center gap-6">
        <View className="items-center justify-center relative">
          <Animated.View
            style={animatedRippleStyle}
            className={`absolute w-32 h-32 rounded-full ${colors.bg}`}
          />
          <Animated.View
            style={animatedIconStyle}
            className={`w-32 h-32 rounded-full items-center justify-center ${colors.bg} z-10`}>
            <Icon name={getIconName()} className={colors.icon} sizeClassName="text-5xl" />
          </Animated.View>
        </View>

        {phaseLabel && (
          <View className={`px-4 py-1.5 rounded-full border ${colors.badge} ${colors.border}`}>
            <Text className={`text-xs font-semibold tracking-wide uppercase ${colors.icon}`}>
              {phaseLabel}
            </Text>
          </View>
        )}

        <View className="items-center gap-1 px-4">
          <Text className="text-foreground text-center text-base font-semibold leading-snug">
            {hasError ? 'Échec de connexion' : currentPhaseMessage}
          </Text>
          {!hasError && !isCompleted && (
            <Text className="text-muted text-xs text-center">
              Synchronisation avec Malnutrix Pro en cours...
            </Text>
          )}
        </View>

        {!hasError && confirmedPatientIds.length > 0 && (
          <View className="flex-row items-center gap-2 bg-success/10 px-5 py-2.5 rounded-full">
            <Icon name="Users" className="text-success" sizeClassName="text-sm" />
            <Text className="text-success text-sm font-semibold">
              {confirmedPatientIds.length} patient{confirmedPatientIds.length > 1 ? 's' : ''}{' '}
              exporté{confirmedPatientIds.length > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>

      <View className="gap-3">
        {hasError && (
          <View className="bg-danger/10 border border-danger/20 rounded-2xl px-4 py-3 flex-row items-start gap-3">
            <Icon name="TriangleAlert" className="text-danger" sizeClassName="text-base" />
            <Text className="text-danger text-sm font-medium flex-1 leading-relaxed">
              {wifiError}
            </Text>
          </View>
        )}

        <Pressable
          onPress={() => {
            if (hasError || isCompleted) {
              onDisconnect();
            } else {
              Alert.alert(
                'Interrompre la synchronisation ?',
                'La synchronisation est en cours. Déconnecter maintenant peut laisser les données dans un état incomplet.',
                [
                  { text: 'Continuer', style: 'cancel' },
                  { text: 'Déconnecter', style: 'destructive', onPress: onDisconnect },
                ],
              );
            }
          }}
          className="w-full border border-danger/25 bg-danger/5 rounded-2xl h-12 items-center justify-center flex-row gap-2 active:opacity-60">
          <Icon
            name={hasError ? 'RefreshCw' : 'WifiOff'}
            className="text-danger"
            sizeClassName="text-sm"
          />
          <Text className="text-danger font-semibold text-sm">
            {hasError ? 'Réessayer' : isCompleted ? 'Fermer' : 'Déconnecter'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
