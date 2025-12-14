import { app_info$ } from '@/store/app.info';
import {
  compileUnExportedPatient,
  ExportedPatient,
  ImportPatient,
} from '@/utils/sync_patient_utils';
import { randomUUID } from '@/utils/crypto';
import { modeles$ } from '@/store';
import { patientSchema } from '@/models/schemas';
import * as v from 'valibot';
import { useCallback } from 'react';

export enum SyncClientMessageType {
  SYNC_START_REQUEST, // DECLENCHE LE PROCESSUR AUPRÈS DU SERVER
  CLIENT_PATIENT_EXPORT, // LE CLIENT ENVOIE LES DONNÉES À EXPORTER
  CLIENT_ACK_SERVER_PATIENT, // LE CLIENT REPONDS QU'IL A BIEN RECU LE PACKET(LES PATIENTS)
}
export enum SyncServerMessageType {
  SYNC_READY_FOR_CLIENT_DATA, // DEMANDE AU CLIENT D'ENVOYER CES DONNÉES QU'IL EST PRES
  SERVER_ACK_CLIENT_EXPORT, // LE SERVER CONFIRME LA RÉCEPTION ET IL COMMENCE LE TRAITEMENT ET LES STOCKE
  SERVER_CLIENT_EXPORT_COMPLETED, // NOTIFIE LE CLIENT QUE L'EXPORT À TERMINEER
  // SYNC_START_SERVER_IMPORT, // LE SERVER SIGNALE AU CLIENT QU'IL  COMMENCER À ENVOYER CES DONNÉES
  SERVER_PATIENT_IMPORT, // LE SERVER ENVOIE LES PATIENTS QU'IL MANQUE AU CLIENT (puisque le server a maintenant les ids des donnés du clients, il peux determiner et eliminer ceux qui sont deja presente chez le client)
  SYNC_PROCESS_COMPLETED, // FIN DE LA SYNCHRONISATION LE SERVER CONFRIME
}

/**
 * Le client se connecte
 * le client envoie le sync start request
 * le server reponds avec un sync ready
 * le client envoie client patient export avec les patients
 * le server traite et envoie un server client export completed
 * le server enoie un server patient import (avec toutes les patients nonsynchro),
 * le server envoie sync processs completed une fois qu'il a resure client ask server patients
 */
export type StartSyncPayload = {
  type: SyncClientMessageType.SYNC_START_REQUEST;
  content: { client_id: string };
};
export type SyncReadyForClientDataPayload = {
  type: SyncServerMessageType.SYNC_READY_FOR_CLIENT_DATA;
  content: { lastSyncTimestamp: null | number };
};
export type ClientPatientStartExportPayload = {
  type: SyncClientMessageType.CLIENT_PATIENT_EXPORT;
  content: { data: ExportedPatient[] };
};
export type SyncClientExportCompletedPayload = {
  type: SyncServerMessageType.SERVER_CLIENT_EXPORT_COMPLETED;
  content: { data: string[] }; // contain all the ids of exported pateints
};
export type SyncServerImportPayload = {
  type: SyncServerMessageType.SERVER_PATIENT_IMPORT;
  content: { data: ImportPatient[] };
};
export type ClientAckServerPatientPayload = {
  type: SyncClientMessageType.CLIENT_ACK_SERVER_PATIENT;
  content: { timestamp: number | null };
};
export type SyncProcessCompletedPayload = {
  type: SyncServerMessageType.SYNC_PROCESS_COMPLETED;
  content: null;
};

export function useSyncManager() {
  const startSync = useCallback((): StartSyncPayload => {
    let client_id = app_info$.client_id.get();
    if (client_id === null) {
      client_id = randomUUID();
      app_info$.client_id.set(client_id);
    }
    return {
      type: SyncClientMessageType.SYNC_START_REQUEST,
      content: { client_id },
    };
  }, []);
  const processServerReady = useCallback(
    (data: SyncReadyForClientDataPayload): ClientPatientStartExportPayload => {
      // const timestamp = data.content.lastSyncTimestamp;
      console.log(data); // Plutard implementer la logique pour ne envoiyer que les update a partir de ce moments
      const patients = Object.values(modeles$.patients.get());
      const patients_measures = modeles$.patient_measures.get();
      const { data: unexported_patients } = compileUnExportedPatient(
        Object.values(patients),
        patients_measures,
      );

      return {
        type: SyncClientMessageType.CLIENT_PATIENT_EXPORT,
        content: {
          data: unexported_patients,
        },
      };
    },
    [],
  );
  const processClientExportCompleted = useCallback((data: SyncClientExportCompletedPayload) => {
    for (const patientId of data.content.data) {
      if (!modeles$.patients[patientId].peek()) {
        return null;
      }
      if (!modeles$.patients[patientId].isLocked.get())
        modeles$.patients[patientId].assign({
          isLocked: true,
          updatedAt: new Date().toISOString(),
        });
      for (let i = 0; i < modeles$.patient_measures[patientId].length; i++) {
        if (!modeles$.patient_measures[patientId][i].isExported.get()) {
          modeles$.patient_measures[patientId][i].assign({
            isExported: true,
            updatedAt: new Date().toISOString(),
          });
        }
      }
    }
    return null;
  }, []);
  const processClientImport = useCallback(
    (data: SyncServerImportPayload): ClientAckServerPatientPayload => {
      const validatedPatients = v.safeParse(v.array(patientSchema), data.content.data);
      if (!validatedPatients.success) {
        console.warn('Ceci ne devrais par arrivé : ', JSON.stringify(validatedPatients));
        return {
          content: { timestamp: null },
          type: SyncClientMessageType.CLIENT_ACK_SERVER_PATIENT,
        };
      }
      const lockedPatients = validatedPatients.output.map((patient) => ({
        ...patient,
        isLocked: true,
      }));
      for (const patient of lockedPatients) {
        if (!modeles$.patients[patient.id]) {
          modeles$.patients[patient.id].set(patient);
        }
      }
      return {
        content: { timestamp: Date.now() },
        type: SyncClientMessageType.CLIENT_ACK_SERVER_PATIENT,
      };
    },
    [],
  );

  return {
    startSync,
    processServerReady,
    processClientExportCompleted,
    processClientImport,
  };
}
