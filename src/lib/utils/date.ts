export function toDatetime(date: Date) {
  const dateStr = date.toISOString();
  return dateStr.slice(0, dateStr.lastIndexOf(':'));
}

export function formatAgeWithConversion(
  ageInDays: number,
  daysPerMonth = 30.44,
  daysPerYear = 365.25,
) {
  const days = Math.round(ageInDays);
  const years = Math.floor(days / daysPerYear);
  const remainingDaysAfterYears = days - years * daysPerYear;
  const months = Math.floor(remainingDaysAfterYears / daysPerMonth);

  let conversion = '';
  if (years > 0 && months > 0) {
    const yearText = years === 1 ? 'an' : 'ans';
    conversion = `${years} ${yearText} ${months} mois`;
  } else if (years > 0 && months === 0) {
    const yearText = years === 1 ? 'an' : 'ans';
    conversion = `${years} ${yearText}`;
  } else if (years === 0 && months > 0) {
    conversion = `${months} mois`;
  } else {
    conversion = `${days} jours`;
  }

  return `${days} jours (${conversion})`;
}

export function getMonthsDifference(startDate: Date, endDate: Date): number {
  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();
  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth();

  let months = (endYear - startYear) * 12 + (endMonth - startMonth);
  if (endDate.getDate() < startDate.getDate()) {
    months--;
  }

  return Math.max(0, months);
}

export function formatAgeInMonths(birthDate: Date): string {
  try {
    const now = new Date();
    if (birthDate > now) {
      throw new Error('La date de naissance ne peut pas être dans le futur');
    }
    const months = getMonthsDifference(birthDate, now);
    return `${months} mois`;
  } catch (error: unknown) {
    throw new Error(`Erreur lors du formatage de l'âge en mois : ${error}`);
  }
}
