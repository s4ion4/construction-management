using CSharpFunctionalExtensions;

namespace ConstructionManagement.Api.Domain.Departments
{
    public class Department : Entity<Guid>
    {
        public Guid TenantId { get; }
        public DepartmentCode DepartmentCode { get; }
        public string Name { get; }
        public DepartmentStatus Status { get; }

        private Department(
            Guid id,
            Guid tenantId,
            DepartmentCode departmentCode,
            string name,
            DepartmentStatus status)
            : base(id)
        {
            TenantId = tenantId;
            DepartmentCode = departmentCode;
            Name = name;
            Status = status;
        }

        public static Department Create(
            Guid id,
            Guid tenantId,
            DepartmentCode departmentCode,
            string name,
            DepartmentStatus status)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("部門名は必須です。");

            name = name.Trim();

            return new Department(
                id,
                tenantId,
                departmentCode,
                name,
                status);
        }
    }
}