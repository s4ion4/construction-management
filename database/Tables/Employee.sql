CREATE TABLE [dbo].[Employee]
(
    [Id] UNIQUEIDENTIFIER NOT NULL,
    [TenantId] UNIQUEIDENTIFIER NOT NULL,
    [EmployeeCode] NVARCHAR(10) NOT NULL,
    [Name] NVARCHAR(20) NOT NULL,
    [DepartmentCode] NVARCHAR(8) NOT NULL,
    [Status] TINYINT NOT NULL, -- 1 = 在職, 2 = 退職
    [CreatedAt] DATETIME2(7) NOT NULL,
    [UpdatedAt] DATETIME2(7) NOT NULL,
    CONSTRAINT [PK_Employee] PRIMARY KEY ([Id]),
    CONSTRAINT [AK_Employee_TenantId_EmployeeCode] UNIQUE ([TenantId], [EmployeeCode]),
    CONSTRAINT [FK_Employee_Tenant] FOREIGN KEY ([TenantId]) REFERENCES [dbo].[Tenant] ([Id]),
    CONSTRAINT [FK_Employee_Department] FOREIGN KEY ([TenantId], [DepartmentCode]) REFERENCES [dbo].[Department] ([TenantId], [DepartmentCode]),
)