import type { ParentRelation, Patient, Sex } from '@/schemas/patient.schema';
import { patients$ } from '@/store/patients/patients.store';
import { MessageType } from '../protocol/message-types';
import type { SendFn } from '../protocol/protocol-message';
import { sync_session_state$ } from '@/store/sync/sync-session.store';

interface PatientExport {
  id: string;
  name: string;
  birthdate: string;
  sex: Sex;
  contact?: { email?: string; tel?: string };
  parents: { relation: ParentRelation; name: string; tel?: string }[];
  address: { fullAddress?: string; city?: string };
  createdAt: string;
  updatedAt: string;
}

function toPatientExport({ isLocked, ...patientExport }: Patient): PatientExport {
  return patientExport;
}

export function handlePatientExport(send: SendFn): void {
  const lastSyncTimestamp = sync_session_state$.lastSyncTimestamp.peek();
  const allPatients = Object.values(patients$.peek());

  const patientsToExport = lastSyncTimestamp
    ? allPatients.filter((p) => new Date(p.updatedAt).getTime() >= lastSyncTimestamp)
    : allPatients;

  send({
    type: MessageType.CLIENT_PATIENT_EXPORT,
    content: {
      patients: patientsToExport.map(toPatientExport),
    },
  });
}
