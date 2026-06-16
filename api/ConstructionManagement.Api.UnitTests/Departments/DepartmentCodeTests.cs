using ConstructionManagement.Api.Domain.Departments;

namespace ConstructionManagement.Api.UnitTests.Departments
{
    public class DepartmentCodeTests
    {
        [Fact]
        public void 有効な部門コードを作成できる()
        {
            var result = DepartmentCode.Create("D001");

            Assert.True(result.IsSuccess);
            Assert.Equal("D001", result.Value.Value);
        }

        [Fact]
        public void 部門コードが未入力のときエラーになる()
        {
            var result = DepartmentCode.Create(null);

            Assert.True(result.IsFailure);
            Assert.Equal("部門コードは必須です。", result.Error);
        }

        [Theory]
        [InlineData("")]
        [InlineData("   ")]
        public void 部門コードが空のときエラーになる(string value)
        {
            var result = DepartmentCode.Create(value);

            Assert.True(result.IsFailure);
            Assert.Equal("部門コードは必須です。", result.Error);
        }

        [Fact]
        public void 部門コードが8文字を超えるときエラーになる()
        {
            var result = DepartmentCode.Create("ABCDEFGHI");

            Assert.True(result.IsFailure);
            Assert.Equal("部門コードは8文字以内で入力してください。", result.Error);
        }

        [Fact]
        public void 部門コードが8文字のとき作成できる()
        {
            var result = DepartmentCode.Create("ABCDEFGH");

            Assert.True(result.IsSuccess);
        }

        [Fact]
        public void 部門コードに使用できない文字が含まれるときエラーになる()
        {
            var result = DepartmentCode.Create("D001-");

            Assert.True(result.IsFailure);
            Assert.Equal("部門コードに使用できるのは、半角英数字のみです。", result.Error);
        }

        [Fact]
        public void 同じ値を持つ部門コードは等しい()
        {
            var a = DepartmentCode.Create("D001").Value;
            var b = DepartmentCode.Create("D001").Value;

            Assert.Equal(a, b);
        }

        [Fact]
        public void 異なる値を持つ部門コードは等しくない()
        {
            var a = DepartmentCode.Create("D001").Value;
            var b = DepartmentCode.Create("D002").Value;

            Assert.NotEqual(a, b);
        }
    }
}
