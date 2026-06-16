using ConstructionManagement.Api.Controllers.Customers.Dtos;
using ConstructionManagement.Api.Domain.Customers;
using ConstructionManagement.Api.Infrastructure.Utils;
using Dapper;
using System.Data;

namespace ConstructionManagement.Api.Infrastructure.Repositories
{
    public sealed class CustomerRepository
    {
        private readonly TenantSqlConnectionFactory _connectionFactory;

        public CustomerRepository(TenantSqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<IReadOnlyList<CustomerDto>> GetDtosAsync(Guid tenantId)
        {
            using var connection = await _connectionFactory.OpenAsync();
            var results = await connection.QueryAsync<CustomerDto>(
                "Customer_ReadMany",
                new { TenantId = tenantId },
                commandType: CommandType.StoredProcedure);
            return results.ToList();
        }

        public async Task<Customer?> GetByIdAsync(Guid tenantId, Guid id)
        {
            using var connection = await _connectionFactory.OpenAsync();
            var record = await connection.QuerySingleOrDefaultAsync<CustomerRecord>(
                "Customer_ReadById",
                new
                {
                    TenantId = tenantId,
                    Id = id,
                },
                commandType: CommandType.StoredProcedure);

            return record is null ? null : MapToCustomer(record);
        }

        private static Customer MapToCustomer(CustomerRecord record)
        {
            CustomerCode customerCode = CustomerCode.Create(record.CustomerCode).Value;

            return Customer.Create(
                record.Id,
                record.TenantId,
                customerCode,
                record.Name,
                record.Status);
        }

        private sealed class CustomerRecord
        {
            public required Guid Id { get; init; }
            public required Guid TenantId { get; init; }
            public required string CustomerCode { get; init; }
            public required string Name { get; init; }
            public required CustomerStatus Status { get; init; }
        }
    }
}