using ConstructionManagement.Api.Common.Tenancy;
using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;

namespace ConstructionManagement.Api.Infrastructure.Utils
{
    public sealed class TenantSqlConnectionFactory
    {
        private readonly ConnectionString _connectionString;
        private readonly ITenantContext _tenantContext;

        public TenantSqlConnectionFactory(ConnectionString connectionString, ITenantContext tenantContext)
        {
            _connectionString = connectionString;
            _tenantContext = tenantContext;
        }

        public async Task<SqlConnection> OpenAsync()
        {
            var connection = new SqlConnection(_connectionString.Value);
            await connection.OpenAsync();

            await connection.ExecuteAsync(
                "sys.sp_set_session_context",
                new { key = "TenantId", value = _tenantContext.TenantId, read_only = true },
                commandType: CommandType.StoredProcedure);

            return connection;
        }
    }
}
