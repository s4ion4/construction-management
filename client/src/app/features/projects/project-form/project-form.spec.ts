import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MATERIAL_ANIMATIONS } from '@angular/material/core';
import { MatOptionHarness } from '@angular/material/core/testing';
import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { ja } from 'date-fns/locale';
import { JaDateFnsAdapter } from '../../../core/utils/ja-date-fns-adapter';
import { CustomerResponse } from '../../customers/models/customer.response';
import { DepartmentResponse } from '../../departments/models/department.response';
import { EmployeeResponse } from '../../employees/models/employee.response';
import { OrderType } from '../models/order-type.enum';
import { ProjectStatus } from '../models/project-status.enum';
import { ProjectResponse } from '../models/project.response';
import { ProjectForm } from './project-form';

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

const pendingProject: ProjectResponse = {
  projectCode: 'P001',
  name: 'テスト工事',
  customer: { id: '00000000-0000-0000-0001-000000000001', code: 'C001', name: 'テスト得意先' },
  customerContactPerson: '山田太郎',
  orderDate: '2026-04-01',
  orderType: OrderType.PrimeContract,
  estimateNumber: { mainNumber: '123456', branchNumber: '01' },
  department: { id: '00000000-0000-0000-0002-000000000001', code: 'D001', name: 'テスト部門' },
  salesStaff: { id: '00000000-0000-0000-0003-000000000001', code: 'E001', name: '営業担当者' },
  constructionStaff: {
    id: '00000000-0000-0000-0003-000000000002',
    code: 'E002',
    name: '工事担当者',
  },
  status: ProjectStatus.Pending,
  approvedAt: null,
};

