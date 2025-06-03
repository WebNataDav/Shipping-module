import { DateFormat } from '@constants';
import { format } from 'date-fns';

export const formatDate = (date?: Date) => {
  if (!date) {
    return;
  }
  return format(date, DateFormat.HistoryDate);
};

export const formatValueDate = (date?: string) => {
  if (!date) {
    return;
  }
  return format(date, DateFormat.PrintValueDate);
};
