export class HumanDateFormatter {
  private static parseDate(dateStr: string): Date {
    if (!dateStr || typeof dateStr !== 'string') {
      throw new Error('Date invalide : chaîne vide ou non valide');
    }

    const trimmed = dateStr.trim();

    // Format ISO 8601 (avec ou sans heure)
    if (trimmed.match(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/)) {
      const date = new Date(trimmed);
      if (isNaN(date.getTime())) {
        throw new Error(`Date invalide : ${dateStr}`);
      }
      return date;
    }

    // Format DD/MM/YYYY ou DD/MM/YYYY HH:MM
    const ddmmMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(\s+(\d{1,2}):(\d{2}))?/);
    if (ddmmMatch) {
      const day = parseInt(ddmmMatch[1], 10);
      const month = parseInt(ddmmMatch[2], 10);
      const year = parseInt(ddmmMatch[3], 10);
      const hour = ddmmMatch[5] ? parseInt(ddmmMatch[5], 10) : 0;
      const minute = ddmmMatch[6] ? parseInt(ddmmMatch[6], 10) : 0;

      const date = new Date(year, month - 1, day, hour, minute);
      if (
        isNaN(date.getTime()) ||
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
      ) {
        throw new Error(`Date invalide : ${dateStr}`);
      }
      return date;
    }

    // Format MM/DD/YYYY ou MM/DD/YYYY HH:MM
    const mmddMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(\s+(\d{1,2}):(\d{2}))?/);
    if (mmddMatch) {
      const month = parseInt(mmddMatch[1], 10);
      const day = parseInt(mmddMatch[2], 10);
      const year = parseInt(mmddMatch[3], 10);
      const hour = mmddMatch[5] ? parseInt(mmddMatch[5], 10) : 0;
      const minute = mmddMatch[6] ? parseInt(mmddMatch[6], 10) : 0;

      // Vérification basique pour distinguer MM/DD de DD/MM
      // Si le premier nombre > 12, c'est probablement DD/MM
      if (month > 12 && day <= 12) {
        const date = new Date(year, day - 1, month, hour, minute);
        if (isNaN(date.getTime())) {
          throw new Error(`Date invalide : ${dateStr}`);
        }
        return date;
      }

      const date = new Date(year, month - 1, day, hour, minute);
      if (
        isNaN(date.getTime()) ||
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
      ) {
        throw new Error(`Date invalide : ${dateStr}`);
      }
      return date;
    }

    throw new Error(`Format de date non supporté : ${dateStr}`);
  }

  private static getMonthsDifference(startDate: Date, endDate: Date): number {
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

  static formatAgeInMonths(birthDateString: string): string {
    try {
      const birthDate = this.parseDate(birthDateString);
      const now = new Date();

      if (birthDate > now) {
        throw new Error('La date de naissance ne peut pas être dans le futur');
      }

      const months = this.getMonthsDifference(birthDate, now);
      return `${months} mois`;
    } catch (error: unknown) {
      throw new Error(`Erreur lors du formatage de l'âge en mois : ${error}`);
    }
  }

  static formatFollowUpDate(dateString: string): string {
    try {
      const date = this.parseDate(dateString);
      const day = date.getDate();
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      const currentYear = new Date().getFullYear();
      const shortMonths = [
        'jan',
        'fév',
        'mar',
        'avr',
        'mai',
        'jun',
        'jul',
        'aoû',
        'sep',
        'oct',
        'nov',
        'déc',
      ];

      const shortMonth = shortMonths[monthIndex];
      return `${day} ${shortMonth}. ${year === currentYear ? '' : year.toString()}`;
    } catch (error: unknown) {
      throw new Error(`Erreur lors du formatage de la date de suivi : ${error}`);
    }
  }
}

export function formatAgeWithConversion(
  ageInDays: number,
  daysPerMonth = 30.44,
  daysPerYear = 365.25,
) {
  // Arrondir ageInDays pour éviter les virgules
  const days = Math.round(ageInDays);

  const years = Math.floor(days / daysPerYear);
  const remainingDaysAfterYears = days - years * daysPerYear;
  const months = Math.floor(remainingDaysAfterYears / daysPerMonth);

  // Construire la partie de conversion
  let conversion = '';

  if (years > 0 && months > 0) {
    // Ex: "2 ans 11 mois"
    const yearText = years === 1 ? 'an' : 'ans';
    conversion = `${years} ${yearText} ${months} mois`;
  } else if (years > 0 && months === 0) {
    // Ex: "1 an", "2 ans"
    const yearText = years === 1 ? 'an' : 'ans';
    conversion = `${years} ${yearText}`;
  } else if (years === 0 && months > 0) {
    // Ex: "3 mois", "11 mois"
    conversion = `${months} mois`;
  } else {
    // Moins d'un mois (très rare en suivi de croissance)
    conversion = `${days} jours`;
  }

  return `${days} jours (${conversion})`;
}

export function getAgeInDays(birthDateString: string) {
  const birthDate = new Date(birthDateString);
  const now = new Date();
  const timeDifference = now.getTime() - birthDate.getTime();
  const ageInDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  return ageInDays;
}
