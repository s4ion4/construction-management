using ConstructionManagement.Api.Application.Projects;
using ConstructionManagement.Api.Application.Projects.Dtos;
using ConstructionManagement.Api.Domain.Projects;
using ConstructionManagement.Api.IntegrationTests.Common;
using ConstructionManagement.Api.IntegrationTests.ObjectMothers;
using System.Net;
using System.Net.Http.Json;

namespace ConstructionManagement.Api.IntegrationTests.Tests
{
    public sealed class ProjectsControllerTests : BaseIntegrationTest
    {
        private static readonly Guid TenantId = Guid.Parse("00000000-0000-0000-0000-000000000001");

        public ProjectsControllerTests(IntegrationTestWebAppFactory factory) : base(factory)
        {
        }

        [Fact]
        public async Task 工事一覧を取得できる()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var customerId = await CustomerMother.Create(DbConnection, TenantId,
                name: "株式会社山田建設",
                cancellationToken: cancellationToken);

            var departmentId = await DepartmentMother.Create(DbConnection, TenantId,
                name: "工事部",
                cancellationToken: cancellationToken);

            var salesStaffId = await EmployeeMother.Create(DbConnection, TenantId,
                employeeCode: "E0000001",
                name: "田中 太郎",
                cancellationToken: cancellationToken);

            var constructionStaffId = await EmployeeMother.Create(DbConnection, TenantId,
                employeeCode: "E0000002",
                name: "鈴木 次郎",
                cancellationToken: cancellationToken);

            await ProjectMother.Create(DbConnection, TenantId, customerId,
                projectCode: "A100000",
                name: "○○ビル新築工事",
                customerContactPerson: "山田 部長",
                orderDate: new DateOnly(2026, 4, 1),
                orderType: (int)OrderType.PrimeContract,
                estimateMainNumber: "100000",
                estimateBranchNumber: "01",
                departmentId: departmentId,
                salesStaffId: salesStaffId,
                constructionStaffId: constructionStaffId,
                cancellationToken: cancellationToken);

            // Act
            var response = await HttpClient.GetAsync("/api/projects", cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var projects = await response.Content.ReadFromJsonAsync<List<ProjectDto>>(cancellationToken);
            Assert.NotNull(projects);
            Assert.Single(projects);

            var project = projects[0];
            Assert.Equal("A100000", project.ProjectCode);
            Assert.Equal("○○ビル新築工事", project.Name);
            Assert.Equal(new DateOnly(2026, 4, 1), project.OrderDate);
            Assert.Equal(OrderType.PrimeContract, project.OrderType);
            Assert.Equal(ProjectStatus.Pending, project.Status);
            Assert.Equal("山田 部長", project.CustomerContactPerson);
            Assert.Null(project.ApprovedAt);

            Assert.NotNull(project.EstimateNumber);
            Assert.Equal("100000", project.EstimateNumber.MainNumber);
            Assert.Equal("01", project.EstimateNumber.BranchNumber);

            Assert.Equal(customerId, project.Customer.Id);
            Assert.Equal("C0000001", project.Customer.Code);
            Assert.Equal("株式会社山田建設", project.Customer.Name);

            Assert.NotNull(project.Department);
            Assert.Equal(departmentId, project.Department.Id);
            Assert.Equal("D0000001", project.Department.Code);
            Assert.Equal("工事部", project.Department.Name);

            Assert.NotNull(project.SalesStaff);
            Assert.Equal(salesStaffId, project.SalesStaff.Id);
            Assert.Equal("E0000001", project.SalesStaff.Code);
            Assert.Equal("田中 太郎", project.SalesStaff.Name);

            Assert.NotNull(project.ConstructionStaff);
            Assert.Equal(constructionStaffId, project.ConstructionStaff.Id);
            Assert.Equal("E0000002", project.ConstructionStaff.Code);
            Assert.Equal("鈴木 次郎", project.ConstructionStaff.Name);
        }

