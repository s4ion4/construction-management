using ConstructionManagement.Api.Domain.Customers;

namespace ConstructionManagement.Api.UnitTests.Customers
{
    public class CustomerCodeTests
    {
        [Fact]
        public void 有効な得意先コードを作成できる()
        {
            var result = CustomerCode.Create("C001");

            Assert.True(result.IsSuccess);
            Assert.Equal("C001", result.Value.Value);
        }

        [Fact]
        public void 得意先コードが未入力のときエラーになる()
        {
            var result = CustomerCode.Create(null);

            Assert.True(result.IsFailure);
            Assert.Equal("得意先コードは必須です。", result.Error);
        }

        [Theory]
        [InlineData("")]
        [InlineData("   ")]
        public void 得意先コードが空のときエラーになる(string value)
        {
            var result = CustomerCode.Create(value);

            Assert.True(result.IsFailure);
            Assert.Equal("得意先コードは必須です。", result.Error);
        }

        [Fact]
        public void 得意先コードが8文字を超えるときエラーになる()
        {
            var result = CustomerCode.Create("ABCDEFGHI");

            Assert.True(result.IsFailure);
            Assert.Equal("得意先コードは8文字以内で入力してください。", result.Error);
        }

        [Fact]
        public void 得意先コードが8文字のとき作成できる()
        {
            var result = CustomerCode.Create("ABCDEFGH");

            Assert.True(result.IsSuccess);
        }

        [Fact]
        public void 得意先コードに使用できない文字が含まれるときエラーになる()
        {
            var result = CustomerCode.Create("C001-");

            Assert.True(result.IsFailure);
            Assert.Equal("得意先コードに使用できるのは、半角英数字のみです。", result.Error);
        }

        [Fact]
        public void 同じ値を持つ得意先コードは等しい()
        {
            var a = CustomerCode.Create("C001").Value;
            var b = CustomerCode.Create("C001").Value;

            Assert.Equal(a, b);
        }

        [Fact]
        public void 異なる値を持つ得意先コードは等しくない()
        {
            var a = CustomerCode.Create("C001").Value;
            var b = CustomerCode.Create("C002").Value;

            Assert.NotEqual(a, b);
        }
    }
}
