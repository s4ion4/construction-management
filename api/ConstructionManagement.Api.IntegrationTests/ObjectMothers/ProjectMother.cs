using Dapper;
using Microsoft.Data.SqlClient;

namespace ConstructionManagement.Api.IntegrationTests.ObjectMothers
{
    public static class ProjectMother
    {
        public static async Task<Guid> Create(
            SqlConnection connection,
            Guid tenantId,
            Guid customerId,
            string projectCode = "A100000",
            string name = "テスト工事",
            string? customerContactPerson = null,
            DateOnly? orderDate = null,
            int orderType = 1,
            string? estimateMainNumber = null,
            string? estimateBranchNumber = null,
            Guid? departmentId = null,
            Guid? salesStaffId = null,
            Guid? constructionStaffId = null,
            int status = 1,
            DateTime? approvedAt = null,
            CancellationToken cancellationToken = default)
        {
            var id = Guid.NewGuid();

            await connection.ExecuteAsync(new CommandDefinition("""
                INSERT INTO [dbo].[Project] (
                    [Id],
                    [TenantId],
                    [ProjectCode],
                    [Name],
                    [CustomerId],
                    [CustomerContactPerson],
                    [OrderDate],
                    [OrderType],
                    [EstimateMainNumber],
                    [EstimateBranchNumber],
                    [DepartmentId],
                    [SalesStaffId],
                    [ConstructionStaffId],
                    [Status],
                    [ApprovedAt],
                    [CreatedAt],
                    [UpdatedAt])
                VALUES (
                    @Id,
                    @TenantId,
                    @ProjectCode,
                    @Name,
                    @CustomerId,
                    @CustomerContactPerson,
                    @OrderDate,
                    @OrderType,
                    @EstimateMainNumber,
                    @EstimateBranchNumber,
                    @DepartmentId,
                    @SalesStaffId,
                    @ConstructionStaffId,
                    @Status,
                    @ApprovedAt,
                    SYSDATETIME(),
                    SYSDATETIME())
                """,
                new
                {
                    Id = id,
                    TenantId = tenantId,
                    ProjectCode = projectCode,
                    Name = name,
                    CustomerId = customerId,
                    CustomerContactPerson = customerContactPerson,
                    OrderDate = orderDate ?? new DateOnly(2026, 4, 1),
                    OrderType = orderType,
                    EstimateMainNumber = estimateMainNumber,
                    EstimateBranchNumber = estimateBranchNumber,
                    DepartmentId = departmentId,
                    SalesStaffId = salesStaffId,
                    ConstructionStaffId = constructionStaffId,
                    Status = status,
                    ApprovedAt = approvedAt,
                },
                cancellationToken: cancellationToken));

            return id;
        }
    }
}