        [Fact]
        public async Task 工事を取得できる()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var customerId = await CustomerMother.Create(DbConnection, TenantId,
                name: "株式会社山田建設",
                cancellationToken: cancellationToken);

            var departmentId = await DepartmentMother.Create(DbConnection, TenantId,
                name: "工事部",
                cancellationToken: cancellationToken);

            var salesStaffId = await EmployeeMother.Create(DbConnection, TenantId,
                employeeCode: "E0000001",
                name: "田中 太郎",
                cancellationToken: cancellationToken);

            var constructionStaffId = await EmployeeMother.Create(DbConnection, TenantId,
                employeeCode: "E0000002",
                name: "鈴木 次郎",
                cancellationToken: cancellationToken);

            await ProjectMother.Create(DbConnection, TenantId, customerId,
                projectCode: "A100000",
                name: "○○ビル新築工事",
                customerContactPerson: "山田 部長",
                orderDate: new DateOnly(2026, 4, 1),
                orderType: (int)OrderType.PrimeContract,
                estimateMainNumber: "100000",
                estimateBranchNumber: "01",
                departmentId: departmentId,
                salesStaffId: salesStaffId,
                constructionStaffId: constructionStaffId,
                cancellationToken: cancellationToken);

            // Act
            var response = await HttpClient.GetAsync("/api/projects/A100000", cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var project = await response.Content.ReadFromJsonAsync<ProjectDto>(cancellationToken);
            Assert.NotNull(project);

            Assert.Equal("A100000", project.ProjectCode);
            Assert.Equal("○○ビル新築工事", project.Name);
            Assert.Equal(new DateOnly(2026, 4, 1), project.OrderDate);
            Assert.Equal(OrderType.PrimeContract, project.OrderType);
            Assert.Equal(ProjectStatus.Pending, project.Status);
            Assert.Equal("山田 部長", project.CustomerContactPerson);
            Assert.Null(project.ApprovedAt);

            Assert.NotNull(project.EstimateNumber);
            Assert.Equal("100000", project.EstimateNumber.MainNumber);
            Assert.Equal("01", project.EstimateNumber.BranchNumber);

            Assert.Equal(customerId, project.Customer.Id);
            Assert.Equal("C0000001", project.Customer.Code);
            Assert.Equal("株式会社山田建設", project.Customer.Name);

            Assert.NotNull(project.Department);
            Assert.Equal(departmentId, project.Department.Id);
            Assert.Equal("D0000001", project.Department.Code);
            Assert.Equal("工事部", project.Department.Name);

            Assert.NotNull(project.SalesStaff);
            Assert.Equal(salesStaffId, project.SalesStaff.Id);
            Assert.Equal("E0000001", project.SalesStaff.Code);
            Assert.Equal("田中 太郎", project.SalesStaff.Name);

            Assert.NotNull(project.ConstructionStaff);
            Assert.Equal(constructionStaffId, project.ConstructionStaff.Id);
            Assert.Equal("E0000002", project.ConstructionStaff.Code);
            Assert.Equal("鈴木 次郎", project.ConstructionStaff.Name);
        }

