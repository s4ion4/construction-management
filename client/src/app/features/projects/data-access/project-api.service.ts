import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProjectResponse } from '../models/project.response';
import { ProjectCreateRequest } from '../models/project-create.request';
import { ProjectUpdateRequest } from '../models/project-update.request';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectApiService {
  private readonly http = inject(HttpClient);
  private readonly projectsUrl = 'api/projects';

  createProjectsResource(): HttpResourceRef<ProjectResponse[]> {
    return httpResource<ProjectResponse[]>(() => this.projectsUrl, { defaultValue: [] });
  }

  createProjectResource(projectCode: () => string): HttpResourceRef<ProjectResponse | undefined> {
    return httpResource<ProjectResponse>(() => `${this.projectsUrl}/${projectCode()}`);
  }

  create(request: ProjectCreateRequest): Observable<void> {
    return this.http.post<void>(this.projectsUrl, request);
  }

  update(projectCode: string, request: ProjectUpdateRequest): Observable<void> {
    return this.http.put<void>(`${this.projectsUrl}/${projectCode}`, request);
  }

  approve(projectCode: string): Observable<void> {
    return this.http.post<void>(`${this.projectsUrl}/${projectCode}/approve`, null);
  }

  revoke(projectCode: string): Observable<void> {
    return this.http.post<void>(`${this.projectsUrl}/${projectCode}/revoke`, null);
  }

  delete(projectCode: string): Observable<void> {
    return this.http.delete<void>(`${this.projectsUrl}/${projectCode}`);
  }

  archive(projectCode: string): Observable<void> {
    return this.http.post<void>(`${this.projectsUrl}/${projectCode}/archive`, null);
  }

  bulkDelete(projectCodes: string[]): Observable<void> {
    return this.http.post<void>(`${this.projectsUrl}/bulk-delete`, { projectCodes });
  }

  bulkArchive(projectCodes: string[]): Observable<void> {
    return this.http.post<void>(`${this.projectsUrl}/bulk-archive`, { projectCodes });
  }

  checkCode(projectCode: string, currentProjectCode?: string): Observable<void> {
    return this.http.post<void>(`${this.projectsUrl}/check-code`, {
      projectCode,
      currentProjectCode,
    });
  }
}
