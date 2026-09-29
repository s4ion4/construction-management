using ConstructionManagement.Api.Application.Customers;
using ConstructionManagement.Api.Application.Customers.Dtos;
using ConstructionManagement.Api.IntegrationTests.Common;
using ConstructionManagement.Api.IntegrationTests.ObjectMothers;
using System.Net;
using System.Net.Http.Json;

namespace ConstructionManagement.Api.IntegrationTests.Tests
{
    public sealed class CustomersControllerTests : BaseIntegrationTest
    {
        private static readonly Guid TenantId = Guid.Parse("00000000-0000-0000-0000-000000000001");

        public CustomersControllerTests(IntegrationTestWebAppFactory factory) : base(factory)
        {
        }

        [Fact]
        public async Task 得意先一覧を取得できる()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var customerId = await CustomerMother.Create(DbConnection, TenantId,
                customerCode: "C0000001",
                name: "株式会社山田建設",
                cancellationToken: cancellationToken);

            // Act
            var response = await HttpClient.GetAsync("/api/customers", cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var customers = await response.Content.ReadFromJsonAsync<List<CustomerDto>>(cancellationToken);
            Assert.NotNull(customers);
            Assert.Single(customers);

            var customer = customers[0];
            Assert.Equal(customerId, customer.Id);
            Assert.Equal("C0000001", customer.CustomerCode);
            Assert.Equal("株式会社山田建設", customer.Name);
        }

        [Fact]
        public async Task 無効な得意先は一覧に含まれない()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            await CustomerMother.Create(DbConnection, TenantId,
                customerCode: "C0000001",
                cancellationToken: cancellationToken);

            await CustomerMother.Create(DbConnection, TenantId,
                customerCode: "C0000002",
                status: 2,
                cancellationToken: cancellationToken);

            // Act
            var response = await HttpClient.GetAsync("/api/customers", cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var customers = await response.Content.ReadFromJsonAsync<List<CustomerDto>>(cancellationToken);
            Assert.NotNull(customers);
            Assert.Single(customers);
            Assert.Equal("C0000001", customers[0].CustomerCode);
        }
    }
}
