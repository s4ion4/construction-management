using CSharpFunctionalExtensions;

namespace ConstructionManagement.Api.Domain.Customers
{
    public class Customer : Entity<Guid>
    {
        public Guid TenantId { get; }
        public CustomerCode CustomerCode { get; }
        public string Name { get; }
        public CustomerStatus Status { get; }

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