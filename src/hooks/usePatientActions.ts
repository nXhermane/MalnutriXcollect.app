import { logger } from '@/lib/utils/logger';
import { generateRandomId } from '@/lib/utils/random';
import { CreatePatientDto, Patient, UpdatePatientDto } from '@/schemas/patient.schema';
import { initPatientMeasures, measures$ } from '@/store/measures/measures.store';
import { patients$ } from '@/store/patients/patients.store';
import { getTasksForPatient, tasks$ } from '@/store/tasks/tasks.store';
import { visits$ } from '@/store/visits/visits.store';
import { useCallback } from 'react';

export function usePatientActions() {
  const createPatient = useCallback((dto: CreatePatientDto): Patient => {
    const now = new Date().toISOString();
    const id = generateRandomId();
    const patient: Patient = {
      id,
      ...dto,
      isLocked: false,
      createdAt: now,
      updatedAt: now,
    };
    patients$[id].set(patient);
    initPatientMeasures(id);
    logger.info('[usePatientActions] Patient created', id);
    return patient;
  }, []);

  const updatePatient = useCallback((id: string, dto: UpdatePatientDto): void => {
    const existing = patients$[id].peek();
    if (!existing) {
      logger.warn('[usePatientActions] Patient not found for update', id);
      return;
    }
    if (existing.isLocked) {
      logger.warn('[usePatientActions] Cannot update locked patient', id);
      return;
    }
    patients$[id].set({
      ...existing,
      ...dto,
      updatedAt: new Date().toISOString(),
    });
    logger.info('[usePatientActions] Patient updated', id);
  }, []);

  const deletePatient = useCallback((id: string, force: boolean = false) => {
    const existing = patients$[id].peek();
    if (!existing) return null;
    if (existing.isLocked && !force) {
      logger.warn('[usePatientActions] Cannot delete locked patient', id);
      return false;
    }
    const allPatients = { ...patients$.peek() };
    delete allPatients[id];
    patients$.set(allPatients);

    const allVisits = { ...visits$.peek() };
    delete allVisits[id];
    visits$.set(allVisits);

    const allMeasures = { ...measures$.peek() };
    delete allMeasures[id];
    measures$.set(allMeasures);

    const patientTasks = getTasksForPatient(id);
    const allTasks = { ...tasks$.peek() };
    patientTasks.forEach((task) => {
      delete allTasks[task.id];
    });
    tasks$.set(allTasks);

    logger.info('[usePatientActions] Patient deleted (cascade)', id);
    return true;
  }, []);

  const lockPatient = useCallback((id: string): void => {
    const existing = patients$[id].peek();
    if (!existing) return;
    patients$[id].set({ ...existing, isLocked: true, updatedAt: new Date().toISOString() });
    logger.info('[usePatientActions] Patient locked', id);
  }, []);

  return { createPatient, updatePatient, deletePatient, lockPatient };
}
