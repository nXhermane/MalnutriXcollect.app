import WifiManager from '@/services/WifiManager';
import { Alert } from 'react-native';

export async function enableWifiAndWait(timeout: number = 10000): Promise<boolean> {
  try {
    const isEnabled = await WifiManager.isEnabled();
    if (isEnabled) {
      console.log('WiFi déjà activé');
      return true;
    }
    console.log("Demande d'activation du WiFi...");

    await WifiManager.setEnabled(true);
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const enabled = await WifiManager.isEnabled();
      if (enabled) {
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log('Timeout: WiFi non activé après', timeout, 'ms');
    return false;
  } catch (error) {
    console.error("Erreur lors de l'activation du WiFi:", error);
    return false;
  }
}

export async function ensureWifiEnabled(
  onSuccess?: () => void,
  onError?: (message: string) => void,
): Promise<void> {
  try {
    const isEnabled = await WifiManager.isEnabled();

    if (isEnabled) {
      console.log('✅ WiFi déjà activé');
      onSuccess?.();
      return;
    }

    Alert.alert('WiFi requis', "Cette fonctionnalité nécessite le WiFi. Veuillez l'activer.", [
      {
        text: 'Annuler',
        style: 'cancel',
        onPress: () => onError?.("Activation annulée par l'utilisateur"),
      },
      {
        text: 'Activer',
        onPress: async () => {
          const success = await enableWifiAndWait();

          if (success) {
            onSuccess?.();
          } else {
            Alert.alert(
              'Erreur',
              "Le WiFi n'a pas pu être activé. Veuillez l'activer manuellement dans les paramètres.",
              [{ text: 'OK', onPress: () => onError?.('WiFi non activé') }],
            );
          }
        },
      },
    ]);
  } catch (error) {
    console.error('Erreur:', error);
    onError?.('Erreur lors de la vérification du WiFi');
  }
}

export function useWifiCheck() {
  const checkAndEnableWifi = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      ensureWifiEnabled(
        () => resolve(true),
        () => resolve(false),
      );
    });
  };

  return { checkAndEnableWifi };
}
