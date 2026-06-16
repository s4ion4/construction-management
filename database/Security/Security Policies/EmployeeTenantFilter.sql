CREATE SECURITY POLICY [Security].[EmployeeTenantFilter]
    ADD FILTER PREDICATE [Security].[fn_securitypredicate]([TenantId])
        ON [dbo].[Employee],
    ADD BLOCK PREDICATE [Security].[fn_securitypredicate]([TenantId])
        ON [dbo].[Employee] AFTER INSERT,
    ADD BLOCK PREDICATE [Security].[fn_securitypredicate]([TenantId])
        ON [dbo].[Employee] AFTER UPDATE
WITH (STATE = ON);