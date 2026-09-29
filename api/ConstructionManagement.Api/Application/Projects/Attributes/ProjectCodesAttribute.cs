using ConstructionManagement.Api.Domain.Projects;
using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations;

namespace ConstructionManagement.Api.Application.Projects.Attributes
{
    [AttributeUsage(AttributeTargets.Property)]
    public sealed class ProjectCodesAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is null)
                return ValidationResult.Success;

            if (value is not IEnumerable<string> codes)
                return new ValidationResult("工事コードの形式が不正です。");

            foreach (string code in codes)
            {
                Result<ProjectCode> result = ProjectCode.Create(code);

                if (result.IsFailure)
                    return new ValidationResult(result.Error);
            }

            return ValidationResult.Success;
        }
    }
}