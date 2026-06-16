import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { orderTypeLabels, OrderType } from '../models/order-type.enum';
import { ProjectResponse } from '../models/project.response';
import { ProjectFormValue } from './project-form.type';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { projectCodeValidator } from '../validators/project-code.validator';
import { customerCodeValidator } from '../validators/customer-code.validator';
import { estimateNumberValidator } from '../validators/estimate-number.validator';
import { ParentInvalidErrorStateMatcher } from '../validators/parent-invalid-error-state-matcher';
import { AutocompletePanelOpenErrorStateMatcher } from '../validators/autocomplete-panel-open-error-state-matcher';
import { CustomerApiService } from '../../customers/data-access/customer-api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { DepartmentApiService } from '../../departments/data-access/department-api.service';
import { EmployeeApiService } from '../../employees/data-access/employee-api.service';
import { projectCodeUniqueValidator } from '../validators/project-code-unique.validator';
import { ProjectApiService } from '../data-access/project-api.service';

@Component({
  selector: 'app-project-form',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
  ],
  templateUrl: './project-form.html',
  styleUrl: './project-form.scss',
})
export class ProjectForm implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly projectApiService = inject(ProjectApiService);
  private readonly customerApiService = inject(CustomerApiService);
  private readonly departmentApiService = inject(DepartmentApiService);
  private readonly employeeApiService = inject(EmployeeApiService);

  readonly project = input<ProjectResponse | null>(null);
  readonly submitted = output<ProjectFormValue>();

  private readonly customerCodeTrigger =
    viewChild.required<MatAutocompleteTrigger>('customerCodeTrigger');

  protected readonly parentInvalidMatcher = new ParentInvalidErrorStateMatcher();
  protected readonly orderTypeLabels = orderTypeLabels;
  protected readonly customerCodeMatcher = new AutocompletePanelOpenErrorStateMatcher(
    () => this.customerCodeTrigger().panelOpen,
  );

  protected readonly form = this.formBuilder.nonNullable.group({
    projectCode: this.formBuilder.nonNullable.control('', {
      validators: [Validators.required, Validators.maxLength(10), projectCodeValidator],
      asyncValidators: [projectCodeUniqueValidator(this.projectApiService)],
    }),
    name: ['', [Validators.required, Validators.maxLength(50)]],
    orderDate: this.formBuilder.control<Date | null>(null, Validators.required),
    orderType: this.formBuilder.control<OrderType | null>(null, Validators.required),
    estimateNumber: this.formBuilder.nonNullable.group(
      {
        mainNumber: '',
        branchNumber: '',
      },
      { validators: estimateNumberValidator },
    ),
    customer: this.formBuilder.nonNullable.group({
      id: '',
      code: ['', [Validators.required, Validators.maxLength(8), customerCodeValidator]],
      name: { value: '', disabled: true },
    }),
    customerContactName: ['', Validators.maxLength(20)],
    department: this.formBuilder.nonNullable.group({
      id: '',
      code: '',
      name: { value: '', disabled: true },
    }),
    salesStaff: this.formBuilder.nonNullable.group({
      id: '',
      code: '',
      name: { value: '', disabled: true },
    }),
    constructionStaff: this.formBuilder.nonNullable.group({
      id: '',
      code: '',
      name: { value: '', disabled: true },
    }),
  });

  protected readonly nameFocused = signal(false);
  protected readonly customerContactNameFocused = signal(false);

  protected readonly filteredCustomers = computed(() => {
    const query = this.customerCodeValue().toLowerCase();
    return this.customersResource
      .value()
      .filter(
        (c) => c.customerCode.toLowerCase().includes(query) || c.name.toLowerCase().includes(query),
      );
  });

  protected readonly filteredDepartments = computed(() => {
    const query = this.departmentCodeValue().toLowerCase();
    return this.departmentsResource
      .value()
      .filter(
        (d) =>
          d.departmentCode.toLowerCase().includes(query) || d.name.toLowerCase().includes(query),
      );
  });

  protected readonly filteredSalesStaff = computed(() => {
    const query = this.salesStaffCodeValue().toLowerCase();
    return this.employeesResource
      .value()
      .filter(
        (e) => e.employeeCode.toLowerCase().includes(query) || e.name.toLowerCase().includes(query),
      );
  });

  protected readonly filteredConstructionStaff = computed(() => {
    const query = this.constructionStaffCodeValue().toLowerCase();
    return this.employeesResource
      .value()
      .filter(
        (e) => e.employeeCode.toLowerCase().includes(query) || e.name.toLowerCase().includes(query),
      );
  });

  private readonly customersResource = this.customerApiService.createCustomersResource();
  private readonly departmentsResource = this.departmentApiService.createDepartmentsResource();
  private readonly employeesResource = this.employeeApiService.createEmployeesResource();

  private readonly customerCodeValue = toSignal(
    this.form.controls.customer.controls.code.valueChanges,
    { initialValue: '' },
  );
  private readonly departmentCodeValue = toSignal(
    this.form.controls.department.controls.code.valueChanges,
    { initialValue: '' },
  );
  private readonly salesStaffCodeValue = toSignal(
    this.form.controls.salesStaff.controls.code.valueChanges,
    { initialValue: '' },
  );
  private readonly constructionStaffCodeValue = toSignal(
    this.form.controls.constructionStaff.controls.code.valueChanges,
    { initialValue: '' },
  );

  ngOnInit(): void {
    const project = this.project();
    if (project === null) {
      return;
    }
    this.initializeForm(project);
  }

  get isDirty(): boolean {
    return this.form.dirty;
  }

  markAsPristine(): void {
    this.form.markAsPristine();
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.form.pending) {
      return;
    }
    this.submitted.emit(this.form.getRawValue());
  }

  protected onCustomerSelected(event: MatAutocompleteSelectedEvent): void {
    const code = event.option.value as string;
    const customer = this.customersResource.value().find((c) => c.customerCode === code);
    if (customer === undefined) {
      return;
    }
    this.form.controls.customer.controls.id.setValue(customer.id);
    this.form.controls.customer.controls.name.setValue(customer.name);
  }

  protected onDepartmentSelected(event: MatAutocompleteSelectedEvent): void {
    const code = event.option.value as string;
    const department = this.departmentsResource.value().find((d) => d.departmentCode === code);
    if (department === undefined) {
      return;
    }
    this.form.controls.department.controls.id.setValue(department.id);
    this.form.controls.department.controls.name.setValue(department.name);
  }

  protected onSalesStaffSelected(event: MatAutocompleteSelectedEvent): void {
    const code = event.option.value as string;
    const employee = this.employeesResource.value().find((e) => e.employeeCode === code);
    if (employee === undefined) {
      return;
    }
    this.form.controls.salesStaff.controls.id.setValue(employee.id);
    this.form.controls.salesStaff.controls.name.setValue(employee.name);
  }

  protected onConstructionStaffSelected(event: MatAutocompleteSelectedEvent): void {
    const code = event.option.value as string;
    const employee = this.employeesResource.value().find((e) => e.employeeCode === code);
    if (employee === undefined) {
      return;
    }
    this.form.controls.constructionStaff.controls.id.setValue(employee.id);
    this.form.controls.constructionStaff.controls.name.setValue(employee.name);
  }

  protected onCustomerCodeBlur(): void {
    const code = this.form.controls.customer.controls.code.value;
    const matched = this.customersResource.value().some((c) => c.customerCode === code);
    if (matched) {
      return;
    }
    this.form.controls.customer.setValue({ id: '', code: '', name: '' });
    this.form.controls.customer.markAsDirty();
  }

  protected onDepartmentCodeBlur(): void {
    const code = this.form.controls.department.controls.code.value;
    const matched = this.departmentsResource.value().some((d) => d.departmentCode === code);
    if (matched) {
      return;
    }
    this.form.controls.department.setValue({ id: '', code: '', name: '' });
    this.form.controls.department.markAsDirty();
  }

  protected onSalesStaffCodeBlur(): void {
    const code = this.form.controls.salesStaff.controls.code.value;
    const matched = this.employeesResource.value().some((e) => e.employeeCode === code);
    if (matched) {
      return;
    }
    this.form.controls.salesStaff.setValue({ id: '', code: '', name: '' });
    this.form.controls.salesStaff.markAsDirty();
  }

  protected onConstructionStaffCodeBlur(): void {
    const code = this.form.controls.constructionStaff.controls.code.value;
    const matched = this.employeesResource.value().some((e) => e.employeeCode === code);
    if (matched) {
      return;
    }
    this.form.controls.constructionStaff.setValue({ id: '', code: '', name: '' });
    this.form.controls.constructionStaff.markAsDirty();
  }

  private initializeForm(project: ProjectResponse) {
    this.form.controls.projectCode.setAsyncValidators(
      projectCodeUniqueValidator(this.projectApiService, project.projectCode),
    );
    this.form.setValue({
      projectCode: project.projectCode,
      name: project.name,
      orderDate: project.orderDate ? new Date(project.orderDate) : null,
      orderType: project.orderType,
      estimateNumber: {
        mainNumber: project.estimateNumber?.mainNumber ?? '',
        branchNumber: project.estimateNumber?.branchNumber ?? '',
      },
      customer: {
        id: project.customer.id,
        code: project.customer.code,
        name: project.customer.name,
      },
      customerContactName: project.customerContactPerson ?? '',
      department: {
        id: project.department?.id ?? '',
        code: project.department?.code ?? '',
        name: project.department?.name ?? '',
      },
      salesStaff: {
        id: project.salesStaff?.id ?? '',
        code: project.salesStaff?.code ?? '',
        name: project.salesStaff?.name ?? '',
      },
      constructionStaff: {
        id: project.constructionStaff?.id ?? '',
        code: project.constructionStaff?.code ?? '',
        name: project.constructionStaff?.name ?? '',
      },
    });
  }
}
