using CSharpFunctionalExtensions;

namespace ConstructionManagement.Api.Domain.Projects
{
    public class ProjectArchive : Entity<Guid>
    {
        public Guid TenantId { get; }
        public ProjectCode ProjectCode { get; }
        public string Name { get; }
        public Guid CustomerId { get; }
        public string? CustomerContactPerson { get; }
        public OrderDate OrderDate { get; }
        public OrderType OrderType { get; }
        public EstimateNumber? EstimateNumber { get; }
        public Guid? DepartmentId { get; }
        public Guid? SalesStaffId { get; }
        public Guid? ConstructionStaffId { get; }
        public DateTime ArchivedAt { get; }

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
                archivedAt);
    }
}