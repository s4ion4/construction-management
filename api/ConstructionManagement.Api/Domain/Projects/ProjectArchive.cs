using CSharpFunctionalExtensions;

namespace ConstructionManagement.Api.Domain.Projects
{
    public class ProjectArchive : Entity<Guid>
    {
        public Guid TenantId { get; private set; }
        public ProjectCode ProjectCode { get; private set; } = default!;
        public string Name { get; private set; } = string.Empty;
        public Guid CustomerId { get; private set; }
        public string? CustomerContactPerson { get; private set; }
        public OrderDate OrderDate { get; private set; } = default!;
        public OrderType OrderType { get; private set; }
        public EstimateNumber? EstimateNumber { get; private set; }
        public Guid? DepartmentId { get; private set; }
        public Guid? SalesStaffId { get; private set; }
        public Guid? ConstructionStaffId { get; private set; }
        public ProjectStatus Status { get; private set; }
        public DateTime? ApprovedAt { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime UpdatedAt { get; private set; }
        public DateTime ArchivedAt { get; private set; }

        private ProjectArchive() { }

        private ProjectArchive(
            Guid id,
            Guid tenantId,
            ProjectCode projectCode,
            string name,
            Guid customerId,
            string? customerContactPerson,
            OrderDate orderDate,
            OrderType orderType,
            EstimateNumber? estimateNumber,
            Guid? departmentId,
            Guid? salesStaffId,
            Guid? constructionStaffId,
            ProjectStatus status,
            DateTime? approvedAt,
            DateTime createdAt,
            DateTime updatedAt,
            DateTime archivedAt)
            : base(id)
        {
            TenantId = tenantId;
            ProjectCode = projectCode;
            Name = name;
            CustomerId = customerId;
            CustomerContactPerson = customerContactPerson;
            OrderDate = orderDate;
            OrderType = orderType;
            EstimateNumber = estimateNumber;
            DepartmentId = departmentId;
            SalesStaffId = salesStaffId;
            ConstructionStaffId = constructionStaffId;
            Status = status;
            ApprovedAt = approvedAt;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
            ArchivedAt = archivedAt;
        }

        public static ProjectArchive Create(
            Guid id,
            Guid tenantId,
            ProjectCode projectCode,
            string name,
            Guid customerId,
            string? customerContactPerson,
            OrderDate orderDate,
            OrderType orderType,
            EstimateNumber? estimateNumber,
            Guid? departmentId,
            Guid? salesStaffId,
            Guid? constructionStaffId,
            ProjectStatus status,
            DateTime? approvedAt,
            DateTime createdAt,
            DateTime updatedAt,
            DateTime archivedAt)
            => new(
                id,
                tenantId,
                projectCode,
                name,
                customerId,
                customerContactPerson,
                orderDate,
                orderType,
                estimateNumber,
                departmentId,
                salesStaffId,
                constructionStaffId,
                status,
                approvedAt,
                createdAt,
                updatedAt,
                archivedAt);
    }
}