using ConstructionManagement.Api.Controllers.Projects.Attributes;
using System.ComponentModel.DataAnnotations;

namespace ConstructionManagement.Api.Controllers.Projects.Dtos
{
    public sealed class CheckProjectCodeDto
    {
        [Display(Name = "工事コード")]
        [Required, ProjectCode]
        public string? ProjectCode { get; init; }

        [Display(Name = "現在の工事コード")]
        [ProjectCode]
        public string? CurrentProjectCode { get; init; }
    }
}