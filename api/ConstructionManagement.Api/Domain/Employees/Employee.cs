using ConstructionManagement.Api.Domain.Departments;
using CSharpFunctionalExtensions;

namespace ConstructionManagement.Api.Domain.Employees
{
    public class Employee : Entity<Guid>
    {
        public Guid TenantId { get; }
        public EmployeeCode EmployeeCode { get; }
        public string Name { get; }
        public DepartmentCode DepartmentCode { get; }
        public EmployeeStatus Status { get; }

        private Employee(
            Guid id,
            Guid tenantId,
            EmployeeCode employeeCode,
            string name,
            DepartmentCode departmentCode,
            EmployeeStatus status)
            : base(id)
        {
            TenantId = tenantId;
            EmployeeCode = employeeCode;
            Name = name;
            DepartmentCode = departmentCode;
            Status = status;
        }

        public static Employee Create(
            Guid id,
            Guid tenantId,
            EmployeeCode employeeCode,
            string name,
            DepartmentCode departmentCode,
            EmployeeStatus status)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("社員名は必須です。");

            name = name.Trim();

            return new Employee(
                id,
                tenantId,
                employeeCode,
                name,
                departmentCode,
                status);
        }
    }
}