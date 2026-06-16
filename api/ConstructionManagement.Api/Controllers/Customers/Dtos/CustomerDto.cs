namespace ConstructionManagement.Api.Controllers.Customers.Dtos
{
    public sealed class CustomerDto
    {
        public required Guid Id { get; init; }
        public required string CustomerCode { get; init; }
        public required string Name { get; init; }
    }
}
