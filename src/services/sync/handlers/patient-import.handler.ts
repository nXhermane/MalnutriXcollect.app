import type { Patient } from '@/schemas/patient.schema';
import { patients$ } from '@/store/patients/patients.store';
import { logger } from '@/lib/utils/logger';
import { MessageType } from '../protocol/message-types';
import type { SendFn } from '../protocol/protocol-message';
import { sync_session_state$ } from '@/store/sync/sync-session.store';

interface PatientImportContent {
  patients: Omit<Patient, 'isLocked'>[];
}

export function handlePatientImport(content: PatientImportContent, send: SendFn): void {
  sync_session_state$.currentPhase.set('import_patients');
  sync_session_state$.currentPhaseMessage.set('Importation des nouveaux patients...');
  const receivedPatientIds: string[] = [];

  for (const patient of content.patients) {
    const existing = patients$[patient.id].peek();

    if (existing?.isLocked) {
      logger.warn(`[PatientImport] Patient ${patient.id} is locked locally, update ignored.`);
    } else {
      patients$[patient.id].set({ ...patient, isLocked: true });
    }

    receivedPatientIds.push(patient.id);
  }

  send({
    type: MessageType.CLIENT_ACK_SERVER_PATIENT,
    content: { receivedPatientIds },
  });

  sync_session_state$.currentPhase.set('passive_wait');
  sync_session_state$.currentPhaseMessage.set('En attente des instructions du serveur...');
}
