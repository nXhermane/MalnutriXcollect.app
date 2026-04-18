import { Icon } from '@/components/shared/icons';
import { Button } from 'heroui-native';
import { Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface SyncIdleViewProps {
  onScanPress: () => void;
  lastSyncTimestamp: number | null;
}

const STEPS = [
  { icon: 'Smartphone' as const, label: 'Ouvrez Malnutrix Pro sur le téléphone du nutritionniste' },
  { icon: 'QrCode' as const, label: 'Scannez le QR Code affiché sur son écran' },
  { icon: 'RefreshCw' as const, label: 'La synchronisation démarrera automatiquement' },
] as const;

export function SyncIdleView({ onScanPress, lastSyncTimestamp }: SyncIdleViewProps) {
  const lastSync = lastSyncTimestamp
    ? new Date(lastSyncTimestamp).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  // Rotating scanner animation
  const rotation = useSharedValue(0);
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 6000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [rotation]);

  const animatedRotate = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View className="flex-1 px-6 pt-4 pb-8 flex-col gap-8">
      <View className="flex-1 items-center justify-center gap-6">
        <View className="relative items-center justify-center">
          <View className="w-36 h-36 rounded-full bg-accent/10 items-center justify-center">
            <Icon name="Wifi" className="text-accent" sizeClassName="text-5xl" />
          </View>
          <Animated.View
            style={[animatedRotate, { position: 'absolute', width: 152, height: 152 }]}
            className="rounded-full border-2 border-dashed border-accent/30"
          />
        </View>

        <View className="items-center gap-2">
          <Text className="text-foreground text-2xl font-bold tracking-tight text-center">
            Prêt à synchroniser
          </Text>
          <Text className="text-muted text-sm text-center leading-relaxed max-w-64">
            Connectez-vous au poste nutritionniste pour transférer les données patients.
          </Text>
        </View>

        <View className="flex-row items-center gap-2 bg-surface px-4 py-2 rounded-full">
          <Icon
            name={lastSync ? 'Clock' : 'CircleAlert'}
            className={lastSync ? 'text-muted' : 'text-warning'}
          />
          <Text className={`text-xs font-medium ${lastSync ? 'text-muted' : 'text-warning'}`}>
            {lastSync ? `Dernière sync : ${lastSync}` : 'Aucune synchronisation effectuée'}
          </Text>
        </View>
      </View>

      <View className="bg-surface rounded-3xl px-5 py-4 gap-4">
        <Text className="text-foreground text-sm font-semibold">Comment procéder ?</Text>
        {STEPS.map((step, index) => (
          <View key={index} className="flex-row items-center gap-3">
            <View className="w-8 h-8 rounded-xl bg-accent/10 items-center justify-center shrink-0">
              <Icon name={step.icon} className="text-accent" sizeClassName="text-sm" />
            </View>
            <Text className="text-muted text-xs leading-relaxed flex-1">{step.label}</Text>
          </View>
        ))}
      </View>

      {/* CTA Button */}
      <Button onPress={onScanPress} size="lg" className="w-full">
        <Icon name="QrCode" className="text-white" sizeClassName="text-lg" />
        <Button.Label className="text-white font-semibold text-base">
          Scanner le QR Code
        </Button.Label>
      </Button>
    </View>
  );
}
