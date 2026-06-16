import { HttpResourceRef, httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmployeeResponse } from '../models/employee.response';

@Injectable({
  providedIn: 'root',
})
export class EmployeeApiService {
  private readonly employeesUrl = 'api/employees';

  createEmployeesResource(): HttpResourceRef<EmployeeResponse[]> {
    return httpResource<EmployeeResponse[]>(() => this.employeesUrl, { defaultValue: [] });
  }
}
