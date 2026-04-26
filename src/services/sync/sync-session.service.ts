import { createLogger } from '@/lib/utils/logger';
import tcpClient from '@/services/tcp-client/tcp-client';
import { logSyncMessage } from '@/store/sync/sync-debug.store';
import { initialSessionState, sync_session_state$ } from '@/store/sync/sync-session.store';
import { user$, userProfile$ } from '@/store/user/user.store';
import { handlePatientExportCompleted } from './handlers/ack-new-patients.handler';
import { handleMeasuresCompleted } from './handlers/ack-patient-measures.handler';
import { handleAckSyncRequest } from './handlers/ack-sync-request.handler';
import { handleTaskResultExportCompleted } from './handlers/ack-task-results.handler';
import { handleSyncCompleted } from './handlers/close-sync-session.handler';
import { handleSyncStartRequest } from './handlers/request-sync.handler';
import { handleTaskResultRequest } from './handlers/request-task-results.handler';
import { handleTaskImport } from './handlers/send-active-tasks.handler';
import { handleCacheManifestRequest } from './handlers/send-cache-manifest.handler';
import { handleReferenceRegistry } from './handlers/send-missing-references.handler';
import { handleMeasuresExport } from './handlers/send-patient-measures.handler';
import { handlePatientImport } from './handlers/send-pro-patients.handler';
import { handleUpdatedPatients } from './handlers/updated-patients.handler';
import { HandlerRegistry } from './protocol/message-handler';
import { MessageType } from './protocol/message-types';
import { ProtocolMessage, SendFn } from './protocol/protocol-message';

const logger = createLogger('SyncSessionService');

class SyncSessionService {
  private registry = new HandlerRegistry();

  private readonly send: SendFn = (message) => {
    logger.debug('Sending message: ', message);
    logSyncMessage('sent', message.type, message.content);
    tcpClient.send(message);
  };

  start(host: string, port: number): void {
    this.registry = new HandlerRegistry();
    this.registry.register(MessageType.SERVER_ACK_SYNC_REQUEST, handleAckSyncRequest);
    this.registry.register(MessageType.SERVER_SEND_UPDATED_PATIENTS, handleUpdatedPatients);
    this.registry.register(MessageType.SERVER_ACK_NEW_PATIENTS, handlePatientExportCompleted);
    this.registry.register(MessageType.SERVER_REQUEST_PATIENT_MEASURES, handleMeasuresExport);
    this.registry.register(MessageType.SERVER_ACK_PATIENT_MEASURES, handleMeasuresCompleted);
    this.registry.register(MessageType.SERVER_SEND_PRO_PATIENTS, handlePatientImport);
    this.registry.register(MessageType.SERVER_REQUEST_CACHE_MANIFEST, handleCacheManifestRequest);
    this.registry.register(MessageType.SERVER_SEND_MISSING_REFERENCES, handleReferenceRegistry);
    this.registry.register(MessageType.SERVER_SEND_ACTIVE_TASKS, handleTaskImport);
    this.registry.register(MessageType.SERVER_REQUEST_TASK_RESULTS, handleTaskResultRequest);
    this.registry.register(MessageType.SERVER_ACK_TASK_RESULTS, handleTaskResultExportCompleted);
    this.registry.register(MessageType.SERVER_CLOSE_SYNC_SESSION, handleSyncCompleted);

    tcpClient.subscribe({
      onStatusChange: (status) => {
        if (status === 'connected') {
          sync_session_state$.isConnected.set(true);
          sync_session_state$.currentPhase.set('handshake');
          sync_session_state$.currentPhaseMessage.set('Négociation de connexion...');

          handleSyncStartRequest(
            {
              client_id: user$.user.id.peek() ?? '',
              name: userProfile$.display_name.peek() ?? 'Collect',
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
    try {
      this.send({
        type: MessageType.CLIENT_DISCONNECTED,
        content: null,
      });
      tcpClient.disconnect();
    } catch (e) {
      logger.error('failing to disconnected');
    }

    sync_session_state$.set(initialSessionState);
  }
}

export const syncSessionService = new SyncSessionService();
