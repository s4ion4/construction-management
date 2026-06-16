using CSharpFunctionalExtensions;

namespace ConstructionManagement.Api.Domain.Projects
{
    public class OrderDate : ValueObject
    {
        private static readonly DateOnly MinDate = new DateOnly(2000, 1, 1);
        private static readonly DateOnly MaxDate = new DateOnly(2099, 12, 31);

        public DateOnly Value { get; }

        private OrderDate(DateOnly value)
        {
            Value = value;
        }

        public static Result<OrderDate> Create(DateOnly? value)
        {
            if (value is null)
                return Result.Failure<OrderDate>("受注日を入力してください。");

            if (value < MinDate || value > MaxDate)
                return Result.Failure<OrderDate>($"受注日は{MinDate:yyyy/MM/dd}～{MaxDate:yyyy/MM/dd}の範囲で入力してください。");

            return Result.Success(new OrderDate(value.Value));
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
