import { tasks$ } from '@/store/tasks/tasks.store';
import { SendFn } from '../protocol/protocol-message';
import { sync_session_state$ } from '@/store/sync/sync-session.store';

interface TaskResultCompletedContent {
  processedTaskIds: string[];
  rejectedTaskIds: string[];
  timestamp: number;
}

export function handleTaskResultExportCompleted(
  content: TaskResultCompletedContent,
  _send: SendFn,
): void {
  for (const id of content.processedTaskIds) {
    if (tasks$[id].peek()) {
      tasks$[id].isLocked.set(true);
    }
  }
  for (const id of content.rejectedTaskIds) {
    if (tasks$[id].peek()) {
      tasks$[id].isLocked.set(false);
    }
  }

  sync_session_state$.currentPhase.set('passive_wait');
  sync_session_state$.currentPhaseMessage.set('En attente des instructions du serveur...');
}
