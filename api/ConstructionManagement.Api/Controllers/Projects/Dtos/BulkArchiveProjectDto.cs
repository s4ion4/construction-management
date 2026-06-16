using ConstructionManagement.Api.Controllers.Projects.Attributes;
using System.ComponentModel.DataAnnotations;

namespace ConstructionManagement.Api.Controllers.Projects.Dtos
{
    public sealed class BulkArchiveProjectDto
    {
        [Required]
        [MinLength(1)]
        [MaxLength(100)]
        [ProjectCodes]
        public required IReadOnlyList<string> ProjectCodes { get; init; }
    }
}