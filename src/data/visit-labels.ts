import { AnthroSystemCodes } from '@/constants/anthropometric';
import { OBSERVATIONS, VITAL_SIGNS } from '@/constants/clinical';

export const anthroLabels: Record<string, string> = {
  [AnthroSystemCodes.WEIGHT]: 'Poids',
  [AnthroSystemCodes.HEIGHT]: 'Taille (debout)',
  [AnthroSystemCodes.LENGTH]: 'Longueur (couché)',
  [AnthroSystemCodes.MUAC]: 'PB (MUAC)',
  [AnthroSystemCodes.HEAD_CIRCUMFERENCE]: 'Périmètre crânien',
  [AnthroSystemCodes.TSF]: 'Pli cutané tricipital',
  [AnthroSystemCodes.SSF]: 'Pli cutané sous-scapulaire',
  [AnthroSystemCodes.LENHEI]: 'Taille / Longeur',
};

export const clinicalLabels: Record<string, string> = {
  [VITAL_SIGNS.TEMPERATURE]: 'Température',
  [VITAL_SIGNS.RESPIRATORY_RATE]: 'Fréq. respiratoire',
  [VITAL_SIGNS.PULSE_RATE]: 'Fréq. cardiaque',
  [OBSERVATIONS.EDEMA_PRESENCE]: 'Œdèmes',
  [OBSERVATIONS.EDEMA_GODET_COUNT]: 'Croix œdèmes',
  [OBSERVATIONS.CONSCIOUSNESS_LEVEL]: 'Conscience',
  [OBSERVATIONS.SUBCOSTAL_RETRACTION]: 'Tirage sous-costal',
  [OBSERVATIONS.SKIN_CHANGES]: 'Lésions cutanées',
};

export function getAnthroLabel(code: string): string {
  return anthroLabels[code] ?? code;
}

export function getClinicalLabel(code: string): string {
  return clinicalLabels[code] ?? code;
}

export function getBioLabel(code: string): string {
  return code;
}

export function formatClinicalValue(value: unknown): string {
  if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null && 'value' in value && 'unit' in value) {
    const v = value as { value: number; unit: string };
    return `${v.value} ${v.unit}`;
  }
  return String(value);
}
