using ConstructionManagement.Api.Domain.Projects;
using ConstructionManagement.Api.Infrastructure.Utils;
using Dapper;
using System.Data;

namespace ConstructionManagement.Api.Infrastructure.Repositories
{
    public sealed class ProjectArchiveRepository
    {
        private readonly TenantSqlConnectionFactory _connectionFactory;

        public ProjectArchiveRepository(TenantSqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<ProjectArchive?> GetByProjectCodeAsync(Guid tenantId, ProjectCode projectCode)
        {
            using var connection = await _connectionFactory.OpenAsync();
            var record = await connection.QuerySingleOrDefaultAsync<ProjectArchiveRecord>(
                "ProjectArchive_ReadByProjectCode",
                new
                {
                    TenantId = tenantId,
                    ProjectCode = projectCode.Value,
                },
                commandType: CommandType.StoredProcedure);

            return record is null ? null : MapToProjectArchive(record);
        }

        private static ProjectArchive MapToProjectArchive(ProjectArchiveRecord record)
        {
            ProjectCode projectCode = ProjectCode.Create(record.ProjectCode).Value;

            return ProjectArchive.Create(
                record.Id,
                record.TenantId,
                projectCode,
                record.Name,
                record.CustomerId,
                record.CustomerContactPerson,
                OrderDate.Create(record.OrderDate).Value,
                record.OrderType,
                record.EstimateMainNumber is null
                    ? null
                    : EstimateNumber.Create(record.EstimateMainNumber, record.EstimateBranchNumber).Value,
                record.DepartmentId,
                record.SalesStaffId,
                record.ConstructionStaffId,
                record.ArchivedAt);
        }

        private sealed class ProjectArchiveRecord
        {
            public required Guid Id { get; init; }
            public required Guid TenantId { get; init; }
            public required string ProjectCode { get; init; }
            public required string Name { get; init; }
            public required Guid CustomerId { get; init; }
            public string? CustomerContactPerson { get; init; }
            public required DateOnly OrderDate { get; init; }
            public required OrderType OrderType { get; init; }
            public string? EstimateMainNumber { get; init; }
            public string? EstimateBranchNumber { get; init; }
            public Guid? DepartmentId { get; init; }
            public Guid? SalesStaffId { get; init; }
            public Guid? ConstructionStaffId { get; init; }
            public required DateTime ArchivedAt { get; init; }
        }
    }
}