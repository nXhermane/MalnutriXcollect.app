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

export const tasksByPatient$ = observable<Record<string, LocalTask[]>>(() => {
  const all = Object.values(tasks$.get());
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMs = today.getTime();

  return all.reduce<Record<string, LocalTask[]>>((acc, t) => {
    const d = new Date(t.receivedAt);
    d.setHours(0, 0, 0, 0);
    if (d.getTime() === todayMs) {
      if (!acc[t.patientId]) acc[t.patientId] = [];
      acc[t.patientId].push(t);
    }
    return acc;
  }, {});
});

export const dailyStats$ = observable(() => {
  const byPatient = tasksByPatient$.get();
  const all = Object.values(byPatient).flat();
  const total = all.length;
  const done = all.filter((t) => t.localStatus === 'completed').length;
  return {
    total,
    done,
    remaining: total - done,
    pct: total > 0 ? Math.round((done / total) * 100) : 0,
  };
});

export const patientDayStats$ = observable<Record<string, { total: number; done: number }>>(() => {
  const byPatient = tasksByPatient$.get();
  const result: Record<string, { total: number; done: number }> = {};
  for (const [patientId, tasks] of Object.entries(byPatient)) {
    result[patientId] = {
      total: tasks.length,
      done: tasks.filter((t) => t.localStatus === 'completed').length,
    };
  }
  return result;
});

export const allTasksByPatient$ = observable<Record<string, LocalTask[]>>(() => {
  const all = Object.values(tasks$.get());
  return all.reduce<Record<string, LocalTask[]>>((acc, t) => {
    if (!acc[t.patientId]) acc[t.patientId] = [];
    acc[t.patientId].push(t);
    return acc;
  }, {});
});

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
