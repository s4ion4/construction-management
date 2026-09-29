using ConstructionManagement.Api.Application.Projects.Attributes;
using ConstructionManagement.Api.Domain.Projects;
using System.ComponentModel.DataAnnotations;

namespace ConstructionManagement.Api.Application.Projects.Dtos
{
    public sealed class UpdateProjectDto
    {
        [Display(Name = "工事コード")]
        [Required, ProjectCode]
        public string? ProjectCode { get; init; }

        [Display(Name = "工事名")]
        [Required, StringLength(50)]
        public string? Name { get; init; }

        [Display(Name = "得意先コード")]
        [Required]
        public Guid? CustomerId { get; init; }

        [Display(Name = "客先担当者")]
        [StringLength(20)]
        public string? CustomerContactPerson { get; init; }

        [Display(Name = "受注日")]
        [Required, OrderDate]
        public DateOnly? OrderDate { get; init; }

        [Display(Name = "受注区分")]
        [Required]
        public OrderType? OrderType { get; init; }

        [Display(Name = "見積番号")]
        [EstimateNumber]
        public EstimateNumberDto? EstimateNumber { get; init; }

        [Display(Name = "担当部門コード")]
        public Guid? DepartmentId { get; init; }

        [Display(Name = "営業担当者コード")]
        public Guid? SalesStaffId { get; init; }

        [Display(Name = "工事担当者コード")]
        public Guid? ConstructionStaffId { get; init; }
    }
}