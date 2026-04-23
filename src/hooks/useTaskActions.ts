import { logger } from '@/lib/utils/logger';
import type {
  CollectedField,
  LocalTask,
  LocalTaskStatus,
  SyncDataCollectionTask,
  SyncMonitoringTask,
  SyncTreatmentAction,
} from '@/schemas/task.schema';
import { tasks$ } from '@/store/tasks/tasks.store';
import { useCallback } from 'react';

function getTaskPayloadWindow(task: LocalTask): { validFrom: Date; expiresAt: Date } | null {
  const payload = task.payload as SyncTreatmentAction | SyncMonitoringTask;
  if (!('validFrom' in payload) || !('expiresAt' in payload)) return null;
  return {
    validFrom: new Date(payload.validFrom),
    expiresAt: new Date(payload.expiresAt),
  };
}

function getRequiredFieldCodes(task: LocalTask): string[] {
  switch (task.taskType) {
    case 'treatment_action': {
      const p = task.payload as SyncTreatmentAction;
      return p.onCompletionTasks.flatMap((t) => t.fields);
    }
    case 'monitoring_task': {
      const p = task.payload as SyncMonitoringTask;
      return p.resolvedTemplate.fields;
    }
    case 'data_collection_task': {
      const p = task.payload as SyncDataCollectionTask;
      return p.requirements.map((r) => r.code);
    }
  }
}

function setTaskStatus(taskId: string, status: LocalTaskStatus, extra?: Partial<LocalTask>): void {
  const current = tasks$[taskId].peek();
  if (!current) return;
  if (current.isLocked) {
    logger.warn('[useTaskActions] Cannot mutate locked task', taskId);
    return;
  }
  tasks$[taskId].set({ ...current, localStatus: status, ...extra });
}

export function collectFieldForTask(
  taskId: string,
  fieldCode: string,
  dataId: string,
  value: unknown,
): void {
  const current = tasks$[taskId].peek();
  if (!current) return;
  if (current.isLocked) {
    logger.warn('[collectFieldForTask] Cannot mutate locked task', taskId);
    return;
  }

  const now = new Date().toISOString();
  const alreadyCollected = current.collectedFields.some((f) => f.fieldCode === fieldCode);
  if (alreadyCollected) return;

  const newField: CollectedField = { fieldCode, dataId, collectedAt: now, value };
  const updatedFields = [...current.collectedFields, newField];

  const required = getRequiredFieldCodes(current);
  const collectedCodes = new Set(updatedFields.map((f) => f.fieldCode));
  const allCollected = required.length > 0 && required.every((c) => collectedCodes.has(c));

  const window = getTaskPayloadWindow(current);
  const isLate = window ? new Date() > window.expiresAt : false;

  if (allCollected) {
    tasks$[taskId].set({
      ...current,
      collectedFields: updatedFields,
      localStatus: 'completed',
      completedAt: now,
      reportedOccurrenceAt: now,
      isLateEntry: isLate,
    });
    logger.info('[collectFieldForTask] All fields collected → completed', taskId);
  } else {
    tasks$[taskId].set({ ...current, collectedFields: updatedFields });
    logger.info('[collectFieldForTask] Field collected', { taskId, fieldCode });
  }
}

export function useTaskActions() {
  const completeTask = useCallback((taskId: string, reportedOccurrenceAt?: string): void => {
    const now = new Date().toISOString();
    const current = tasks$[taskId].peek();
    if (!current) return;

    const window = getTaskPayloadWindow(current);
    const isLate = window ? new Date() > window.expiresAt : false;

    setTaskStatus(taskId, 'completed', {
      completedAt: now,
      reportedOccurrenceAt: reportedOccurrenceAt ?? now,
      isLateEntry: isLate,
    });
    logger.info('[useTaskActions] Task completed', taskId);
  }, []);

  const missTask = useCallback((taskId: string): void => {
    const now = new Date().toISOString();
    setTaskStatus(taskId, 'missed', { completedAt: null });
    logger.info('[useTaskActions] Task missed', { taskId, now });
  }, []);

  const skipTask = useCallback((taskId: string, reason: string): void => {
    const now = new Date().toISOString();
    setTaskStatus(taskId, 'skipped', { skippedAt: now, skippedReason: reason });
    logger.info('[useTaskActions] Task skipped', taskId);
  }, []);

  return { completeTask, missTask, skipTask };
}

export function evaluateMissedTask(taskId: string): void {
  const task = tasks$[taskId].peek();
  if (!task) return;
  if (task.localStatus !== 'pending_execution') return;
  if (task.isLocked) return;

  const window = getTaskPayloadWindow(task);
  if (!window) return;

  if (new Date() > window.expiresAt) {
    tasks$[taskId].set({ ...task, localStatus: 'missed', missedAt: new Date().toISOString() });
    logger.info('[evaluateMissedTask] Task auto-missed', taskId);
  }
}
