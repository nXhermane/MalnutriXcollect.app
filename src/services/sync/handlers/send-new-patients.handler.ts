import type { ParentRelation, Patient, Sex, PatientStatus } from '@/schemas/patient.schema';
import { patients$ } from '@/store/patients/patients.store';
import { MessageType } from '../protocol/message-types';
import type { SendFn } from '../protocol/protocol-message';
import { sync_session_state$ } from '@/store/sync/sync-session.store';

interface PatientExport {
  id: string;
  name: string;
  birthdate: string;
  sex: Sex;
  isLocked: boolean;
  status: PatientStatus;
  contact?: { email?: string; tel?: string };
  parents: { relation: ParentRelation; name: string; tel?: string }[];
  address: { fullAddress?: string; city?: string };
  createdAt: string;
  updatedAt: string;
}

function toPatientExport(patientExport: Patient): PatientExport {
  return patientExport as PatientExport;
}

export function handleSendNewPatients(send: SendFn): void {
  const lastSyncTimestamp = sync_session_state$.lastSyncTimestamp.peek();
  const allPatients = Object.values(patients$.peek());

  const patientsToExport = lastSyncTimestamp
    ? allPatients.filter((p) => new Date(p.updatedAt).getTime() >= lastSyncTimestamp)
    : allPatients;

  send({
    type: MessageType.CLIENT_SEND_NEW_PATIENTS,
    content: {
      patients: patientsToExport.map(toPatientExport),
    },
  });
}
