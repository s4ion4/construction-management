namespace ConstructionManagement.Api.Controllers.Departments.Dtos
{
    public sealed class DepartmentDto
    {
        public required Guid Id { get; init; }
        public required string DepartmentCode { get; init; }
        public required string Name { get; init; }
    }
}
