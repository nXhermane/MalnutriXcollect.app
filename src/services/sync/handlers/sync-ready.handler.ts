import type { SendFn } from '../protocol/protocol-message';
import { sync_session_state$ } from '@/store/sync/sync-session.store';
import { handlePatientExport } from './patient-export.handler';

interface SyncReadyContent {
  lastSyncTimestamp: number | null;
}

export function handleSyncReady(content: SyncReadyContent, send: SendFn): void {
  sync_session_state$.lastSyncTimestamp.set(content.lastSyncTimestamp);
  sync_session_state$.currentPhase.set('export_patients');
  sync_session_state$.currentPhaseMessage.set('Export des données démographiques...');
  handlePatientExport(send);
}
