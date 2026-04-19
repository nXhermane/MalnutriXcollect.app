import type { CollectedField, LocalTask, TaskType } from '@/schemas/task.schema';
import { getNonPendingAndExportableTasks } from '@/store/tasks/tasks.store';
import { MessageType } from '../protocol/message-types';
import type { SendFn } from '../protocol/protocol-message';
import { sync_session_state$ } from '@/store/sync/sync-session.store';

interface TaskResult {
  taskId: string;
  taskType: TaskType;
  status: string;
  collectedFields: CollectedField[];
  completedAt: string | null;
  skippedAt: string | null;
  skippedReason: string | null;
  reportedOccurrenceAt: string | null;
  isLateEntry: boolean;
}

function toTaskResult(task: LocalTask): TaskResult {
  return {
    taskId: task.id,
    taskType: task.taskType,
    status: task.localStatus,
    collectedFields: task.collectedFields,
    completedAt: task.completedAt,
    skippedAt: task.skippedAt,
    skippedReason: task.skippedReason,
    reportedOccurrenceAt: task.reportedOccurrenceAt,
    isLateEntry: task.isLateEntry,
  };
}

export function handleTaskResultRequest(_content: null, send: SendFn): void {
  sync_session_state$.currentPhase.set('export_results');
  sync_session_state$.currentPhaseMessage.set('Export des résultats de tâches...');
  const nonPendingAndExportableTasks = getNonPendingAndExportableTasks();
  send({
    type: MessageType.CLIENT_SEND_TASK_RESULTS,
    content: {
      results: nonPendingAndExportableTasks.map(toTaskResult),
    },
  });
}
