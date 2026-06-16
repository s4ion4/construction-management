using ConstructionManagement.Api.Controllers.Departments.Dtos;
using ConstructionManagement.Api.Domain.Departments;
using ConstructionManagement.Api.Infrastructure.Utils;
using Dapper;
using System.Data;

namespace ConstructionManagement.Api.Infrastructure.Repositories
{
    public sealed class DepartmentRepository
    {
        private readonly TenantSqlConnectionFactory _connectionFactory;

        public DepartmentRepository(TenantSqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<IReadOnlyList<DepartmentDto>> GetDtosAsync(Guid tenantId)
        {
            using var connection = await _connectionFactory.OpenAsync();
            var results = await connection.QueryAsync<DepartmentDto>(
                "Department_ReadMany",
                new { TenantId = tenantId },
                commandType: CommandType.StoredProcedure);
            return results.ToList();
        }

        public async Task<Department?> GetByIdAsync(Guid tenantId, Guid id)
        {
            using var connection = await _connectionFactory.OpenAsync();
            var record = await connection.QuerySingleOrDefaultAsync<DepartmentRecord>(
                "Department_ReadById",
                new
                {
                    TenantId = tenantId,
                    Id = id,
                },
                commandType: CommandType.StoredProcedure);

            return record is null ? null : MapToDepartment(record);
        }

        private static Department MapToDepartment(DepartmentRecord record)
        {
            DepartmentCode departmentCode = DepartmentCode.Create(record.DepartmentCode).Value;

            return Department.Create(
                record.Id,
                record.TenantId,
                departmentCode,
                record.Name,
                record.Status);
        }

        private sealed class DepartmentRecord
        {
            public required Guid Id { get; init; }
            public required Guid TenantId { get; init; }
            public required string DepartmentCode { get; init; }
            public required string Name { get; init; }
            public required DepartmentStatus Status { get; init; }
        }
    }
}