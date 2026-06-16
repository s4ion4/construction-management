import { Routes } from '@angular/router';
import { Layout } from './core/layout/layout/layout';
import { unsavedChangesGuard } from './core/guards/unsaved-changes-guard';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/projects/project-list/project-list').then((m) => m.ProjectList),
      },
      {
        path: 'projects/new',
        loadComponent: () =>
          import('./features/projects/project-new/project-new').then((m) => m.ProjectNew),
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: 'projects/:projectCode',
        loadComponent: () =>
          import('./features/projects/project-detail/project-detail').then((m) => m.ProjectDetail),
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./features/customers/customer-list/customer-list').then((m) => m.CustomerList),
      },
      {
        path: 'departments',
        loadComponent: () =>
          import('./features/departments/department-list/department-list').then(
            (m) => m.DepartmentList,
          ),
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('./features/employees/employee-list/employee-list').then((m) => m.EmployeeList),
      },
      {
        path: '',
        redirectTo: 'projects',
        pathMatch: 'full',
      },
      {
        path: '**',
        loadComponent: () =>
          import('./features/page-not-found/page-not-found').then((m) => m.PageNotFound),
      },
    ],
  },
];
