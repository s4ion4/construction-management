using ConstructionManagement.Api.Application.Employees;
using ConstructionManagement.Api.Application.Employees.Dtos;
using ConstructionManagement.Api.IntegrationTests.Common;
using ConstructionManagement.Api.IntegrationTests.ObjectMothers;
using System.Net;
using System.Net.Http.Json;

namespace ConstructionManagement.Api.IntegrationTests.Tests
{
    public sealed class EmployeesControllerTests : BaseIntegrationTest
    {
        private static readonly Guid TenantId = Guid.Parse("00000000-0000-0000-0000-000000000001");

        public EmployeesControllerTests(IntegrationTestWebAppFactory factory) : base(factory)
        {
        }

        [Fact]
        public async Task 社員一覧を取得できる()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            await DepartmentMother.Create(DbConnection, TenantId,
                departmentCode: "D0000001",
                name: "工事部",
                cancellationToken: cancellationToken);

            var employeeId = await EmployeeMother.Create(DbConnection, TenantId,
                employeeCode: "E0000001",
                name: "田中 太郎",
                departmentCode: "D0000001",
                cancellationToken: cancellationToken);

            // Act
            var response = await HttpClient.GetAsync("/api/employees", cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var employees = await response.Content.ReadFromJsonAsync<List<EmployeeDto>>(cancellationToken);
            Assert.NotNull(employees);
            Assert.Single(employees);

            var employee = employees[0];
            Assert.Equal(employeeId, employee.Id);
            Assert.Equal("E0000001", employee.EmployeeCode);
            Assert.Equal("田中 太郎", employee.Name);
            Assert.Equal("D0000001", employee.DepartmentCode);
            Assert.Equal("工事部", employee.DepartmentName);
        }

        [Fact]
        public async Task 無効な社員は一覧に含まれない()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            await DepartmentMother.Create(DbConnection, TenantId,
                departmentCode: "D0000001",
                cancellationToken: cancellationToken);

            await EmployeeMother.Create(DbConnection, TenantId,
                employeeCode: "E0000001",
                departmentCode: "D0000001",
                cancellationToken: cancellationToken);

            await EmployeeMother.Create(DbConnection, TenantId,
                employeeCode: "E0000002",
                departmentCode: "D0000001",
                status: 2,
                cancellationToken: cancellationToken);

            // Act
            var response = await HttpClient.GetAsync("/api/employees", cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var employees = await response.Content.ReadFromJsonAsync<List<EmployeeDto>>(cancellationToken);
            Assert.NotNull(employees);
            Assert.Single(employees);
            Assert.Equal("E0000001", employees[0].EmployeeCode);
        }
    }
}
