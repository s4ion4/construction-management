
using ConstructionManagement.Api.Application.Projects.Commands;
using ConstructionManagement.Api.Application.Projects.Dtos;
using ConstructionManagement.Api.Application.Projects.Queries;
using ConstructionManagement.Api.Common.Extensions;
using ConstructionManagement.Api.Common.Utils;
using CSharpFunctionalExtensions;
using Mediator;
using Microsoft.AspNetCore.Mvc;

namespace ConstructionManagement.Api.Controllers
{
    [Route("api/[controller]")]
    public class ProjectsController : BaseController
    {
        private readonly IMediator _mediator;

        public ProjectsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{projectCode}")]
        public async Task<IActionResult> GetAsync(string projectCode)
        {
            Guid tenantId = User.GetTenantId();
            Result<ProjectDto, Error> result = await _mediator.Send(new GetProjectQuery(tenantId, projectCode));
            return FromResult(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            Guid tenantId = User.GetTenantId();
            IReadOnlyList<ProjectDto> dtos = await _mediator.Send(new GetAllProjectsQuery(tenantId));
            return Ok(dtos);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync(CreateProjectDto request)
        {
            Guid tenantId = User.GetTenantId();
            var command = new CreateProjectCommand(
                tenantId,
                request.ProjectCode,
                request.Name,
                request.CustomerId,
                request.CustomerContactPerson,
                request.OrderDate,
                request.OrderType,
                request.EstimateNumber?.MainNumber,
                request.EstimateNumber?.BranchNumber,
                request.DepartmentId,
                request.SalesStaffId,
                request.ConstructionStaffId);

            UnitResult<Error> result = await _mediator.Send(command);
            return FromResult(result);
        }

        [HttpPut("{projectCode}")]
        public async Task<IActionResult> UpdateAsync(string projectCode, UpdateProjectDto request)
        {
            Guid tenantId = User.GetTenantId();
            var command = new UpdateProjectCommand(
                tenantId,
                projectCode,
                request.ProjectCode,
                request.Name,
                request.CustomerId,
                request.CustomerContactPerson,
                request.OrderDate,
                request.OrderType,
                request.EstimateNumber?.MainNumber,
                request.EstimateNumber?.BranchNumber,
                request.DepartmentId,
                request.SalesStaffId,
                request.ConstructionStaffId);

            UnitResult<Error> result = await _mediator.Send(command);
            return FromResult(result);
        }

        [HttpPost("{projectCode}/approve")]
        public async Task<IActionResult> ApproveAsync(string projectCode)
        {
            Guid tenantId = User.GetTenantId();
            UnitResult<Error> result = await _mediator.Send(new ApproveProjectCommand(tenantId, projectCode));
            return FromResult(result);
        }

        [HttpPost("{projectCode}/revoke")]
        public async Task<IActionResult> RevokeAsync(string projectCode)
        {
            Guid tenantId = User.GetTenantId();
            UnitResult<Error> result = await _mediator.Send(new RevokeProjectCommand(tenantId, projectCode));
            return FromResult(result);
        }

        [HttpDelete("{projectCode}")]
        public async Task<IActionResult> DeleteAsync(string projectCode)
        {
            Guid tenantId = User.GetTenantId();
            UnitResult<Error> result = await _mediator.Send(new DeleteProjectCommand(tenantId, projectCode));
            return FromResult(result);
        }

        [HttpPost("{projectCode}/archive")]
        public async Task<IActionResult> ArchiveAsync(string projectCode)
        {
            Guid tenantId = User.GetTenantId();
            UnitResult<Error> result = await _mediator.Send(new ArchiveProjectCommand(tenantId, projectCode));
            return FromResult(result);
        }

        [HttpPost("bulk-delete")]
        public async Task<IActionResult> BulkDeleteAsync(BulkDeleteProjectDto request)
        {
            Guid tenantId = User.GetTenantId();
            UnitResult<Error> result = await _mediator.Send(new BulkDeleteProjectsCommand(tenantId, request.ProjectCodes));
            return FromResult(result);
        }

        [HttpPost("bulk-archive")]
        public async Task<IActionResult> BulkArchiveAsync(BulkArchiveProjectDto request)
        {
            Guid tenantId = User.GetTenantId();
            UnitResult<Error> result = await _mediator.Send(new BulkArchiveProjectsCommand(tenantId, request.ProjectCodes));
            return FromResult(result);
        }

        [HttpPost("check-code")]
        public async Task<IActionResult> CheckCodeAsync(CheckProjectCodeDto request)
        {
            Guid tenantId = User.GetTenantId();
            UnitResult<Error> result = await _mediator.Send(
                new CheckProjectCodeQuery(tenantId, request.ProjectCode, request.CurrentProjectCode));
            return FromResult(result);
        }
    }
}