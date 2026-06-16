import {
  Component,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ProjectApiService } from '../data-access/project-api.service';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Button } from '../../../shared/components/button/button/button';
import { IconButton } from '../../../shared/components/button/icon-button/icon-button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { SearchInput } from '../../../shared/components/search-input/search-input';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { RowSelectionOptions } from 'ag-grid-community';
import { createProjectColumnDefs } from './project-columns';
import { DataGrid } from '../../../shared/components/data-grid/data-grid/data-grid';
import { BulkActionBar } from '../../../shared/components/bulk-action-bar/bulk-action-bar';
import { BulkAction } from '../../../shared/components/bulk-action-bar/bulk-action-bar.type';
import { ColumnSettingsService } from '../../../shared/services/column-settings.service';
import { Loading } from '../../../shared/components/loading/loading';
import { withLoadingDelay } from '../../../shared/utils/with-loading-delay';
import { LayoutService } from '../../../core/services/layout.service';
import { ProjectResponse } from '../models/project.response';
import { ProjectStatus } from '../models/project-status.enum';
import { DialogService } from '../../../shared/services/dialog.service';

@Component({
  selector: 'app-project-list',
  imports: [
    DataGrid,
    BulkActionBar,
    RouterLink,
    Button,
    IconButton,
    MatTooltipModule,
    EmptyState,
    SearchInput,
    PageHeader,
    Loading,
  ],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss',
})
export class ProjectList {
  private readonly projectApiService = inject(ProjectApiService);
  private readonly columnSettingsService = inject(ColumnSettingsService);
  private readonly dialogService = inject(DialogService);
  private readonly router = inject(Router);
  protected readonly layoutService = inject(LayoutService);

  private readonly dataGrid = viewChild.required<DataGrid<ProjectResponse>>(DataGrid);

  protected readonly projectsResource = this.projectApiService.createProjectsResource();
  protected readonly searchQuery = signal('');
  protected readonly columnDefs = createProjectColumnDefs((row) =>
    this.router.navigate(['/projects', row.projectCode]),
  );

  protected readonly rowSelection: RowSelectionOptions<ProjectResponse> = {
    mode: 'multiRow',
    selectAll: 'currentPage',
  };

  protected readonly selectedRows = signal<ProjectResponse[]>([]);
  protected readonly isSubmitting = signal(false);
  protected readonly showSubmitting = withLoadingDelay(this.isSubmitting);

  private readonly hasApproved = computed(() =>
    this.selectedRows().some((row) => row.status === ProjectStatus.Approved),
  );
  private readonly hasPending = computed(() =>
    this.selectedRows().some((row) => row.status === ProjectStatus.Pending),
  );
  protected readonly bulkActions = computed<BulkAction[]>(() => [
    {
      icon: 'delete',
      tooltip: '削除',
      disabled: this.hasApproved() || this.isSubmitting(),
      disabledTooltip: '承認済みの工事が含まれているため、削除できません',
      onAction: () => this.onBulkDelete(),
    },
    {
      icon: 'archive',
      tooltip: 'アーカイブ',
      disabled: this.hasPending() || this.isSubmitting(),
      disabledTooltip: '未承認の工事が含まれているため、アーカイブできません',
      onAction: () => this.onBulkArchive(),
    },
  ]);

  protected exportCsv(): void {
    this.dataGrid().exportCsv();
  }

  protected openColumnSettings(): void {
    this.columnSettingsService.open(this.dataGrid());
  }

  protected onSelectionChanged(rows: ProjectResponse[]): void {
    this.selectedRows.set(rows);
  }

  protected onClearSelection(): void {
    this.dataGrid().clearSelection();
  }

  private onBulkDelete(): void {
    const projectCodes = this.selectedRows().map((row) => row.projectCode);
    this.dialogService
      .openActionDialog({
        title: '工事の一括削除',
        message: `選択した ${projectCodes.length} 件の工事を削除します。\nこの操作は取り消せません。よろしいですか？`,
        actionButtonLabel: '削除',
        variant: 'danger',
      })
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.isSubmitting.set(true);
        this.projectApiService
          .bulkDelete(projectCodes)
          .pipe(finalize(() => this.isSubmitting.set(false)))
          .subscribe({
            next: () => {
              this.dialogService
                .openMessageDialog({
                  title: '削除完了',
                  message: `${projectCodes.length} 件の工事を削除しました。`,
                })
                .subscribe(() => {
                  this.onClearSelection();
                  this.projectsResource.reload();
                });
            },
            error: () => {
              this.dialogService.openMessageDialog({
                title: '削除失敗',
                message: '工事の削除に失敗しました。\nしばらくしてからもう一度お試しください。',
              });
            },
          });
      });
  }

  private onBulkArchive(): void {
    const projectCodes = this.selectedRows().map((row) => row.projectCode);
    this.dialogService
      .openActionDialog({
        title: '工事の一括アーカイブ',
        message: `選択した ${projectCodes.length} 件の工事をアーカイブします。\nアーカイブの完了後、アプリ上からの操作は不可能になります。よろしいですか？`,
        actionButtonLabel: 'アーカイブ',
        variant: 'danger',
      })
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.isSubmitting.set(true);
        this.projectApiService
          .bulkArchive(projectCodes)
          .pipe(finalize(() => this.isSubmitting.set(false)))
          .subscribe({
            next: () => {
              this.dialogService
                .openMessageDialog({
                  title: 'アーカイブ完了',
                  message: `${projectCodes.length} 件の工事をアーカイブしました。`,
                })
                .subscribe(() => {
                  this.onClearSelection();
                  this.projectsResource.reload();
                });
            },
            error: () => {
              this.dialogService.openMessageDialog({
                title: 'アーカイブ失敗',
                message:
                  '工事のアーカイブに失敗しました。\nしばらくしてからもう一度お試しください。',
              });
            },
          });
      });
  }
}
