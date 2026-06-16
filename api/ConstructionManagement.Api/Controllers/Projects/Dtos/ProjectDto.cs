using ConstructionManagement.Api.Domain.Projects;

namespace ConstructionManagement.Api.Controllers.Projects.Dtos
{
    public sealed class ProjectDto
    {
        public required string ProjectCode { get; init; }
        public required string Name { get; init; }
        public required ProjectCustomerDto Customer { get; init; }
        public string? CustomerContactPerson { get; init; }
        public DateOnly OrderDate { get; init; }
        public OrderType OrderType { get; init; }
        public ProjectEstimateNumberDto? EstimateNumber { get; init; }
        public ProjectDepartmentDto? Department { get; init; }
        public ProjectStaffDto? SalesStaff { get; init; }
        public ProjectStaffDto? ConstructionStaff { get; init; }
        public ProjectStatus Status { get; init; }
        public DateTime? ApprovedAt { get; init; }
    }

    public sealed class ProjectEstimateNumberDto
    {
        public required string MainNumber { get; init; }
        public required string BranchNumber { get; init; }
    }

    public sealed class ProjectCustomerDto
    {
        public required Guid Id { get; init; }
        public required string Code { get; init; }
        public required string Name { get; init; }
    }

    public sealed class ProjectDepartmentDto
    {
        public required Guid Id { get; init; }
        public required string Code { get; init; }
        public required string Name { get; init; }
    }

    public sealed class ProjectStaffDto
    {
        public required Guid Id { get; init; }
        public required string Code { get; init; }
        public required string Name { get; init; }
    }
}