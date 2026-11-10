using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System.Data;
using System.Data.Common;

namespace ConstructionManagement.Infrastructure.Data.Interceptors
{
    public sealed class TenantSessionContextInterceptor : DbConnectionInterceptor
    {
        private readonly ITenantContext _tenantContext;

        public TenantSessionContextInterceptor(ITenantContext tenantContext)
        {
            _tenantContext = tenantContext;
        }

        public override async Task ConnectionOpenedAsync(
            DbConnection connection,
            ConnectionEndEventData eventData,
            CancellationToken cancellationToken = default)
        {
            await SetSessionContextAsync((SqlConnection)connection, cancellationToken);
            await base.ConnectionOpenedAsync(connection, eventData, cancellationToken);
        }

        public override void ConnectionOpened(DbConnection connection, ConnectionEndEventData eventData)
        {
            SetSessionContextAsync((SqlConnection)connection, CancellationToken.None).GetAwaiter().GetResult();
            base.ConnectionOpened(connection, eventData);
        }

        private async Task SetSessionContextAsync(SqlConnection connection, CancellationToken cancellationToken)
        {
            await using var command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "sys.sp_set_session_context";

            command.Parameters.Add(new SqlParameter("@key", "TenantId"));
            command.Parameters.Add(new SqlParameter("@value", _tenantContext.TenantId));
            command.Parameters.Add(new SqlParameter("@read_only", true));

            await command.ExecuteNonQueryAsync(cancellationToken);
        }
    }
}