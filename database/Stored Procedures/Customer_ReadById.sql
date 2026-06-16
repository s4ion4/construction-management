CREATE PROCEDURE [dbo].[Customer_ReadById]
    @TenantId UNIQUEIDENTIFIER,
    @Id UNIQUEIDENTIFIER
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
        AND [Id] = @Id
END
