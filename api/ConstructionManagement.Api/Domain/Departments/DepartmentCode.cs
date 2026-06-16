using CSharpFunctionalExtensions;

namespace ConstructionManagement.Api.Domain.Departments
{
    public class DepartmentCode : ValueObject
    {
        private const int MaxLength = 8;

        public string Value { get; }

        private DepartmentCode(string value)
        {
            Value = value;
        }

        public static Result<DepartmentCode> Create(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return Result.Failure<DepartmentCode>("部門コードは必須です。");

            if (value.Length > MaxLength)
                return Result.Failure<DepartmentCode>($"部門コードは{MaxLength}文字以内で入力してください。");

            if (!value.All(c => char.IsAsciiLetterOrDigit(c)))
                return Result.Failure<DepartmentCode>("部門コードに使用できるのは、半角英数字のみです。");

            return Result.Success(new DepartmentCode(value));
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}