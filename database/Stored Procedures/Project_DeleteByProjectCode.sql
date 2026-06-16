CREATE PROCEDURE [dbo].[Project_DeleteByProjectCode]
    @TenantId UNIQUEIDENTIFIER,
    @ProjectCode NVARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON

    DELETE FROM
        [dbo].[Project]
    WHERE
        [TenantId] = @TenantId
        AND [ProjectCode] = @ProjectCode
END