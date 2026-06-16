import { Component, inject, input, signal, computed, viewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { LayoutService } from '../../../core/services/layout.service';
import { Breadcrumb } from '../../../shared/components/breadcrumb/breadcrumb';
import { BreadcrumbItem } from '../../../shared/components/breadcrumb/breadcrumb.type';
import { StatusDot } from '../../../shared/components/status-dot/status-dot';
import { Button } from '../../../shared/components/button/button/button';
import { IconButton } from '../../../shared/components/button/icon-button/icon-button';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { Loading } from '../../../shared/components/loading/loading';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { withLoadingDelay } from '../../../shared/utils/with-loading-delay';
import { ProjectApiService } from '../data-access/project-api.service';
import { ProjectStatus } from '../models/project-status.enum';
import { UnsavedChangesComponent } from '../../../core/guards/unsaved-changes-guard';
import { formatDateOnly } from '../../../shared/utils/format-date';
import { ProjectUpdateRequest } from '../models/project-update.request';
import { ProjectView } from '../project-view/project-view';
import { ProjectForm } from '../project-form/project-form';
import { ProjectFormValue } from '../project-form/project-form.type';
import { ToastService } from '../../../shared/services/toast.service';
import { DialogService } from '../../../shared/services/dialog.service';

@Component({
  selector: 'app-project-detail',
  imports: [
    ProjectForm,
    ProjectView,
    EmptyState,
    PageHeader,
    Breadcrumb,
    StatusDot,
    Loading,
    Button,
    IconButton,
    MatTooltipModule,
    CdkScrollableModule,
  ],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss',
})
export class ProjectDetail implements UnsavedChangesComponent {
  private readonly projectApiService = inject(ProjectApiService);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);
  private readonly toastService = inject(ToastService);
  protected readonly layoutService = inject(LayoutService);

  readonly projectCode = input.required<string>();

  private readonly projectForm = viewChild(ProjectForm);

  protected readonly ProjectStatus = ProjectStatus;

  protected readonly projectResource = this.projectApiService.createProjectResource(
    this.projectCode,
  );
  protected readonly breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const breadcrumbs: BreadcrumbItem[] = [{ label: '工事一覧', url: '/projects' }];
    if (this.projectResource.hasValue()) {
      const project = this.projectResource.value();
      breadcrumbs.push({ label: `${project.projectCode} ${project.name}` });
    } else if (this.projectResource.error()) {
      breadcrumbs.push({ label: this.projectCode() });
    }
    return breadcrumbs;
  });
  protected readonly mode = signal<'view' | 'edit'>('view');
  protected readonly isLoading = withLoadingDelay(this.projectResource.isLoading);
  protected readonly isSubmitting = signal(false);
  protected readonly showSubmitting = withLoadingDelay(this.isSubmitting);
  protected readonly isApproved = computed(
    () => this.projectResource.value()?.status === ProjectStatus.Approved,
  );
  protected readonly isNotFound = computed(() => {
    const error = this.projectResource.error();
    return error instanceof HttpErrorResponse && (error.status === 404 || error.status === 400);
  });

  hasUnsavedChanges(): boolean {
    return this.projectForm()?.isDirty ?? false;
  }

  protected onEdit(): void {
    this.mode.set('edit');
  }

  protected onEditCancelled(): void {
    if (!this.hasUnsavedChanges()) {
      this.mode.set('view');
      return;
    }
    this.dialogService
      .openActionDialog({
        title: '変更の破棄',
        message: '保存されていない変更があります。\n変更を破棄してもよろしいですか？',
        actionButtonLabel: '破棄して戻る',
        variant: 'danger',
      })
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.mode.set('view');
      });
  }

  protected onSave(): void {
    this.projectForm()?.submit();
  }

  protected onSubmitted(value: ProjectFormValue): void {
    this.dialogService
      .openActionDialog({
        title: '工事の更新',
        message: '入力した内容で工事を更新します。\nよろしいですか？',
        actionButtonLabel: '更新',
      })
      .subscribe((confirmed) => {
        if (!confirmed) return;

        const request: ProjectUpdateRequest = {
          projectCode: value.projectCode,
          name: value.name,
          customerId: value.customer.id,
          customerContactPerson: value.customerContactName || null,
          orderDate: formatDateOnly(value.orderDate) || null,
          orderType: value.orderType!,
          estimateNumber:
            value.estimateNumber.mainNumber || value.estimateNumber.branchNumber
              ? value.estimateNumber
              : null,
          departmentId: value.department.id || null,
          salesStaffId: value.salesStaff.id || null,
          constructionStaffId: value.constructionStaff.id || null,
        };

        this.isSubmitting.set(true);
        this.projectApiService
          .update(this.projectCode(), request)
          .pipe(finalize(() => this.isSubmitting.set(false)))
          .subscribe({
            next: () => {
              this.projectForm()?.markAsPristine();
              if (request.projectCode === this.projectCode()) {
                this.mode.set('view');
                this.projectResource.reload();
                this.toastService.showSuccess('工事を更新しました。');
              } else {
                this.dialogService
                  .openMessageDialog({
                    title: '更新完了',
                    message: '工事を更新しました。工事一覧に戻ります。',
                  })
                  .subscribe(() => this.router.navigate(['/projects']));
              }
            },
            error: () => {
              this.dialogService.openMessageDialog({
                title: '更新失敗',
                message: '工事の更新に失敗しました。\nしばらくしてからもう一度お試しください。',
              });
            },
          });
      });
  }

  protected onBackToList(): void {
    this.router.navigate(['/projects']);
  }

  protected onDelete(): void {
    this.dialogService
      .openActionDialog({
        title: '工事の削除',
        message: 'この工事を削除します。\nこの操作は取り消せません。よろしいですか？',
        actionButtonLabel: '削除',
        variant: 'danger',
      })
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.isSubmitting.set(true);
        this.projectApiService
          .delete(this.projectCode())
          .pipe(finalize(() => this.isSubmitting.set(false)))
          .subscribe({
            next: () => {
              this.dialogService
                .openMessageDialog({
                  title: '削除完了',
                  message: '工事を削除しました。工事一覧に戻ります。',
                })
                .subscribe(() => this.router.navigate(['/projects']));
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

  protected onArchive(): void {
    this.dialogService
      .openActionDialog({
        title: '工事のアーカイブ',
        message:
          'この工事をアーカイブします。\nアーカイブの完了後、アプリ上からの操作は不可能になります。よろしいですか？',
        actionButtonLabel: 'アーカイブ',
        variant: 'danger',
      })
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.isSubmitting.set(true);
        this.projectApiService
          .archive(this.projectCode())
          .pipe(finalize(() => this.isSubmitting.set(false)))
          .subscribe({
            next: () => {
              this.dialogService
                .openMessageDialog({
                  title: 'アーカイブ完了',
                  message: '工事をアーカイブしました。',
                })
                .subscribe(() => this.router.navigate(['/projects']));
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

  protected onApprove(): void {
    this.dialogService
      .openActionDialog({
        title: '工事の承認',
        message: 'この工事を承認します。\nよろしいですか？',
        actionButtonLabel: '承認',
      })
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.isSubmitting.set(true);
        this.projectApiService
          .approve(this.projectCode())
          .pipe(finalize(() => this.isSubmitting.set(false)))
          .subscribe({
            next: () => {
              this.projectResource.reload();
              this.toastService.showSuccess('工事を承認しました。');
            },
            error: () => {
              this.dialogService.openMessageDialog({
                title: '承認失敗',
                message: '工事の承認に失敗しました。\nしばらくしてからもう一度お試しください。',
              });
            },
          });
      });
  }

  protected onRevoke(): void {
    this.dialogService
      .openActionDialog({
        title: '承認の取り消し',
        message: '工事の承認を取り消し、未承認に戻します。\nよろしいですか？',
        actionButtonLabel: '未承認に戻す',
        variant: 'danger',
      })
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.isSubmitting.set(true);
        this.projectApiService
          .revoke(this.projectCode())
          .pipe(finalize(() => this.isSubmitting.set(false)))
          .subscribe({
            next: () => {
              this.projectResource.reload();
              this.toastService.showSuccess('工事の承認を取り消しました。');
            },
            error: () => {
              this.dialogService.openMessageDialog({
                title: '取り消しに失敗しました',
                message: '取り消しに失敗しました。\nしばらくしてからもう一度お試しください。',
              });
            },
          });
      });
  }
}
