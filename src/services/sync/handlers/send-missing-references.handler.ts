import type { ServerRegistryPayload } from '@/services/registry/registry.service';
import { mergeRegistryDiff } from '@/services/registry/registry.service';
import { MessageType } from '../protocol/message-types';
import type { SendFn } from '../protocol/protocol-message';
import { sync_session_state$ } from '@/store/sync/sync-session.store';

export function handleReferenceRegistry(content: ServerRegistryPayload, send: SendFn): void {
  const updatedCodes = mergeRegistryDiff(content);
  send({
    type: MessageType.CLIENT_ACK_REFERENCES,
    content: { updatedCodes },
  });

  sync_session_state$.currentPhase.set('passive_wait');
  sync_session_state$.currentPhaseMessage.set('En attente des instructions du serveur...');
}
