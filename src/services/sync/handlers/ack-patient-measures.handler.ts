import { logger } from '@/lib/utils/logger';
import { sync_session_state$ } from '@/store/sync/sync-session.store';
import type { SendFn } from '../protocol/protocol-message';

interface ServerMeasuresCompletedContent {
  timestamp: number;
}

export function handleMeasuresCompleted(
  content: ServerMeasuresCompletedContent,
  _send: SendFn,
): void {
  logger.info(
    `[MeasuresCompleted] Server confirmed measures (timestamp: ${content.timestamp}). Waiting for SERVER_SEND_PRO_PATIENTS.`,
  );
  sync_session_state$.currentPhase.set('passive_wait');
  sync_session_state$.currentPhaseMessage.set('En attente des patients Pro...');
}
