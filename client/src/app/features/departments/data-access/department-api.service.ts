import { HttpResourceRef, httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DepartmentResponse } from '../models/department.response';

@Injectable({
  providedIn: 'root',
})
export class DepartmentApiService {
  private readonly departmentsUrl = 'api/departments';

  createDepartmentsResource(): HttpResourceRef<DepartmentResponse[]> {
    return httpResource<DepartmentResponse[]>(() => this.departmentsUrl, { defaultValue: [] });
  }
}
