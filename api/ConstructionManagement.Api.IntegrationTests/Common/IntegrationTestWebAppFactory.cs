using Dapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.SqlClient;
using Microsoft.SqlServer.Dac;
using Respawn;
using Testcontainers.MsSql;

namespace ConstructionManagement.Api.IntegrationTests.Common
{
    public sealed class IntegrationTestWebAppFactory : WebApplicationFactory<Program>, IAsyncLifetime
    {
        private readonly MsSqlContainer _msSqlContainer = new MsSqlBuilder("mcr.microsoft.com/mssql/server:2019-latest")
            .Build();

        private Respawner _respawner = null!;

        public string ConnectionString => _msSqlContainer.GetConnectionString();

        public async ValueTask InitializeAsync()
        {
            await _msSqlContainer.StartAsync();
            DeployDacpac();

            await using var connection = new SqlConnection(ConnectionString);
            await connection.OpenAsync();

            _respawner = await Respawner.CreateAsync(connection, new RespawnerOptions
            {
                DbAdapter = DbAdapter.SqlServer,
                SchemasToInclude = ["dbo"],
            });
        }

        public new async ValueTask DisposeAsync()
        {
            await _msSqlContainer.DisposeAsync();
        }

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseSetting("ConnectionStrings:DefaultConnection", _msSqlContainer.GetConnectionString());
        }

        public async Task ResetDatabaseAsync(CancellationToken cancellationToken = default)
        {
            await using var connection = new SqlConnection(ConnectionString);
            await connection.OpenAsync(cancellationToken);

            await connection.ExecuteAsync("""
                ALTER SECURITY POLICY [Security].[DepartmentTenantFilter] WITH (STATE = OFF);
                ALTER SECURITY POLICY [Security].[EmployeeTenantFilter] WITH (STATE = OFF);
                ALTER SECURITY POLICY [Security].[CustomerTenantFilter] WITH (STATE = OFF);
                ALTER SECURITY POLICY [Security].[ProjectTenantFilter] WITH (STATE = OFF);
                ALTER SECURITY POLICY [Security].[ProjectArchiveTenantFilter] WITH (STATE = OFF);
            """);

            await _respawner.ResetAsync(connection);

            await connection.ExecuteAsync("""
                ALTER SECURITY POLICY [Security].[DepartmentTenantFilter] WITH (STATE = ON);
                ALTER SECURITY POLICY [Security].[EmployeeTenantFilter] WITH (STATE = ON);
                ALTER SECURITY POLICY [Security].[CustomerTenantFilter] WITH (STATE = ON);
                ALTER SECURITY POLICY [Security].[ProjectTenantFilter] WITH (STATE = ON);
                ALTER SECURITY POLICY [Security].[ProjectArchiveTenantFilter] WITH (STATE = ON);
            """);
        }

        private void DeployDacpac()
        {
            var dacpacPath = Path.Combine(AppContext.BaseDirectory, "ConstructionManagement.Database.dacpac");
            var dacServices = new DacServices(ConnectionString);
            using var dacPackage = DacPackage.Load(dacpacPath);
            dacServices.Deploy(dacPackage, "master", upgradeExisting: true);
        }
    }
}
