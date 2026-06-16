CREATE PROCEDURE [dbo].[Project_ArchiveManyByProjectCodes]
    @TenantId UNIQUEIDENTIFIER,
    @ProjectCodes [dbo].[ProjectCodeArray] READONLY
AS
BEGIN
    SET NOCOUNT ON

    BEGIN TRY
        BEGIN TRANSACTION

        INSERT INTO [dbo].[ProjectArchive]
        (
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
            [ArchivedAt]
        )
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
            [ApprovedAt],
            [CreatedAt],
            [UpdatedAt],
            SYSUTCDATETIME()
        FROM
            [dbo].[Project]
        WHERE
            [TenantId] = @TenantId
            AND [ProjectCode] IN (SELECT [ProjectCode] FROM @ProjectCodes)

        DELETE FROM
            [dbo].[Project]
        WHERE
            [TenantId] = @TenantId
            AND [ProjectCode] IN (SELECT [ProjectCode] FROM @ProjectCodes)

        COMMIT TRANSACTION

    END TRY
    BEGIN CATCH

        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION

        THROW

    END CATCH
END