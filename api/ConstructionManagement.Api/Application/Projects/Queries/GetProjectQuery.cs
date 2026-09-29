using ConstructionManagement.Api.Application.Projects.Dtos;
using ConstructionManagement.Api.Common.Utils;
using ConstructionManagement.Api.Domain.Projects;
using ConstructionManagement.Api.Infrastructure.Utils;
using CSharpFunctionalExtensions;
using Dapper;
using Mediator;
using System.Data;

namespace ConstructionManagement.Api.Application.Projects.Queries
{
    public sealed class GetProjectQuery : IQuery<Result<ProjectDto, Error>>
    {
        public Guid TenantId { get; }
        public string? ProjectCode { get; }

        public GetProjectQuery(Guid tenantId, string? projectCode)
        {
            TenantId = tenantId;
            ProjectCode = projectCode;
        }

        internal static ProjectDto MapToProjectDto(ProjectDetailsRecord record)
        {
            return new ProjectDto
            {
                ProjectCode = record.ProjectCode,
                Name = record.Name,
                Customer = new ProjectCustomerDto
                {
                    Id = record.CustomerId,
                    Code = record.CustomerCode,
                    Name = record.CustomerName,
                },
                CustomerContactPerson = record.CustomerContactPerson,
                OrderDate = record.OrderDate,
                OrderType = record.OrderType,
                EstimateNumber = record.EstimateMainNumber is null ? null : new ProjectEstimateNumberDto
                {
                    MainNumber = record.EstimateMainNumber,
                    BranchNumber = record.EstimateBranchNumber!,
                },
                Department = record.DepartmentId is null ? null : new ProjectDepartmentDto
                {
                    Id = record.DepartmentId.Value,
                    Code = record.DepartmentCode!,
                    Name = record.DepartmentName!,
                },
                SalesStaff = record.SalesStaffId is null ? null : new ProjectStaffDto
                {
                    Id = record.SalesStaffId.Value,
                    Code = record.SalesStaffCode!,
                    Name = record.SalesStaffName!,
                },
                ConstructionStaff = record.ConstructionStaffId is null ? null : new ProjectStaffDto
                {
                    Id = record.ConstructionStaffId.Value,
                    Code = record.ConstructionStaffCode!,
                    Name = record.ConstructionStaffName!,
                },
                Status = record.Status,
                ApprovedAt = record.ApprovedAt,
            };
        }

        internal sealed class ProjectDetailsRecord
        {
            public required string ProjectCode { get; init; }
            public required string Name { get; init; }
            public required Guid CustomerId { get; init; }
            public required string CustomerCode { get; init; }
            public required string CustomerName { get; init; }
            public string? CustomerContactPerson { get; init; }
            public required DateOnly OrderDate { get; init; }
            public required OrderType OrderType { get; init; }
            public string? EstimateMainNumber { get; init; }
            public string? EstimateBranchNumber { get; init; }
            public Guid? DepartmentId { get; init; }
            public string? DepartmentCode { get; init; }
            public string? DepartmentName { get; init; }
            public Guid? SalesStaffId { get; init; }
            public string? SalesStaffCode { get; init; }
            public string? SalesStaffName { get; init; }
            public Guid? ConstructionStaffId { get; init; }
            public string? ConstructionStaffCode { get; init; }
            public string? ConstructionStaffName { get; init; }
            public required ProjectStatus Status { get; init; }
            public DateTime? ApprovedAt { get; init; }
        }

        internal sealed class GetProjectQueryHandler : IQueryHandler<GetProjectQuery, Result<ProjectDto, Error>>
        {
            private readonly TenantSqlConnectionFactory _connectionFactory;

            public GetProjectQueryHandler(TenantSqlConnectionFactory connectionFactory)
            {
                _connectionFactory = connectionFactory;
            }

            public async ValueTask<Result<ProjectDto, Error>> Handle(
                GetProjectQuery query,
                CancellationToken cancellationToken)
            {
                var result = Domain.Projects.ProjectCode.Create(query.ProjectCode);
                if (result.IsFailure)
                    return Errors.General.Validation(result.Error);

                using var connection = await _connectionFactory.OpenAsync();
                var record = await connection.QuerySingleOrDefaultAsync<ProjectDetailsRecord>(
                    "ProjectDetails_ReadByProjectCode",
                    new
                    {
                        query.TenantId,
                        ProjectCode = result.Value.Value,
                    },
                    commandType: CommandType.StoredProcedure);

                if (record is null)
                    return Errors.General.NotFound();

                return MapToProjectDto(record);
            }
        }
    }
}