CREATE PROCEDURE [dbo].[Department_ReadMany]
    @TenantId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON

    SELECT
        [Id],
        [TenantId],
        [DepartmentCode],
        [Name],
        [Status]
    FROM
        [dbo].[Department]
    WHERE
        [TenantId] = @TenantId
        AND [Status] = 1
    ORDER BY
        [DepartmentCode]
END