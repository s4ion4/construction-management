using ConstructionManagement.Api.Domain.Projects;

namespace ConstructionManagement.Api.UnitTests.Projects
{
    public class ProjectTests
    {
        [Fact]
        public void 未承認の工事を承認できる()
        {
            var project = CreatePendingProject();

            var result = project.Approve();

            Assert.True(result.IsSuccess);
            Assert.Equal(ProjectStatus.Approved, project.Status);
            Assert.NotNull(project.ApprovedAt);
        }

        [Fact]
        public void 承認済みの工事を再承認するとエラーになる()
        {
            var project = CreateApprovedProject();

            var result = project.Approve();

            Assert.True(result.IsFailure);
            Assert.Equal("この工事は既に承認済みです。", result.Error);
        }

        [Fact]
        public void 承認済みの工事を未承認に戻せる()
        {
            var project = CreateApprovedProject();

            var result = project.Revoke();

            Assert.True(result.IsSuccess);
            Assert.Equal(ProjectStatus.Pending, project.Status);
            Assert.Null(project.ApprovedAt);
        }

        [Fact]
        public void 未承認の工事を承認取消するとエラーになる()
        {
            var project = CreatePendingProject();

            var result = project.Revoke();

            Assert.True(result.IsFailure);
            Assert.Equal("この工事は承認されていません。", result.Error);
        }

        [Fact]
        public void 未承認の工事は編集できる()
        {
            var project = CreatePendingProject();

            Assert.True(project.CanEdit());
        }

        [Fact]
        public void 承認済みの工事は編集できない()
        {
            var project = CreateApprovedProject();

            Assert.False(project.CanEdit());
        }

        [Fact]
        public void 未承認の工事は削除できる()
        {
            var project = CreatePendingProject();

            Assert.True(project.CanDelete());
        }

        [Fact]
        public void 承認済みの工事は削除できない()
        {
            var project = CreateApprovedProject();

            Assert.False(project.CanDelete());
        }

        [Fact]
        public void 承認済みの工事はアーカイブできる()
        {
            var project = CreateApprovedProject();

            Assert.True(project.CanArchive());
        }

        [Fact]
        public void 未承認の工事はアーカイブできない()
        {
            var project = CreatePendingProject();

            Assert.False(project.CanArchive());
        }

        [Fact]
        public void 承認済みの工事は更新できない()
        {
            var project = CreateApprovedProject();

            Assert.Throws<InvalidOperationException>(() =>
                project.Update(
                    projectCode: ProjectCode.Create("P002").Value,
                    name: "更新後工事",
                    customerId: Guid.NewGuid(),
                    customerContactPerson: null,
                    orderDate: OrderDate.Create(new DateOnly(2026, 4, 1)).Value,
                    orderType: OrderType.PrimeContract,
                    estimateNumber: null,
                    departmentId: null,
                    salesStaffId: null,
                    constructionStaffId: null));
        }

        [Fact]
        public void 工事名が空のとき工事を作成できない()
        {
            Assert.Throws<ArgumentException>(() =>
                Project.Create(
                    id: Guid.NewGuid(),
                    tenantId: Guid.NewGuid(),
                    projectCode: ProjectCode.Create("P001").Value,
                    name: "",
                    customerId: Guid.NewGuid(),
                    customerContactPerson: null,
                    orderDate: OrderDate.Create(new DateOnly(2026, 4, 1)).Value,
                    orderType: OrderType.PrimeContract,
                    estimateNumber: null,
                    departmentId: null,
                    salesStaffId: null,
                    constructionStaffId: null,
                    status: ProjectStatus.Pending,
                    approvedAt: null));
        }

        private Project CreatePendingProject()
        {
            return Project.Create(
                id: Guid.NewGuid(),
                tenantId: Guid.NewGuid(),
                projectCode: ProjectCode.Create("P001").Value,
                name: "テスト工事",
                customerId: Guid.NewGuid(),
                customerContactPerson: null,
                orderDate: OrderDate.Create(new DateOnly(2026, 4, 1)).Value,
                orderType: OrderType.PrimeContract,
                estimateNumber: null,
                departmentId: null,
                salesStaffId: null,
                constructionStaffId: null,
                status: ProjectStatus.Pending,
                approvedAt: null);
        }

        private Project CreateApprovedProject()
        {
            return Project.Create(
                id: Guid.NewGuid(),
                tenantId: Guid.NewGuid(),
                projectCode: ProjectCode.Create("P001").Value,
                name: "テスト工事",
                customerId: Guid.NewGuid(),
                customerContactPerson: null,
                orderDate: OrderDate.Create(new DateOnly(2026, 4, 1)).Value,
                orderType: OrderType.PrimeContract,
                estimateNumber: null,
                departmentId: null,
                salesStaffId: null,
                constructionStaffId: null,
                status: ProjectStatus.Approved,
                approvedAt: new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc));
        }
    }
}
