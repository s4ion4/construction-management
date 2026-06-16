import { TestBed } from '@angular/core/testing';
import { GridPaginator } from './grid-paginator';

describe('GridPaginator', () => {
  async function setup({
    currentPage = 0,
    totalPages = 5,
    pageSize = 20,
    totalRows = 100,
    pageSizeOptions = [20, 50, 100],
  } = {}) {
    await TestBed.configureTestingModule({
      imports: [GridPaginator],
    }).compileComponents();

    const fixture = TestBed.createComponent(GridPaginator);

    fixture.componentRef.setInput('currentPage', currentPage);
    fixture.componentRef.setInput('totalPages', totalPages);
    fixture.componentRef.setInput('pageSize', pageSize);
    fixture.componentRef.setInput('totalRows', totalRows);
    fixture.componentRef.setInput('pageSizeOptions', pageSizeOptions);

    await fixture.whenStable();

    return fixture;
  }

  describe('ナビゲーションボタンの活性／非活性', () => {
    it('1ページ目のとき、「最初のページ」と「前のページ」ボタンは操作できない', async () => {
      const fixture = await setup({ currentPage: 0 });
      const element = fixture.nativeElement as HTMLElement;

      const firstButton = element.querySelector<HTMLButtonElement>('[aria-label="最初のページ"]');
      const prevButton = element.querySelector<HTMLButtonElement>('[aria-label="前のページ"]');
      expect(firstButton?.disabled).toBe(true);
      expect(prevButton?.disabled).toBe(true);
    });

    it('最終ページのとき、「次のページ」と「最後のページ」ボタンは操作できない', async () => {
      const fixture = await setup({ currentPage: 4, totalPages: 5 });
      const element = fixture.nativeElement as HTMLElement;

      const nextButton = element.querySelector<HTMLButtonElement>('[aria-label="次のページ"]');
      const lastButton = element.querySelector<HTMLButtonElement>('[aria-label="最後のページ"]');
      expect(nextButton?.disabled).toBe(true);
      expect(lastButton?.disabled).toBe(true);
    });

    it('中間ページのとき、すべてのナビゲーションボタンが操作できる', async () => {
      const fixture = await setup({ currentPage: 2, totalPages: 5 });
      const element = fixture.nativeElement as HTMLElement;

      const firstButton = element.querySelector<HTMLButtonElement>('[aria-label="最初のページ"]');
      const prevButton = element.querySelector<HTMLButtonElement>('[aria-label="前のページ"]');
      const nextButton = element.querySelector<HTMLButtonElement>('[aria-label="次のページ"]');
      const lastButton = element.querySelector<HTMLButtonElement>('[aria-label="最後のページ"]');
      expect(firstButton?.disabled).toBe(false);
      expect(prevButton?.disabled).toBe(false);
      expect(nextButton?.disabled).toBe(false);
      expect(lastButton?.disabled).toBe(false);
    });
  });

  describe('ナビゲーション操作', () => {
    it('「最初のページ」ボタンを押すと、1ページ目に移動する', async () => {
      const fixture = await setup({ currentPage: 3 });
      const element = fixture.nativeElement as HTMLElement;

      const onPageChange = vi.fn();
      fixture.componentInstance.pageChange.subscribe(onPageChange);

      element.querySelector<HTMLButtonElement>('[aria-label="最初のページ"]')!.click();
      await fixture.whenStable();

      expect(onPageChange).toHaveBeenCalledWith(0);
      expect(onPageChange).toHaveBeenCalledTimes(1);
    });

    it('「前のページ」ボタンを押すと、1つ前のページに移動する', async () => {
      const fixture = await setup({ currentPage: 3 });
      const element = fixture.nativeElement as HTMLElement;

      const onPageChange = vi.fn();
      fixture.componentInstance.pageChange.subscribe(onPageChange);

      element.querySelector<HTMLButtonElement>('[aria-label="前のページ"]')!.click();
      await fixture.whenStable();

      expect(onPageChange).toHaveBeenCalledWith(2);
      expect(onPageChange).toHaveBeenCalledTimes(1);
    });

    it('「次のページ」ボタンを押すと、1つ後のページに移動する', async () => {
      const fixture = await setup({ currentPage: 2 });
      const element = fixture.nativeElement as HTMLElement;

      const onPageChange = vi.fn();
      fixture.componentInstance.pageChange.subscribe(onPageChange);

      element.querySelector<HTMLButtonElement>('[aria-label="次のページ"]')!.click();
      await fixture.whenStable();

      expect(onPageChange).toHaveBeenCalledWith(3);
      expect(onPageChange).toHaveBeenCalledTimes(1);
    });

    it('「最後のページ」ボタンを押すと、最終ページに移動する', async () => {
      const fixture = await setup({ currentPage: 1, totalPages: 5 });
      const element = fixture.nativeElement as HTMLElement;

      const onPageChange = vi.fn();
      fixture.componentInstance.pageChange.subscribe(onPageChange);

      element.querySelector<HTMLButtonElement>('[aria-label="最後のページ"]')!.click();
      await fixture.whenStable();

      expect(onPageChange).toHaveBeenCalledWith(4);
      expect(onPageChange).toHaveBeenCalledTimes(1);
    });
  });
});
