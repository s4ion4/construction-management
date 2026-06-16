MERGE INTO [dbo].[Tenant] AS target
USING (VALUES
    ('00000000-0000-0000-0000-000000000001', N'テスト企業A', '2026-01-01 09:00:00.0000000', '2026-01-01 09:00:00.0000000'),
    ('00000000-0000-0000-0000-000000000002', N'テスト企業B', '2026-01-01 09:00:00.0000000', '2026-01-01 09:00:00.0000000'),
    ('00000000-0000-0000-0000-000000000003', N'テスト企業C', '2026-01-01 09:00:00.0000000', '2026-01-01 09:00:00.0000000')
) AS source ([Id], [Name], [CreatedAt], [UpdatedAt])
ON target.[Id] = source.[Id]
WHEN NOT MATCHED THEN
    INSERT ([Id], [Name], [CreatedAt], [UpdatedAt])
    VALUES (source.[Id], source.[Name], source.[CreatedAt], source.[UpdatedAt]);