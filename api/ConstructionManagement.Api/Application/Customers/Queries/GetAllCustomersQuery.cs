using ConstructionManagement.Api.Application.Customers.Dtos;
using ConstructionManagement.Api.Infrastructure.Utils;
using Dapper;
using Mediator;
using System.Data;

namespace ConstructionManagement.Api.Application.Customers.Queries
{
    public sealed class GetAllCustomersQuery : IQuery<IReadOnlyList<CustomerDto>>
    {
        public Guid TenantId { get; }

        public GetAllCustomersQuery(Guid tenantId)
        {
            TenantId = tenantId;
        }

        internal sealed class GetAllCustomersQueryHandler : IQueryHandler<GetAllCustomersQuery, IReadOnlyList<CustomerDto>>
        {
            private readonly TenantSqlConnectionFactory _connectionFactory;

            public GetAllCustomersQueryHandler(TenantSqlConnectionFactory connectionFactory)
            {
                _connectionFactory = connectionFactory;
            }

            public async ValueTask<IReadOnlyList<CustomerDto>> Handle(
                GetAllCustomersQuery query,
                CancellationToken cancellationToken)
            {
                using var connection = await _connectionFactory.OpenAsync();
                var results = await connection.QueryAsync<CustomerDto>(
                    "Customer_ReadMany",
                    new { query.TenantId },
                    commandType: CommandType.StoredProcedure);
                return results.ToList();
            }
        }
    }
}