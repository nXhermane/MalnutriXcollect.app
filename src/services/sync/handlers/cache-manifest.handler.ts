import { buildCacheManifest } from '@/services/registry/registry.service';
import { patients$ } from '@/store/patients/patients.store';
import { MessageType } from '../protocol/message-types';
import type { SendFn } from '../protocol/protocol-message';
import { sync_session_state$ } from '@/store/sync/sync-session.store';

export function handleCacheManifestRequest(_content: null, send: SendFn): void {
  sync_session_state$.currentPhase.set('import_references');
  sync_session_state$.currentPhaseMessage.set('Vérification des références médicales...');
  const cachedRefs = buildCacheManifest();
  const knownPatientIds = Object.keys(patients$.peek());

  send({
    type: MessageType.CLIENT_CACHE_MANIFEST,
    content: {
      cachedRefs,
      knownPatientIds,
    },
  });
}
