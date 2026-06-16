import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { ProjectResponse } from '../models/project.response';
import { DisplayField } from '../../../shared/components/display-field/display-field';
import { OrderTypePipe } from '../pipes/order-type-pipe';
import { EstimateNumberPipe } from '../pipes/estimate-number-pipe';

@Component({
  selector: 'app-project-view',
  imports: [DisplayField, DatePipe, OrderTypePipe, EstimateNumberPipe],
  templateUrl: './project-view.html',
  styleUrl: './project-view.scss',
})
export class ProjectView {
  readonly project = input.required<ProjectResponse>();
}
