CREATE PROCEDURE [dbo].[ProjectArchive_ReadByProjectCode]
    @TenantId UNIQUEIDENTIFIER,
    @ProjectCode NVARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON

    SELECT
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
        [ArchivedAt]
    FROM
        [dbo].[ProjectArchive]
    WHERE
        [TenantId] = @TenantId
        AND [ProjectCode] = @ProjectCode
END