import TcpClient from '@/services/TcpClient';
import WifiManager from '@/services/WifiManager';
import { memo, useEffect, useState } from 'react';
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

  return (
    <BottomSheetModal isVisible={isVisible} onClose={onClose}>
      <VStack className="flex-1 bg-yellow-400">
        <Text>
          {connectionStatus} {syncStatus}
        </Text>
      </VStack>
    </BottomSheetModal>
  );
});

SyncModal.displayName = 'SyncModal';
export { SyncModal };
