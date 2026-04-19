import tcpClient from '@/services/tcp-client/tcp-client';
import { user$, userProfile$ } from '@/store/user/user.store';
import { handleCacheManifestRequest } from './handlers/cache-manifest.handler';
import { handlePatientImport } from './handlers/patient-import.handler';
import { handleReferenceRegistry } from './handlers/reference-registry.handler';
import { handleSyncCompleted } from './handlers/sync-completed.handler';
import { handleSyncReady } from './handlers/sync-ready.handler';
import { handleTaskImport } from './handlers/task-import.handler';
import { handleTaskResultRequest } from './handlers/task-result-request.handler';
import { handleMeasuresExport } from './handlers/measures-export.handler';
import { HandlerRegistry } from './protocol/message-handler';
import { MessageType } from './protocol/message-types';
import type { ProtocolMessage, SendFn } from './protocol/protocol-message';
import { createLogger } from '@/lib/utils/logger';
import { handleSyncStartRequest } from './handlers/sync-start-request.handler';
import { initialSessionState, sync_session_state$ } from '@/store/sync/sync-session.store';
import { handlePatientExportCompleted } from './handlers/patient-export-completed.handler';
import { handleMeasuresCompleted } from './handlers/measures-completed.handler';
import { handleTaskResultExportCompleted } from './handlers/task-result-export-completed.handler';

const logger = createLogger('SyncSessionService');

class SyncSessionService {
  private registry = new HandlerRegistry();

  private readonly send: SendFn = (message) => {
    logger.debug('Sending message: ', message);
    tcpClient.send(message);
  };

  start(host: string, port: number): void {
    this.registry = new HandlerRegistry();
    // register handlers
    this.registry.register(MessageType.SYNC_START_REQUEST, handleSyncStartRequest);
    this.registry.register(MessageType.SYNC_READY_FOR_CLIENT_DATA, handleSyncReady);
    this.registry.register(
      MessageType.SERVER_CLIENT_EXPORT_COMPLETED,
      handlePatientExportCompleted,
    );
    this.registry.register(MessageType.SERVER_REQUEST_MEASURES, handleMeasuresExport);
    this.registry.register(MessageType.SERVER_MEASURES_COMPLETED, handleMeasuresCompleted);
    this.registry.register(MessageType.SERVER_PATIENT_IMPORT, handlePatientImport);
    this.registry.register(MessageType.SERVER_REQUEST_CACHE_MANIFEST, handleCacheManifestRequest);
    this.registry.register(MessageType.SERVER_REFERENCE_REGISTRY, handleReferenceRegistry);
    this.registry.register(MessageType.SERVER_TASK_IMPORT, handleTaskImport);
    this.registry.register(MessageType.SERVER_REQUEST_TASK_RESULTS, handleTaskResultRequest);
    this.registry.register(
      MessageType.SERVER_TASK_RESULT_COMPLETED,
      handleTaskResultExportCompleted,
    );
    this.registry.register(MessageType.SYNC_PROCESS_COMPLETED, handleSyncCompleted);

    tcpClient.subscribe({
      onStatusChange: (status) => {
        if (status === 'connected') {
          sync_session_state$.isConnected.set(true);
          sync_session_state$.currentPhase.set('handshake');
          sync_session_state$.currentPhaseMessage.set('Négociation de connexion...');
          this.registry.dispatch(
            {
              type: MessageType.SYNC_START_REQUEST,
              content: {
                client_id: user$.user.id.peek() ?? '',
                name: userProfile$.display_name.peek() ?? 'Collect',
              },
            },
            this.send,
          );
        } else {
          sync_session_state$.isConnected.set(false);
        }
      },
      onReceived: (data) => {
        this.registry.dispatch(data as ProtocolMessage<unknown>, this.send);
      },
      onError: (error) => {
        logger.error('TCP error:', error);
        sync_session_state$.isConnected.set(false);
      },
    });

    tcpClient.connect(host, port);
  }

  disconnect(): void {
    this.send({
      type: MessageType.CLIENT_DISCONNECTED,
      content: null,
    });
    tcpClient.disconnect();
    sync_session_state$.set(initialSessionState);
  }
}

export const syncSessionService = new SyncSessionService();
