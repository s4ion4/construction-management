using ConstructionManagement.Api.Common.Utils;
using ConstructionManagement.Api.Domain.Projects;
using ConstructionManagement.Api.Infrastructure.Data;
using CSharpFunctionalExtensions;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace ConstructionManagement.Api.Application.Projects.Commands
{
    public sealed class BulkArchiveProjectsCommand : ICommand<UnitResult<Error>>
    {
        public Guid TenantId { get; }
        public IReadOnlyList<string> ProjectCodes { get; }

        public BulkArchiveProjectsCommand(Guid tenantId, IReadOnlyList<string> projectCodes)
        {
            TenantId = tenantId;
            ProjectCodes = projectCodes;
        }

        internal sealed class BulkArchiveProjectsCommandHandler : ICommandHandler<BulkArchiveProjectsCommand, UnitResult<Error>>
        {
            private readonly ApplicationDbContext _context;

            public BulkArchiveProjectsCommandHandler(ApplicationDbContext context)
            {
                _context = context;
            }

            public async ValueTask<UnitResult<Error>> Handle(
                BulkArchiveProjectsCommand command,
                CancellationToken cancellationToken)
            {
                IReadOnlyList<ProjectCode> projectCodes = command.ProjectCodes
                    .Distinct().Select(c => ProjectCode.Create(c).Value).ToList();

                IReadOnlyList<Project> projects = await _context.Projects
                    .Where(p => p.TenantId == command.TenantId && projectCodes.Contains(p.ProjectCode))
                    .ToListAsync(cancellationToken);

                var existing = projects.Select(p => p.ProjectCode.Value).ToHashSet();

                if (projectCodes.Any(c => !existing.Contains(c.Value)))
                    return UnitResult.Failure(Errors.General.UnprocessableEntity("存在しない工事コードが含まれています。"));

                if (projects.Any(p => !p.CanArchive()))
                    return UnitResult.Failure(Errors.General.UnprocessableEntity("未承認の工事が含まれているため一括アーカイブできません。"));

                var archivedAt = DateTime.UtcNow;

                foreach (var project in projects)
                {
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
                        archivedAt);

                    _context.ProjectArchives.Add(archive);
                    _context.Projects.Remove(project);
                }

                await _context.SaveChangesAsync(cancellationToken);

                return UnitResult.Success<Error>();
            }
        }
    }
}