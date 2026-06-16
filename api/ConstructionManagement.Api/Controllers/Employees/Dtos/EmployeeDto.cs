namespace ConstructionManagement.Api.Controllers.Employees.Dtos
{
    public sealed class EmployeeDto
    {
        public required Guid Id { get; init; }
        public required string EmployeeCode { get; init; }
        public required string Name { get; init; }
        public required string DepartmentCode { get; init; }
        public required string DepartmentName { get; init; }
    }
}
