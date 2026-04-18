import type { LocalTask, LocalTaskStatus } from '@/schemas/task.schema';
import { ObservablePersistMMKV } from '@/store/config';
import { observable } from '@legendapp/state';
import { synced } from '@legendapp/state/sync';

export const tasks$ = observable<Record<string, LocalTask>>(
  synced({
    persist: { name: 'tasks', plugin: ObservablePersistMMKV },
    initial: {},
  }),
);

export function getTasksForPatient(patientId: string, status?: LocalTaskStatus): LocalTask[] {
  const all = Object.values(tasks$.peek());
  return all.filter((t) => t.patientId === patientId && (!status || t.localStatus === status));
}

export function getPendingTasksForPatient(patientId: string): LocalTask[] {
  return getTasksForPatient(patientId, 'pending_execution');
}

export function getNonPendingAndExportableTasks(): LocalTask[] {
  return Object.values(tasks$.peek()).filter(
    (t) => !t.isLocked && t.localStatus !== 'pending_execution',
  );
}
