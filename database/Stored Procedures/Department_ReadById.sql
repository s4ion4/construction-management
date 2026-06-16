CREATE PROCEDURE [dbo].[Department_ReadById]
    @TenantId UNIQUEIDENTIFIER,
    @Id UNIQUEIDENTIFIER
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
        AND [Id] = @Id
END
