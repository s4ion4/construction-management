using System.Security.Claims;

namespace ConstructionManagement.Api.Common.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        // 実際にはJWTのClaimsなどからテナントIDを取得する
        public static Guid GetTenantId(this ClaimsPrincipal principal)
            => new Guid("00000000-0000-0000-0000-000000000001");
    }
}