CREATE SECURITY POLICY [Security].[DepartmentTenantFilter]
    ADD FILTER PREDICATE [Security].[fn_securitypredicate]([TenantId])
        ON [dbo].[Department],
    ADD BLOCK PREDICATE [Security].[fn_securitypredicate]([TenantId])
        ON [dbo].[Department] AFTER INSERT,
    ADD BLOCK PREDICATE [Security].[fn_securitypredicate]([TenantId])
        ON [dbo].[Department] AFTER UPDATE
WITH (STATE = ON);