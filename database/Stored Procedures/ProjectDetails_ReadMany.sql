CREATE PROCEDURE [dbo].[ProjectDetails_ReadMany]
    @TenantId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON

    SELECT
        P.[Id],
        P.[TenantId],
        P.[ProjectCode],
        P.[Name],
        P.[CustomerId],
        C.[CustomerCode],
        C.[Name] AS [CustomerName],
        P.[CustomerContactPerson],
        P.[OrderDate],
        P.[OrderType],
        P.[EstimateMainNumber],
        P.[EstimateBranchNumber],
        P.[DepartmentId],
        D.[DepartmentCode],
        D.[Name] AS [DepartmentName],
        P.[SalesStaffId],
        S.[EmployeeCode] AS [SalesStaffCode],
        S.[Name] AS [SalesStaffName],
        P.[ConstructionStaffId],
        CS.[EmployeeCode] AS [ConstructionStaffCode],
        CS.[Name] AS [ConstructionStaffName],
        P.[Status],
        P.[ApprovedAt]
    FROM
        [dbo].[Project] P
    INNER JOIN
        [dbo].[Customer] C ON C.[Id] = P.[CustomerId]
    LEFT OUTER JOIN
        [dbo].[Department] D ON D.[Id] = P.[DepartmentId]
    LEFT OUTER JOIN
        [dbo].[Employee] S ON S.[Id] = P.[SalesStaffId]
    LEFT OUTER JOIN
        [dbo].[Employee] CS ON CS.[Id] = P.[ConstructionStaffId]
    WHERE
        P.[TenantId] = @TenantId
    ORDER BY
        P.[ProjectCode]
END