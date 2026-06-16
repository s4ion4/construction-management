import { Pipe, PipeTransform } from '@angular/core';
import { OrderType } from '../models/order-type.enum';
import { formatOrderType } from '../utils/project-formatters';

@Pipe({
  name: 'orderType',
})
export class OrderTypePipe implements PipeTransform {
  transform(value: OrderType): string {
    return formatOrderType(value);
  }
}
