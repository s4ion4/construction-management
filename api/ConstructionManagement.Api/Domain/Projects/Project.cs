using CSharpFunctionalExtensions;

namespace ConstructionManagement.Api.Domain.Projects
{
    public class Project : Entity<Guid>
    {
        public Guid TenantId { get; }
        public ProjectCode ProjectCode { get; private set; }
        public string Name { get; private set; }
        public Guid CustomerId { get; private set; }
        public string? CustomerContactPerson { get; private set; }
        public OrderDate OrderDate { get; private set; }
        public OrderType OrderType { get; private set; }
        public EstimateNumber? EstimateNumber { get; private set; }
        public Guid? DepartmentId { get; private set; }
        public Guid? SalesStaffId { get; private set; }
        public Guid? ConstructionStaffId { get; private set; }
        public ProjectStatus Status { get; private set; }
        public DateTime? ApprovedAt { get; private set; }

        private Project(
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
            DateTime? approvedAt)
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
        }

        public static Project Create(
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
            DateTime? approvedAt)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("工事名は必須です。");

            name = name.Trim();
            customerContactPerson = string.IsNullOrWhiteSpace(customerContactPerson)
                ? null
                : customerContactPerson.Trim();

            return new Project(
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
                approvedAt);
        }

        public void Update(
            ProjectCode projectCode,
            string name,
            Guid customerId,
            string? customerContactPerson,
            OrderDate orderDate,
            OrderType orderType,
            EstimateNumber? estimateNumber,
            Guid? departmentId,
            Guid? salesStaffId,
            Guid? constructionStaffId)
        {
            if (!CanEdit())
                throw new InvalidOperationException("承認済みの工事は編集できません。");

            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("工事名は必須です。");

            name = name.Trim();
            customerContactPerson = string.IsNullOrWhiteSpace(customerContactPerson)
                ? null
                : customerContactPerson.Trim();

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
        }

        public Result Approve()
        {
            if (Status == ProjectStatus.Approved)
                return Result.Failure("この工事は既に承認済みです。");

            Status = ProjectStatus.Approved;
            ApprovedAt = DateTime.UtcNow;
            return Result.Success();
        }

        public Result Revoke()
        {
            if (Status != ProjectStatus.Approved)
                return Result.Failure("この工事は承認されていません。");

            Status = ProjectStatus.Pending;
            ApprovedAt = null;
            return Result.Success();
        }

        public bool CanEdit() => Status == ProjectStatus.Pending;
        public bool CanDelete() => Status == ProjectStatus.Pending;
        public bool CanArchive() => Status == ProjectStatus.Approved;
    }
}