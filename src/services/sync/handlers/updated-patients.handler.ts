import { patients$ } from '@/store/patients/patients.store';
import type { SendFn } from '../protocol/protocol-message';
import { handleSendNewPatients } from './send-new-patients.handler';
import { createLogger } from '@/lib/utils/logger';
import { Patient } from '@/schemas/patient.schema';
import { sync_session_state$ } from '@/store/sync/sync-session.store';

const logger = createLogger('UpdatedPatientsHandler');

interface ServerSendUpdatedPatientsContent {
  updatedPatients: Patient[];
}

export function handleUpdatedPatients(
  content: ServerSendUpdatedPatientsContent,
  send: SendFn,
): void {
  const { updatedPatients } = content;

  if (updatedPatients.length > 0) {
    logger.info(`Received ${updatedPatients.length} updated patient(s) from PRO.`);

    for (const remotePatient of updatedPatients) {
      if (patients$[remotePatient.id].peek()) {
        patients$[remotePatient.id].assign(remotePatient);
      }
    }
  } else {
    logger.info('No locked patients were updated on the PRO side.');
  }

  sync_session_state$.currentPhase.set('export_patients');
  sync_session_state$.currentPhaseMessage.set('Export des données démographiques...');

  handleSendNewPatients(send);
}
