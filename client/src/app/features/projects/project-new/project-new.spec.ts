import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MATERIAL_ANIMATIONS } from '@angular/material/core';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';
import { MatOptionHarness } from '@angular/material/core/testing';
import { provideRouter, withComponentInputBinding, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { ja } from 'date-fns/locale';
import { JaDateFnsAdapter } from '../../../core/utils/ja-date-fns-adapter';
import { ButtonHarness } from '../../../shared/testing/button-harness';
import { CustomerResponse } from '../../customers/models/customer.response';
import { ProjectNew } from './project-new';
import { DepartmentResponse } from '../../departments/models/department.response';
import { EmployeeResponse } from '../../employees/models/employee.response';
import { OrderType } from '../models/order-type.enum';

const defaultCustomers: CustomerResponse[] = [
  { id: '00000000-0000-0000-0001-000000000001', customerCode: 'C001', name: 'テスト得意先' },
];

const defaultDepartments: DepartmentResponse[] = [
  { id: '00000000-0000-0000-0002-000000000001', departmentCode: 'D001', name: 'テスト部門' },
];

const defaultEmployees: EmployeeResponse[] = [
  {
    id: '00000000-0000-0000-0003-000000000001',
    employeeCode: 'E001',
    name: 'テスト担当者',
    departmentCode: 'D001',
    departmentName: 'テスト部門',
  },
];

describe('ProjectNew', () => {
  async function setup({
    customers = defaultCustomers,
    departments = [],
    employees = [],
  }: {
    customers?: CustomerResponse[];
    departments?: DepartmentResponse[];
    employees?: EmployeeResponse[];
  } = {}) {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(
          [
            { path: 'projects', children: [] },
            { path: 'projects/new', component: ProjectNew },
          ],
          withComponentInputBinding(),
        ),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideDateFnsAdapter(),
        { provide: DateAdapter, useClass: JaDateFnsAdapter },
        { provide: MAT_DATE_LOCALE, useValue: ja },
        { provide: MATERIAL_ANIMATIONS, useValue: { animationsDisabled: true } },
      ],
    });

    const routerHarness = await RouterTestingHarness.create();
    await routerHarness.navigateByUrl('/projects/new', ProjectNew);

    const router = TestBed.inject(Router);
    const httpTesting = TestBed.inject(HttpTestingController);
    const loader = TestbedHarnessEnvironment.loader(routerHarness.fixture);
    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(routerHarness.fixture);

    httpTesting.expectOne('api/customers').flush(customers);
    httpTesting.expectOne('api/departments').flush(departments);
    httpTesting.expectOne('api/employees').flush(employees);
    await routerHarness.fixture.whenStable();

    return { routerHarness, router, httpTesting, loader, rootLoader };
  }

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  describe('キャンセル', () => {
    it('キャンセルボタンを押すと工事一覧に戻る', async () => {
      const { router, loader } = await setup();

      const cancelButton = await loader.getHarness(ButtonHarness.with({ text: 'キャンセル' }));
      await cancelButton.click();

      expect(router.url).toBe('/projects');
    });
  });

  describe('登録', () => {
    it('必須項目が未入力のときは登録確認ダイアログが表示されない', async () => {
      const { loader, rootLoader } = await setup();

      const saveButton = await loader.getHarness(ButtonHarness.with({ text: '保存' }));
      await saveButton.click();

      expect(await rootLoader.hasHarness(MatDialogHarness)).toBe(false);
    });

    it('工事コードの重複チェック中は登録確認ダイアログが表示されない', async () => {
      const { loader, rootLoader } = await setup();

      const projectCodeInput = await loader.getHarness(
        MatInputHarness.with({ label: '工事コード' }),
      );
      await projectCodeInput.setValue('P001');

      const saveButton = await loader.getHarness(ButtonHarness.with({ text: '保存' }));
      await saveButton.click();

      expect(await rootLoader.hasHarness(MatDialogHarness)).toBe(false);
    });

    it('必須項目のみ入力して工事を登録できる', async () => {
      const { routerHarness, router, httpTesting, loader, rootLoader } = await setup();

      const projectCodeInput = await loader.getHarness(
        MatInputHarness.with({ label: '工事コード' }),
      );
      vi.useFakeTimers();
      await projectCodeInput.setValue('P001');
      await vi.runAllTimersAsync();
      httpTesting.expectOne({ method: 'POST', url: 'api/projects/check-code' }).flush(null);
      vi.useRealTimers();

      const nameInput = await loader.getHarness(MatInputHarness.with({ label: '工事名' }));
      await nameInput.setValue('テスト工事');

      const orderDateInput = await loader.getHarness(
        MatDatepickerInputHarness.with({ label: '受注日' }),
      );
      await orderDateInput.setValue('2026/04/01');

      const orderTypeSelect = await loader.getHarness(MatSelectHarness.with({ label: '受注区分' }));
      await orderTypeSelect.open();
      await orderTypeSelect.clickOptions({ text: '元請' });

      const customerCodeInput = await loader.getHarness(
        MatInputHarness.with({ label: '得意先コード' }),
      );
      await customerCodeInput.setValue('C001');
      const customerOption = await rootLoader.getHarness(MatOptionHarness.with({ text: /C001/ }));
      await customerOption.click();

      const saveButton = await loader.getHarness(ButtonHarness.with({ text: '保存' }));
      await saveButton.click();

      const confirmDialog = await rootLoader.getHarness(MatDialogHarness);
      const confirmButton = await confirmDialog.getHarness(ButtonHarness.with({ text: '登録' }));
      await confirmButton.click();

      const req = httpTesting.expectOne({ method: 'POST', url: 'api/projects' });
      expect(req.request.body).toEqual({
        projectCode: 'P001',
        name: 'テスト工事',
        customerId: '00000000-0000-0000-0001-000000000001',
        customerContactPerson: null,
        orderDate: '2026-04-01',
        orderType: OrderType.PrimeContract,
        estimateNumber: null,
        departmentId: null,
        salesStaffId: null,
        constructionStaffId: null,
      });
      req.flush(null);

      const completeDialog = await rootLoader.getHarness(MatDialogHarness);
      const closeButton = await completeDialog.getHarness(ButtonHarness.with({ text: '閉じる' }));
      await closeButton.click();

      await routerHarness.fixture.whenStable();
      expect(router.url).toBe('/projects');
    });

    it('任意項目をすべて入力して工事を登録できる', async () => {
      const { routerHarness, router, httpTesting, loader, rootLoader } = await setup({
        departments: defaultDepartments,
        employees: defaultEmployees,
      });

      const projectCodeInput = await loader.getHarness(
        MatInputHarness.with({ label: '工事コード' }),
      );
      vi.useFakeTimers();
      await projectCodeInput.setValue('P001');
      await vi.runAllTimersAsync();
      httpTesting.expectOne({ method: 'POST', url: 'api/projects/check-code' }).flush(null);
      vi.useRealTimers();

      const nameInput = await loader.getHarness(MatInputHarness.with({ label: '工事名' }));
      await nameInput.setValue('テスト工事');

      const orderDateInput = await loader.getHarness(
        MatDatepickerInputHarness.with({ label: '受注日' }),
      );
      await orderDateInput.setValue('2026/04/01');

      const orderTypeSelect = await loader.getHarness(MatSelectHarness.with({ label: '受注区分' }));
      await orderTypeSelect.open();
      await orderTypeSelect.clickOptions({ text: '元請' });

      const customerCodeInput = await loader.getHarness(
        MatInputHarness.with({ label: '得意先コード' }),
      );
      await customerCodeInput.setValue('C001');
      const customerOption = await rootLoader.getHarness(MatOptionHarness.with({ text: /C001/ }));
      await customerOption.click();

      const customerContactNameInput = await loader.getHarness(
        MatInputHarness.with({ label: '客先担当者' }),
      );
      await customerContactNameInput.setValue('山田太郎');

      const estimateMainInput = await loader.getHarness(
        MatInputHarness.with({ label: '見積番号' }),
      );
      await estimateMainInput.setValue('123456');
      const estimateBranchInput = await loader.getHarness(MatInputHarness.with({ label: '枝番' }));
      await estimateBranchInput.setValue('01');

      const departmentCodeInput = await loader.getHarness(
        MatInputHarness.with({ label: '担当部門コード' }),
      );
      await departmentCodeInput.setValue('D001');
      const departmentOption = await rootLoader.getHarness(MatOptionHarness.with({ text: /D001/ }));
      await departmentOption.click();

      const salesStaffCodeInput = await loader.getHarness(
        MatInputHarness.with({ label: '営業担当者コード' }),
      );
      await salesStaffCodeInput.setValue('E001');
      const salesStaffOption = await rootLoader.getHarness(MatOptionHarness.with({ text: /E001/ }));
      await salesStaffOption.click();

      const constructionStaffCodeInput = await loader.getHarness(
        MatInputHarness.with({ label: '工事担当者コード' }),
      );
      await constructionStaffCodeInput.setValue('E001');
      const constructionStaffOption = await rootLoader.getHarness(
        MatOptionHarness.with({ text: /E001/ }),
      );
      await constructionStaffOption.click();

      const saveButton = await loader.getHarness(ButtonHarness.with({ text: '保存' }));
      await saveButton.click();

      const confirmDialog = await rootLoader.getHarness(MatDialogHarness);
      const confirmButton = await confirmDialog.getHarness(ButtonHarness.with({ text: '登録' }));
      await confirmButton.click();

      const req = httpTesting.expectOne({ method: 'POST', url: 'api/projects' });
      expect(req.request.body).toEqual({
        projectCode: 'P001',
        name: 'テスト工事',
        customerId: '00000000-0000-0000-0001-000000000001',
        customerContactPerson: '山田太郎',
        orderDate: '2026-04-01',
        orderType: OrderType.PrimeContract,
        estimateNumber: { mainNumber: '123456', branchNumber: '01' },
        departmentId: '00000000-0000-0000-0002-000000000001',
        salesStaffId: '00000000-0000-0000-0003-000000000001',
        constructionStaffId: '00000000-0000-0000-0003-000000000001',
      });
      req.flush(null);

      const completeDialog = await rootLoader.getHarness(MatDialogHarness);
      const closeButton = await completeDialog.getHarness(ButtonHarness.with({ text: '閉じる' }));
      await closeButton.click();

      await routerHarness.fixture.whenStable();
      expect(router.url).toBe('/projects');
    });

    it('登録に失敗すると失敗ダイアログが表示される', async () => {
      const { httpTesting, loader, rootLoader } = await setup();

      const projectCodeInput = await loader.getHarness(
        MatInputHarness.with({ label: '工事コード' }),
      );
      vi.useFakeTimers();
      await projectCodeInput.setValue('P001');
      await vi.runAllTimersAsync();
      httpTesting.expectOne({ method: 'POST', url: 'api/projects/check-code' }).flush(null);
      vi.useRealTimers();

      const nameInput = await loader.getHarness(MatInputHarness.with({ label: '工事名' }));
      await nameInput.setValue('テスト工事');

      const orderDateInput = await loader.getHarness(
        MatDatepickerInputHarness.with({ label: '受注日' }),
      );
      await orderDateInput.setValue('2026/04/01');

      const orderTypeSelect = await loader.getHarness(MatSelectHarness.with({ label: '受注区分' }));
      await orderTypeSelect.open();
      await orderTypeSelect.clickOptions({ text: '元請' });

      const customerCodeInput = await loader.getHarness(
        MatInputHarness.with({ label: '得意先コード' }),
      );
      await customerCodeInput.setValue('C001');
      const customerOption = await rootLoader.getHarness(MatOptionHarness.with({ text: /C001/ }));
      await customerOption.click();

      const saveButton = await loader.getHarness(ButtonHarness.with({ text: '保存' }));
      await saveButton.click();

      const confirmDialog = await rootLoader.getHarness(MatDialogHarness);
      const confirmButton = await confirmDialog.getHarness(ButtonHarness.with({ text: '登録' }));
      await confirmButton.click();

      httpTesting
        .expectOne({ method: 'POST', url: 'api/projects' })
        .flush(null, { status: 500, statusText: 'Internal Server Error' });

      const failureDialog = await rootLoader.getHarness(MatDialogHarness);
      expect(await failureDialog.getTitleText()).toContain('登録失敗');
    });
  });
});
