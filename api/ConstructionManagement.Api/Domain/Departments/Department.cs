using CSharpFunctionalExtensions;

namespace ConstructionManagement.Api.Domain.Departments
{
    public class Department : Entity<Guid>
    {
        public Guid TenantId { get; private set; }
        public DepartmentCode DepartmentCode { get; private set; } = default!;
        public string Name { get; private set; } = string.Empty;
        public DepartmentStatus Status { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime UpdatedAt { get; private set; }

        private Department() { }

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