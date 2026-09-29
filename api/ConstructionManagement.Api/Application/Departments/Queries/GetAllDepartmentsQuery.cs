using ConstructionManagement.Api.Application.Departments.Dtos;
using ConstructionManagement.Api.Infrastructure.Utils;
using Dapper;
using Mediator;
using System.Data;

namespace ConstructionManagement.Api.Application.Departments.Queries
{
    public sealed class GetAllDepartmentsQuery : IQuery<IReadOnlyList<DepartmentDto>>
    {
        public Guid TenantId { get; }

        public GetAllDepartmentsQuery(Guid tenantId)
        {
            TenantId = tenantId;
        }

        internal sealed class GetAllDepartmentsQueryHandler : IQueryHandler<GetAllDepartmentsQuery, IReadOnlyList<DepartmentDto>>
        {
            private readonly TenantSqlConnectionFactory _connectionFactory;

            public GetAllDepartmentsQueryHandler(TenantSqlConnectionFactory connectionFactory)
            {
                _connectionFactory = connectionFactory;
            }

            public async ValueTask<IReadOnlyList<DepartmentDto>> Handle(
                GetAllDepartmentsQuery query,
                CancellationToken cancellationToken)
            {
                using var connection = await _connectionFactory.OpenAsync();
                var results = await connection.QueryAsync<DepartmentDto>(
                    "Department_ReadMany",
                    new { query.TenantId },
                    commandType: CommandType.StoredProcedure);
                return results.ToList();
            }
        }
    }
}