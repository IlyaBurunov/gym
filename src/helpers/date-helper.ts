import dayJs from 'dayjs';

export function getDateFormat(date: string): string {
  return dayJs(date).format('DD MMM YYYY');
}

export function getCurrentDate(): string {
  return dayJs().format();
}

export class DateHelper {
  static getDateFormat = (date: string): string => {
    return dayJs(date).format('DD MMM YYYY');
  };

  static getFullTimeFormat = (date: string): string => {
    return dayJs(date).format('HH:mm:ss');
  };

  static getShortTimeFormat = (date: string): string => {
    return dayJs(date).format('HH:mm');
  };

  static getFullDate = (date: string): string => {
    return dayJs(date).format('DD MMM YYYY HH:mm:ss');
  };

  static getCurrentDate = (): string => {
    return dayJs().format();
  };
}
