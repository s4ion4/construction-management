using ConstructionManagement.Domain.Departments;
using ConstructionManagement.Domain.Employees;

namespace ConstructionManagement.UnitTests.Employees
{
    public class EmployeeTests
    {
        [Theory]
        [InlineData("")]
        [InlineData("   ")]
        public void 社員名が空のとき社員を作成できない(string name)
        {
            Assert.Throws<ArgumentException>(() =>
                Employee.Create(
                    id: Guid.NewGuid(),
                    tenantId: Guid.NewGuid(),
                    employeeCode: EmployeeCode.Create("E001").Value,
                    name: name,
                    departmentCode: DepartmentCode.Create("D001").Value,
                    status: EmployeeStatus.Active));
        }

        [Fact]
        public void 社員名の前後の空白は除去される()
        {
            var employee = Employee.Create(
                id: Guid.NewGuid(),
                tenantId: Guid.NewGuid(),
                employeeCode: EmployeeCode.Create("E001").Value,
                name: "  テスト社員  ",
                departmentCode: DepartmentCode.Create("D001").Value,
                status: EmployeeStatus.Active);

            Assert.Equal("テスト社員", employee.Name);
        }
    }
}
