import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from '@/components/shared/BlurView';
import { Icon } from '@/components/shared/icons';
import { vibrate } from '@/lib/utils/haptics';
import { Camera } from 'react-native-vision-camera';
import { QRScannerSheet } from './components/QRScannerSheet';
import { SyncIdleView } from './components/SyncIdleView';
import { SyncProgressView } from './components/SyncProgressView';
import { useSyncSession } from './hooks/useSyncSession';
import { logger } from '@/lib/utils/logger';

export function SyncScreen() {
  const [scannerOpen, setScannerOpen] = useState(false);
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const {
    isSessionActive,
    wifiError,
    lastSyncTimestamp,
    confirmedPatientIds,
    currentPhase,
    currentPhaseMessage,
    handleScan,
    handleDisconnect,
  } = useSyncSession();

  useEffect(() => {
    Camera.requestCameraPermission();
  }, []);

  const handleScanResult = (raw: string) => {
    logger.info('Scan result: ' + raw);
    setScannerOpen(false);
    handleScan(raw);
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: top }}>
      <View className="absolute z-30 w-full overflow-hidden" style={{ top }}>
        <BlurView />
        <View className="flex-row items-center gap-3 px-4 pb-2 pt-2">
          <Pressable
            className="bg-surface/80 p-3 rounded-2xl shadow-sm active:bg-surface"
            accessibilityLabel="Retour"
            onPress={() => {
              vibrate('soft');
              router.back();
            }}>
            <Icon name="ArrowLeft" sizeClassName="text-lg" className="text-foreground" />
          </Pressable>

          <View className="flex-1 bg-surface/80 h-12 rounded-2xl shadow-sm items-center justify-center px-4">
            <Text className="text-foreground text-base font-bold tracking-tight" numberOfLines={1}>
              Synchronisation
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-1 mt-16">
        {isSessionActive ? (
          <SyncProgressView
            currentPhase={currentPhase}
            currentPhaseMessage={currentPhaseMessage}
            confirmedPatientIds={confirmedPatientIds}
            wifiError={wifiError}
            onDisconnect={handleDisconnect}
          />
        ) : (
          <SyncIdleView
            onScanPress={() => setScannerOpen(true)}
            lastSyncTimestamp={lastSyncTimestamp}
          />
        )}
      </View>

      <QRScannerSheet
        isOpen={scannerOpen}
        onScan={handleScanResult}
        onClose={() => setScannerOpen(false)}
      />
    </View>
  );
}
