CREATE TABLE [dbo].[ProjectArchive]
(
    [Id] UNIQUEIDENTIFIER NOT NULL,
    [TenantId] UNIQUEIDENTIFIER NOT NULL,
    [ProjectCode] NVARCHAR(10) NOT NULL,
    [Name] NVARCHAR(50) NOT NULL,
    [CustomerId] UNIQUEIDENTIFIER NOT NULL,
    [CustomerContactPerson] NVARCHAR(20) NULL,
    [OrderDate] DATE NOT NULL,
    [OrderType] TINYINT NOT NULL, -- 1 = 元請, 2 = 下請
    [EstimateMainNumber] NVARCHAR(6) NULL,
    [EstimateBranchNumber] NVARCHAR(2) NULL,
    [DepartmentId] UNIQUEIDENTIFIER NULL,
    [SalesStaffId] UNIQUEIDENTIFIER NULL,
    [ConstructionStaffId] UNIQUEIDENTIFIER NULL,
    [Status] TINYINT NOT NULL, -- 1 = 未承認, 2 = 承認済
    [ApprovedAt] DATETIME2(7) NULL,
    [CreatedAt] DATETIME2(7) NOT NULL,
    [UpdatedAt] DATETIME2(7) NOT NULL,
    [ArchivedAt] DATETIME2(7) NOT NULL,
    CONSTRAINT [PK_ProjectArchive] PRIMARY KEY ([Id]),
)