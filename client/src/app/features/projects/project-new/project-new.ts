import { Component, inject, signal, viewChild } from '@angular/core';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { Router } from '@angular/router';
import { ProjectApiService } from '../data-access/project-api.service';
import { ProjectCreateRequest } from '../models/project-create.request';
import { ProjectFormValue } from '../project-form/project-form.type';
import { ProjectForm } from '../project-form/project-form';
import { formatDateOnly } from '../../../shared/utils/format-date';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { Breadcrumb } from '../../../shared/components/breadcrumb/breadcrumb';
import { BreadcrumbItem } from '../../../shared/components/breadcrumb/breadcrumb.type';
import { Loading } from '../../../shared/components/loading/loading';
import { Button } from '../../../shared/components/button/button/button';
import { withLoadingDelay } from '../../../shared/utils/with-loading-delay';
import { LayoutService } from '../../../core/services/layout.service';
import { UnsavedChangesComponent } from '../../../core/guards/unsaved-changes-guard';
import { finalize } from 'rxjs';
import { DialogService } from '../../../shared/services/dialog.service';

@Component({
  selector: 'app-project-new',
  imports: [ProjectForm, PageHeader, Breadcrumb, Loading, Button, CdkScrollableModule],
  templateUrl: './project-new.html',
  styleUrl: './project-new.scss',
})
export class ProjectNew implements UnsavedChangesComponent {
  private readonly projectApiService = inject(ProjectApiService);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);
  protected readonly layoutService = inject(LayoutService);

  private readonly projectForm = viewChild.required(ProjectForm);

  protected readonly breadcrumbs: BreadcrumbItem[] = [
    { label: '工事一覧', url: '/projects' },
    { label: '工事登録' },
  ];

  protected readonly isSubmitting = signal(false);
  protected readonly showSubmitting = withLoadingDelay(this.isSubmitting);

  hasUnsavedChanges(): boolean {
    return this.projectForm().isDirty;
  }

  protected onSubmitted(value: ProjectFormValue): void {
    this.dialogService
      .openActionDialog({
        title: '工事の登録',
        message: '入力した内容で工事を登録します。\nよろしいですか？',
        actionButtonLabel: '登録',
      })
      .subscribe((confirmed) => {
        if (!confirmed) return;

        const request: ProjectCreateRequest = {
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
          .create(request)
          .pipe(finalize(() => this.isSubmitting.set(false)))
          .subscribe({
            next: () => {
              this.dialogService
                .openMessageDialog({
                  title: '登録完了',
                  message: '工事を登録しました。工事一覧に戻ります。',
                })
                .subscribe(() => {
                  this.projectForm().markAsPristine();
                  this.router.navigate(['/projects']);
                });
            },
            error: () => {
              this.dialogService.openMessageDialog({
                title: '登録失敗',
                message: '工事の登録に失敗しました。\nしばらくしてからもう一度お試しください。',
              });
            },
          });
      });
  }

  protected onSave(): void {
    this.projectForm().submit();
  }

  protected onCancelled(): void {
    this.router.navigate(['/projects']);
  }
}
