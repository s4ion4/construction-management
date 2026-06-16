using ConstructionManagement.Api.Domain.Projects;

namespace ConstructionManagement.Api.UnitTests.Projects
{
    public class EstimateNumberTests
    {
        [Fact]
        public void 有効な親番号と枝番号で見積番号を作成できる()
        {
            var result = EstimateNumber.Create("123456", "01");

            Assert.True(result.IsSuccess);
            Assert.Equal("123456", result.Value.MainNumber);
            Assert.Equal("01", result.Value.BranchNumber);
        }

        [Fact]
        public void 親番号が未入力のときエラーになる()
        {
            var result = EstimateNumber.Create(null, "01");

            Assert.True(result.IsFailure);
            Assert.Equal("親番号は必須です。", result.Error);
        }

        [Fact]
        public void 親番号が空白のときエラーになる()
        {
            var result = EstimateNumber.Create("   ", "01");

            Assert.True(result.IsFailure);
            Assert.Equal("親番号は必須です。", result.Error);
        }

        [Fact]
        public void 枝番号が未入力のときエラーになる()
        {
            var result = EstimateNumber.Create("123456", null);

            Assert.True(result.IsFailure);
            Assert.Equal("枝番号は必須です。", result.Error);
        }

        [Fact]
        public void 枝番号が空白のときエラーになる()
        {
            var result = EstimateNumber.Create("123456", "  ");

            Assert.True(result.IsFailure);
            Assert.Equal("枝番号は必須です。", result.Error);
        }

        [Fact]
        public void 親番号が6桁未満のときエラーになる()
        {
            var result = EstimateNumber.Create("12345", "01");

            Assert.True(result.IsFailure);
            Assert.Equal("親番号は数字6桁で入力してください。", result.Error);
        }

        [Fact]
        public void 親番号が6桁超のときエラーになる()
        {
            var result = EstimateNumber.Create("1234567", "01");

            Assert.True(result.IsFailure);
            Assert.Equal("親番号は数字6桁で入力してください。", result.Error);
        }

        [Fact]
        public void 親番号に数字以外が含まれるときエラーになる()
        {
            var result = EstimateNumber.Create("12345A", "01");

            Assert.True(result.IsFailure);
            Assert.Equal("親番号は数字6桁で入力してください。", result.Error);
        }

        [Fact]
        public void 枝番号が2桁未満のときエラーになる()
        {
            var result = EstimateNumber.Create("123456", "1");

            Assert.True(result.IsFailure);
            Assert.Equal("枝番号は数字2桁で入力してください。", result.Error);
        }

        [Fact]
        public void 枝番号が2桁超のときエラーになる()
        {
            var result = EstimateNumber.Create("123456", "012");

            Assert.True(result.IsFailure);
            Assert.Equal("枝番号は数字2桁で入力してください。", result.Error);
        }

        [Fact]
        public void 枝番号に数字以外が含まれるときエラーになる()
        {
            var result = EstimateNumber.Create("123456", "0A");

            Assert.True(result.IsFailure);
            Assert.Equal("枝番号は数字2桁で入力してください。", result.Error);
        }

        [Fact]
        public void 同じ親番号と枝番号を持つ見積番号は等しい()
        {
            var a = EstimateNumber.Create("123456", "01").Value;
            var b = EstimateNumber.Create("123456", "01").Value;

            Assert.Equal(a, b);
        }

        [Fact]
        public void 異なる親番号を持つ見積番号は等しくない()
        {
            var a = EstimateNumber.Create("123456", "01").Value;
            var b = EstimateNumber.Create("999999", "01").Value;

            Assert.NotEqual(a, b);
        }

        [Fact]
        public void 異なる枝番号を持つ見積番号は等しくない()
        {
            var a = EstimateNumber.Create("123456", "01").Value;
            var b = EstimateNumber.Create("123456", "02").Value;

            Assert.NotEqual(a, b);
        }
    }
}
