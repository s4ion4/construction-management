CREATE PROCEDURE [dbo].[Project_ReadManyByProjectCodes]
    @TenantId UNIQUEIDENTIFIER,
    @ProjectCodes [dbo].[ProjectCodeArray] READONLY
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
        [Status],
        [ApprovedAt]
    FROM
        [dbo].[Project]
    WHERE
        [TenantId] = @TenantId
        AND [ProjectCode] IN (SELECT [ProjectCode] FROM @ProjectCodes)
END