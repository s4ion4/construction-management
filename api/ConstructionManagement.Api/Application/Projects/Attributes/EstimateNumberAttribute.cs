using ConstructionManagement.Api.Application.Projects.Dtos;
using ConstructionManagement.Api.Domain.Projects;
using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations;

namespace ConstructionManagement.Api.Application.Projects.Attributes
{
    [AttributeUsage(AttributeTargets.Property)]
    public sealed class EstimateNumberAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is null)
                return ValidationResult.Success;

            if (value is not EstimateNumberDto dto)
                return new ValidationResult("見積番号の形式が不正です。");

            Result<EstimateNumber> result = EstimateNumber.Create(dto.MainNumber, dto.BranchNumber);

            if (result.IsFailure)
                return new ValidationResult(result.Error);

            return ValidationResult.Success;
        }
    }
}
