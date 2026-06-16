using Dapper;
using Microsoft.Data.SqlClient;

namespace ConstructionManagement.Api.IntegrationTests.ObjectMothers
{
    public static class EmployeeMother
    {
        public static async Task<Guid> Create(
            SqlConnection connection,
            Guid tenantId,
            string employeeCode = "E0000001",
            string name = "テスト社員",
            string departmentCode = "D0000001",
            int status = 1,
            CancellationToken cancellationToken = default)
        {
            var id = Guid.NewGuid();

            await connection.ExecuteAsync(new CommandDefinition("""
                INSERT INTO [dbo].[Employee] (
                    [Id],
                    [TenantId],
                    [EmployeeCode],
                    [Name],
                    [DepartmentCode],
                    [Status],
                    [CreatedAt],
                    [UpdatedAt])
                VALUES (
                    @Id,
                    @TenantId,
                    @EmployeeCode,
                    @Name,
                    @DepartmentCode,
                    @Status,
                    SYSDATETIME(),
                    SYSDATETIME())
                """,
                new
                {
                    Id = id,
                    TenantId = tenantId,
                    EmployeeCode = employeeCode,
                    Name = name,
                    DepartmentCode = departmentCode,
                    Status = status,
                },
                cancellationToken: cancellationToken));

            return id;
        }
    }
}
