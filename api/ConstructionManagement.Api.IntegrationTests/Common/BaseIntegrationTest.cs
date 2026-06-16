using Dapper;
using Microsoft.Data.SqlClient;

namespace ConstructionManagement.Api.IntegrationTests.Common
{
    public abstract class BaseIntegrationTest : IClassFixture<IntegrationTestWebAppFactory>, IAsyncLifetime
    {
        private readonly IntegrationTestWebAppFactory _factory;

        protected HttpClient HttpClient { get; private set; } = null!;
        protected SqlConnection DbConnection { get; private set; } = null!;

        protected BaseIntegrationTest(IntegrationTestWebAppFactory factory)
        {
            _factory = factory;
        }

        public async ValueTask InitializeAsync()
        {
            HttpClient = _factory.CreateClient();

            DbConnection = new SqlConnection(_factory.ConnectionString);
            await DbConnection.OpenAsync(TestContext.Current.CancellationToken);

            await _factory.ResetDatabaseAsync(TestContext.Current.CancellationToken);

            await DbConnection.ExecuteAsync(
                "EXEC sp_set_session_context @key = N'TenantId', @value = @TenantId",
                new { TenantId = "00000000-0000-0000-0000-000000000001" });
        }

        public async ValueTask DisposeAsync()
        {
            await DbConnection.CloseAsync();
            DbConnection.Dispose();
            HttpClient.Dispose();
        }
    }
}
