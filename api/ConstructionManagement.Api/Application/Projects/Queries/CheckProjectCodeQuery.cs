using ConstructionManagement.Api.Common.Utils;
using ConstructionManagement.Api.Domain.Projects;
using ConstructionManagement.Api.Infrastructure.Data;
using CSharpFunctionalExtensions;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace ConstructionManagement.Api.Application.Projects.Queries
{
    public sealed class CheckProjectCodeQuery : IQuery<UnitResult<Error>>
    {
        public Guid TenantId { get; }
        public string? ProjectCode { get; }
        public string? CurrentProjectCode { get; }

        public CheckProjectCodeQuery(Guid tenantId, string? projectCode, string? currentProjectCode)
        {
            TenantId = tenantId;
            ProjectCode = projectCode;
            CurrentProjectCode = currentProjectCode;
        }

        internal sealed class CheckProjectCodeQueryHandler : IQueryHandler<CheckProjectCodeQuery, UnitResult<Error>>
        {
            private readonly ApplicationDbContext _context;

            public CheckProjectCodeQueryHandler(ApplicationDbContext context)
            {
                _context = context;
            }

            public async ValueTask<UnitResult<Error>> Handle(
                CheckProjectCodeQuery query,
                CancellationToken cancellationToken)
            {
                ProjectCode projectCode = Domain.Projects.ProjectCode.Create(query.ProjectCode).Value;

                ProjectCode? currentCode = query.CurrentProjectCode is not null
                    ? Domain.Projects.ProjectCode.Create(query.CurrentProjectCode).Value
                    : null;

                bool existsInProjects = await _context.Projects
                   .AnyAsync(p => p.TenantId == query.TenantId && p.ProjectCode == projectCode, cancellationToken);

                if (existsInProjects && projectCode != currentCode)
                    return UnitResult.Failure(Errors.General.Conflict());

                bool existsInArchives = await _context.ProjectArchives
                    .AnyAsync(p => p.TenantId == query.TenantId && p.ProjectCode == projectCode, cancellationToken);

                if (existsInArchives && projectCode != currentCode)
                    return UnitResult.Failure(Errors.General.Conflict());

                return UnitResult.Success<Error>();
            }
        }
    }
}