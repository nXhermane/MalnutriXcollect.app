import { MeasureCategory } from '@/constants';
import { logger } from '@/lib/utils/logger';
import { generateRandomId } from '@/lib/utils/random';
import { Visit, emptyMeasureIds } from '@/schemas/visit.schema';
import { measures$ } from '@/store/measures/measures.store';
import { visits$ } from '@/store/visits/visits.store';
import { useCallback } from 'react';

export function useVisitActions() {
  const createVisit = useCallback((patientId: string): Visit => {
    const now = new Date().toISOString();
    const newVisit: Visit = {
      id: generateRandomId(),
      patientId,
      measureIds: emptyMeasureIds(),
      isExported: false,
      isLocked: false,
      createdAt: now,
      updatedAt: now,
    };
    const current = visits$[patientId].peek(); // !possible to be undefined
    if (!current) visits$[patientId].set([newVisit]);
    else visits$[patientId].set([...current, newVisit]);
    logger.info('[useVisitActions] New visit created', newVisit.id);
    return newVisit;
  }, []);

  const lockVisit = useCallback((patientId: string, visitId: string): void => {
    const patientVisits = visits$[patientId].peek() ?? [];
    const updated = patientVisits.map((v) => {
      if (v.id !== visitId) return v;
      return { ...v, isLocked: true, isExported: true, updatedAt: new Date().toISOString() };
    });
    visits$[patientId].set(updated);

    const patientMeasures = measures$[patientId].peek();
    if (!patientMeasures) return;

    const visit = updated.find((v) => v.id === visitId);
    if (!visit) return;

    const lockIds = new Set([
      ...visit.measureIds[MeasureCategory.ANTHRO],
      ...visit.measureIds[MeasureCategory.FIELD],
      ...visit.measureIds[MeasureCategory.BIOLOGICAL],
    ]);

    measures$[patientId].set({
      [MeasureCategory.ANTHRO]: patientMeasures[MeasureCategory.ANTHRO].map((m) =>
        lockIds.has(m.id) ? { ...m, isLocked: true } : m,
      ),
      [MeasureCategory.FIELD]: patientMeasures[MeasureCategory.FIELD].map((m) =>
        lockIds.has(m.id) ? { ...m, isLocked: true } : m,
      ),
      [MeasureCategory.BIOLOGICAL]: patientMeasures[MeasureCategory.BIOLOGICAL].map((m) =>
        lockIds.has(m.id) ? { ...m, isLocked: true } : m,
      ),
    });

    logger.info('[useVisitActions] Visit locked (cascade)', visitId);
  }, []);

  const deleteVisit = useCallback((patientId: string, visitId: string): void => {
    const patientVisits = visits$[patientId].peek() ?? [];
    const visit = patientVisits.find((v) => v.id === visitId);
    if (!visit) return;
    if (visit.isLocked) {
      logger.warn('[useVisitActions] Cannot delete locked visit', visitId);
      return;
    }
    visits$[patientId].set(patientVisits.filter((v) => v.id !== visitId));
    logger.info('[useVisitActions] Visit deleted', visitId);
  }, []);

  return { createVisit, lockVisit, deleteVisit };
}
