CREATE PROCEDURE [dbo].[Employee_ReadMany]
    @TenantId UNIQUEIDENTIFIER
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
        AND [Status] = 1
    ORDER BY
        [EmployeeCode]
END