CREATE SECURITY POLICY [Security].[ProjectTenantFilter]
    ADD FILTER PREDICATE [Security].[fn_securitypredicate]([TenantId])
        ON [dbo].[Project],
    ADD BLOCK PREDICATE [Security].[fn_securitypredicate]([TenantId])
        ON [dbo].[Project] AFTER INSERT,
    ADD BLOCK PREDICATE [Security].[fn_securitypredicate]([TenantId])
        ON [dbo].[Project] AFTER UPDATE
WITH (STATE = ON);