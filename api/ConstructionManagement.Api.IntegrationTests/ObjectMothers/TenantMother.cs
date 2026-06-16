using Dapper;
using Microsoft.Data.SqlClient;

namespace ConstructionManagement.Api.IntegrationTests.ObjectMothers
{
    public static class TenantMother
    {
        public static async Task<Guid> Create(
            SqlConnection connection,
            Guid id,
            string name = "テスト企業",
            CancellationToken cancellationToken = default)
        {
            await connection.ExecuteAsync(new CommandDefinition("""
                INSERT INTO [dbo].[Tenant] (
                    [Id],
                    [Name],
                    [CreatedAt],
                    [UpdatedAt])
                VALUES (
                    @Id,
                    @Name,
                    SYSDATETIME(),
                    SYSDATETIME())
                """,
                new { Id = id, Name = name },
                cancellationToken: cancellationToken));

            return id;
        }
    }
}
