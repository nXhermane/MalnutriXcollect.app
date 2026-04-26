import { BlurView } from '@/components/shared/BlurView';
import { Icon } from '@/components/shared/icons';
import { vibrate } from '@/lib/utils/haptics';
import { logger } from '@/lib/utils/logger';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Camera } from 'react-native-vision-camera';
import { QRScannerSheet } from './components/QRScannerSheet';
import { SyncDebugPanel } from './components/SyncDebugPanel';
import { SyncIdleView } from './components/SyncIdleView';
import { SyncProgressView } from './components/SyncProgressView';
import { useSyncSession } from './hooks/useSyncSession';

export function SyncScreen() {
  const [scannerOpen, setScannerOpen] = useState(false);
  const autoOpenedRef = useRef(false);
  const router = useRouter();
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

  useEffect(() => {
    if (isSessionActive || autoOpenedRef.current) return;
    const timer = setTimeout(() => {
      autoOpenedRef.current = true;
      setScannerOpen(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isSessionActive]);

  const handleScanResult = (raw: string) => {
    logger.info('Scan result: ' + raw);
    setScannerOpen(false);
    handleScan(raw);
  };

  return (
    <View className="flex-1 bg-background pb-safe-offset-0 pt-safe-offset-0">
      <View className="absolute z-30 w-full overflow-hidden pt-safe-offset-0">
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

      <View className="flex-1 mt-v-16">
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

      {__DEV__ && <SyncDebugPanel />}

      <QRScannerSheet
        isOpen={scannerOpen}
        onScan={handleScanResult}
        onClose={() => setScannerOpen(false)}
      />
    </View>
  );
}
