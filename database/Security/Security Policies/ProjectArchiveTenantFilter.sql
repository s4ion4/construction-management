CREATE SECURITY POLICY [Security].[ProjectArchiveTenantFilter]
    ADD FILTER PREDICATE [Security].[fn_securitypredicate]([TenantId])
        ON [dbo].[ProjectArchive],
    ADD BLOCK PREDICATE [Security].[fn_securitypredicate]([TenantId])
        ON [dbo].[ProjectArchive] AFTER INSERT,
    ADD BLOCK PREDICATE [Security].[fn_securitypredicate]([TenantId])
        ON [dbo].[ProjectArchive] AFTER UPDATE
WITH (STATE = ON);