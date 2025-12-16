import {
  ClientAckServerPatientPayload,
  SyncClientExportCompletedPayload,
  SyncProcessCompletedPayload,
  SyncReadyForClientDataPayload,
  SyncServerImportPayload,
  SyncServerMessageType,
  useSyncManager,
} from '@/hooks';
import { useToast } from '@/providers/Toast';
import TcpClient from '@/services/TcpClient';
import WifiManager from '@/services/WifiManager';
import { router } from 'expo-router';
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Network,
  RefreshCw,
  Wifi,
  WifiOff,
} from 'lucide-react-native';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { BottomSheetModal } from '../custom';
import { Box } from '../ui/box';
import { Button, ButtonIcon, ButtonText } from '../ui/button';
import { HStack } from '../ui/hstack';
import { Icon } from '../ui/icon';
import { Text } from '../ui/text';
import { VStack } from '../ui/vstack';

/**
 * Union type for all possible communication data payloads between client and server
 */
type CommunicationDataType =
  | SyncClientExportCompletedPayload
  | SyncProcessCompletedPayload
  | SyncReadyForClientDataPayload
  | SyncServerImportPayload
  | ClientAckServerPatientPayload;

export interface SyncModalProps {
  isVisible: boolean;
  data: {
    host: string;
    port: number;
    ssid: string;
    password: string;
  };
  onClose: () => void;
}

/**
 * Modal component for handling the synchronization process with the nutritionist server
 *
 * This component manages the complete synchronization flow:
 * 1. WiFi connection to the nutritionist's network
 * 2. TLS encrypted TCP connection to the server
 * 3. Patient data exchange using the defined protocol
 * 4. UI feedback for each step of the process
 */
