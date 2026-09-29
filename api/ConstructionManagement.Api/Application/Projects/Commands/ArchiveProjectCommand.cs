using ConstructionManagement.Api.Common.Utils;
using ConstructionManagement.Api.Domain.Projects;
using ConstructionManagement.Api.Infrastructure.Data;
using CSharpFunctionalExtensions;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace ConstructionManagement.Api.Application.Projects.Commands
{
    public sealed class ArchiveProjectCommand : ICommand<UnitResult<Error>>
    {
        public Guid TenantId { get; }
        public string? ProjectCode { get; }

        public ArchiveProjectCommand(Guid tenantId, string? projectCode)
        {
            TenantId = tenantId;
            ProjectCode = projectCode;
        }

        internal sealed class ArchiveProjectCommandHandler : ICommandHandler<ArchiveProjectCommand, UnitResult<Error>>
        {
            private readonly ApplicationDbContext _context;

            public ArchiveProjectCommandHandler(ApplicationDbContext context)
            {
                _context = context;
            }

            public async ValueTask<UnitResult<Error>> Handle(
                ArchiveProjectCommand command,
                CancellationToken cancellationToken)
            {
                var result = Domain.Projects.ProjectCode.Create(command.ProjectCode);
                if (result.IsFailure)
                    return UnitResult.Failure(Errors.General.Validation(result.Error));

                Project? project = await _context.Projects
                    .FirstOrDefaultAsync(p => p.TenantId == command.TenantId && p.ProjectCode == result.Value, cancellationToken);
                if (project is null)
                    return UnitResult.Failure(Errors.General.NotFound());

                if (!project.CanArchive())
                    return UnitResult.Failure(Errors.General.UnprocessableEntity("未承認の工事はアーカイブできません。"));

                ProjectArchive archive = ProjectArchive.Create(
                    project.Id,
                    project.TenantId,
                    project.ProjectCode,
                    project.Name,
                    project.CustomerId,
                    project.CustomerContactPerson,
                    project.OrderDate,
                    project.OrderType,
                    project.EstimateNumber,
                    project.DepartmentId,
                    project.SalesStaffId,
                    project.ConstructionStaffId,
                    project.Status,
                    project.ApprovedAt,
                    project.CreatedAt,
                    project.UpdatedAt,
                    DateTime.UtcNow);

                _context.ProjectArchives.Add(archive);
                _context.Projects.Remove(project);
                await _context.SaveChangesAsync(cancellationToken);

                return UnitResult.Success<Error>();
            }
        }
    }
}