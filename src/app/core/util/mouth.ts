import { isNullOrUndefined } from './validatord';

export function getMonthOfYear() {
  const months: string[] = [];
  for (let month = 0; month < 12; month++) {
    const date = new Date(2000, month); // Use any year, as it doesn't affect the month names
    const monthName = date.toLocaleString('default', { month: 'long' });
    months.push(monthName);
  }
  return months;
}

export function getMonthLocaleString(month: number): string {
  const date = new Date(2000, month);
  const monthName = date.toLocaleString('default', { month: 'long' });
  return monthName;
}

export function getMonthNumber(monthName: string): number | null {
  const date = new Date(`${monthName} 1, 2000`);
  if (isNaN(date.getTime())) {
    return null;
  }
  return date.getMonth() + 1;
}

export function generateMonthArray(compareYear?: number, numberStart = 0) {
  const currentDate = new Date();
  const months: { name: string; value: string; disabled: boolean }[] = [];
  for (let month = 0; month < 12; month++) {
    const date = new Date(2000, month);
    const monthName = date.toLocaleString('default', { month: 'long' });
    let disabled: boolean = false;
    if (compareYear && !isNullOrUndefined(compareYear)) {
      const currentYear: number = currentDate.getFullYear();
      const isCurrentYear: boolean = currentYear === compareYear;
      if (isCurrentYear) {
        const currentMount: number = currentDate.getMonth();
        disabled = currentMount < month;
      }
    }
    months.push({
      value: (month + numberStart).toString().padStart(2, '0'),
      name: monthName,
      disabled: disabled,
    });
  }
  return months;
}
