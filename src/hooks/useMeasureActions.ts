import { MeasureCategory } from '@/constants';
import { logger } from '@/lib/utils/logger';
import { generateRandomId } from '@/lib/utils/random';
import {
  AnthropometricMeasure,
  CreateAnthropometricMeasureDto,
} from '@/schemas/anthropometric-measure.schema';
import { BiologicalMeasure, CreateBiologicalMeasureDto } from '@/schemas/biological-measure.schema';
import {
  ClinicalFieldMeasure,
  CreateClinicalFieldMeasureDto,
} from '@/schemas/clinical-field-measure.schema';
import { getOrInitPatientMeasures, measures$ } from '@/store/measures/measures.store';
import { visits$ } from '@/store/visits/visits.store';
import { useCallback } from 'react';

export function useMeasureActions() {
  const addAnthropometricMeasure = useCallback(
    (
      patientId: string,
      dto: CreateAnthropometricMeasureDto,
      visitId?: string,
    ): AnthropometricMeasure => {
      const now = new Date().toISOString();
      logger.info('on patient measure', now);
      const current = getOrInitPatientMeasures(patientId);
      logger.info('onMeureas', current);
      if (visitId) {
        const visitMeasureIds = _getVisitMeasureIds(patientId, visitId, MeasureCategory.ANTHRO);
        const existing = current[MeasureCategory.ANTHRO].find(
          (m) => visitMeasureIds.has(m.id) && m.code === dto.code,
        );
        if (existing) {
          const updated: AnthropometricMeasure = {
            ...existing,
            value: dto.value,
            unit: dto.unit,
            updatedAt: now,
          };
          measures$[patientId].set({
            ...current,
            [MeasureCategory.ANTHRO]: current[MeasureCategory.ANTHRO].map((m) =>
              m.id === existing.id ? updated : m,
            ),
          });
          logger.info('[useMeasureActions] Anthropometric updated (upsert)', existing.id);
          return updated;
        }
      }

      const measure: AnthropometricMeasure = {
        id: generateRandomId(),
        ...dto,
        isLocked: false,
        createdAt: now,
        updatedAt: now,
      };
      measures$[patientId].set({
        ...current,
        [MeasureCategory.ANTHRO]: [...current[MeasureCategory.ANTHRO], measure],
      });
      if (visitId) {
        _attachMeasureToVisit(patientId, visitId, MeasureCategory.ANTHRO, measure.id);
      }
      logger.info('[useMeasureActions] Anthropometric added', measure.id);
      return measure;
    },
    [],
  );

  const addClinicalFieldMeasure = useCallback(
    (
      patientId: string,
      dto: CreateClinicalFieldMeasureDto,
      visitId?: string,
    ): ClinicalFieldMeasure => {
      const now = new Date().toISOString();
      const current = getOrInitPatientMeasures(patientId);

      if (visitId) {
        const visitMeasureIds = _getVisitMeasureIds(patientId, visitId, MeasureCategory.FIELD);
        const existing = current[MeasureCategory.FIELD].find(
          (m) => visitMeasureIds.has(m.id) && m.code === dto.code,
        );
        if (existing) {
          const updated: ClinicalFieldMeasure = { ...existing, value: dto.value, updatedAt: now };
          measures$[patientId].set({
            ...current,
            [MeasureCategory.FIELD]: current[MeasureCategory.FIELD].map((m) =>
              m.id === existing.id ? updated : m,
            ),
          });
          logger.info('[useMeasureActions] Clinical field updated (upsert)', existing.id);
          return updated;
        }
      }

      const measure: ClinicalFieldMeasure = {
        id: generateRandomId(),
        ...dto,
        isLocked: false,
        createdAt: now,
        updatedAt: now,
      };
      measures$[patientId].set({
        ...current,
        [MeasureCategory.FIELD]: [...current[MeasureCategory.FIELD], measure],
      });
      if (visitId) {
        _attachMeasureToVisit(patientId, visitId, MeasureCategory.FIELD, measure.id);
      }
      logger.info('[useMeasureActions] Clinical field added', measure.id);
      return measure;
    },
    [],
  );

  const addBiologicalMeasure = useCallback(
    (patientId: string, dto: CreateBiologicalMeasureDto, visitId?: string): BiologicalMeasure => {
      const now = new Date().toISOString();
      const current = getOrInitPatientMeasures(patientId);

      if (visitId) {
        const visitMeasureIds = _getVisitMeasureIds(patientId, visitId, MeasureCategory.BIOLOGICAL);
        const existing = current[MeasureCategory.BIOLOGICAL].find(
          (m) => visitMeasureIds.has(m.id) && m.code === dto.code,
        );
        if (existing) {
          const updated: BiologicalMeasure = {
            ...existing,
            value: dto.value,
            unit: dto.unit,
            updatedAt: now,
          };
          measures$[patientId].set({
            ...current,
            [MeasureCategory.BIOLOGICAL]: current[MeasureCategory.BIOLOGICAL].map((m) =>
              m.id === existing.id ? updated : m,
            ),
          });
          logger.info('[useMeasureActions] Biological updated (upsert)', existing.id);
          return updated;
        }
      }

      const measure: BiologicalMeasure = {
        id: generateRandomId(),
        ...dto,
        isLocked: false,
        createdAt: now,
        updatedAt: now,
      };
      measures$[patientId].set({
        ...current,
        [MeasureCategory.BIOLOGICAL]: [...current[MeasureCategory.BIOLOGICAL], measure],
      });
      if (visitId) {
        _attachMeasureToVisit(patientId, visitId, MeasureCategory.BIOLOGICAL, measure.id);
      }
      logger.info('[useMeasureActions] Biological added', measure.id);
      return measure;
    },
    [],
  );

  const deleteMeasure = useCallback(
    (patientId: string, measureId: string, category: MeasureCategory): void => {
      const current = measures$[patientId].peek();
      if (!current) return;

      const target = current[category].find((m) => m.id === measureId);
      if (!target) return;
      if (target.isLocked) {
        logger.warn('[useMeasureActions] Cannot delete locked measure', measureId);
        return;
      }

      measures$[patientId].set({
        ...current,
        [category]: current[category].filter((m) => m.id !== measureId),
      });
      logger.info('[useMeasureActions] Measure deleted', measureId);
    },
    [],
  );

  const updateMeasure = useCallback(
    (
      patientId: string,
      measureId: string,
      category: MeasureCategory,
      patch: Record<string, unknown>,
    ): void => {
      const current = measures$[patientId].peek();
      if (!current) return;

      const list = current[category] as { id: string; isLocked: boolean }[];
      const target = list.find((m) => m.id === measureId);
      if (!target) return;
      if (target.isLocked) {
        logger.warn('[useMeasureActions] Cannot update locked measure', measureId);
        return;
      }

      const now = new Date().toISOString();
      measures$[patientId].set({
        ...current,
        [category]: list.map((m) => (m.id === measureId ? { ...m, ...patch, updatedAt: now } : m)),
      });
      logger.info('[useMeasureActions] Measure updated', measureId);
    },
    [],
  );

  return {
    addAnthropometricMeasure,
    addClinicalFieldMeasure,
    addBiologicalMeasure,
    deleteMeasure,
    updateMeasure,
    checkFreshMeasure,
  };
}

