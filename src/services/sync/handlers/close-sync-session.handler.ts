import tcpClient from '@/services/tcp-client/tcp-client';
import type { SendFn } from '../protocol/protocol-message';
import { initialSessionState, sync_session_state$ } from '@/store/sync/sync-session.store';
import { MessageType } from '../protocol/message-types';

export function handleSyncCompleted(_content: null, send: SendFn): void {
  sync_session_state$.currentPhase.set('completed');
  sync_session_state$.currentPhaseMessage.set('Synchronisation validée et finalisée !');
  send({
    type: MessageType.CLIENT_DISCONNECTED,
    content: null,
  });
  tcpClient.disconnect();
  sync_session_state$.set({
    ...initialSessionState,
    currentPhase: 'completed',
    currentPhaseMessage: 'Synchronisation finalisée avec succès !',
  });
}
