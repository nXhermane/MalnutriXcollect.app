import type { LocalTask, TaskBundle, TaskType } from '@/schemas/task.schema';
import { tasks$ } from '@/store/tasks/tasks.store';
import { MessageType } from '../protocol/message-types';
import type { SendFn } from '../protocol/protocol-message';
import { sync_session_state$ } from '@/store/sync/sync-session.store';

interface TaskImportContent {
  taskBundles: TaskBundle[];
}

const TASK_TYPE_MAP = {
  treatmentActions: 'treatment_action',
  monitoringTasks: 'monitoring_task',
  dataCollectionTasks: 'data_collection_task',
} as const satisfies Record<keyof Omit<TaskBundle, 'patientId'>, TaskType>;

export function handleTaskImport(content: TaskImportContent, send: SendFn): void {
  sync_session_state$.currentPhase.set('import_tasks');
  sync_session_state$.currentPhaseMessage.set('Importation des tâches de soins en cours...');

  const receivedTaskIds: string[] = [];
  const now = new Date().toISOString();

  for (const bundle of content.taskBundles) {
    const keys = Object.keys(TASK_TYPE_MAP) as (keyof typeof TASK_TYPE_MAP)[];
    for (const key of keys) {
      const taskType = TASK_TYPE_MAP[key];
      for (const task of bundle[key]) {
        receivedTaskIds.push(task.id);

        if (tasks$[task.id] && tasks$[task.id].peek()) {
          continue;
        }

        const localTask: LocalTask = {
          id: task.id,
          patientId: bundle.patientId,
          taskType,
          payload: task,
          localStatus: 'pending_execution',
          isLocked: false,
          collectedFields: [],
          completedAt: null,
          skippedAt: null,
          skippedReason: null,
          reportedOccurrenceAt: null,
          isLateEntry: false,
          receivedAt: now,
        };
        tasks$[task.id].set(localTask);
      }
    }
  }

  send({
    type: MessageType.CLIENT_ACK_ACTIVE_TASKS,
    content: {
      receivedTaskIds,
      timestamp: Date.now(),
    },
  });

  sync_session_state$.currentPhase.set('passive_wait');
  sync_session_state$.currentPhaseMessage.set('En attente des instructions du serveur...');
}
