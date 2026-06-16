using ConstructionManagement.Api.Controllers.Employees.Dtos;
using ConstructionManagement.Api.Domain.Departments;
using ConstructionManagement.Api.Domain.Employees;
using ConstructionManagement.Api.Infrastructure.Utils;
using Dapper;
using System.Data;

namespace ConstructionManagement.Api.Infrastructure.Repositories
{
    public sealed class EmployeeRepository
    {
        private readonly TenantSqlConnectionFactory _connectionFactory;

        public EmployeeRepository(TenantSqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<IReadOnlyList<EmployeeDto>> GetDtosAsync(Guid tenantId)
        {
            using var connection = await _connectionFactory.OpenAsync();
            var results = await connection.QueryAsync<EmployeeDto>(
                "EmployeeDetails_ReadMany",
                new { TenantId = tenantId },
                commandType: CommandType.StoredProcedure);
            return results.ToList();
        }

        public async Task<Employee?> GetByIdAsync(Guid tenantId, Guid id)
        {
            using var connection = await _connectionFactory.OpenAsync();
            var record = await connection.QuerySingleOrDefaultAsync<EmployeeRecord>(
                "Employee_ReadById",
                new
                {
                    TenantId = tenantId,
                    Id = id,
                },
                commandType: CommandType.StoredProcedure);

            return record is null ? null : MapToEmployee(record);
        }

        private static Employee MapToEmployee(EmployeeRecord record)
        {
            EmployeeCode employeeCode = EmployeeCode.Create(record.EmployeeCode).Value;
            DepartmentCode departmentCode = DepartmentCode.Create(record.DepartmentCode).Value;

            return Employee.Create(record.Id, record.TenantId, employeeCode, record.Name, departmentCode, record.Status);
        }

        private sealed class EmployeeRecord
        {
            public required Guid Id { get; init; }
            public required Guid TenantId { get; init; }
            public required string EmployeeCode { get; init; }
            public required string Name { get; init; }
            public required string DepartmentCode { get; init; }
            public required EmployeeStatus Status { get; init; }
        }
    }
}