export function checkFreshMeasure(
  patientId: string,
  code: string,
  category: MeasureCategory,
  freshnessWindowInMinutes: number,
) {
  const current = measures$[patientId].peek();
  if (!current) return null;

  const list = current[category];
  const sorted = [...list]
    .filter((m) => m.code === code)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const latest = sorted[0];
  if (!latest) return null;

  const windowMs = freshnessWindowInMinutes * 60 * 1000;
  const isFresh = Date.now() - new Date(latest.createdAt).getTime() <= windowMs;
  if (!isFresh) return null;

  return {
    id: latest.id,
    value: latest.value,
    unit: 'unit' in latest ? latest.unit : undefined,
    createdAt: latest.createdAt,
  };
}

function _getVisitMeasureIds(
  patientId: string,
  visitId: string,
  category: MeasureCategory,
): Set<string> {
  const patientVisits = visits$[patientId].peek() ?? [];
  const visit = patientVisits.find((v) => v.id === visitId);
  return new Set(visit?.measureIds[category] ?? []);
}

function _attachMeasureToVisit(
  patientId: string,
  visitId: string,
  category: MeasureCategory,
  measureId: string,
): void {
  const patientVisits = visits$[patientId].peek() ?? [];
  const updated = patientVisits.map((v) => {
    if (v.id !== visitId) return v;
    return {
      ...v,
      measureIds: {
        ...v.measureIds,
        [category]: [...v.measureIds[category], measureId],
      },
      updatedAt: new Date().toISOString(),
    };
  });
  visits$[patientId].set(updated);
}
