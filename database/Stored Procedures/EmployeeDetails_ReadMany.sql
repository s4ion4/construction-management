CREATE PROCEDURE [dbo].[EmployeeDetails_ReadMany]
    @TenantId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON

    SELECT
        E.[Id],
        E.[TenantId],
        E.[EmployeeCode],
        E.[Name],
        E.[DepartmentCode],
        D.[Name] AS [DepartmentName],
        E.[Status]
    FROM
        [dbo].[Employee] E
    INNER JOIN
        [dbo].[Department] D ON D.[TenantId] = E.[TenantId]
            AND D.[DepartmentCode] = E.[DepartmentCode]
    WHERE
        E.[TenantId] = @TenantId
        AND E.[Status] = 1
    ORDER BY
        E.[EmployeeCode]
END
