// import { sync_session_state$ } from "@/store/sync/sync-session.store";
import { sync_session_state$ } from '@/store/sync/sync-session.store';
import { SendFn } from '../protocol/protocol-message';
import { patients$ } from '@/store/patients/patients.store';

interface ServerClientExportCompletedContent {
  confirmedPatientIds: string[];
}

export function handlePatientExportCompleted(
  content: ServerClientExportCompletedContent,
  send: SendFn,
) {
  //   sync_session_state$.confirmedPatientIds.set(content.confirmedPatientIds);

  for (const patientId of content.confirmedPatientIds) {
    if (patients$[patientId]) {
      patients$[patientId].isLocked.set(true);
    }
  }
  sync_session_state$.currentPhase.set('passive_wait');
  sync_session_state$.currentPhaseMessage.set('En attente des instructions du serveur...');
}
