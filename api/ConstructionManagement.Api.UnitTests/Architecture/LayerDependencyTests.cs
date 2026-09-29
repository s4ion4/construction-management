using ArchUnitNET.Fluent;
using ArchUnitNET.xUnitV3;
using static ArchUnitNET.Fluent.ArchRuleDefinition;

namespace ConstructionManagement.Api.UnitTests.Architecture
{
    public class LayerDependencyTests : ArchitectureTestBase
    {
        private const string DomainNamespace = @"ConstructionManagement\.Api\.Domain(\..*)?";
        private const string ApplicationNamespace = @"ConstructionManagement\.Api\.Application(\..*)?";
        private const string InfrastructureNamespace = @"ConstructionManagement\.Api\.Infrastructure(\..*)?";

        [Fact]
        public void Domain層はApplication層に依存しない()
        {
            IArchRule rule = Types()
                .That().ResideInNamespaceMatching(DomainNamespace)
                .Should().NotDependOnAny(
                    Types().That().ResideInNamespaceMatching(ApplicationNamespace))
                .Because("Domain層はApplication層に依存できません。");

            rule.Check(Architecture);
        }

        [Fact]
        public void Domain層はInfrastructure層に依存しない()
        {
            IArchRule rule = Types()
                .That().ResideInNamespaceMatching(DomainNamespace)
                .Should().NotDependOnAny(
                    Types().That().ResideInNamespaceMatching(InfrastructureNamespace))
                .Because("Domain層はInfrastructure層に依存できません。");

            rule.Check(Architecture);
        }
    }
}
