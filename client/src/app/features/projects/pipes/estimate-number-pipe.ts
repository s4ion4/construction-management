import { Pipe, PipeTransform } from '@angular/core';
import { EstimateNumberResponse } from '../models/project.response';
import { formatEstimateNumber } from '../utils/project-formatters';

@Pipe({
  name: 'estimateNumber',
})
export class EstimateNumberPipe implements PipeTransform {
  transform(estimateNumber: EstimateNumberResponse | null): string {
    return formatEstimateNumber(estimateNumber);
  }
}
