using ConstructionManagement.Api.Common.Utils;
using ConstructionManagement.Api.Domain.Projects;
using ConstructionManagement.Api.Infrastructure.Data;
using CSharpFunctionalExtensions;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace ConstructionManagement.Api.Application.Projects.Commands
{
    public sealed class ApproveProjectCommand : ICommand<UnitResult<Error>>
    {
        public Guid TenantId { get; }
        public string? ProjectCode { get; }

        public ApproveProjectCommand(Guid tenantId, string? projectCode)
        {
            TenantId = tenantId;
            ProjectCode = projectCode;
        }

        internal sealed class ApproveProjectCommandHandler : ICommandHandler<ApproveProjectCommand, UnitResult<Error>>
        {
            private readonly ApplicationDbContext _context;

            public ApproveProjectCommandHandler(ApplicationDbContext context)
            {
                _context = context;
            }

            public async ValueTask<UnitResult<Error>> Handle(
                ApproveProjectCommand command,
                CancellationToken cancellationToken)
            {
                var result = Domain.Projects.ProjectCode.Create(command.ProjectCode);
                if (result.IsFailure)
                    return UnitResult.Failure(Errors.General.Validation(result.Error));

                Project? project = await _context.Projects
                    .FirstOrDefaultAsync(p => p.TenantId == command.TenantId && p.ProjectCode == result.Value, cancellationToken);
                if (project is null)
                    return UnitResult.Failure(Errors.General.NotFound());

                Result approveResult = project.Approve();
                if (approveResult.IsFailure)
                    return UnitResult.Failure(Errors.General.UnprocessableEntity(approveResult.Error));

                await _context.SaveChangesAsync(cancellationToken);

                return UnitResult.Success<Error>();
            }
        }
    }
}