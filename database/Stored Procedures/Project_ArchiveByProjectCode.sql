CREATE PROCEDURE [dbo].[Project_ArchiveByProjectCode]
    @TenantId UNIQUEIDENTIFIER,
    @ProjectCode NVARCHAR(10)
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
            AND [ProjectCode] = @ProjectCode

        DELETE FROM
            [dbo].[Project]
        WHERE
            [TenantId] = @TenantId
            AND [ProjectCode] = @ProjectCode

        COMMIT TRANSACTION

    END TRY
    BEGIN CATCH

        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION

        THROW

    END CATCH
END