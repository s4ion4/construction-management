using ConstructionManagement.Api.Domain.Projects;
using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations;

namespace ConstructionManagement.Api.Controllers.Projects.Attributes
{

    [AttributeUsage(AttributeTargets.Property)]
    public sealed class OrderDateAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is null)
                return ValidationResult.Success;

            if (value is not DateOnly dateOnly)
                return new ValidationResult("受注日の形式が不正です。");

            Result<OrderDate> result = OrderDate.Create(dateOnly);

            if (result.IsFailure)
                return new ValidationResult(result.Error);

            return ValidationResult.Success;
        }
    }

}
