import type { MessageType } from '@/services/sync/protocol/message-types';
import { observable } from '@legendapp/state';

export type SyncMessageDirection = 'received' | 'sent';

export interface SyncDebugEntry {
  id: string;
  direction: SyncMessageDirection;
  type: MessageType;
  content: unknown;
  timestamp: number;
}

export interface SyncDebugState {
  entries: SyncDebugEntry[];
  isVisible: boolean;
}

export const sync_debug$ = observable<SyncDebugState>({
  entries: [],
  isVisible: false,
});

let _entryCounter = 0;

export function logSyncMessage(
  direction: SyncMessageDirection,
  type: MessageType,
  content: unknown,
): void {
  const entry: SyncDebugEntry = {
    id: `${Date.now()}-${_entryCounter++}`,
    direction,
    type,
    content,
    timestamp: Date.now(),
  };
  sync_debug$.entries.set([...sync_debug$.entries.peek(), entry]);
}

export function clearSyncDebugLog(): void {
  sync_debug$.entries.set([]);
}
