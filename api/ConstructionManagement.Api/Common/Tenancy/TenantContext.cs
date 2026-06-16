namespace ConstructionManagement.Api.Common.Tenancy
{
    public interface ITenantContext
    {
        Guid TenantId { get; }
    }

    public interface ITenantSetter
    {
        void SetTenant(Guid tenantId);
    }

    public sealed class TenantContext : ITenantContext, ITenantSetter
    {
        private Guid? _tenantId;

        public Guid TenantId =>
            _tenantId ?? throw new InvalidOperationException("テナントが設定されていません。");

        public void SetTenant(Guid tenantId)
        {
            if (_tenantId is not null)
                throw new InvalidOperationException("テナントは再設定できません。");

            _tenantId = tenantId;
        }
    }
}
