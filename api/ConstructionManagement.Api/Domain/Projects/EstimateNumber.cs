using CSharpFunctionalExtensions;

namespace ConstructionManagement.Api.Domain.Projects
{
    public class EstimateNumber : ValueObject
    {
        private const int MainNumberLength = 6;
        private const int BranchNumberLength = 2;

        public string MainNumber { get; } = string.Empty;
        public string BranchNumber { get; } = string.Empty;

        private EstimateNumber() { }

        private EstimateNumber(string mainNumber, string branchNumber)
        {
            MainNumber = mainNumber;
            BranchNumber = branchNumber;
        }

        public static Result<EstimateNumber> Create(string? mainNumber, string? branchNumber)
        {
            if (string.IsNullOrWhiteSpace(mainNumber))
                return Result.Failure<EstimateNumber>("親番号は必須です。");

            if (string.IsNullOrWhiteSpace(branchNumber))
                return Result.Failure<EstimateNumber>("枝番号は必須です。");

            if (mainNumber.Length != MainNumberLength || !mainNumber.All(char.IsDigit))
                return Result.Failure<EstimateNumber>($"親番号は数字{MainNumberLength}桁で入力してください。");

            if (branchNumber.Length != BranchNumberLength || !branchNumber.All(char.IsDigit))
                return Result.Failure<EstimateNumber>($"枝番号は数字{BranchNumberLength}桁で入力してください。");

            return Result.Success(new EstimateNumber(mainNumber, branchNumber));
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return MainNumber;
            yield return BranchNumber;
        }
    }
}
