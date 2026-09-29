using CSharpFunctionalExtensions;

namespace ConstructionManagement.Api.Common.Utils
{
    public sealed class Error : ValueObject
    {
        public string Code { get; }
        public string Message { get; }

        internal Error(string code, string message)
        {
            Code = code;
            Message = message;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Code;
        }
    }

    public static class Errors
    {
        public static class General
        {
            public static Error NotFound(string? message = null)
                => new("General.NotFound", message ?? "対象のデータが見つかりません。");

            public static Error Validation(string? message = null)
                => new("General.Validation", message ?? "入力内容が正しくありません。");

            public static Error Conflict(string? message = null)
                => new("General.Conflict", message ?? "リソースが競合しています。");

            public static Error UnprocessableEntity(string? message = null)
                => new("General.UnprocessableEntity", message ?? "処理できないリクエストです。");

            public static Error Unauthorized()
                => new("General.Unauthorized", "認証が必要です。");

            public static Error Forbidden()
                => new("General.Forbidden", "権限がありません。");
        }
    }
}