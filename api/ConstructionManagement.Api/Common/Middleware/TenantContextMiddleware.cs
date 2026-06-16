using ConstructionManagement.Api.Common.Extensions;
using ConstructionManagement.Api.Common.Tenancy;

namespace ConstructionManagement.Api.Common.Middleware
{
    public sealed class TenantContextMiddleware : IMiddleware
    {
        private readonly ITenantSetter _tenantSetter;

        public TenantContextMiddleware(ITenantSetter tenantSetter)
        {
            _tenantSetter = tenantSetter;
        }

        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            _tenantSetter.SetTenant(context.User.GetTenantId());
            await next(context);
        }
    }
}