describe('ProjectForm', () => {
  async function setup({
    project = null as ProjectResponse | null,
    customers = defaultCustomers,
    departments = defaultDepartments,
    employees = defaultEmployees,
  }: {
    project?: ProjectResponse | null;
    customers?: CustomerResponse[];
    departments?: DepartmentResponse[];
    employees?: EmployeeResponse[];
  } = {}) {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideDateFnsAdapter(),
        { provide: DateAdapter, useClass: JaDateFnsAdapter },
        { provide: MAT_DATE_LOCALE, useValue: ja },
        { provide: MATERIAL_ANIMATIONS, useValue: { animationsDisabled: true } },
      ],
    });

    const fixture = TestBed.createComponent(ProjectForm);
    if (project !== null) {
      fixture.componentRef.setInput('project', project);
    }

    fixture.detectChanges();

    const httpTesting = TestBed.inject(HttpTestingController);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    httpTesting.expectOne('api/customers').flush(customers);
    httpTesting.expectOne('api/departments').flush(departments);
    httpTesting.expectOne('api/employees').flush(employees);
    await fixture.whenStable();

    return { fixture, httpTesting, loader, rootLoader };
  }

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  describe('初期表示', () => {
    it('新規登録時はフォームが空で表示される', async () => {
      const { loader } = await setup();

      const projectCodeInput = await loader.getHarness(
        MatInputHarness.with({ label: '工事コード' }),
      );
      expect(await projectCodeInput.getValue()).toBe('');
    });

    it('編集時にはフォームに工事情報が表示される', async () => {
      const { loader } = await setup({ project: pendingProject });

      const projectCodeInput = await loader.getHarness(
        MatInputHarness.with({ label: '工事コード' }),
      );
      const nameInput = await loader.getHarness(MatInputHarness.with({ label: '工事名' }));
      const orderDateInput = await loader.getHarness(
        MatDatepickerInputHarness.with({ label: '受注日' }),
      );
      const orderTypeSelect = await loader.getHarness(MatSelectHarness.with({ label: '受注区分' }));
      const estimateMainInput = await loader.getHarness(
        MatInputHarness.with({ label: '見積番号' }),
      );
      const estimateBranchInput = await loader.getHarness(MatInputHarness.with({ label: '枝番' }));
      const customerCodeInput = await loader.getHarness(
        MatInputHarness.with({ label: '得意先コード' }),
      );
      const customerNameInput = await loader.getHarness(
        MatInputHarness.with({ label: '得意先名' }),
      );
      const customerContactNameInput = await loader.getHarness(
        MatInputHarness.with({ label: '客先担当者' }),
      );
      const departmentCodeInput = await loader.getHarness(
        MatInputHarness.with({ label: '担当部門コード' }),
      );
      const departmentNameInput = await loader.getHarness(
        MatInputHarness.with({ label: '部門名' }),
      );
      const salesStaffCodeInput = await loader.getHarness(
        MatInputHarness.with({ label: '営業担当者コード' }),
      );
      const constructionStaffCodeInput = await loader.getHarness(
        MatInputHarness.with({ label: '工事担当者コード' }),
      );

      expect(await projectCodeInput.getValue()).toBe('P001');
      expect(await nameInput.getValue()).toBe('テスト工事');
      expect(await orderDateInput.getValue()).toBe('2026/04/01');
      expect(await orderTypeSelect.getValueText()).toBe('元請');
      expect(await estimateMainInput.getValue()).toBe('123456');
      expect(await estimateBranchInput.getValue()).toBe('01');
      expect(await customerCodeInput.getValue()).toBe('C001');
      expect(await customerNameInput.getValue()).toBe('テスト得意先');
      expect(await customerContactNameInput.getValue()).toBe('山田太郎');
      expect(await departmentCodeInput.getValue()).toBe('D001');
      expect(await departmentNameInput.getValue()).toBe('テスト部門');
      expect(await salesStaffCodeInput.getValue()).toBe('E001');
      expect(await constructionStaffCodeInput.getValue()).toBe('E002');
    });
  });

  describe('バリデーション', () => {
    describe('工事コード', () => {
      it('未入力のときエラーが表示される', async () => {
        const { fixture, loader } = await setup();

        const input = await loader.getHarness(MatInputHarness.with({ label: '工事コード' }));
        await input.setValue('');
        await input.blur();
        await fixture.whenStable();

        const element: HTMLElement = fixture.nativeElement;
        expect(element.textContent).toContain('必須入力です。');
      });

      it('10文字を超えるときエラーが表示される', async () => {
        const { fixture, loader } = await setup();

        const input = await loader.getHarness(MatInputHarness.with({ label: '工事コード' }));
        await input.setValue('ABCDEFGHIJK');
        await input.blur();
        await fixture.whenStable();

        const element: HTMLElement = fixture.nativeElement;
        expect(element.textContent).toContain('10文字以内で入力してください。');
      });

      it('使用できない文字が含まれるときエラーが表示される', async () => {
        const { fixture, loader } = await setup();

        const input = await loader.getHarness(MatInputHarness.with({ label: '工事コード' }));
        await input.setValue('あいう');
        await input.blur();
        await fixture.whenStable();

        const element: HTMLElement = fixture.nativeElement;
        expect(element.textContent).toContain(
          '半角大文字英字・半角数字・ハイフン（-）のみ使用できます。',
        );
      });

      it('先頭または末尾にハイフンがあるときエラーが表示される', async () => {
        const { fixture, loader } = await setup();

        const input = await loader.getHarness(MatInputHarness.with({ label: '工事コード' }));
        await input.setValue('-P001');
        await input.blur();
        await fixture.whenStable();

        const element: HTMLElement = fixture.nativeElement;
        expect(element.textContent).toContain('先頭と末尾にハイフンは使用できません。');
      });

      it('使用済みの工事コードのとき重複エラーが表示される', async () => {
        const { fixture, httpTesting, loader } = await setup();

        const input = await loader.getHarness(MatInputHarness.with({ label: '工事コード' }));
        vi.useFakeTimers();
        await input.setValue('P001');
        await vi.runAllTimersAsync();
        httpTesting
          .expectOne({ method: 'POST', url: 'api/projects/check-code' })
          .flush(null, { status: 409, statusText: 'Conflict' });
        await vi.runAllTimersAsync();
        vi.useRealTimers();

        await input.blur();
        await fixture.whenStable();

        const element: HTMLElement = fixture.nativeElement;
        expect(element.textContent).toContain('このコードは使用されています。');
      });

      it('重複チェック中にサーバーエラーが発生したときエラーが表示される', async () => {
        const { fixture, httpTesting, loader } = await setup();

        const input = await loader.getHarness(MatInputHarness.with({ label: '工事コード' }));
        vi.useFakeTimers();
        await input.setValue('P001');
        await vi.runAllTimersAsync();
        httpTesting
          .expectOne({ method: 'POST', url: 'api/projects/check-code' })
          .flush(null, { status: 500, statusText: 'Internal Server Error' });
        await vi.runAllTimersAsync();
        vi.useRealTimers();

        await input.blur();
        await fixture.whenStable();

        const element: HTMLElement = fixture.nativeElement;
        expect(element.textContent).toContain(
          'コードの確認中にエラーが発生しました。再度お試しください。',
        );
      });
    });

    describe('工事名', () => {
      it('未入力のときエラーが表示される', async () => {
        const { fixture, loader } = await setup();

        const input = await loader.getHarness(MatInputHarness.with({ label: '工事名' }));
        await input.setValue('');
        await input.blur();
        await fixture.whenStable();

        const element: HTMLElement = fixture.nativeElement;
        expect(element.textContent).toContain('必須入力です。');
      });

      it('50文字を超えるときエラーが表示される', async () => {
        const { fixture, loader } = await setup();

        const input = await loader.getHarness(MatInputHarness.with({ label: '工事名' }));
        await input.setValue('あ'.repeat(51));
        await input.blur();
        await fixture.whenStable();

        const element: HTMLElement = fixture.nativeElement;
        expect(element.textContent).toContain('50文字以内で入力してください。');
      });
    });

    describe('見積番号', () => {
      it('親番号のみ入力して枝番号が空のときエラーが表示される', async () => {
        const { fixture, loader } = await setup();

        const mainInput = await loader.getHarness(MatInputHarness.with({ label: '見積番号' }));
        await mainInput.setValue('123456');
        await mainInput.blur();
        await fixture.whenStable();

        const element: HTMLElement = fixture.nativeElement;
        expect(element.textContent).toContain('親番号と枝番号はどちらも入力してください。');
      });

      it('親番号が数字6桁でないときエラーが表示される', async () => {
        const { fixture, loader } = await setup();

        const mainInput = await loader.getHarness(MatInputHarness.with({ label: '見積番号' }));
        const branchInput = await loader.getHarness(MatInputHarness.with({ label: '枝番' }));
        await mainInput.setValue('123');
        await branchInput.setValue('01');
        await branchInput.blur();
        await fixture.whenStable();

        const element: HTMLElement = fixture.nativeElement;
        expect(element.textContent).toContain('親番号は数字6桁で入力してください。');
      });

      it('枝番号が数字2桁でないときエラーが表示される', async () => {
        const { fixture, loader } = await setup();

        const mainInput = await loader.getHarness(MatInputHarness.with({ label: '見積番号' }));
        const branchInput = await loader.getHarness(MatInputHarness.with({ label: '枝番' }));
        await mainInput.setValue('123456');
        await branchInput.setValue('1');
        await branchInput.blur();
        await fixture.whenStable();

        const element: HTMLElement = fixture.nativeElement;
        expect(element.textContent).toContain('枝番号は数字2桁で入力してください。');
      });
    });
  });

  describe('得意先の入力', () => {
    it('得意先コードを選択すると得意先名が自動入力される', async () => {
      const { fixture, loader, rootLoader } = await setup();

      const customerCodeInput = await loader.getHarness(
        MatInputHarness.with({ label: '得意先コード' }),
      );
      await customerCodeInput.setValue('C001');
      const option = await rootLoader.getHarness(MatOptionHarness.with({ text: /C001/ }));
      await option.click();
      await fixture.whenStable();

      const customerNameInput = await loader.getHarness(
        MatInputHarness.with({ label: '得意先名' }),
      );
      expect(await customerNameInput.getValue()).toBe('テスト得意先');
    });

    it('一致する得意先コードが存在しない状態でフォーカスを外すと入力がクリアされる', async () => {
      const { fixture, loader } = await setup();

      const customerCodeInput = await loader.getHarness(
        MatInputHarness.with({ label: '得意先コード' }),
      );
      await customerCodeInput.setValue('ZZZZ');
      await customerCodeInput.blur();
      await fixture.whenStable();

      expect(await customerCodeInput.getValue()).toBe('');
    });
  });

  describe('担当部門の入力', () => {
    it('担当部門コードを選択すると部門名が自動入力される', async () => {
      const { fixture, loader, rootLoader } = await setup();

      const departmentCodeInput = await loader.getHarness(
        MatInputHarness.with({ label: '担当部門コード' }),
      );
      await departmentCodeInput.setValue('D001');
      const option = await rootLoader.getHarness(MatOptionHarness.with({ text: /D001/ }));
      await option.click();
      await fixture.whenStable();

      const departmentNameInput = await loader.getHarness(
        MatInputHarness.with({ label: '部門名' }),
      );
      expect(await departmentNameInput.getValue()).toBe('テスト部門');
    });

    it('一致する部門コードが存在しない状態でフォーカスを外すと入力がクリアされる', async () => {
      const { fixture, loader } = await setup();

      const departmentCodeInput = await loader.getHarness(
        MatInputHarness.with({ label: '担当部門コード' }),
      );
      await departmentCodeInput.setValue('ZZZZ');
      await departmentCodeInput.blur();
      await fixture.whenStable();

      expect(await departmentCodeInput.getValue()).toBe('');
    });
  });

  describe('営業担当者の入力', () => {
    it('営業担当者コードを選択すると担当者名が自動入力される', async () => {
      const { fixture, loader, rootLoader } = await setup();

      const salesStaffCodeInput = await loader.getHarness(
        MatInputHarness.with({ label: '営業担当者コード' }),
      );
      await salesStaffCodeInput.setValue('E001');
      const option = await rootLoader.getHarness(MatOptionHarness.with({ text: /E001/ }));
      await option.click();
      await fixture.whenStable();

      const salesStaffNameInput = await loader.getHarness(
        MatInputHarness.with({ label: '営業担当者名' }),
      );
      expect(await salesStaffNameInput.getValue()).toBe('テスト担当者');
    });

    it('一致する営業担当者コードが存在しない状態でフォーカスを外すと入力がクリアされる', async () => {
      const { fixture, loader } = await setup();

      const salesStaffCodeInput = await loader.getHarness(
        MatInputHarness.with({ label: '営業担当者コード' }),
      );
      await salesStaffCodeInput.setValue('ZZZZ');
      await salesStaffCodeInput.blur();
      await fixture.whenStable();

      expect(await salesStaffCodeInput.getValue()).toBe('');
    });
  });

  describe('工事担当者の入力', () => {
    it('工事担当者コードを選択すると担当者名が自動入力される', async () => {
      const { fixture, loader, rootLoader } = await setup();

      const constructionStaffCodeInput = await loader.getHarness(
        MatInputHarness.with({ label: '工事担当者コード' }),
      );
      await constructionStaffCodeInput.setValue('E001');
      const option = await rootLoader.getHarness(MatOptionHarness.with({ text: /E001/ }));
      await option.click();
      await fixture.whenStable();

      const constructionStaffNameInput = await loader.getHarness(
        MatInputHarness.with({ label: '工事担当者名' }),
      );
      expect(await constructionStaffNameInput.getValue()).toBe('テスト担当者');
    });

    it('一致する工事担当者コードが存在しない状態でフォーカスを外すと入力がクリアされる', async () => {
      const { fixture, loader } = await setup();

      const constructionStaffCodeInput = await loader.getHarness(
        MatInputHarness.with({ label: '工事担当者コード' }),
      );
      await constructionStaffCodeInput.setValue('ZZZZ');
      await constructionStaffCodeInput.blur();
      await fixture.whenStable();

      expect(await constructionStaffCodeInput.getValue()).toBe('');
    });
  });
});
