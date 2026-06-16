CREATE PROCEDURE [dbo].[Project_DeleteManyByProjectCodes]
    @TenantId UNIQUEIDENTIFIER,
    @ProjectCodes [dbo].[ProjectCodeArray] READONLY
AS
BEGIN
    SET NOCOUNT ON

    DELETE FROM
        [dbo].[Project]
    WHERE
        [TenantId] = @TenantId
        AND [ProjectCode] IN (SELECT [ProjectCode] FROM @ProjectCodes)
END