        [Fact]
        public async Task 存在しない工事コードを指定した場合は404エラーを返す()
        {
            var response = await HttpClient.GetAsync(
                "/api/projects/A999999",
                TestContext.Current.CancellationToken);

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task 工事を登録できる()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var customerId = await CustomerMother.Create(DbConnection, TenantId,
                cancellationToken: cancellationToken);

            var departmentId = await DepartmentMother.Create(DbConnection, TenantId,
                cancellationToken: cancellationToken);

            var salesStaffId = await EmployeeMother.Create(DbConnection, TenantId,
                employeeCode: "E0000001",
                cancellationToken: cancellationToken);

            var constructionStaffId = await EmployeeMother.Create(DbConnection, TenantId,
                employeeCode: "E0000002",
                cancellationToken: cancellationToken);

            var request = new CreateProjectDto
            {
                ProjectCode = "A100000",
                Name = "○○ビル新築工事",
                CustomerId = customerId,
                CustomerContactPerson = "山田 部長",
                OrderDate = new DateOnly(2026, 4, 1),
                OrderType = OrderType.PrimeContract,
                EstimateNumber = new EstimateNumberDto { MainNumber = "100000", BranchNumber = "01" },
                DepartmentId = departmentId,
                SalesStaffId = salesStaffId,
                ConstructionStaffId = constructionStaffId,
            };

            // Act
            var response = await HttpClient.PostAsJsonAsync("/api/projects", request, cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var getResponse = await HttpClient.GetAsync("/api/projects/A100000", cancellationToken);
            Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);
            var project = await getResponse.Content.ReadFromJsonAsync<ProjectDto>(cancellationToken);
            Assert.NotNull(project);
            Assert.Equal("A100000", project.ProjectCode);
            Assert.Equal("○○ビル新築工事", project.Name);
            Assert.Equal(new DateOnly(2026, 4, 1), project.OrderDate);
            Assert.Equal(OrderType.PrimeContract, project.OrderType);
            Assert.Equal(ProjectStatus.Pending, project.Status);
            Assert.Equal("山田 部長", project.CustomerContactPerson);
            Assert.Null(project.ApprovedAt);

            Assert.NotNull(project.EstimateNumber);
            Assert.Equal("100000", project.EstimateNumber.MainNumber);
            Assert.Equal("01", project.EstimateNumber.BranchNumber);

            Assert.Equal(customerId, project.Customer.Id);
            Assert.Equal(departmentId, project.Department?.Id);
            Assert.Equal(salesStaffId, project.SalesStaff?.Id);
            Assert.Equal(constructionStaffId, project.ConstructionStaff?.Id);
        }

        [Fact]
        public async Task 使用済みの工事コードで登録しようとした場合は409エラーを返す()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var customerId = await CustomerMother.Create(DbConnection, TenantId,
                cancellationToken: cancellationToken);

            await ProjectMother.Create(DbConnection, TenantId, customerId,
                projectCode: "A100000",
                cancellationToken: cancellationToken);

            var request = new CreateProjectDto
            {
                ProjectCode = "A100000",
                Name = "別の工事",
                CustomerId = customerId,
                OrderDate = new DateOnly(2026, 4, 1),
                OrderType = OrderType.PrimeContract,
            };

            // Act
            var response = await HttpClient.PostAsJsonAsync("/api/projects", request, cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
        }

        [Fact]
        public async Task アーカイブ済みの工事コードで登録しようとした場合は409エラーを返す()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var customerId = await CustomerMother.Create(DbConnection, TenantId,
                cancellationToken: cancellationToken);

            await ProjectArchiveMother.Create(DbConnection, TenantId, customerId,
                projectCode: "A100000",
                cancellationToken: cancellationToken);

            var request = new CreateProjectDto
            {
                ProjectCode = "A100000",
                Name = "別の工事",
                CustomerId = customerId,
                OrderDate = new DateOnly(2026, 4, 1),
                OrderType = OrderType.PrimeContract,
            };

            // Act
            var response = await HttpClient.PostAsJsonAsync("/api/projects", request, cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
        }

        [Fact]
        public async Task 無効な得意先で登録しようとした場合は422エラーを返す()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var customerId = await CustomerMother.Create(DbConnection, TenantId,
                status: 2,
                cancellationToken: cancellationToken);

            var request = new CreateProjectDto
            {
                ProjectCode = "A100000",
                Name = "○○ビル新築工事",
                CustomerId = customerId,
                OrderDate = new DateOnly(2026, 4, 1),
                OrderType = OrderType.PrimeContract,
            };

            // Act
            var response = await HttpClient.PostAsJsonAsync("/api/projects", request, cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.UnprocessableEntity, response.StatusCode);
        }

        [Fact]
        public async Task 無効な部門で登録しようとした場合は422エラーを返す()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var customerId = await CustomerMother.Create(DbConnection, TenantId,
                cancellationToken: cancellationToken);

