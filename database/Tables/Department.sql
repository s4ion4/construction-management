CREATE TABLE [dbo].[Department]
(
    [Id] UNIQUEIDENTIFIER NOT NULL,
    [TenantId] UNIQUEIDENTIFIER NOT NULL,
    [DepartmentCode] NVARCHAR(8) NOT NULL,
    [Name] NVARCHAR(10) NOT NULL,
    [Status] TINYINT NOT NULL, -- 1 = 有効, 2 = 廃止
    [CreatedAt] DATETIME2(7) NOT NULL,
    [UpdatedAt] DATETIME2(7) NOT NULL,
    CONSTRAINT [PK_Department] PRIMARY KEY ([Id]),
    CONSTRAINT [AK_Department_TenantId_DepartmentCode] UNIQUE ([TenantId], [DepartmentCode]),
    CONSTRAINT [FK_Department_Tenant] FOREIGN KEY ([TenantId]) REFERENCES [dbo].[Tenant] ([Id]),
)