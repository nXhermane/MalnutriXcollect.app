import { logger } from '@/lib/utils/logger';
import type { SendFn } from '../protocol/protocol-message';
import { sync_session_state$ } from '@/store/sync/sync-session.store';

interface ServerMeasuresCompletedContent {
  timestamp: number;
}

export function handleMeasuresCompleted(
  content: ServerMeasuresCompletedContent,
  _send: SendFn,
): void {
  logger.info(
    `[MeasuresCompleted] Server confirmed measures (timestamp: ${content.timestamp}). Waiting for SERVER_PATIENT_IMPORT.`,
  );
  sync_session_state$.currentPhase.set('passive_wait');
  sync_session_state$.currentPhaseMessage.set('En attente des instructions du serveur...');
}