            var departmentId = await DepartmentMother.Create(DbConnection, TenantId,
                status: 2,
                cancellationToken: cancellationToken);

            var request = new CreateProjectDto
            {
                ProjectCode = "A100000",
                Name = "○○ビル新築工事",
                CustomerId = customerId,
                OrderDate = new DateOnly(2026, 4, 1),
                OrderType = OrderType.PrimeContract,
                DepartmentId = departmentId,
            };

            // Act
            var response = await HttpClient.PostAsJsonAsync("/api/projects", request, cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.UnprocessableEntity, response.StatusCode);
        }

        [Fact]
        public async Task 無効な営業担当者で登録しようとした場合は422エラーを返す()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var customerId = await CustomerMother.Create(DbConnection, TenantId,
                cancellationToken: cancellationToken);

            await DepartmentMother.Create(DbConnection, TenantId,
                cancellationToken: cancellationToken);

            var salesStaffId = await EmployeeMother.Create(DbConnection, TenantId,
                status: 2,
                cancellationToken: cancellationToken);

            var request = new CreateProjectDto
            {
                ProjectCode = "A100000",
                Name = "○○ビル新築工事",
                CustomerId = customerId,
                OrderDate = new DateOnly(2026, 4, 1),
                OrderType = OrderType.PrimeContract,
                SalesStaffId = salesStaffId,
            };

            // Act
            var response = await HttpClient.PostAsJsonAsync("/api/projects", request, cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.UnprocessableEntity, response.StatusCode);
        }

        [Fact]
        public async Task 無効な工事担当者で登録しようとした場合は422エラーを返す()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var customerId = await CustomerMother.Create(DbConnection, TenantId,
                cancellationToken: cancellationToken);

            await DepartmentMother.Create(DbConnection, TenantId,
                cancellationToken: cancellationToken);

            var constructionStaffId = await EmployeeMother.Create(DbConnection, TenantId,
                status: 2,
                cancellationToken: cancellationToken);

            var request = new CreateProjectDto
            {
                ProjectCode = "A100000",
                Name = "○○ビル新築工事",
                CustomerId = customerId,
                OrderDate = new DateOnly(2026, 4, 1),
                OrderType = OrderType.PrimeContract,
                ConstructionStaffId = constructionStaffId,
            };

            // Act
            var response = await HttpClient.PostAsJsonAsync("/api/projects", request, cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.UnprocessableEntity, response.StatusCode);
        }

        [Fact]
        public async Task 工事を更新できる()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var customerId = await CustomerMother.Create(DbConnection, TenantId,
                cancellationToken: cancellationToken);

            var departmentId = await DepartmentMother.Create(DbConnection, TenantId,
                cancellationToken: cancellationToken);

            var salesStaffId = await EmployeeMother.Create(DbConnection, TenantId,
                employeeCode: "E0000001",
                cancellationToken: cancellationToken);

            var constructionStaffId = await EmployeeMother.Create(DbConnection, TenantId,
                employeeCode: "E0000002",
                cancellationToken: cancellationToken);

            await ProjectMother.Create(DbConnection, TenantId, customerId,
                projectCode: "A100000",
                cancellationToken: cancellationToken);

            var request = new UpdateProjectDto
            {
                ProjectCode = "A100001",
                Name = "○○ビル新築工事（変更後）",
                CustomerId = customerId,
                CustomerContactPerson = "山田 部長",
                OrderDate = new DateOnly(2026, 5, 1),
                OrderType = OrderType.Subcontract,
                EstimateNumber = new EstimateNumberDto { MainNumber = "200000", BranchNumber = "02" },
                DepartmentId = departmentId,
                SalesStaffId = salesStaffId,
                ConstructionStaffId = constructionStaffId,
            };

            // Act
            var response = await HttpClient.PutAsJsonAsync("/api/projects/A100000", request, cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var getResponse = await HttpClient.GetAsync("/api/projects/A100001", cancellationToken);
            Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);
            var project = await getResponse.Content.ReadFromJsonAsync<ProjectDto>(cancellationToken);
            Assert.NotNull(project);
            Assert.Equal("A100001", project.ProjectCode);
            Assert.Equal("○○ビル新築工事（変更後）", project.Name);
            Assert.Equal(new DateOnly(2026, 5, 1), project.OrderDate);
            Assert.Equal(OrderType.Subcontract, project.OrderType);
            Assert.Equal("山田 部長", project.CustomerContactPerson);

            Assert.NotNull(project.EstimateNumber);
            Assert.Equal("200000", project.EstimateNumber.MainNumber);
            Assert.Equal("02", project.EstimateNumber.BranchNumber);

            Assert.Equal(customerId, project.Customer.Id);
            Assert.Equal(departmentId, project.Department?.Id);
            Assert.Equal(salesStaffId, project.SalesStaff?.Id);
            Assert.Equal(constructionStaffId, project.ConstructionStaff?.Id);
        }

        [Fact]
        public async Task 存在しない工事を更新しようとした場合は404エラーを返す()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var customerId = await CustomerMother.Create(DbConnection, TenantId,
                cancellationToken: cancellationToken);

            var request = new UpdateProjectDto
            {
                ProjectCode = "A100000",
                Name = "テスト工事",
                CustomerId = customerId,
                OrderDate = new DateOnly(2026, 4, 1),
                OrderType = OrderType.PrimeContract,
            };

            // Act
            var response = await HttpClient.PutAsJsonAsync("/api/projects/A999999", request, cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task 使用済みの工事コードに変更しようとした場合は409エラーを返す()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var customerId = await CustomerMother.Create(DbConnection, TenantId,
                cancellationToken: cancellationToken);

            await ProjectMother.Create(DbConnection, TenantId, customerId,
                projectCode: "A100000",
                cancellationToken: cancellationToken);

            await ProjectMother.Create(DbConnection, TenantId, customerId,
                projectCode: "A100001",
                cancellationToken: cancellationToken);

            var request = new UpdateProjectDto
            {
                ProjectCode = "A100001",
                Name = "テスト工事",
                CustomerId = customerId,
                OrderDate = new DateOnly(2026, 4, 1),
                OrderType = OrderType.PrimeContract,
            };

            // Act
            var response = await HttpClient.PutAsJsonAsync("/api/projects/A100000", request, cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
        }

        [Fact]
        public async Task アーカイブ済みの工事コードに変更しようとした場合は409エラーを返す()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var customerId = await CustomerMother.Create(DbConnection, TenantId,
                cancellationToken: cancellationToken);

            await ProjectMother.Create(DbConnection, TenantId, customerId,
                projectCode: "A100000",
                cancellationToken: cancellationToken);

            await ProjectArchiveMother.Create(DbConnection, TenantId, customerId,
                projectCode: "A100001",
                cancellationToken: cancellationToken);

            var request = new UpdateProjectDto
            {
                ProjectCode = "A100001",
                Name = "テスト工事",
                CustomerId = customerId,
                OrderDate = new DateOnly(2026, 4, 1),
                OrderType = OrderType.PrimeContract,
            };

            // Act
            var response = await HttpClient.PutAsJsonAsync("/api/projects/A100000", request, cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
        }

        [Fact]
        public async Task 無効な得意先に変更しようとした場合は422エラーを返す()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var customerId = await CustomerMother.Create(DbConnection, TenantId,
                customerCode: "C0000001",
                cancellationToken: cancellationToken);

            var invalidCustomerId = await CustomerMother.Create(DbConnection, TenantId,
                customerCode: "C0000002",
                status: 2,
                cancellationToken: cancellationToken);

            await ProjectMother.Create(DbConnection, TenantId, customerId,
                projectCode: "A100000",
                cancellationToken: cancellationToken);

            var request = new UpdateProjectDto
            {
                ProjectCode = "A100000",
                Name = "テスト工事",
                CustomerId = invalidCustomerId,
                OrderDate = new DateOnly(2026, 4, 1),
                OrderType = OrderType.PrimeContract,
            };

            // Act
            var response = await HttpClient.PutAsJsonAsync("/api/projects/A100000", request, cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.UnprocessableEntity, response.StatusCode);
        }

        [Fact]
        public async Task 無効な部門に変更しようとした場合は422エラーを返す()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var customerId = await CustomerMother.Create(DbConnection, TenantId,
                cancellationToken: cancellationToken);

            await ProjectMother.Create(DbConnection, TenantId, customerId,
                projectCode: "A100000",
                cancellationToken: cancellationToken);

            var invalidDepartmentId = await DepartmentMother.Create(DbConnection, TenantId,
                status: 2,
                cancellationToken: cancellationToken);

            var request = new UpdateProjectDto
            {
                ProjectCode = "A100000",
                Name = "テスト工事",
                CustomerId = customerId,
                OrderDate = new DateOnly(2026, 4, 1),
                OrderType = OrderType.PrimeContract,
                DepartmentId = invalidDepartmentId,
            };

            // Act
            var response = await HttpClient.PutAsJsonAsync("/api/projects/A100000", request, cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.UnprocessableEntity, response.StatusCode);
        }

        [Fact]
        public async Task 無効な営業担当者に変更しようとした場合は422エラーを返す()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var customerId = await CustomerMother.Create(DbConnection, TenantId,
                cancellationToken: cancellationToken);

            await ProjectMother.Create(DbConnection, TenantId, customerId,
                projectCode: "A100000",
                cancellationToken: cancellationToken);

            await DepartmentMother.Create(DbConnection, TenantId,
                cancellationToken: cancellationToken);

            var invalidSalesStaffId = await EmployeeMother.Create(DbConnection, TenantId,
                status: 2,
                cancellationToken: cancellationToken);

            var request = new UpdateProjectDto
            {
                ProjectCode = "A100000",
                Name = "テスト工事",
                CustomerId = customerId,
                OrderDate = new DateOnly(2026, 4, 1),
                OrderType = OrderType.PrimeContract,
                SalesStaffId = invalidSalesStaffId,
            };

            // Act
            var response = await HttpClient.PutAsJsonAsync("/api/projects/A100000", request, cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.UnprocessableEntity, response.StatusCode);
        }

        [Fact]
        public async Task 無効な工事担当者に変更しようとした場合は422エラーを返す()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var customerId = await CustomerMother.Create(DbConnection, TenantId,
                cancellationToken: cancellationToken);

            await ProjectMother.Create(DbConnection, TenantId, customerId,
                projectCode: "A100000",
                cancellationToken: cancellationToken);

            await DepartmentMother.Create(DbConnection, TenantId,
                cancellationToken: cancellationToken);

            var invalidConstructionStaffId = await EmployeeMother.Create(DbConnection, TenantId,
                employeeCode: "E0000002",
                status: 2,
                cancellationToken: cancellationToken);

            var request = new UpdateProjectDto
            {
                ProjectCode = "A100000",
                Name = "テスト工事",
                CustomerId = customerId,
                OrderDate = new DateOnly(2026, 4, 1),
                OrderType = OrderType.PrimeContract,
                ConstructionStaffId = invalidConstructionStaffId,
            };

            // Act
            var response = await HttpClient.PutAsJsonAsync("/api/projects/A100000", request, cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.UnprocessableEntity, response.StatusCode);
        }

        [Fact]
        public async Task 工事を承認できる()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var customerId = await CustomerMother.Create(DbConnection, TenantId,
                cancellationToken: cancellationToken);

            await ProjectMother.Create(DbConnection, TenantId, customerId,
                projectCode: "A100000",
                cancellationToken: cancellationToken);

            // Act
            var response = await HttpClient.PostAsync(
                "/api/projects/A100000/approve",
                null,
                cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var getResponse = await HttpClient.GetAsync("/api/projects/A100000", cancellationToken);
            var project = await getResponse.Content.ReadFromJsonAsync<ProjectDto>(cancellationToken);
            Assert.NotNull(project);
            Assert.Equal(ProjectStatus.Approved, project.Status);
            Assert.NotNull(project.ApprovedAt);
        }

        [Fact]
        public async Task 存在しない工事を承認しようとした場合は404エラーを返す()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            // Act
            var response = await HttpClient.PostAsync(
                "/api/projects/A999999/approve",
                null,
                cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task 工事の承認を取り消せる()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var customerId = await CustomerMother.Create(DbConnection, TenantId,
                cancellationToken: cancellationToken);

            await ProjectMother.Create(DbConnection, TenantId, customerId,
                projectCode: "A100000",
                status: 2,
                approvedAt: DateTime.UtcNow,
                cancellationToken: cancellationToken);

            // Act
            var response = await HttpClient.PostAsync(
                "/api/projects/A100000/revoke",
                null,
                cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var getResponse = await HttpClient.GetAsync("/api/projects/A100000", cancellationToken);
            var project = await getResponse.Content.ReadFromJsonAsync<ProjectDto>(cancellationToken);
            Assert.NotNull(project);
            Assert.Equal(ProjectStatus.Pending, project.Status);
            Assert.Null(project.ApprovedAt);
        }

        [Fact]
        public async Task 存在しない工事の承認を取り消しようとした場合は404エラーを返す()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            // Act
            var response = await HttpClient.PostAsync(
                "/api/projects/A999999/revoke",
                null,
                cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task 工事を削除できる()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var customerId = await CustomerMother.Create(DbConnection, TenantId,
                cancellationToken: cancellationToken);

            await ProjectMother.Create(DbConnection, TenantId, customerId,
                projectCode: "A100000",
                cancellationToken: cancellationToken);

            // Act
            var response = await HttpClient.DeleteAsync(
                "/api/projects/A100000",
                cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var getResponse = await HttpClient.GetAsync("/api/projects/A100000", cancellationToken);
            Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
        }

        [Fact]
        public async Task 存在しない工事を削除しようとした場合は404エラーを返す()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            // Act
            var response = await HttpClient.DeleteAsync(
                "/api/projects/A999999",
                cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task 工事をアーカイブできる()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var customerId = await CustomerMother.Create(DbConnection, TenantId,
                cancellationToken: cancellationToken);

            await ProjectMother.Create(DbConnection, TenantId, customerId,
                projectCode: "A100000",
                status: 2,
                approvedAt: DateTime.UtcNow,
                cancellationToken: cancellationToken);

            // Act
            var response = await HttpClient.PostAsync(
                "/api/projects/A100000/archive",
                null,
                cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var getResponse = await HttpClient.GetAsync("/api/projects/A100000", cancellationToken);
            Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
        }

        [Fact]
        public async Task 存在しない工事をアーカイブしようとした場合は404エラーを返す()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            // Act
            var response = await HttpClient.PostAsync(
                "/api/projects/A999999/archive",
                null,
                cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task 工事を一括削除できる()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var customerId = await CustomerMother.Create(DbConnection, TenantId,
                cancellationToken: cancellationToken);

            await ProjectMother.Create(DbConnection, TenantId, customerId,
                projectCode: "A100000",
                cancellationToken: cancellationToken);

            await ProjectMother.Create(DbConnection, TenantId, customerId,
                projectCode: "A100001",
                cancellationToken: cancellationToken);

            var request = new BulkDeleteProjectDto { ProjectCodes = ["A100000", "A100001"] };

            // Act
            var response = await HttpClient.PostAsJsonAsync("/api/projects/bulk-delete", request, cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var get1 = await HttpClient.GetAsync("/api/projects/A100000", cancellationToken);
            Assert.Equal(HttpStatusCode.NotFound, get1.StatusCode);

            var get2 = await HttpClient.GetAsync("/api/projects/A100001", cancellationToken);
            Assert.Equal(HttpStatusCode.NotFound, get2.StatusCode);
        }

        [Fact]
        public async Task 存在しない工事コードを含む場合は一括削除できない()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var customerId = await CustomerMother.Create(DbConnection, TenantId,
                cancellationToken: cancellationToken);

            await ProjectMother.Create(DbConnection, TenantId, customerId,
                projectCode: "A100000",
                cancellationToken: cancellationToken);

            var request = new BulkDeleteProjectDto { ProjectCodes = ["A100000", "A999999"] };

            // Act
            var response = await HttpClient.PostAsJsonAsync("/api/projects/bulk-delete", request, cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.UnprocessableEntity, response.StatusCode);
        }

        [Fact]
        public async Task 工事を一括アーカイブできる()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var customerId = await CustomerMother.Create(DbConnection, TenantId,
                cancellationToken: cancellationToken);

            await ProjectMother.Create(DbConnection, TenantId, customerId,
                projectCode: "A100000",
                status: 2,
                approvedAt: DateTime.UtcNow,
                cancellationToken: cancellationToken);

            await ProjectMother.Create(DbConnection, TenantId, customerId,
                projectCode: "A100001",
                status: 2,
                approvedAt: DateTime.UtcNow,
                cancellationToken: cancellationToken);

            var request = new BulkArchiveProjectDto { ProjectCodes = ["A100000", "A100001"] };

            // Act
            var response = await HttpClient.PostAsJsonAsync("/api/projects/bulk-archive", request, cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var get1 = await HttpClient.GetAsync("/api/projects/A100000", cancellationToken);
            Assert.Equal(HttpStatusCode.NotFound, get1.StatusCode);

            var get2 = await HttpClient.GetAsync("/api/projects/A100001", cancellationToken);
            Assert.Equal(HttpStatusCode.NotFound, get2.StatusCode);
        }

        [Fact]
        public async Task 存在しない工事コードを含む場合は一括アーカイブできない()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var customerId = await CustomerMother.Create(DbConnection, TenantId,
                cancellationToken: cancellationToken);

            await ProjectMother.Create(DbConnection, TenantId, customerId,
                projectCode: "A100000",
                status: 2,
                approvedAt: DateTime.UtcNow,
                cancellationToken: cancellationToken);

            var request = new BulkArchiveProjectDto { ProjectCodes = ["A100000", "A999999"] };

            // Act
            var response = await HttpClient.PostAsJsonAsync("/api/projects/bulk-archive", request, cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.UnprocessableEntity, response.StatusCode);
        }

        [Fact]
        public async Task 使用可能な工事コードの場合は成功を返す()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var request = new CheckProjectCodeDto { ProjectCode = "A100000" };

            // Act
            var response = await HttpClient.PostAsJsonAsync("/api/projects/check-code", request, cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task 使用中の工事コードの場合は409エラーを返す()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var customerId = await CustomerMother.Create(DbConnection, TenantId,
                cancellationToken: cancellationToken);

            await ProjectMother.Create(DbConnection, TenantId, customerId,
                projectCode: "A100000",
                cancellationToken: cancellationToken);

            var request = new CheckProjectCodeDto { ProjectCode = "A100000" };

            // Act
            var response = await HttpClient.PostAsJsonAsync("/api/projects/check-code", request, cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
        }

        [Fact]
        public async Task アーカイブ済みの工事コードの場合は409エラーを返す()
        {
            // Arrange
            var cancellationToken = TestContext.Current.CancellationToken;

            await TenantMother.Create(DbConnection, TenantId, cancellationToken: cancellationToken);

            var customerId = await CustomerMother.Create(DbConnection, TenantId,
                cancellationToken: cancellationToken);

            await ProjectArchiveMother.Create(DbConnection, TenantId, customerId,
                projectCode: "A100000",
                cancellationToken: cancellationToken);

            var request = new CheckProjectCodeDto { ProjectCode = "A100000" };

            // Act
            var response = await HttpClient.PostAsJsonAsync("/api/projects/check-code", request, cancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
        }
    }
}
