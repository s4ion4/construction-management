using ConstructionManagement.Api.Application.Projects.Dtos;
using ConstructionManagement.Api.Infrastructure.Utils;
using Dapper;
using Mediator;
using System.Data;

namespace ConstructionManagement.Api.Application.Projects.Queries
{
    public sealed class GetAllProjectsQuery : IQuery<IReadOnlyList<ProjectDto>>
    {
        public Guid TenantId { get; }

        public GetAllProjectsQuery(Guid tenantId)
        {
            TenantId = tenantId;
        }

        internal sealed class GetAllProjectsQueryHandler : IQueryHandler<GetAllProjectsQuery, IReadOnlyList<ProjectDto>>
        {
            private readonly TenantSqlConnectionFactory _connectionFactory;

            public GetAllProjectsQueryHandler(TenantSqlConnectionFactory connectionFactory)
            {
                _connectionFactory = connectionFactory;
            }

            public async ValueTask<IReadOnlyList<ProjectDto>> Handle(
                GetAllProjectsQuery query,
                CancellationToken cancellationToken)
            {
                using var connection = await _connectionFactory.OpenAsync();
                var records = await connection.QueryAsync<GetProjectQuery.ProjectDetailsRecord>(
                    "ProjectDetails_ReadMany",
                    new { query.TenantId },
                    commandType: CommandType.StoredProcedure);

                return records.Select(GetProjectQuery.MapToProjectDto).ToList();
            }
        }
    }
}