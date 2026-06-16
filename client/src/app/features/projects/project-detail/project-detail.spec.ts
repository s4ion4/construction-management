import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { manualChangeDetection } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { ProjectDetail } from './project-detail';
import { OrderType } from '../models/order-type.enum';
import { ProjectStatus } from '../models/project-status.enum';
import { ProjectResponse } from '../models/project.response';
import { ButtonHarness } from '../../../shared/testing/button-harness';
import { IconButtonHarness } from '../../../shared/testing/icon-button-harness';
import { ToastHarness } from '../../../shared/testing/toast-harness';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MATERIAL_ANIMATIONS } from '@angular/material/core';
import { ja } from 'date-fns/locale';
import { JaDateFnsAdapter } from '../../../core/utils/ja-date-fns-adapter';
import { CustomerResponse } from '../../customers/models/customer.response';
import { DepartmentResponse } from '../../departments/models/department.response';
import { EmployeeResponse } from '../../employees/models/employee.response';

const pendingProject: ProjectResponse = {
  projectCode: 'P001',
  name: 'テスト工事',
  customer: { id: '001', code: 'C001', name: 'テスト得意先' },
  customerContactPerson: null,
  orderDate: '2026-04-01',
  orderType: OrderType.PrimeContract,
  estimateNumber: null,
  department: null,
  salesStaff: null,
  constructionStaff: null,
  status: ProjectStatus.Pending,
  approvedAt: null,
};

const approvedProject: ProjectResponse = {
  ...pendingProject,
  status: ProjectStatus.Approved,
  approvedAt: '2026-05-01T00:00:00Z',
};

