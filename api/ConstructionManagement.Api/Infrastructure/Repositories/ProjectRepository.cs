using ConstructionManagement.Api.Controllers.Projects.Dtos;
using ConstructionManagement.Api.Domain.Projects;
using ConstructionManagement.Api.Infrastructure.Utils;
using Dapper;
using System.Data;

namespace ConstructionManagement.Api.Infrastructure.Repositories
{
    public sealed class ProjectRepository
    {
        private readonly TenantSqlConnectionFactory _connectionFactory;

        public ProjectRepository(TenantSqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<ProjectDto?> GetDtoByProjectCodeAsync(Guid tenantId, ProjectCode projectCode)
        {
            using var connection = await _connectionFactory.OpenAsync();
            var record = await connection.QuerySingleOrDefaultAsync<ProjectDetailsRecord>(
                "ProjectDetails_ReadByProjectCode",
                new
                {
                    TenantId = tenantId,
                    ProjectCode = projectCode.Value,
                },
                commandType: CommandType.StoredProcedure);

            return record is null ? null : MapToProjectDto(record);
        }

        public async Task<IReadOnlyList<ProjectDto>> GetDtosAsync(Guid tenantId)
        {
            using var connection = await _connectionFactory.OpenAsync();
            var records = await connection.QueryAsync<ProjectDetailsRecord>(
                "ProjectDetails_ReadMany",
                new { TenantId = tenantId },
                commandType: CommandType.StoredProcedure);
            return records.Select(MapToProjectDto).ToList();
        }

        public async Task<Project?> GetByProjectCodeAsync(Guid tenantId, ProjectCode projectCode)
        {
            using var connection = await _connectionFactory.OpenAsync();
            var record = await connection.QuerySingleOrDefaultAsync<ProjectRecord>(
                "Project_ReadByProjectCode",
                new
                {
                    TenantId = tenantId,
                    ProjectCode = projectCode.Value,
                },
                commandType: CommandType.StoredProcedure);

            return record is null ? null : MapToProject(record);
        }

        public async Task<IReadOnlyList<Project>> GetByProjectCodesAsync(Guid tenantId, IEnumerable<ProjectCode> projectCodes)
        {
            using var connection = await _connectionFactory.OpenAsync();
            var table = new DataTable();
            table.Columns.Add("ProjectCode", typeof(string));
            foreach (var code in projectCodes)
                table.Rows.Add(code.Value);

            var records = await connection.QueryAsync<ProjectRecord>(
                "Project_ReadManyByProjectCodes",
                new
                {
                    TenantId = tenantId,
                    ProjectCodes = table.AsTableValuedParameter("[dbo].[ProjectCodeArray]"),
                },
                commandType: CommandType.StoredProcedure);

            return records.Select(MapToProject).ToList();
        }

        public async Task CreateAsync(Project project)
        {
            using var connection = await _connectionFactory.OpenAsync();
            await connection.ExecuteAsync(
                "Project_Create",
                new
                {
                    project.Id,
                    project.TenantId,
                    ProjectCode = project.ProjectCode.Value,
                    project.Name,
                    project.CustomerId,
                    project.CustomerContactPerson,
                    OrderDate = project.OrderDate.Value,
                    project.OrderType,
                    EstimateMainNumber = project.EstimateNumber?.MainNumber,
                    EstimateBranchNumber = project.EstimateNumber?.BranchNumber,
                    project.DepartmentId,
                    project.SalesStaffId,
                    project.ConstructionStaffId,
                    project.Status,
                    project.ApprovedAt,
                },
                commandType: CommandType.StoredProcedure);
        }

        public async Task UpdateAsync(Project project)
        {
            using var connection = await _connectionFactory.OpenAsync();
            await connection.ExecuteAsync(
                "Project_Update",
                new
                {
                    project.Id,
                    project.TenantId,
                    ProjectCode = project.ProjectCode.Value,
                    project.Name,
                    project.CustomerId,
                    project.CustomerContactPerson,
                    OrderDate = project.OrderDate.Value,
                    project.OrderType,
                    EstimateMainNumber = project.EstimateNumber?.MainNumber,
                    EstimateBranchNumber = project.EstimateNumber?.BranchNumber,
                    project.DepartmentId,
                    project.SalesStaffId,
                    project.ConstructionStaffId,
                    project.Status,
                    project.ApprovedAt,
                },
                commandType: CommandType.StoredProcedure);
        }

        public async Task ArchiveByProjectCodeAsync(Guid tenantId, ProjectCode projectCode)
        {
            using var connection = await _connectionFactory.OpenAsync();
            await connection.ExecuteAsync(
                "Project_ArchiveByProjectCode",
                new
                {
                    TenantId = tenantId,
                    ProjectCode = projectCode.Value,
                },
                commandType: CommandType.StoredProcedure);
        }

        public async Task DeleteByProjectCodeAsync(Guid tenantId, ProjectCode projectCode)
        {
            using var connection = await _connectionFactory.OpenAsync();
            await connection.ExecuteAsync(
                "Project_DeleteByProjectCode",
                new
                {
                    TenantId = tenantId,
                    ProjectCode = projectCode.Value,
                },
                commandType: CommandType.StoredProcedure);
        }

        public async Task BulkDeleteAsync(Guid tenantId, IEnumerable<ProjectCode> projectCodes)
        {
            using var connection = await _connectionFactory.OpenAsync();
            var table = new DataTable();
            table.Columns.Add("ProjectCode", typeof(string));
            foreach (var code in projectCodes)
                table.Rows.Add(code.Value);

            await connection.ExecuteAsync(
                "Project_DeleteManyByProjectCodes",
                new
                {
                    TenantId = tenantId,
                    ProjectCodes = table.AsTableValuedParameter("[dbo].[ProjectCodeArray]"),
                },
                commandType: CommandType.StoredProcedure);
        }

        public async Task BulkArchiveAsync(Guid tenantId, IEnumerable<ProjectCode> projectCodes)
        {
            using var connection = await _connectionFactory.OpenAsync();
            var table = new DataTable();
            table.Columns.Add("ProjectCode", typeof(string));
            foreach (var code in projectCodes)
                table.Rows.Add(code.Value);

            await connection.ExecuteAsync(
                "Project_ArchiveManyByProjectCodes",
                new
                {
                    TenantId = tenantId,
                    ProjectCodes = table.AsTableValuedParameter("[dbo].[ProjectCodeArray]"),
                },
                commandType: CommandType.StoredProcedure);
        }

        private static ProjectDto MapToProjectDto(ProjectDetailsRecord record)
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

        private static Project MapToProject(ProjectRecord record)
        {
            ProjectCode projectCode = ProjectCode.Create(record.ProjectCode).Value;

            return Project.Create(
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
                record.Status,
                record.ApprovedAt);
        }

        private sealed class ProjectDetailsRecord
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

        private sealed class ProjectRecord
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
            public required ProjectStatus Status { get; init; }
            public DateTime? ApprovedAt { get; init; }
        }
    }
}