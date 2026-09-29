using ArchUnitNET.Loader;
using ConstructionManagement.Api.Domain.Projects;

namespace ConstructionManagement.Api.UnitTests.Architecture
{
    public abstract class ArchitectureTestBase
    {
        protected static readonly ArchUnitNET.Domain.Architecture Architecture = new ArchLoader()
            .LoadAssemblies(typeof(Project).Assembly)
            .Build();
    }
}
