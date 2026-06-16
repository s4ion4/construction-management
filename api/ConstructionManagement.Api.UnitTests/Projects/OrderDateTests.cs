using ConstructionManagement.Api.Domain.Projects;

namespace ConstructionManagement.Api.UnitTests.Projects
{
    public class OrderDateTests
    {
        [Fact]
        public void 有効な日付で受注日を作成できる()
        {
            var result = OrderDate.Create(new DateOnly(2026, 4, 1));

            Assert.True(result.IsSuccess);
            Assert.Equal(new DateOnly(2026, 4, 1), result.Value.Value);
        }

        [Fact]
        public void 受注日が未入力のときエラーになる()
        {
            var result = OrderDate.Create(null);

            Assert.True(result.IsFailure);
            Assert.Equal("受注日を入力してください。", result.Error);
        }

        [Fact]
        public void 受注日が下限より前のときエラーになる()
        {
            var result = OrderDate.Create(new DateOnly(1999, 12, 31));

            Assert.True(result.IsFailure);
            Assert.Equal("受注日は2000/01/01～2099/12/31の範囲で入力してください。", result.Error);
        }

        [Fact]
        public void 受注日が上限より後のときエラーになる()
        {
            var result = OrderDate.Create(new DateOnly(2100, 1, 1));

            Assert.True(result.IsFailure);
            Assert.Equal("受注日は2000/01/01～2099/12/31の範囲で入力してください。", result.Error);
        }

        [Fact]
        public void 受注日が下限と等しいとき作成できる()
        {
            var result = OrderDate.Create(new DateOnly(2000, 1, 1));

            Assert.True(result.IsSuccess);
        }

        [Fact]
        public void 受注日が上限と等しいとき作成できる()
        {
            var result = OrderDate.Create(new DateOnly(2099, 12, 31));

            Assert.True(result.IsSuccess);
        }

        [Fact]
        public void 同じ日付を持つ受注日は等しい()
        {
            var a = OrderDate.Create(new DateOnly(2026, 4, 1)).Value;
            var b = OrderDate.Create(new DateOnly(2026, 4, 1)).Value;

            Assert.Equal(a, b);
        }

        [Fact]
        public void 異なる日付を持つ受注日は等しくない()
        {
            var a = OrderDate.Create(new DateOnly(2026, 4, 1)).Value;
            var b = OrderDate.Create(new DateOnly(2026, 4, 2)).Value;

            Assert.NotEqual(a, b);
        }
    }
}
