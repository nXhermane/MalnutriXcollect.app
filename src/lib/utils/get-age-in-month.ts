import { DAY_IN_MONTHS } from '@/constants';

export function getAgeInDayAndMonth(birthdate: Date) {
  const now = new Date();
  const diffInMs = now.getTime() - birthdate.getTime();
  const ageInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  return { inMonths: ageInDays / DAY_IN_MONTHS, inDays: ageInDays };
}
