using ConstructionManagement.Api.Common.Extensions;
using ConstructionManagement.Api.Controllers.Projects.Dtos;
using ConstructionManagement.Api.Domain.Customers;
using ConstructionManagement.Api.Domain.Departments;
using ConstructionManagement.Api.Domain.Employees;
using ConstructionManagement.Api.Domain.Projects;
using ConstructionManagement.Api.Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ConstructionManagement.Api.Controllers.Projects
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly ProjectRepository _projectRepository;
        private readonly ProjectArchiveRepository _projectArchiveRepository;
        private readonly CustomerRepository _customerRepository;
        private readonly DepartmentRepository _departmentRepository;
        private readonly EmployeeRepository _employeeRepository;

        public ProjectsController(
            ProjectRepository projectRepository,
            ProjectArchiveRepository projectArchiveRepository,
            CustomerRepository customerRepository,
            DepartmentRepository departmentRepository,
            EmployeeRepository employeeRepository)
        {
            _projectRepository = projectRepository;
            _projectArchiveRepository = projectArchiveRepository;
            _customerRepository = customerRepository;
            _departmentRepository = departmentRepository;
            _employeeRepository = employeeRepository;
        }

        [HttpGet("{projectCode}")]
        public async Task<IActionResult> GetAsync(string projectCode)
        {
            Guid tenantId = User.GetTenantId();

            var result = ProjectCode.Create(projectCode);
            if (result.IsFailure)
                return Problem(
                    detail: result.Error,
                    statusCode: StatusCodes.Status400BadRequest);

            ProjectDto? dto = await _projectRepository.GetDtoByProjectCodeAsync(tenantId, result.Value);

            if (dto is null)
                return NotFound();

            return Ok(dto);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            Guid tenantId = User.GetTenantId();
            IReadOnlyList<ProjectDto> dtos = await _projectRepository.GetDtosAsync(tenantId);
            return Ok(dtos);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync(CreateProjectDto request)
        {
            Guid tenantId = User.GetTenantId();
            ProjectCode projectCode = ProjectCode.Create(request.ProjectCode).Value;
            OrderDate orderDate = OrderDate.Create(request.OrderDate).Value;
            EstimateNumber? estimateNumber = request.EstimateNumber is null
                ? null
                : EstimateNumber.Create(request.EstimateNumber.MainNumber, request.EstimateNumber.BranchNumber).Value;

            if (await _projectRepository.GetByProjectCodeAsync(tenantId, projectCode) is not null)
                return Problem(
                    detail: "指定された工事コードは既に使用されています。",
                    statusCode: StatusCodes.Status409Conflict);

            if (await _projectArchiveRepository.GetByProjectCodeAsync(tenantId, projectCode) is not null)
                return Problem(
                    detail: "指定された工事コードは削除済みのため使用できません。",
                    statusCode: StatusCodes.Status409Conflict);

            Customer? customer = await _customerRepository.GetByIdAsync(tenantId, request.CustomerId!.Value);
            if (customer is null || customer.Status != CustomerStatus.Active)
                return Problem(
                    detail: "指定された得意先は無効です。",
                    statusCode: StatusCodes.Status422UnprocessableEntity);

            if (request.DepartmentId is not null)
            {
                Department? department = await _departmentRepository.GetByIdAsync(tenantId, request.DepartmentId.Value);
                if (department is null || department.Status != DepartmentStatus.Active)
                    return Problem(
                        detail: "指定された部門は無効です。",
                        statusCode: StatusCodes.Status422UnprocessableEntity);
            }

            if (request.SalesStaffId is not null)
            {
                Employee? salesStaff = await _employeeRepository.GetByIdAsync(tenantId, request.SalesStaffId.Value);
                if (salesStaff is null || salesStaff.Status != EmployeeStatus.Active)
                    return Problem(
                        detail: "指定された社員は無効です。",
                        statusCode: StatusCodes.Status422UnprocessableEntity);
            }

            if (request.ConstructionStaffId is not null)
            {
                Employee? constructionStaff = await _employeeRepository.GetByIdAsync(tenantId, request.ConstructionStaffId.Value);
                if (constructionStaff is null || constructionStaff.Status != EmployeeStatus.Active)
                    return Problem(
                        detail: "指定された社員は無効です。",
                        statusCode: StatusCodes.Status422UnprocessableEntity);
            }

            Project project = Project.Create(
                Guid.NewGuid(),
                tenantId,
                projectCode,
                request.Name!,
                request.CustomerId!.Value,
                request.CustomerContactPerson,
                orderDate,
                request.OrderType!.Value,
                estimateNumber,
                request.DepartmentId,
                request.SalesStaffId,
                request.ConstructionStaffId,
                ProjectStatus.Pending,
                approvedAt: null);

            await _projectRepository.CreateAsync(project);

            return Ok();
        }

        [HttpPut("{projectCode}")]
        public async Task<IActionResult> UpdateAsync(string projectCode, UpdateProjectDto request)
        {
            Guid tenantId = User.GetTenantId();

            var result = ProjectCode.Create(projectCode);
            if (result.IsFailure)
                return Problem(
                    detail: result.Error,
                    statusCode: StatusCodes.Status400BadRequest);

            Project? project = await _projectRepository.GetByProjectCodeAsync(tenantId, result.Value);
            if (project is null)
                return NotFound();

            if (!project.CanEdit())
                return Problem(
                    detail: "承認済みの工事は編集できません。",
                    statusCode: StatusCodes.Status422UnprocessableEntity);

            ProjectCode newProjectCode = ProjectCode.Create(request.ProjectCode).Value;
            OrderDate orderDate = OrderDate.Create(request.OrderDate).Value;
            EstimateNumber? estimateNumber = request.EstimateNumber is null
                ? null
                : EstimateNumber.Create(request.EstimateNumber.MainNumber, request.EstimateNumber.BranchNumber).Value;

            if (newProjectCode != project.ProjectCode)
            {
                if (await _projectRepository.GetByProjectCodeAsync(tenantId, newProjectCode) is not null)
                    return Problem(
                        detail: "指定された工事コードは既に使用されています。",
                        statusCode: StatusCodes.Status409Conflict);

                if (await _projectArchiveRepository.GetByProjectCodeAsync(tenantId, newProjectCode) is not null)
                    return Problem(
                        detail: "指定された工事コードは削除済みのため使用できません。",
                        statusCode: StatusCodes.Status409Conflict);
            }

            if (request.CustomerId != project.CustomerId)
            {
                Customer? customer = await _customerRepository.GetByIdAsync(tenantId, request.CustomerId!.Value);
                if (customer is null || customer.Status != CustomerStatus.Active)
                    return Problem(
                        detail: "指定された得意先は無効です。",
                        statusCode: StatusCodes.Status422UnprocessableEntity);
            }

            if (request.DepartmentId != project.DepartmentId)
            {
                if (request.DepartmentId is not null)
                {
                    Department? department = await _departmentRepository.GetByIdAsync(tenantId, request.DepartmentId.Value);
                    if (department is null || department.Status != DepartmentStatus.Active)
                        return Problem(
                            detail: "指定された部門は無効です。",
                            statusCode: StatusCodes.Status422UnprocessableEntity);
                }
            }

            if (request.SalesStaffId != project.SalesStaffId)
            {
                if (request.SalesStaffId is not null)
                {
                    Employee? salesStaff = await _employeeRepository.GetByIdAsync(tenantId, request.SalesStaffId.Value);
                    if (salesStaff is null || salesStaff.Status != EmployeeStatus.Active)
                        return Problem(
                            detail: "指定された社員は無効です。",
                            statusCode: StatusCodes.Status422UnprocessableEntity);
                }
            }

            if (request.ConstructionStaffId != project.ConstructionStaffId)
            {
                if (request.ConstructionStaffId is not null)
                {
                    Employee? constructionStaff = await _employeeRepository.GetByIdAsync(tenantId, request.ConstructionStaffId.Value);
                    if (constructionStaff is null || constructionStaff.Status != EmployeeStatus.Active)
                        return Problem(
                            detail: "指定された社員は無効です。",
                            statusCode: StatusCodes.Status422UnprocessableEntity);
                }
            }

            project.Update(
                newProjectCode,
                request.Name!,
                request.CustomerId!.Value,
                request.CustomerContactPerson,
                orderDate,
                request.OrderType!.Value,
                estimateNumber,
                request.DepartmentId,
                request.SalesStaffId,
                request.ConstructionStaffId);

            await _projectRepository.UpdateAsync(project);

            return Ok();
        }

        [HttpPost("{projectCode}/approve")]
        public async Task<IActionResult> ApproveAsync(string projectCode)
        {
            Guid tenantId = User.GetTenantId();

            var result = ProjectCode.Create(projectCode);
            if (result.IsFailure)
                return Problem(
                    detail: result.Error,
                    statusCode: StatusCodes.Status400BadRequest);

            Project? project = await _projectRepository.GetByProjectCodeAsync(tenantId, result.Value);
            if (project is null)
                return NotFound();

            var approveResult = project.Approve();
            if (approveResult.IsFailure)
                return Problem(
                    detail: approveResult.Error,
                    statusCode: StatusCodes.Status422UnprocessableEntity);

            await _projectRepository.UpdateAsync(project);

            return Ok();
        }

        [HttpPost("{projectCode}/revoke")]
        public async Task<IActionResult> RevokeAsync(string projectCode)
        {
            Guid tenantId = User.GetTenantId();

            var result = ProjectCode.Create(projectCode);
            if (result.IsFailure)
                return Problem(
                    detail: result.Error,
                    statusCode: StatusCodes.Status400BadRequest);

            Project? project = await _projectRepository.GetByProjectCodeAsync(tenantId, result.Value);
            if (project is null)
                return NotFound();

            var revokeResult = project.Revoke();
            if (revokeResult.IsFailure)
                return Problem(
                    detail: revokeResult.Error,
                    statusCode: StatusCodes.Status422UnprocessableEntity);

            await _projectRepository.UpdateAsync(project);

            return Ok();
        }

        [HttpDelete("{projectCode}")]
        public async Task<IActionResult> DeleteAsync(string projectCode)
        {
            Guid tenantId = User.GetTenantId();

            var result = ProjectCode.Create(projectCode);
            if (result.IsFailure)
                return Problem(
                    detail: result.Error,
                    statusCode: StatusCodes.Status400BadRequest);

            Project? project = await _projectRepository.GetByProjectCodeAsync(tenantId, result.Value);
            if (project is null)
                return NotFound();

            if (!project.CanDelete())
                return Problem(
                    detail: "承認済みの工事は削除できません。",
                    statusCode: StatusCodes.Status422UnprocessableEntity);

            await _projectRepository.DeleteByProjectCodeAsync(tenantId, result.Value);

            return Ok();
        }

        [HttpPost("{projectCode}/archive")]
        public async Task<IActionResult> ArchiveAsync(string projectCode)
        {
            Guid tenantId = User.GetTenantId();

            var result = ProjectCode.Create(projectCode);
            if (result.IsFailure)
                return Problem(
                    detail: result.Error,
                    statusCode: StatusCodes.Status400BadRequest);

            Project? project = await _projectRepository.GetByProjectCodeAsync(tenantId, result.Value);
            if (project is null)
                return NotFound();

            if (!project.CanArchive())
                return Problem(
                    detail: "未承認の工事はアーカイブできません。",
                    statusCode: StatusCodes.Status422UnprocessableEntity);

            await _projectRepository.ArchiveByProjectCodeAsync(tenantId, result.Value);

            return Ok();
        }

        [HttpPost("bulk-delete")]
        public async Task<IActionResult> BulkDeleteAsync(BulkDeleteProjectDto request)
        {
            Guid tenantId = User.GetTenantId();

            IReadOnlyList<ProjectCode> projectCodes = request.ProjectCodes
                .Distinct().Select(c => ProjectCode.Create(c).Value).ToList();

            IReadOnlyList<Project> projects = await _projectRepository
                .GetByProjectCodesAsync(tenantId, projectCodes);

            var existing = projects.Select(p => p.ProjectCode.Value).ToHashSet();

            if (projectCodes.Any(c => !existing.Contains(c.Value)))
                return Problem(
                    detail: "存在しない工事コードが含まれています。",
                    statusCode: StatusCodes.Status422UnprocessableEntity);

            if (projects.Any(p => !p.CanDelete()))
                return Problem(
                    detail: "承認済みの工事が含まれているため一括削除できません。",
                    statusCode: StatusCodes.Status422UnprocessableEntity);

            await _projectRepository.BulkDeleteAsync(tenantId, projectCodes);

            return Ok();
        }

        [HttpPost("bulk-archive")]
        public async Task<IActionResult> BulkArchiveAsync(BulkArchiveProjectDto request)
        {
            Guid tenantId = User.GetTenantId();

            IReadOnlyList<ProjectCode> projectCodes = request.ProjectCodes
                .Distinct().Select(c => ProjectCode.Create(c).Value).ToList();

            IReadOnlyList<Project> projects = await _projectRepository
                .GetByProjectCodesAsync(tenantId, projectCodes);

            var existing = projects.Select(p => p.ProjectCode.Value).ToHashSet();

            if (projectCodes.Any(c => !existing.Contains(c.Value)))
                return Problem(
                    detail: "存在しない工事コードが含まれています。",
                    statusCode: StatusCodes.Status422UnprocessableEntity);

            if (projects.Any(p => !p.CanArchive()))
                return Problem(
                    detail: "未承認の工事が含まれているため一括アーカイブできません。",
                    statusCode: StatusCodes.Status422UnprocessableEntity);

            await _projectRepository.BulkArchiveAsync(tenantId, projectCodes);

            return Ok();
        }

        [HttpPost("check-code")]
        public async Task<IActionResult> CheckCodeAsync(CheckProjectCodeDto request)
        {
            Guid tenantId = User.GetTenantId();

            var result = ProjectCode.Create(request.ProjectCode);
            if (result.IsFailure)
                return Problem(
                    detail: result.Error,
                    statusCode: StatusCodes.Status400BadRequest);

            ProjectCode projectCode = result.Value;

            ProjectCode? currentCode = request.CurrentProjectCode is not null
                ? ProjectCode.Create(request.CurrentProjectCode).Value
                : null;

            var existing = await _projectRepository.GetByProjectCodeAsync(tenantId, projectCode);
            if (existing is not null && existing.ProjectCode != currentCode)
                return Conflict();

            var archived = await _projectArchiveRepository.GetByProjectCodeAsync(tenantId, projectCode);
            if (archived is not null && archived.ProjectCode != currentCode)
                return Conflict();

            return Ok();
        }
    }
}