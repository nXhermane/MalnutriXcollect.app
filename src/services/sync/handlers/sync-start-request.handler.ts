import { MessageType } from '../protocol/message-types';
import type { SendFn } from '../protocol/protocol-message';

interface SyncStartRequestContent {
  client_id: string;
  name: string;
}
export function handleSyncStartRequest(content: SyncStartRequestContent, send: SendFn): void {
  send({
    type: MessageType.SYNC_START_REQUEST,
    content,
  });
}
