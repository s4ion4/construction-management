import { TestBed } from '@angular/core/testing';
import { ProjectView } from './project-view';
import { OrderType } from '../models/order-type.enum';
import { ProjectStatus } from '../models/project-status.enum';
import { ProjectResponse } from '../models/project.response';

const defaultProject: ProjectResponse = {
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

describe('ProjectView', () => {
  async function setup({ project = defaultProject }: { project?: ProjectResponse } = {}) {
    TestBed.configureTestingModule({});

    const fixture = TestBed.createComponent(ProjectView);
    fixture.componentRef.setInput('project', project);
    await fixture.whenStable();

    return { fixture };
  }

  describe('基本情報', () => {
    it('工事コードが表示される', async () => {
      const { fixture } = await setup();
      const element: HTMLElement = fixture.nativeElement;
      expect(element.textContent).toContain('P001');
    });

    it('工事名が表示される', async () => {
      const { fixture } = await setup();
      const element: HTMLElement = fixture.nativeElement;
      expect(element.textContent).toContain('テスト工事');
    });

    it('受注日がyyyy/MM/dd形式で表示される', async () => {
      const { fixture } = await setup();
      const element: HTMLElement = fixture.nativeElement;
      expect(element.textContent).toContain('2026/04/01');
    });

    it('受注区分が表示される', async () => {
      const { fixture } = await setup();
      const element: HTMLElement = fixture.nativeElement;
      expect(element.textContent).toContain('元請');
    });

    it('見積番号が表示される', async () => {
      const { fixture } = await setup();
      const element: HTMLElement = fixture.nativeElement;
      expect(element.textContent).toContain('123456-01');
    });
  });

  describe('得意先情報', () => {
    it('得意先コードが表示される', async () => {
      const { fixture } = await setup();
      const element: HTMLElement = fixture.nativeElement;
      expect(element.textContent).toContain('C001');
    });

    it('得意先名が表示される', async () => {
      const { fixture } = await setup();
      const element: HTMLElement = fixture.nativeElement;
      expect(element.textContent).toContain('テスト得意先');
    });

    it('客先担当者が表示される', async () => {
      const { fixture } = await setup();
      const element: HTMLElement = fixture.nativeElement;
      expect(element.textContent).toContain('山田太郎');
    });
  });

  describe('担当情報', () => {
    it('担当部門コードが表示される', async () => {
      const { fixture } = await setup();
      const element: HTMLElement = fixture.nativeElement;
      expect(element.textContent).toContain('D001');
    });

    it('担当部門名が表示される', async () => {
      const { fixture } = await setup();
      const element: HTMLElement = fixture.nativeElement;
      expect(element.textContent).toContain('テスト部門');
    });

    it('営業担当者コードが表示される', async () => {
      const { fixture } = await setup();
      const element: HTMLElement = fixture.nativeElement;
      expect(element.textContent).toContain('E001');
    });

    it('営業担当者名が表示される', async () => {
      const { fixture } = await setup();
      const element: HTMLElement = fixture.nativeElement;
      expect(element.textContent).toContain('営業担当者');
    });

    it('工事担当者コードが表示される', async () => {
      const { fixture } = await setup();
      const element: HTMLElement = fixture.nativeElement;
      expect(element.textContent).toContain('E002');
    });

    it('工事担当者名が表示される', async () => {
      const { fixture } = await setup();
      const element: HTMLElement = fixture.nativeElement;
      expect(element.textContent).toContain('工事担当者');
    });
  });
});
