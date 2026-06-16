using Dapper;
using Microsoft.Data.SqlClient;

namespace ConstructionManagement.Api.IntegrationTests.ObjectMothers
{
    public static class CustomerMother
    {
        public static async Task<Guid> Create(
            SqlConnection connection,
            Guid tenantId,
            string customerCode = "C0000001",
            string name = "テスト得意先",
            int status = 1,
            CancellationToken cancellationToken = default)
        {
            var id = Guid.NewGuid();

            await connection.ExecuteAsync(new CommandDefinition("""
                INSERT INTO [dbo].[Customer] (
                    [Id],
                    [TenantId],
                    [CustomerCode],
                    [Name],
                    [Status],
                    [CreatedAt],
                    [UpdatedAt])
                VALUES (
                    @Id,
                    @TenantId,
                    @CustomerCode,
                    @Name,
                    @Status,
                    SYSDATETIME(),
                    SYSDATETIME())
                """,
                new
                {
                    Id = id,
                    TenantId = tenantId,
                    CustomerCode = customerCode,
                    Name = name,
                    Status = status,
                },
                cancellationToken: cancellationToken));

            return id;
        }
    }
}
