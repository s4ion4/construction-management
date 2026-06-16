using ConstructionManagement.Api.Domain.Employees;

namespace ConstructionManagement.Api.UnitTests.Employees
{
    public class EmployeeCodeTests
    {
        [Fact]
        public void 有効な社員コードを作成できる()
        {
            var result = EmployeeCode.Create("E001");

            Assert.True(result.IsSuccess);
            Assert.Equal("E001", result.Value.Value);
        }

        [Fact]
        public void 社員コードが未入力のときエラーになる()
        {
            var result = EmployeeCode.Create(null);

            Assert.True(result.IsFailure);
            Assert.Equal("社員コードは必須です。", result.Error);
        }

        [Theory]
        [InlineData("")]
        [InlineData("   ")]
        public void 社員コードが空のときエラーになる(string value)
        {
            var result = EmployeeCode.Create(value);

            Assert.True(result.IsFailure);
            Assert.Equal("社員コードは必須です。", result.Error);
        }

        [Fact]
        public void 社員コードが10文字を超えるときエラーになる()
        {
            var result = EmployeeCode.Create("ABCDEFGHIJK");

            Assert.True(result.IsFailure);
            Assert.Equal("社員コードは10文字以内で入力してください。", result.Error);
        }

        [Fact]
        public void 社員コードが10文字のとき作成できる()
        {
            var result = EmployeeCode.Create("ABCDEFGHIJ");

            Assert.True(result.IsSuccess);
        }

        [Fact]
        public void 社員コードに使用できない文字が含まれるときエラーになる()
        {
            var result = EmployeeCode.Create("E001-");

            Assert.True(result.IsFailure);
            Assert.Equal("社員コードに使用できるのは、半角英数字のみです。", result.Error);
        }

        [Fact]
        public void 同じ値を持つ社員コードは等しい()
        {
            var a = EmployeeCode.Create("E001").Value;
            var b = EmployeeCode.Create("E001").Value;

            Assert.Equal(a, b);
        }

        [Fact]
        public void 異なる値を持つ社員コードは等しくない()
        {
            var a = EmployeeCode.Create("E001").Value;
            var b = EmployeeCode.Create("E002").Value;

            Assert.NotEqual(a, b);
        }
    }
}
