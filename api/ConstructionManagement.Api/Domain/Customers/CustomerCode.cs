using CSharpFunctionalExtensions;

namespace ConstructionManagement.Api.Domain.Customers
{
    public class CustomerCode : ValueObject
    {
        private const int MaxLength = 8;

        public string Value { get; }

        private CustomerCode(string value)
        {
            Value = value;
        }

        public static Result<CustomerCode> Create(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return Result.Failure<CustomerCode>("得意先コードは必須です。");

            if (value.Length > MaxLength)
                return Result.Failure<CustomerCode>($"得意先コードは{MaxLength}文字以内で入力してください。");

            if (!value.All(c => char.IsAsciiLetterOrDigit(c)))
                return Result.Failure<CustomerCode>("得意先コードに使用できるのは、半角英数字のみです。");

            return Result.Success(new CustomerCode(value));
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}