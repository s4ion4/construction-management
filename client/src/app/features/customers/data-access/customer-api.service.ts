import { HttpResourceRef, httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomerResponse } from '../models/customer.response';

@Injectable({
  providedIn: 'root',
})
export class CustomerApiService {
  private readonly customersUrl = 'api/customers';

  createCustomersResource(): HttpResourceRef<CustomerResponse[]> {
    return httpResource<CustomerResponse[]>(() => this.customersUrl, { defaultValue: [] });
  }
}
