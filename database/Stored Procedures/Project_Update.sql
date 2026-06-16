CREATE PROCEDURE [dbo].[Project_Update]
    @Id UNIQUEIDENTIFIER,
    @TenantId UNIQUEIDENTIFIER,
    @ProjectCode NVARCHAR(10),
    @Name NVARCHAR(50),
    @CustomerId UNIQUEIDENTIFIER,
    @CustomerContactPerson NVARCHAR(20) = NULL,
    @OrderDate DATE,
    @OrderType TINYINT,
    @EstimateMainNumber NVARCHAR(6) = NULL,
    @EstimateBranchNumber NVARCHAR(2) = NULL,
    @DepartmentId UNIQUEIDENTIFIER = NULL,
    @SalesStaffId UNIQUEIDENTIFIER = NULL,
    @ConstructionStaffId UNIQUEIDENTIFIER = NULL,
    @Status TINYINT,
    @ApprovedAt DATETIME2(7) = NULL
AS
BEGIN
    SET NOCOUNT ON

    UPDATE
        [dbo].[Project]
    SET
        [ProjectCode] = @ProjectCode,
        [Name] = @Name,
        [CustomerId] = @CustomerId,
        [CustomerContactPerson] = @CustomerContactPerson,
        [OrderDate] = @OrderDate,
        [OrderType] = @OrderType,
        [EstimateMainNumber] = @EstimateMainNumber,
        [EstimateBranchNumber] = @EstimateBranchNumber,
        [DepartmentId] = @DepartmentId,
        [SalesStaffId] = @SalesStaffId,
        [ConstructionStaffId] = @ConstructionStaffId,
        [Status] = @Status,
        [ApprovedAt] = @ApprovedAt,
        [UpdatedAt] = SYSUTCDATETIME()
    WHERE
        [Id] = @Id
        AND [TenantId] = @TenantId
END