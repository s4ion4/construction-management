using ConstructionManagement.Api.Domain.Projects;

namespace ConstructionManagement.Api.UnitTests.Projects
{
    public class ProjectCodeTests
    {
        [Fact]
        public void 有効な工事コードを作成できる()
        {
            var result = ProjectCode.Create("P001");

            Assert.True(result.IsSuccess);
            Assert.Equal("P001", result.Value.Value);
        }

        [Fact]
        public void 工事コードが未入力のときエラーになる()
        {
            var result = ProjectCode.Create(null);

            Assert.True(result.IsFailure);
            Assert.Equal("工事コードは必須です。", result.Error);
        }

        [Fact]
        public void 工事コードが空白のときエラーになる()
        {
            var result = ProjectCode.Create("   ");

            Assert.True(result.IsFailure);
            Assert.Equal("工事コードは必須です。", result.Error);
        }

        [Fact]
        public void 工事コードの先頭がハイフンのときエラーになる()
        {
            var result = ProjectCode.Create("-P001");

            Assert.True(result.IsFailure);
            Assert.Equal("工事コードの先頭と末尾にハイフンは使用できません。", result.Error);
        }

        [Fact]
        public void 工事コードの末尾がハイフンのときエラーになる()
        {
            var result = ProjectCode.Create("P001-");

            Assert.True(result.IsFailure);
            Assert.Equal("工事コードの先頭と末尾にハイフンは使用できません。", result.Error);
        }

        [Fact]
        public void 工事コードに使用できない文字が含まれるときエラーになる()
        {
            var result = ProjectCode.Create("P001@");

            Assert.True(result.IsFailure);
            Assert.Equal("工事コードに使用できるのは、半角大文字英字・半角数字・ハイフン（-）のみです。", result.Error);
        }

        [Fact]
        public void 小文字を含む工事コードはエラーになる()
        {
            var result = ProjectCode.Create("p001");

            Assert.True(result.IsFailure);
            Assert.Equal("工事コードに使用できるのは、半角大文字英字・半角数字・ハイフン（-）のみです。", result.Error);
        }

        [Fact]
        public void 工事コードが10文字を超えるときエラーになる()
        {
            var result = ProjectCode.Create("ABCDEFGHIJK");

            Assert.True(result.IsFailure);
            Assert.Equal("工事コードは10文字以内で入力してください。", result.Error);
        }

        [Fact]
        public void 工事コードが10文字のとき作成できる()
        {
            var result = ProjectCode.Create("ABCDEFGHIJ");

            Assert.True(result.IsSuccess);
        }

        [Fact]
        public void 前後の空白は除去される()
        {
            var result = ProjectCode.Create("  P001  ");

            Assert.True(result.IsSuccess);
            Assert.Equal("P001", result.Value.Value);
        }

        [Fact]
        public void ハイフンを含む工事コードを作成できる()
        {
            var result = ProjectCode.Create("P-001");

            Assert.True(result.IsSuccess);
            Assert.Equal("P-001", result.Value.Value);
        }

        [Fact]
        public void 同じ値を持つ工事コードは等しい()
        {
            var a = ProjectCode.Create("P001").Value;
            var b = ProjectCode.Create("P001").Value;

            Assert.Equal(a, b);
        }

        [Fact]
        public void 異なる値を持つ工事コードは等しくない()
        {
            var a = ProjectCode.Create("P001").Value;
            var b = ProjectCode.Create("P002").Value;

            Assert.NotEqual(a, b);
        }
    }
}
