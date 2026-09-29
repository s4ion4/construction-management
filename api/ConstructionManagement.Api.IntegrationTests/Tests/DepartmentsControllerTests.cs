using ConstructionManagement.Api.Application.Departments;
using ConstructionManagement.Api.Application.Departments.Dtos;
using ConstructionManagement.Api.IntegrationTests.Common;
using ConstructionManagement.Api.IntegrationTests.ObjectMothers;
using System.Net;
using System.Net.Http.Json;

namespace ConstructionManagement.Api.IntegrationTests.Tests
{
    public sealed class DepartmentsControllerTests : BaseIntegrationTest
    {
        private static readonly Guid TenantId = Guid.Parse("00000000-0000-0000-0000-000000000001");

        public DepartmentsControllerTests(IntegrationTestWebAppFactory factory) : base(factory)
        {
        }

        [Fact]
        public async Task 部門一覧を取得できる()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var departmentId = await DepartmentMother.Create(DbConnection, TenantId,
                departmentCode: "D0000001",
                name: "工事部",
                cancellationToken: cancellationToken);

            // Act
            var response = await HttpClient.GetAsync("/api/departments", cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var departments = await response.Content.ReadFromJsonAsync<List<DepartmentDto>>(cancellationToken);
            Assert.NotNull(departments);
            Assert.Single(departments);

            var department = departments[0];
            Assert.Equal(departmentId, department.Id);
            Assert.Equal("D0000001", department.DepartmentCode);
            Assert.Equal("工事部", department.Name);
        }

        [Fact]
        public async Task 無効な部門は一覧に含まれない()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            await DepartmentMother.Create(DbConnection, TenantId,
                departmentCode: "D0000001",
                cancellationToken: cancellationToken);

            await DepartmentMother.Create(DbConnection, TenantId,
                departmentCode: "D0000002",
                status: 2,
                cancellationToken: cancellationToken);

            // Act
            var response = await HttpClient.GetAsync("/api/departments", cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var departments = await response.Content.ReadFromJsonAsync<List<DepartmentDto>>(cancellationToken);
            Assert.NotNull(departments);
            Assert.Single(departments);
            Assert.Equal("D0000001", departments[0].DepartmentCode);
        }
    }
}
