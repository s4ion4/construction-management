CREATE TABLE [dbo].[Customer]
(
    [Id] UNIQUEIDENTIFIER NOT NULL,
    [TenantId] UNIQUEIDENTIFIER NOT NULL,
    [CustomerCode] NVARCHAR(8) NOT NULL,
    [Name] NVARCHAR(30) NOT NULL,
    [Status] TINYINT NOT NULL, -- 1 = 有効, 2 = 無効
    [CreatedAt] DATETIME2(7) NOT NULL,
    [UpdatedAt] DATETIME2(7) NOT NULL,
    CONSTRAINT [PK_Customer] PRIMARY KEY ([Id]),
    CONSTRAINT [AK_Customer_TenantId_CustomerCode] UNIQUE ([TenantId], [CustomerCode]),
    CONSTRAINT [FK_Customer_Tenant] FOREIGN KEY ([TenantId]) REFERENCES [dbo].[Tenant] ([Id]),
)