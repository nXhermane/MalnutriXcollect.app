import { PermissionsAndroid, Platform } from 'react-native';
import Wifi from 'react-native-wifi-reborn';
class WifiManager {
  async connectToDevice(ssid: string, password: string) {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) throw new Error('Permission réfusée');
      }
      await Wifi.connectToProtectedSSID(ssid, password, false, false);
      console.log('Connecté au Wifi.');
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (e) {
      console.error('Echec de la chaine de connexion:', e);
      throw e;
    }
  }
  async disconnect(ssid: string) {
    try {
      await Wifi.disconnectFromSSID(ssid);
    } catch (e) {
      console.log('Déjà déconnecté du Wifi', e);
    }
  }
  isEnabled = Wifi.isEnabled;
  setEnabled = Wifi.setEnabled;
}

export default new WifiManager();
