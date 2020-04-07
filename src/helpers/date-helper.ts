import dayJs from 'dayjs';

export class DateHelper {
  getDateFormat = (date: string): string => {
    return dayJs(date).format('DD MMM YYYY');
  };

  getFullTimeFormat = (date: string): string => {
    return dayJs(date).format('HH:mm:ss');
  };

  getShortTimeFormat = (date: string): string => {
    return dayJs(date).format('HH:mm');
  };

  getFullDate = (date: string): string => {
    return dayJs(date).format('DD MMM YYYY HH:mm:ss');
  };

  getCurrentDate = (): string => {
    return dayJs().format();
  };
}
