using ConstructionManagement.Api.Domain.Departments;
using CSharpFunctionalExtensions;

namespace ConstructionManagement.Api.Domain.Employees
{
    public class Employee : Entity<Guid>
    {
        public Guid TenantId { get; private set; }
        public EmployeeCode EmployeeCode { get; private set; } = default!;
        public string Name { get; private set; } = string.Empty;
        public DepartmentCode DepartmentCode { get; private set; } = default!;
        public EmployeeStatus Status { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime UpdatedAt { get; private set; }

        private Employee() { }

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