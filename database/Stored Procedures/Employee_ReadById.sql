CREATE PROCEDURE [dbo].[Employee_ReadById]
    @TenantId UNIQUEIDENTIFIER,
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON

    SELECT
        [Id],
        [TenantId],
        [EmployeeCode],
        [Name],
        [DepartmentCode],
        [Status]
    FROM
        [dbo].[Employee]
    WHERE
        [TenantId] = @TenantId
        AND [Id] = @Id
END