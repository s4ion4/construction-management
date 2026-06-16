using CSharpFunctionalExtensions;

namespace ConstructionManagement.Api.Domain.Employees
{
    public class EmployeeCode : ValueObject
    {
        private const int MaxLength = 10;

        public string Value { get; }

        private EmployeeCode(string value)
        {
            Value = value;
        }

        public static Result<EmployeeCode> Create(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return Result.Failure<EmployeeCode>("社員コードは必須です。");

            if (value.Length > MaxLength)
                return Result.Failure<EmployeeCode>($"社員コードは{MaxLength}文字以内で入力してください。");

            if (!value.All(c => char.IsAsciiLetterOrDigit(c)))
                return Result.Failure<EmployeeCode>("社員コードに使用できるのは、半角英数字のみです。");

            return Result.Success(new EmployeeCode(value));
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}