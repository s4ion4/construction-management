using CSharpFunctionalExtensions;

namespace ConstructionManagement.Api.Domain.Customers
{
    public class Customer : Entity<Guid>
    {
        public Guid TenantId { get; private set; }
        public CustomerCode CustomerCode { get; private set; } = default!;
        public string Name { get; private set; } = string.Empty;
        public CustomerStatus Status { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime UpdatedAt { get; private set; }

        private Customer() { }

        private Customer(
            Guid id,
            Guid tenantId,
            CustomerCode customerCode,
            string name,
            CustomerStatus status)
            : base(id)
        {
            TenantId = tenantId;
            CustomerCode = customerCode;
            Name = name;
            Status = status;
        }

        public static Customer Create(
            Guid id,
            Guid tenantId,
            CustomerCode customerCode,
            string name,
            CustomerStatus status)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("得意先名は必須です。");

            name = name.Trim();

            return new Customer(
                id,
                tenantId,
                customerCode,
                name,
                status);
        }
    }
}