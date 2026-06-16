using CSharpFunctionalExtensions;

namespace ConstructionManagement.Api.Domain.Projects
{
    public class ProjectCode : ValueObject
    {
        private const int MaxLength = 10;

        public string Value { get; }

        private ProjectCode(string value)
        {
            Value = value;
        }

        public static Result<ProjectCode> Create(string? input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return Result.Failure<ProjectCode>("工事コードは必須です。");

            string projectCode = input.Trim();

            if (projectCode.StartsWith("-") || projectCode.EndsWith("-"))
                return Result.Failure<ProjectCode>("工事コードの先頭と末尾にハイフンは使用できません。");

            if (!System.Text.RegularExpressions.Regex.IsMatch(projectCode, @"^[A-Z0-9\-]+$"))
                return Result.Failure<ProjectCode>("工事コードに使用できるのは、半角大文字英字・半角数字・ハイフン（-）のみです。");

            if (projectCode.Length > MaxLength)
                return Result.Failure<ProjectCode>($"工事コードは{MaxLength}文字以内で入力してください。");

            return Result.Success(new ProjectCode(projectCode));
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
