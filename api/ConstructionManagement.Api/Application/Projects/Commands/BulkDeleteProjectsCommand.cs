using ConstructionManagement.Api.Common.Utils;
using ConstructionManagement.Api.Domain.Projects;
using ConstructionManagement.Api.Infrastructure.Data;
using CSharpFunctionalExtensions;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace ConstructionManagement.Api.Application.Projects.Commands
{
    public sealed class BulkDeleteProjectsCommand : ICommand<UnitResult<Error>>
    {
        public Guid TenantId { get; }
        public IReadOnlyList<string> ProjectCodes { get; }

        public BulkDeleteProjectsCommand(Guid tenantId, IReadOnlyList<string> projectCodes)
        {
            TenantId = tenantId;
            ProjectCodes = projectCodes;
        }

        internal sealed class BulkDeleteProjectsCommandHandler : ICommandHandler<BulkDeleteProjectsCommand, UnitResult<Error>>
        {
            private readonly ApplicationDbContext _context;

            public BulkDeleteProjectsCommandHandler(ApplicationDbContext context)
            {
                _context = context;
            }

            public async ValueTask<UnitResult<Error>> Handle(
                BulkDeleteProjectsCommand command,
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

                if (projects.Any(p => !p.CanDelete()))
                    return UnitResult.Failure(Errors.General.UnprocessableEntity("承認済みの工事が含まれているため一括削除できません。"));

                _context.Projects.RemoveRange(projects);
                await _context.SaveChangesAsync(cancellationToken);

                return UnitResult.Success<Error>();
            }
        }
    }
}