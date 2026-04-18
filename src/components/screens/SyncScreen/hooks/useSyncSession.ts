import { logger } from '@/lib/utils/logger';
import { decodeSyncQR } from '@/lib/utils/sync-qr';
import { syncSessionService } from '@/services/sync/sync-session.service';
import {
  connectToDevice,
  disconnect as disconnectWifi,
} from '@/services/wifi-manager/wifi-manager';
import { sync_session_state$ } from '@/store/sync/sync-session.store';
import { useValue } from '@legendapp/state/react';
import { useCallback, useRef, useState } from 'react';

export type PhaseStatus = 'pending' | 'active' | 'done' | 'error';

type WifiStep = 'idle' | 'connecting_wifi' | 'wifi_ready' | 'error';

export function useSyncSession() {
  const sessionState = useValue(sync_session_state$);
  const [wifiStep, setWifiStep] = useState<WifiStep>('idle');
  const [wifiError, setWifiError] = useState<string | null>(null);

  const ssidRef = useRef<string | null>(null);
  const scannedRef = useRef(false);

  const handleScan = useCallback(async (raw: string) => {
    if (scannedRef.current) return;

    const info = decodeSyncQR(raw);
    if (!info) {
      logger.warn('[useSyncSession] QR code invalide ou format inconnu.');
      return;
    }

    scannedRef.current = true;
    ssidRef.current = info.ssid;
    setWifiError(null);

    try {
      setWifiStep('connecting_wifi');
      sync_session_state$.currentPhase.set('wifi_connecting');
      sync_session_state$.currentPhaseMessage.set('Connexion au réseau WiFi...');
      logger.debug(`[useSyncSession] Connexion au réseau WiFi : ${info.ssid} ${info.password}`);
      logger.info(`[useSyncSession] Connexion au réseau WiFi : ${info.ssid}`);
      await connectToDevice(info.ssid, info.password);
      setWifiStep('wifi_ready');
      sync_session_state$.currentPhase.set('tcp_connecting');
      sync_session_state$.currentPhaseMessage.set('Ouverture de la connexion réseau...');
      logger.info('[useSyncSession] WiFi connecté. Démarrage de la session TCP…');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erreur inconnue';
      logger.error('[useSyncSession] Échec connexion WiFi :', e);
      setWifiError(msg);
      setWifiStep('error');
      scannedRef.current = false;
      return;
    }

    syncSessionService.start(info.host, info.port);
  }, []);

  const handleDisconnect = useCallback(async () => {
    syncSessionService.disconnect();

    if (ssidRef.current) {
      logger.info(`[useSyncSession] Déconnexion du réseau WiFi : ${ssidRef.current}`);
      await disconnectWifi(ssidRef.current);
      ssidRef.current = null;
    }

    scannedRef.current = false;
    setWifiStep('idle');
    setWifiError(null);
  }, []);

  const { isConnected, confirmedPatientIds, lastSyncTimestamp, currentPhase, currentPhaseMessage } =
    sessionState;

  const isSessionActive = wifiStep !== 'idle' || isConnected;

  return {
    isConnected,
    isSessionActive,
    wifiStep,
    wifiError,
    lastSyncTimestamp,
    confirmedPatientIds,
    currentPhase,
    currentPhaseMessage,
    handleScan,
    handleDisconnect,
  };
}
