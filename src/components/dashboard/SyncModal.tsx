import TcpClient from '@/services/TcpClient';
import WifiManager from '@/services/WifiManager';
import { memo, useCallback, useEffect, useState } from 'react';
import { BottomSheetModal } from '../custom';
import { Text } from '../ui/text';
import { VStack } from '../ui/vstack';
import {
  ClientAckServerPatientPayload,
  SyncClientExportCompletedPayload,
  SyncProcessCompletedPayload,
  SyncReadyForClientDataPayload,
  SyncServerImportPayload,
  SyncServerMessageType,
  useSyncManager,
} from '@/hooks';
import { Box } from '../ui/box';
import { useToast } from '@/providers/Toast';
import { Icon } from '../ui/icon';
import { CheckCircle } from 'lucide-react-native';
import { Button, ButtonText } from '../ui/button';
import { router } from 'expo-router';

type CommunicationDataType =
  | SyncClientExportCompletedPayload
  | SyncProcessCompletedPayload
  | SyncReadyForClientDataPayload
  | SyncServerImportPayload
  | ClientAckServerPatientPayload
  | {
      type: SyncServerMessageType.SERVER_ACK_CLIENT_EXPORT;
    };

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

  const handleDone = useCallback(() => {
    router.navigate('/');
  }, []);
  useEffect(() => {
    TcpClient.subscribe({
      onError: (error) => {
        setConnectionStatus('ERROR_TCP');
        console.error(error);
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
        } else if (_data.type === SyncServerMessageType.SERVER_ACK_CLIENT_EXPORT) {
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
            })
            .catch((e) => {
              console.error(e);
              setConnectionStatus('ERROR_WIFI');
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
      });
  }, [data, processClientExportCompleted, processClientImport, processServerReady, startSync]);

  useEffect(() => {
    if (connectionStatus === 'ERROR_WIFI') {
      toast.show(
        'Error',
        'Erreur de connexion au nutritionniste.',
        'Veuillez activer votre wifi et réessayer.',
        'top',
      );
    } else if (connectionStatus === 'ERROR_TCP') {
      toast.show(
        'Error',
        'Erreur de connexion au nutritionniste.',
        "Assurez-vous d'être connecté à internet et de réessayer.",
        'top',
      );
    }
  }, [connectionStatus, toast]);

  if (
    connectionStatus === 'ERROR_TCP' ||
    connectionStatus === 'ERROR_WIFI' ||
    syncStatus === 'NONE'
  ) {
    onClose();
    return null;
  }
  return (
    <BottomSheetModal isVisible={isVisible} onClose={onClose}>
      {(syncStatus === 'IMPORT' || syncStatus === 'EXPORT') && (
        <VStack className="flex-1 items-center justify-center gap-y-6">
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
        <VStack className="flex-1 items-center justify-center gap-y-6 px-4">
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
            className="h-14 w-full bg-emerald-600 text-white hover:bg-emerald-700">
            <ButtonText>Terminé</ButtonText>
          </Button>
        </VStack>
      )}
    </BottomSheetModal>
  );
});

SyncModal.displayName = 'SyncModal';
export { SyncModal };
