// src/services/date.service.ts
export class DateService {
  static getMondayOfCurrentWeek(date: Date = new Date()): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  static getRelevantWeekStart(date: Date = new Date()): Date {
    const isFriday = date.getDay() === 5; // Friday
    const currentMonday = this.getMondayOfCurrentWeek(date);
    return isFriday ? this.addDays(currentMonday, 7) : currentMonday;
  }

  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  static addDays(date: Date, days: number): Date {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);
    return copy;
  }
}
