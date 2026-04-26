import { logger } from '@/lib/utils/logger';
import { PermissionsAndroid, Platform } from 'react-native';
import Wifi from 'react-native-wifi-reborn';

export async function connectToDevice(ssid: string, password: string) {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) throw new Error('Permission réfusée');
    }
    await Wifi.connectToProtectedSSID(ssid, password, false, false);
    logger.info('Connected!.');
    await new Promise((resolve) => setTimeout(resolve, 2000));
  } catch (e) {
    logger.error('Failed to connect to wifi:', e);
    throw e;
  }
}

export async function disconnect(ssid: string): Promise<void> {
  try {
    await Wifi.disconnectFromSSID(ssid);
    logger.info(`[WifiManager] Disconnected from ${ssid}`);
  } catch (e) {
    logger.debug('[WifiManager] Disconnect attempt (already disconnected or not found):', e);
  }
}

export const isEnabled = Wifi.isEnabled;
export const setEnabled = Wifi.setEnabled;
