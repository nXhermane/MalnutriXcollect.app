import { MeasureCategory } from '@/constants';
import { measures$ } from '@/store/measures/measures.store';
import { MessageType } from '../protocol/message-types';
import type { SendFn } from '../protocol/protocol-message';
import { sync_session_state$ } from '@/store/sync/sync-session.store';

interface ServerRequestMeasuresContent {
  patientIds: string[];
}

interface AnthropometricMeasureExport {
  id: string;
  code: string;
  value: number;
  unit: string;
  createdAt: string;
}

interface BiologicalMeasureExport {
  id: string;
  code: string;
  value: number;
  unit: string;
  createdAt: string;
}

interface ClinicalFieldMeasureExport {
  id: string;
  code: string;
  value: unknown;
  createdAt: string;
}

interface PatientMeasuresExport {
  patientId: string;
  anthropometric: AnthropometricMeasureExport[];
  biological: BiologicalMeasureExport[];
  clinical: ClinicalFieldMeasureExport[];
}

export function handleMeasuresExport(content: ServerRequestMeasuresContent, send: SendFn): void {
  sync_session_state$.currentPhase.set('export_measures');
  sync_session_state$.currentPhaseMessage.set('Export des mesures en cours...');
  const lastSyncTimestamp = sync_session_state$.lastSyncTimestamp.peek();

  const measuresPayload: PatientMeasuresExport[] = content.patientIds.map((patientId) => {
    const patientMeasures = measures$[patientId]?.peek();

    if (!patientMeasures) {
      return { patientId, anthropometric: [], biological: [], clinical: [] };
    }

    const anthro = patientMeasures[MeasureCategory.ANTHRO] ?? [];
    const bio = patientMeasures[MeasureCategory.BIOLOGICAL] ?? [];
    const field = patientMeasures[MeasureCategory.FIELD] ?? [];

    const sinceFilter = (createdAt: string) =>
      lastSyncTimestamp ? new Date(createdAt).getTime() >= lastSyncTimestamp : true;

    return {
      patientId,
      anthropometric: anthro
        .filter((m) => sinceFilter(m.createdAt))
        .map((m) => ({
          id: m.id,
          code: m.code,
          value: m.value,
          unit: m.unit,
          createdAt: m.createdAt,
        })),
      biological: bio
        .filter((m) => sinceFilter(m.createdAt))
        .map((m) => ({
          id: m.id,
          code: m.code,
          value: m.value,
          unit: m.unit,
          createdAt: m.createdAt,
        })),
      clinical: field
        .filter((m) => sinceFilter(m.createdAt))
        .map((m) => ({ id: m.id, code: m.code, value: m.value, createdAt: m.createdAt })),
    };
  });

  send({
    type: MessageType.CLIENT_SEND_PATIENT_MEASURES,
    content: { measures: measuresPayload },
  });
}
