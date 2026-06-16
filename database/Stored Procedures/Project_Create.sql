CREATE PROCEDURE [dbo].[Project_Create]
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

    INSERT INTO [dbo].[Project]
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
        [UpdatedAt]
    )
    VALUES
    (
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
        SYSUTCDATETIME(),
        SYSUTCDATETIME()
    )
END