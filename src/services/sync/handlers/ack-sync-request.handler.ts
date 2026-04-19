import { patients$ } from '@/store/patients/patients.store';
import { sync_session_state$ } from '@/store/sync/sync-session.store';
import { MessageType } from '../protocol/message-types';
import type { SendFn } from '../protocol/protocol-message';

interface ServerAckSyncRequestContent {
  lastSyncTimestamp: number | null;
}

export function handleAckSyncRequest(content: ServerAckSyncRequestContent, send: SendFn): void {
  sync_session_state$.lastSyncTimestamp.set(content.lastSyncTimestamp);
  sync_session_state$.currentPhase.set('update_locked');
  sync_session_state$.currentPhaseMessage.set('Analyse des patients partagés...');

  const allPatients = Object.values(patients$.peek());
  const lockedPatientIds = allPatients.filter((p) => p.isLocked).map((p) => p.id);

  send({
    type: MessageType.CLIENT_SEND_LOCKED_PATIENT_IDS,
    content: {
      lockedPatientIds,
    },
  });
}
