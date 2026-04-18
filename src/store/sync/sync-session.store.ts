import { observable } from '@legendapp/state';

export type SyncPhaseId =
  | 'idle'
  | 'wifi_connecting'
  | 'wifi_ready'
  | 'tcp_connecting'
  | 'handshake'
  | 'export_patients'
  | 'export_measures'
  | 'import_patients'
  | 'passive_wait'
  | 'import_references'
  | 'import_tasks'
  | 'export_results'
  | 'completed';

export interface SessionState {
  isConnected: boolean;
  lastSyncTimestamp: number | null;
  confirmedPatientIds: string[];
  currentPhase: SyncPhaseId;
  currentPhaseMessage: string;
}

export const initialSessionState: SessionState = {
  isConnected: false,
  lastSyncTimestamp: null,
  confirmedPatientIds: [],
  currentPhase: 'idle',
  currentPhaseMessage: 'Prêt',
};

export const sync_session_state$ = observable<SessionState>({ ...initialSessionState });
