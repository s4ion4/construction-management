using ConstructionManagement.Api.Domain.Departments;

namespace ConstructionManagement.Api.UnitTests.Departments
{
    public class DepartmentTests
    {
        [Theory]
        [InlineData("")]
        [InlineData("   ")]
        public void 部門名が空のとき部門を作成できない(string name)
        {
            Assert.Throws<ArgumentException>(() =>
                Department.Create(
                    id: Guid.NewGuid(),
                    tenantId: Guid.NewGuid(),
                    departmentCode: DepartmentCode.Create("D001").Value,
                    name: name,
                    status: DepartmentStatus.Active));
        }

        [Fact]
        public void 部門名の前後の空白は除去される()
        {
            var department = Department.Create(
                id: Guid.NewGuid(),
                tenantId: Guid.NewGuid(),
                departmentCode: DepartmentCode.Create("D001").Value,
                name: "  テスト部門  ",
                status: DepartmentStatus.Active);

            Assert.Equal("テスト部門", department.Name);
        }
    }
}
