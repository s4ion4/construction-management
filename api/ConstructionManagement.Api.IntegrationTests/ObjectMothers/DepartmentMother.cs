using Dapper;
using Microsoft.Data.SqlClient;

namespace ConstructionManagement.Api.IntegrationTests.ObjectMothers
{
    public static class DepartmentMother
    {
        public static async Task<Guid> Create(
            SqlConnection connection,
            Guid tenantId,
            string departmentCode = "D0000001",
            string name = "テスト部門",
            int status = 1,
            CancellationToken cancellationToken = default)
        {
            var id = Guid.NewGuid();

            await connection.ExecuteAsync(new CommandDefinition("""
                INSERT INTO [dbo].[Department] (
                    [Id],
                    [TenantId],
                    [DepartmentCode],
                    [Name],
                    [Status],
                    [CreatedAt],
                    [UpdatedAt])
                VALUES (
                    @Id,
                    @TenantId,
                    @DepartmentCode,
                    @Name,
                    @Status,
                    SYSDATETIME(),
                    SYSDATETIME())
                """,
                new
                {
                    Id = id,
                    TenantId = tenantId,
                    DepartmentCode = departmentCode,
                    Name = name,
                    Status = status,
                },
                cancellationToken: cancellationToken));

            return id;
        }
    }
}