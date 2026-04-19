import { PatientStatus } from '@/schemas';

export const DAY_IN_MONTHS = 30.4375;
export const DAY_IN_YEARS = 365.25;
export const MONTH_IN_YEARS = 12;
export const MAX_AGE_IN_MONTH_IN_PEDIATRIC = 228; // 19 ans
export const DAY_IN_TWO_YEARS = Math.round(DAY_IN_YEARS * 2);
export const MAX_AGE_TO_USE_AGE_IN_DAY = DAY_IN_YEARS * 5;

export enum SystemCodes {
  AGE_IN_DAY = 'age_in_day',
  AGE_IN_MONTH = 'age_in_month',
}

export const STATUS_CONFIG: Record<
  PatientStatus,
  {
    label: string;
    pillBg: string;
    pillText: string;
    pillBorder: string;
    leftBar: string;
    pulse: boolean;
  }
> = {
  [PatientStatus.SEVERE_ACUTE_MALNUTRITION]: {
    label: 'MAS',
    pillBg: 'bg-red-500/15',
    pillText: 'text-red-400',
    pillBorder: 'border-red-400/30',
    leftBar: 'bg-red-500/70',
    pulse: true,
  },
  [PatientStatus.MODERATE_ACUTE_MALNUTRITION]: {
    label: 'MAM',
    pillBg: 'bg-amber-500/15',
    pillText: 'text-amber-400',
    pillBorder: 'border-amber-400/30',
    leftBar: 'bg-amber-500/60',
    pulse: false,
  },
  [PatientStatus.NEW]: {
    label: 'Nouveau',
    pillBg: 'bg-blue-500/15',
    pillText: 'text-blue-400',
    pillBorder: 'border-blue-400/30',
    leftBar: 'bg-blue-500/60',
    pulse: false,
  },
  [PatientStatus.NORMAL]: {
    label: 'Normal',
    pillBg: 'bg-green-500/15',
    pillText: 'text-green-400',
    pillBorder: 'border-green-400/30',
    leftBar: 'bg-green-500/50',
    pulse: false,
  },
  [PatientStatus.SEVERE_CHRONIC_MALNUTRITION]: {
    label: 'MCS',
    pillBg: 'bg-violet-500/15',
    pillText: 'text-violet-400',
    pillBorder: 'border-violet-400/30',
    leftBar: 'bg-violet-500/60',
    pulse: false,
  },
  [PatientStatus.MODERATE_CHRONIC_MALNUTRITION]: {
    label: 'MCM',
    pillBg: 'bg-violet-500/10',
    pillText: 'text-violet-300',
    pillBorder: 'border-violet-300/30',
    leftBar: 'bg-violet-400/40',
    pulse: false,
  },
  [PatientStatus.SEVERE_UNDERWEIGHT]: {
    label: 'Sous-poids',
    pillBg: 'bg-orange-500/15',
    pillText: 'text-orange-400',
    pillBorder: 'border-orange-400/30',
    leftBar: 'bg-orange-500/60',
    pulse: false,
  },
  [PatientStatus.MODERATE_UNDERWEIGHT]: {
    label: 'Sous-poids',
    pillBg: 'bg-orange-500/10',
    pillText: 'text-orange-300',
    pillBorder: 'border-orange-300/30',
    leftBar: 'bg-orange-400/40',
    pulse: false,
  },
  [PatientStatus.OBESITY]: {
    label: 'Obésité',
    pillBg: 'bg-pink-500/15',
    pillText: 'text-pink-400',
    pillBorder: 'border-pink-400/30',
    leftBar: 'bg-pink-500/60',
    pulse: false,
  },
  [PatientStatus.OVERWEIGHT]: {
    label: 'Surpoids',
    pillBg: 'bg-pink-500/10',
    pillText: 'text-pink-300',
    pillBorder: 'border-pink-300/30',
    leftBar: 'bg-pink-400/40',
    pulse: false,
  },
};