const SyncModal = memo(({ data, isVisible, onClose }: SyncModalProps) => {
  const toast = useToast();
  const [connectionStatus, setConnectionStatus] = useState<
    | 'CONNECTING_WIFI'
    | 'CONNECTING_TCP'
    | 'CONNECTED'
    | 'IDLE'
    | 'ERROR_WIFI'
    | 'ERROR_TCP'
    | 'DISCONNECTED'
    | 'TIMEOUT'
  >('IDLE');
  const [syncStatus, setSyncStatus] = useState<'NONE' | 'IMPORT' | 'EXPORT' | 'FINISHED'>('NONE');
  const { processClientExportCompleted, processClientImport, processServerReady, startSync } =
    useSyncManager();
  const [error, setError] = useState<string | null>(null);

  const handleDone = useCallback(() => {
    onClose();
    router.navigate('/');
  }, [onClose]);

  /**
   * Handles the complete connection and synchronization process
   * Sets up event listeners and initiates WiFi and TCP connections
   */
  const handleConnection = useCallback(() => {
    TcpClient.subscribe({
      onError: (error) => {
        setConnectionStatus('ERROR_TCP');
        setSyncStatus('NONE');
        console.error(error);
        setError('Error connecting to TCP server : ' + error.message);
      },
      onReceived: (data) => {
        const _data = data as CommunicationDataType;

        if (_data.type === SyncServerMessageType.SYNC_READY_FOR_CLIENT_DATA) {
          setSyncStatus('EXPORT');
          TcpClient.send(processServerReady(_data));
        } else if (_data.type === SyncServerMessageType.SERVER_CLIENT_EXPORT_COMPLETED) {
          processClientExportCompleted(_data);
        } else if (_data.type === SyncServerMessageType.SERVER_PATIENT_IMPORT) {
          setSyncStatus('IMPORT');
          TcpClient.send(processClientImport(_data));
        } else if (_data.type === SyncServerMessageType.SYNC_PROCESS_COMPLETED) {
          setSyncStatus('FINISHED');
        }
      },
      onStatusChange: (status) => {
        if (status === 'connected') {
          console.log('connected');
          setConnectionStatus('CONNECTED');
          TcpClient.send(startSync());
        }
        if (status === 'closed') {
          WifiManager.disconnect('ssid')
            .then(() => {
              setConnectionStatus('DISCONNECTED');
              setSyncStatus('NONE');
            })
            .catch((e) => {
              console.error(e);
              setError('Error disconnecting from WiFi : ' + e.message);
              setConnectionStatus('ERROR_WIFI');
              setSyncStatus('NONE');
            });
        }
      },
    });
    setConnectionStatus('CONNECTING_WIFI');
    WifiManager.connectToDevice(data.ssid, data.password)
      .then(() => {
        setConnectionStatus('CONNECTING_TCP');
        TcpClient.connect(data.host, data.port);
      })
      .catch((e) => {
        console.error(e);
        setConnectionStatus('ERROR_WIFI');
        setSyncStatus('NONE');
      });

    return () => {
      TcpClient.subscribe({});
      TcpClient.disconnect();
      WifiManager.disconnect(data.ssid);
    };
  }, [data, processClientExportCompleted, processClientImport, processServerReady, startSync]);

  useEffect(() => {
    const unsubcribe = handleConnection();
    return () => {
      unsubcribe();
    };
  }, [handleConnection]);

  useEffect(() => {
    if (connectionStatus === 'ERROR_WIFI') {
      toast.show(
        'Error',
        'Erreur de connexion au nutritionniste.',
        'Veuillez activer votre wifi et réessayer.',
        'top',
        'wifi_error',
      );
    } else if (connectionStatus === 'ERROR_TCP') {
      toast.show(
        'Error',
        'Erreur de connexion au nutritionniste.',
        "Assurez-vous d'être connecté à internet et de réessayer.",
        'top',
        'tcp_error',
      );
    }
  }, [connectionStatus, toast]);

  return (
    <BottomSheetModal isVisible={isVisible} onClose={onClose} snapPoints={['70%']}>
      {syncStatus === 'NONE' && (
        <React.Fragment>
          {connectionStatus === 'CONNECTING_WIFI' && (
            <VStack className="h-full flex-1 items-center justify-center gap-y-6">
              <HStack className=" justify-center">
                <Box className="relative">
                  <Box className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" />
                  <Box className="relative rounded-full bg-emerald-100 p-4 dark:bg-emerald-900/30">
                    <Icon
                      as={Wifi}
                      className="h-12 w-12 animate-pulse text-emerald-600 dark:text-emerald-400"
                    />
                  </Box>
                </Box>
              </HStack>

              <Box className="gap-y-2 text-center">
                <Text className="text-center font-h4 text-lg font-medium  text-emerald-600 dark:text-emerald-400">
                  Connexion au réseau WiFi
                </Text>
                <Text className="text-center font-light text-sm text-muted-foreground">
                  Connexion au réseau
                </Text>
                <Text className="text-center font-light text-xs text-muted-foreground">
                  Assurez-vous que le WiFi est activé sur votre appareil
                </Text>
              </Box>
              <HStack className="items-center justify-center gap-2">
                <Icon
                  as={Loader2}
                  className="h-4 w-4 animate-spin text-emerald-600 dark:text-emerald-400"
                />
                <Text className="text-center font-light text-xs text-muted-foreground">
                  Connexion en cours...
                </Text>
              </HStack>
            </VStack>
          )}
          {connectionStatus === 'CONNECTING_TCP' && (
            <VStack className="h-full flex-1 items-center justify-center gap-y-6">
              <HStack className="justify-center">
                <Box className="relative">
                  <Box className="absolute inset-0 animate-ping rounded-full bg-blue-500/20" />
                  <Box className="relative rounded-full bg-blue-100 p-4 dark:bg-blue-900/30">
                    <Icon
                      as={Network}
                      className="h-12 w-12 animate-pulse text-blue-600 dark:text-blue-400"
                    />
                  </Box>
                </Box>
              </HStack>

              <Box className="space-y-2 text-center">
                <Text className="text-center font-h4 text-lg font-medium text-blue-600 dark:text-blue-400 ">
                  Établissement de la connexion
                </Text>
                <Text className="text-center font-light text-xs text-muted-foreground">
                  Connexion sécurisée avec le nutritionniste
                </Text>
              </Box>
              <Box className="flex items-center justify-center gap-2">
                <Icon
                  as={Loader2}
                  className="size-4 animate-spin text-blue-600 dark:text-blue-400"
                />
                <Text className="text-center font-light text-xs text-muted-foreground">
                  Connexion sécurisée...
                </Text>
              </Box>
            </VStack>
          )}
          {connectionStatus === 'ERROR_WIFI' && (
            <VStack className="flex-1 items-center justify-center gap-y-6 p-6">
              <HStack className="flex justify-center">
                <Box className="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
                  <Icon as={WifiOff} className="size-12 text-red-600 dark:text-red-400" />
                </Box>
              </HStack>
              <Box className="gap-y-2 text-center">
                <Text className="text-center font-h4 text-lg font-medium text-red-600 dark:text-red-400">
                  Échec de connexion WiFi
                </Text>
                <Text className="text-center font-light text-xs text-muted-foreground">
                  Impossible de se connecter au réseau{' '}
                </Text>
              </Box>
              <Box className="gap-y-2 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                <Text className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  Vérifications à effectuer :
                </Text>
                <VStack className=" gap-y-1">
                  <Text className="text-amber-700 dark:text-amber-300">
                    {'• Activez le WiFi sur votre appareil'}
                  </Text>
                  <Text className="text-amber-700 dark:text-amber-300">
                    {"• Assurez-vous d'être à proximité du nutritionniste"}
                  </Text>
                </VStack>
              </Box>

              {error && (
                <Text className="rounded bg-muted p-2 text-center text-xs text-muted-foreground">
                  {error}
                </Text>
              )}
              <HStack className="w-full gap-3">
                <Button variant="outline" onPress={onClose} className="flex-1 rounded-xl">
                  <ButtonText className="font-h4 text-foreground">Annuler</ButtonText>
                </Button>
                <Button
                  onPress={handleConnection}
                  className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 ">
                  <ButtonIcon as={RefreshCw} className="h-4 w-4 text-white " />
                  <ButtonText className="font-h4 text-white">Réessayer</ButtonText>
                </Button>
              </HStack>
            </VStack>
          )}
          {connectionStatus === 'ERROR_TCP' && (
            <VStack className="flex-1 items-center justify-center gap-y-6 p-6">
              <HStack className="flex justify-center">
                <Box className="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
                  <Icon as={AlertCircle} className="size-12 text-red-600 dark:text-red-400" />
                </Box>
              </HStack>
              <Box className="gap-y-2 text-center">
                <Text className="text-center font-h4 text-lg font-medium text-red-600 dark:text-red-400">
                  Échec de la communication
                </Text>
                <Text className="text-center font-light text-xs text-muted-foreground">
                  {"Impossible d'établir une connexion sécurisée avec le nutritionniste"}
                </Text>
              </Box>
              <Box className="gap-y-2 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                <Text className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  Vérifications à effectuer :
                </Text>
                <VStack className=" gap-y-1">
                  <Text className="text-amber-700 dark:text-amber-300">
                    • {"Le nutritionniste doit avoir l'application ouverte"}
                  </Text>
                  <Text className="text-amber-700 dark:text-amber-300">
                    • {'Vérifiez que votre Wifi est activé'}
                  </Text>
                  <Text className="text-amber-700 dark:text-amber-300">
                    • {'Réessayez de scanner le QR code'}
                  </Text>
                  <Text className="text-amber-700 dark:text-amber-300">
                    • {'Redémarrez les deux applications si le problème persiste'}
                  </Text>
                </VStack>
              </Box>

              {error && (
                <Text className="rounded bg-muted p-2 text-center text-xs text-muted-foreground">
                  {error}
                </Text>
              )}
              <HStack className="w-full gap-3">
                <Button variant="outline" onPress={onClose} className="h-v-10 flex-1 rounded-xl">
                  <ButtonText className="font-h4 text-foreground">Annuler</ButtonText>
                </Button>
                <Button
                  onPress={handleConnection}
                  className="h-v-10 flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 ">
                  <ButtonIcon as={RefreshCw} className="h-4 w-4 text-white " />
                  <ButtonText className="font-h4 text-white">Réessayer</ButtonText>
                </Button>
              </HStack>
            </VStack>
          )}
          {connectionStatus === 'TIMEOUT' && (
            <VStack className="flex-1 items-center justify-center gap-y-6 p-6">
              <HStack className="flex justify-center">
                <Box className="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
                  <Icon as={AlertCircle} className="size-12 text-red-600 dark:text-red-400" />
                </Box>
              </HStack>
              <Box className="gap-y-2 text-center">
                <Text className="text-center font-h4 text-lg font-medium text-red-600 dark:text-red-400">
                  Délai de connexion dépassé
                </Text>
                <Text className="text-center font-light text-xs text-muted-foreground">
                  La connexion a pris trop de temps (plus de 30 secondes)
                </Text>
              </Box>
              <Box className="gap-y-2 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <Text className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Conseils :
                </Text>
                <VStack className=" gap-y-1">
                  <Text className="text-blue-700 dark:text-blue-300">
                    • {'Rapprochez-vous du nutritionniste'}
                  </Text>
                  <Text className="text-blue-700 dark:text-blue-300">
                    • {"Assurez-vous qu'aucun autre appareil n'utilise le réseau"}
                  </Text>
                  <Text className="text-blue-700 dark:text-blue-300">
                    • {'Désactivez puis réactivez votre WiFi'}
                  </Text>
                </VStack>
              </Box>

              {error && (
                <Text className="rounded bg-muted p-2 text-center text-xs text-muted-foreground">
                  {error}
                </Text>
              )}
              <HStack className="w-full gap-3">
                <Button variant="outline" onPress={onClose} className="h-v-10 flex-1 rounded-xl">
                  <ButtonText className="font-h4 text-foreground">Annuler</ButtonText>
                </Button>
                <Button
                  onPress={handleConnection}
                  className="h-v-10 flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 ">
                  <ButtonIcon as={RefreshCw} className="h-4 w-4 text-white " />
                  <ButtonText className="font-h4 text-white">Réessayer</ButtonText>
                </Button>
              </HStack>
            </VStack>
          )}
          {connectionStatus === 'CONNECTED' && (
            <VStack className="h-full flex-1 items-center justify-center gap-y-6">
              <Box className="mx-auto w-fit rounded-full bg-emerald-100 p-8 dark:bg-emerald-900/20">
                <Icon as={CheckCircle} className="size-20 text-emerald-600 dark:text-emerald-400" />
              </Box>
              <Box className="gap-y-2">
                <Text className="text-center font-h4 text-lg font-medium text-foreground">
                  Connexion réuissir
                </Text>
              </Box>
            </VStack>
          )}
        </React.Fragment>
      )}
      {(syncStatus === 'IMPORT' || syncStatus === 'EXPORT') && (
        <VStack className="h-full flex-1 items-center justify-center gap-y-6">
          <Box className="mx-auto w-fit rounded-full bg-emerald-100 p-8 dark:bg-emerald-900/20">
            <Box className="size-20 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent dark:border-emerald-400"></Box>
          </Box>
          <Box className="gap-y-2">
            <Text className="text-center font-h4 text-lg font-medium text-foreground">
              Synchronisation en cours...
            </Text>
            <Text className="text-center font-light text-sm text-muted-foreground">
              Transfert des données avec le nutritionniste
            </Text>
          </Box>
        </VStack>
      )}
      {syncStatus === 'FINISHED' && (
        <VStack className="h-full flex-1 items-center justify-center gap-y-6 px-4">
          <Box className="mx-auto w-fit rounded-full bg-emerald-100 p-8 dark:bg-emerald-900/20">
            <Icon as={CheckCircle} className="size-20 text-emerald-600 dark:text-emerald-400" />
          </Box>

          <Box className="gap-y-2">
            <Text className="text-center font-h4 text-lg font-medium text-foreground">
              Synchronisation réussie !
            </Text>
            <Text className="text-center font-light text-sm text-muted-foreground">
              Toutes les visites ont été transférées au nutritionniste et les patients concernés
              sont maintenant verrouillés.
            </Text>
          </Box>

          <Button
            onPress={handleDone}
            className="h-v-10 w-full rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">
            <ButtonText className="font-h4 text-white">Terminé</ButtonText>
          </Button>
        </VStack>
      )}
    </BottomSheetModal>
  );
});

SyncModal.displayName = 'SyncModal';
export { SyncModal };
