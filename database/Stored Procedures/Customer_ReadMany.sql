CREATE PROCEDURE [dbo].[Customer_ReadMany]
    @TenantId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON

    SELECT
        [Id],
        [TenantId],
        [CustomerCode],
        [Name],
        [Status]
    FROM
        [dbo].[Customer]
    WHERE
        [TenantId] = @TenantId
        AND [Status] = 1
    ORDER BY
        [CustomerCode]
END