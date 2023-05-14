import { Pipe, PipeTransform } from '@angular/core';
import { isNullOrUndefined } from '../util/validatord';
import { getMonthLocaleString } from '../util/mouth';

@Pipe({
  name: 'month',
})
export class MonthPipe implements PipeTransform {
  transform(value: string, start: number = 0): string {
    const month = parseInt(value);
    if (isNullOrUndefined(value) && isNaN(month)) return value;
    return getMonthLocaleString(month - start);
  }
}
