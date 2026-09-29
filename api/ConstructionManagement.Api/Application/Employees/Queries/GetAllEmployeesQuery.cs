using ConstructionManagement.Api.Application.Employees.Dtos;
using ConstructionManagement.Api.Infrastructure.Utils;
using Dapper;
using Mediator;
using System.Data;

namespace ConstructionManagement.Api.Application.Employees.Queries
{
    public sealed class GetAllEmployeesQuery : IQuery<IReadOnlyList<EmployeeDto>>
    {
        public Guid TenantId { get; }

        public GetAllEmployeesQuery(Guid tenantId)
        {
            TenantId = tenantId;
        }

        internal sealed class GetAllEmployeesQueryHandler : IQueryHandler<GetAllEmployeesQuery, IReadOnlyList<EmployeeDto>>
        {
            private readonly TenantSqlConnectionFactory _connectionFactory;

            public GetAllEmployeesQueryHandler(TenantSqlConnectionFactory connectionFactory)
            {
                _connectionFactory = connectionFactory;
            }

            public async ValueTask<IReadOnlyList<EmployeeDto>> Handle(
                GetAllEmployeesQuery query,
                CancellationToken cancellationToken)
            {
                using var connection = await _connectionFactory.OpenAsync();
                var results = await connection.QueryAsync<EmployeeDto>(
                    "EmployeeDetails_ReadMany",
                    new { query.TenantId },
                    commandType: CommandType.StoredProcedure);
                return results.ToList();
            }
        }
    }
}