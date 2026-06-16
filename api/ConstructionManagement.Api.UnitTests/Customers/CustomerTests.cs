using ConstructionManagement.Api.Domain.Customers;

namespace ConstructionManagement.Api.UnitTests.Customers
{
    public class CustomerTests
    {
        [Theory]
        [InlineData("")]
        [InlineData("   ")]
        public void 得意先名が空のとき得意先を作成できない(string name)
        {
            Assert.Throws<ArgumentException>(() =>
                Customer.Create(
                    id: Guid.NewGuid(),
                    tenantId: Guid.NewGuid(),
                    customerCode: CustomerCode.Create("C001").Value,
                    name: name,
                    status: CustomerStatus.Active));
        }

        [Fact]
        public void 得意先名の前後の空白は除去される()
        {
            var customer = Customer.Create(
                id: Guid.NewGuid(),
                tenantId: Guid.NewGuid(),
                customerCode: CustomerCode.Create("C001").Value,
                name: "  テスト得意先  ",
                status: CustomerStatus.Active);

            Assert.Equal("テスト得意先", customer.Name);
        }
    }
}
