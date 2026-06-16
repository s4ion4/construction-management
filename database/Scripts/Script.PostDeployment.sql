-- テスト用初期データの挿入
IF '$(DeployTestData)' = 'true'
BEGIN
    ALTER SECURITY POLICY [Security].[DepartmentTenantFilter] WITH (STATE = OFF);
    ALTER SECURITY POLICY [Security].[EmployeeTenantFilter] WITH (STATE = OFF);
    ALTER SECURITY POLICY [Security].[CustomerTenantFilter] WITH (STATE = OFF);
    ALTER SECURITY POLICY [Security].[ProjectTenantFilter] WITH (STATE = OFF);
    ALTER SECURITY POLICY [Security].[ProjectArchiveTenantFilter] WITH (STATE = OFF);

    :r .\TestData\Tenant.sql
    :r .\TestData\Department.sql
    :r .\TestData\Employee.sql
    :r .\TestData\Customer.sql
    :r .\TestData\Project.sql
    :r .\TestData\ProjectArchive.sql

    ALTER SECURITY POLICY [Security].[DepartmentTenantFilter] WITH (STATE = ON);
    ALTER SECURITY POLICY [Security].[EmployeeTenantFilter] WITH (STATE = ON);
    ALTER SECURITY POLICY [Security].[CustomerTenantFilter] WITH (STATE = ON);
    ALTER SECURITY POLICY [Security].[ProjectTenantFilter] WITH (STATE = ON);
    ALTER SECURITY POLICY [Security].[ProjectArchiveTenantFilter] WITH (STATE = ON);
END
