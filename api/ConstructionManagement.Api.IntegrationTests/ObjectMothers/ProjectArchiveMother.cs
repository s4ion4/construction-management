using Dapper;
using Microsoft.Data.SqlClient;

namespace ConstructionManagement.Api.IntegrationTests.ObjectMothers
{
    public static class ProjectArchiveMother
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
            int status = 2,
            DateTime? approvedAt = null,
            DateTime? archivedAt = null,
            CancellationToken cancellationToken = default)
        {
            var id = Guid.NewGuid();

            await connection.ExecuteAsync(new CommandDefinition("""
                INSERT INTO [dbo].[ProjectArchive] (
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
                    [UpdatedAt],
                    [ArchivedAt])
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
                    SYSDATETIME(),
                    @ArchivedAt)
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
                    ApprovedAt = approvedAt ?? DateTime.UtcNow,
                    ArchivedAt = archivedAt ?? DateTime.UtcNow,
                },
                cancellationToken: cancellationToken));

            return id;
        }
    }
}
