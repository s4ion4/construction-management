CREATE SECURITY POLICY [Security].[CustomerTenantFilter]
    ADD FILTER PREDICATE [Security].[fn_securitypredicate]([TenantId])
        ON [dbo].[Customer],
    ADD BLOCK PREDICATE [Security].[fn_securitypredicate]([TenantId])
        ON [dbo].[Customer] AFTER INSERT,
    ADD BLOCK PREDICATE [Security].[fn_securitypredicate]([TenantId])
        ON [dbo].[Customer] AFTER UPDATE
WITH (STATE = ON);