describe('ProjectDetail', () => {
  async function setup({ projectCode = 'P001' }: { projectCode?: string } = {}) {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(
          [
            { path: 'projects', children: [] },
            { path: 'projects/:projectCode', component: ProjectDetail },
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
    await routerHarness.navigateByUrl(`/projects/${projectCode}`, ProjectDetail);

    const router = TestBed.inject(Router);
    const httpTesting = TestBed.inject(HttpTestingController);
    const loader = TestbedHarnessEnvironment.loader(routerHarness.fixture);
    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(routerHarness.fixture);

    return { routerHarness, router, httpTesting, loader, rootLoader };
  }

  async function setupProjectFetched({
    project = pendingProject,
  }: { project?: ProjectResponse } = {}) {
    const state = await setup({ projectCode: project.projectCode });

    state.httpTesting.expectOne(`api/projects/${project.projectCode}`).flush(project);
    await state.routerHarness.fixture.whenStable();

    return state;
  }

  async function setupEditMode({
    project = pendingProject,
    customers = [],
    departments = [],
    employees = [],
  }: {
    project?: ProjectResponse;
    customers?: CustomerResponse[];
    departments?: DepartmentResponse[];
    employees?: EmployeeResponse[];
  } = {}) {
    const state = await setupProjectFetched({ project });

    const editButton = await state.loader.getHarness(IconButtonHarness.with({ ariaLabel: '編集' }));
    await manualChangeDetection(() => editButton.click());
    state.routerHarness.fixture.detectChanges();

    state.httpTesting.expectOne('api/customers').flush(customers);
    state.httpTesting.expectOne('api/departments').flush(departments);
    state.httpTesting.expectOne('api/employees').flush(employees);
    await state.routerHarness.fixture.whenStable();

    return state;
  }

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  describe('工事詳細の表示', () => {
    it('工事コードに対応する工事の詳細が表示される', async () => {
      const { routerHarness } = await setupProjectFetched();

      expect(routerHarness.routeNativeElement?.textContent).toContain('テスト工事');
    });

    it('存在しない工事コードにアクセスすると「工事が見つかりません」と表示される', async () => {
      const { routerHarness, httpTesting } = await setup();

      httpTesting
        .expectOne('api/projects/P001')
        .flush(null, { status: 404, statusText: 'Not Found' });
      await routerHarness.fixture.whenStable();

      expect(routerHarness.routeNativeElement?.textContent).toContain('工事が見つかりません');
    });

    it('サーバーエラーが発生すると「データを読み込めませんでした」と表示される', async () => {
      const { routerHarness, httpTesting } = await setup();

      httpTesting
        .expectOne('api/projects/P001')
        .flush(null, { status: 500, statusText: 'Internal Server Error' });
      await routerHarness.fixture.whenStable();

      expect(routerHarness.routeNativeElement?.textContent).toContain(
        'データを読み込めませんでした',
      );
    });
  });

  describe('ボタンの表示制御', () => {
    it('未承認の工事には編集ボタンと削除ボタンが表示される', async () => {
      const { loader } = await setupProjectFetched();

      const hasEditButton = await loader.hasHarness(IconButtonHarness.with({ ariaLabel: '編集' }));
      const hasDeleteButton = await loader.hasHarness(
        IconButtonHarness.with({ ariaLabel: '削除' }),
      );

      expect(hasEditButton).toBe(true);
      expect(hasDeleteButton).toBe(true);
    });

    it('承認済みの工事にはアーカイブボタンと未承認に戻すボタンが表示される', async () => {
      const { loader } = await setupProjectFetched({ project: approvedProject });

      const hasArchiveButton = await loader.hasHarness(
        IconButtonHarness.with({ ariaLabel: 'アーカイブ' }),
      );
      const hasRevertButton = await loader.hasHarness(
        IconButtonHarness.with({ ariaLabel: '未承認に戻す' }),
      );

      expect(hasArchiveButton).toBe(true);
      expect(hasRevertButton).toBe(true);
    });

    it('承認済みの工事は編集できない', async () => {
      const { loader } = await setupProjectFetched({ project: approvedProject });

      const editButton = await loader.getHarness(
        IconButtonHarness.with({ ariaLabel: '承認済みのため編集できません' }),
      );

      expect(await editButton.isDisabled()).toBe(true);
    });
  });

  describe('キャンセル', () => {
    it('変更がない状態でキャンセルすると確認ダイアログなしで詳細表示に戻る', async () => {
      const { loader, rootLoader } = await setupEditMode();

      const cancelButton = await loader.getHarness(ButtonHarness.with({ text: 'キャンセル' }));
      await cancelButton.click();

      expect(await rootLoader.hasHarness(MatDialogHarness)).toBe(false);
      expect(await loader.hasHarness(IconButtonHarness.with({ ariaLabel: '編集' }))).toBe(true);
    });

    it('変更がある状態でキャンセルすると確認ダイアログが表示される', async () => {
      const { loader, rootLoader } = await setupEditMode();

      const nameInput = await loader.getHarness(MatInputHarness.with({ label: '工事名' }));
      await nameInput.setValue('変更後の工事名');

      const cancelButton = await loader.getHarness(ButtonHarness.with({ text: 'キャンセル' }));
      await cancelButton.click();

      expect(await rootLoader.hasHarness(MatDialogHarness)).toBe(true);
    });
  });

  describe('更新', () => {
    it('工事を更新できる', async () => {
      const { routerHarness, httpTesting, loader, rootLoader } = await setupEditMode();

      const nameInput = await loader.getHarness(MatInputHarness.with({ label: '工事名' }));
      await nameInput.setValue('更新後の工事名');

      const saveButton = await loader.getHarness(ButtonHarness.with({ text: '保存' }));
      await saveButton.click();

      const confirmDialog = await rootLoader.getHarness(MatDialogHarness);
      const confirmButton = await confirmDialog.getHarness(ButtonHarness.with({ text: '更新' }));
      await confirmButton.click();

      const req = httpTesting.expectOne({ method: 'PUT', url: 'api/projects/P001' });
      expect(req.request.body).toEqual({
        projectCode: 'P001',
        name: '更新後の工事名',
        customerId: '001',
        customerContactPerson: null,
        orderDate: '2026-04-01',
        orderType: OrderType.PrimeContract,
        estimateNumber: null,
        departmentId: null,
        salesStaffId: null,
        constructionStaffId: null,
      });
      req.flush(null);
      routerHarness.fixture.detectChanges();
      httpTesting.expectOne('api/projects/P001').flush(pendingProject);

      const toast = await rootLoader.getHarness(ToastHarness);
      expect(await toast.getMessage()).toContain('工事を更新しました');

      await routerHarness.fixture.whenStable();
      expect(await loader.hasHarness(IconButtonHarness.with({ ariaLabel: '編集' }))).toBe(true);
    });

    it('更新に失敗すると失敗ダイアログが表示される', async () => {
      const { httpTesting, loader, rootLoader } = await setupEditMode();

      const nameInput = await loader.getHarness(MatInputHarness.with({ label: '工事名' }));
      await nameInput.setValue('更新後の工事名');

      const saveButton = await loader.getHarness(ButtonHarness.with({ text: '保存' }));
      await saveButton.click();

      const confirmDialog = await rootLoader.getHarness(MatDialogHarness);
      const confirmButton = await confirmDialog.getHarness(ButtonHarness.with({ text: '更新' }));
      await confirmButton.click();

      httpTesting
        .expectOne({ method: 'PUT', url: 'api/projects/P001' })
        .flush(null, { status: 500, statusText: 'Internal Server Error' });

      const failureDialog = await rootLoader.getHarness(MatDialogHarness);
      expect(await failureDialog.getTitleText()).toContain('更新失敗');
    });
  });

  describe('承認', () => {
    it('工事を承認できる', async () => {
      const { routerHarness, httpTesting, loader, rootLoader } = await setupProjectFetched();

      const approveButton = await loader.getHarness(ButtonHarness.with({ text: '承認' }));
      await approveButton.click();

      const confirmDialog = await rootLoader.getHarness(MatDialogHarness);
      const confirmButton = await confirmDialog.getHarness(ButtonHarness.with({ text: '承認' }));
      await confirmButton.click();

      httpTesting.expectOne({ method: 'POST', url: 'api/projects/P001/approve' }).flush(null);
      routerHarness.fixture.detectChanges();
      httpTesting.expectOne('api/projects/P001').flush(approvedProject);

      const toast = await rootLoader.getHarness(ToastHarness);
      expect(await toast.getMessage()).toContain('工事を承認しました');

      await routerHarness.fixture.whenStable();
      expect(routerHarness.routeNativeElement?.textContent).toContain('承認済');
    });

    it('承認に失敗すると失敗ダイアログが表示される', async () => {
      const { httpTesting, loader, rootLoader } = await setupProjectFetched();

      const approveButton = await loader.getHarness(ButtonHarness.with({ text: '承認' }));
      await approveButton.click();

      const confirmDialog = await rootLoader.getHarness(MatDialogHarness);
      const confirmButton = await confirmDialog.getHarness(ButtonHarness.with({ text: '承認' }));
      await confirmButton.click();

      httpTesting
        .expectOne({ method: 'POST', url: 'api/projects/P001/approve' })
        .flush(null, { status: 500, statusText: 'Internal Server Error' });

      const failureDialog = await rootLoader.getHarness(MatDialogHarness);
      expect(await failureDialog.getTitleText()).toContain('承認失敗');
    });
  });

  describe('未承認に戻す', () => {
    it('工事を未承認に戻せる', async () => {
      const { routerHarness, httpTesting, loader, rootLoader } = await setupProjectFetched({
        project: approvedProject,
      });

      const revokeButton = await loader.getHarness(
        IconButtonHarness.with({ ariaLabel: '未承認に戻す' }),
      );
      await revokeButton.click();

      const confirmDialog = await rootLoader.getHarness(MatDialogHarness);
      const confirmButton = await confirmDialog.getHarness(
        ButtonHarness.with({ text: '未承認に戻す' }),
      );
      await confirmButton.click();

      httpTesting.expectOne({ method: 'POST', url: 'api/projects/P001/revoke' }).flush(null);
      routerHarness.fixture.detectChanges();
      httpTesting.expectOne('api/projects/P001').flush(pendingProject);

      const toast = await rootLoader.getHarness(ToastHarness);
      expect(await toast.getMessage()).toContain('工事の承認を取り消しました');

      await routerHarness.fixture.whenStable();
      expect(routerHarness.routeNativeElement?.textContent).toContain('未承認');
    });

    it('未承認への取り消しに失敗すると失敗ダイアログが表示される', async () => {
      const { httpTesting, loader, rootLoader } = await setupProjectFetched({
        project: approvedProject,
      });

      const revokeButton = await loader.getHarness(
        IconButtonHarness.with({ ariaLabel: '未承認に戻す' }),
      );
      await revokeButton.click();

      const confirmDialog = await rootLoader.getHarness(MatDialogHarness);
      const confirmButton = await confirmDialog.getHarness(
        ButtonHarness.with({ text: '未承認に戻す' }),
      );
      await confirmButton.click();

      httpTesting
        .expectOne({ method: 'POST', url: 'api/projects/P001/revoke' })
        .flush(null, { status: 500, statusText: 'Internal Server Error' });

      const failureDialog = await rootLoader.getHarness(MatDialogHarness);
      expect(await failureDialog.getTitleText()).toContain('取り消しに失敗しました');
    });
  });

  describe('削除', () => {
    it('工事を削除することができ、削除後は工事一覧に戻る', async () => {
      const { router, httpTesting, loader, rootLoader } = await setupProjectFetched();

      const deleteButton = await loader.getHarness(IconButtonHarness.with({ ariaLabel: '削除' }));
      await deleteButton.click();

      const confirmDialog = await rootLoader.getHarness(MatDialogHarness);
      const confirmButton = await confirmDialog.getHarness(ButtonHarness.with({ text: '削除' }));
      await confirmButton.click();

      httpTesting.expectOne({ method: 'DELETE', url: 'api/projects/P001' }).flush(null);

      const completeDialog = await rootLoader.getHarness(MatDialogHarness);
      const closeButton = await completeDialog.getHarness(ButtonHarness.with({ text: '閉じる' }));
      await closeButton.click();

      expect(router.url).toBe('/projects');
    });

    it('削除に失敗すると失敗ダイアログが表示される', async () => {
      const { httpTesting, loader, rootLoader } = await setupProjectFetched();

      const deleteButton = await loader.getHarness(IconButtonHarness.with({ ariaLabel: '削除' }));
      await deleteButton.click();

      const confirmDialog = await rootLoader.getHarness(MatDialogHarness);
      const confirmButton = await confirmDialog.getHarness(ButtonHarness.with({ text: '削除' }));
      await confirmButton.click();

      httpTesting
        .expectOne({ method: 'DELETE', url: 'api/projects/P001' })
        .flush(null, { status: 500, statusText: 'Internal Server Error' });

      const failureDialog = await rootLoader.getHarness(MatDialogHarness);
      expect(await failureDialog.getTitleText()).toContain('削除失敗');
    });
  });

  describe('アーカイブ', () => {
    it('工事をアーカイブすることができ、アーカイブ後は工事一覧に戻る', async () => {
      const { router, httpTesting, loader, rootLoader } = await setupProjectFetched({
        project: approvedProject,
      });

      const archiveButton = await loader.getHarness(
        IconButtonHarness.with({ ariaLabel: 'アーカイブ' }),
      );
      await archiveButton.click();

      const confirmDialog = await rootLoader.getHarness(MatDialogHarness);
      const confirmButton = await confirmDialog.getHarness(
        ButtonHarness.with({ text: 'アーカイブ' }),
      );
      await confirmButton.click();

      httpTesting.expectOne({ method: 'POST', url: 'api/projects/P001/archive' }).flush(null);

      const completeDialog = await rootLoader.getHarness(MatDialogHarness);
      const closeButton = await completeDialog.getHarness(ButtonHarness.with({ text: '閉じる' }));
      await closeButton.click();

      expect(router.url).toBe('/projects');
    });

    it('アーカイブに失敗すると失敗ダイアログが表示される', async () => {
      const { httpTesting, loader, rootLoader } = await setupProjectFetched({
        project: approvedProject,
      });

      const archiveButton = await loader.getHarness(
        IconButtonHarness.with({ ariaLabel: 'アーカイブ' }),
      );
      await archiveButton.click();

      const confirmDialog = await rootLoader.getHarness(MatDialogHarness);
      const confirmButton = await confirmDialog.getHarness(
        ButtonHarness.with({ text: 'アーカイブ' }),
      );
      await confirmButton.click();

      httpTesting
        .expectOne({ method: 'POST', url: 'api/projects/P001/archive' })
        .flush(null, { status: 500, statusText: 'Internal Server Error' });

      const failureDialog = await rootLoader.getHarness(MatDialogHarness);
      expect(await failureDialog.getTitleText()).toContain('アーカイブ失敗');
    });
  });
});
