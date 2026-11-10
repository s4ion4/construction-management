using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;
using System.ComponentModel.DataAnnotations;

namespace ConstructionManagement.Api.Common.Localization
{
    public class JapaneseValidationMetadataProvider : IValidationMetadataProvider
    {
        public void CreateValidationMetadata(ValidationMetadataProviderContext context)
        {
            foreach (var metadata in context.ValidationMetadata.ValidatorMetadata)
            {
                switch (metadata)
                {
                    case RequiredAttribute required:
                        required.ErrorMessage = "{0}は必須です。";
                        break;
                    case StringLengthAttribute stringLength when stringLength.MinimumLength > 0:
                        stringLength.ErrorMessage = "{0}は{2}文字以上{1}文字以内で入力してください。";
                        break;
                    case StringLengthAttribute stringLength:
                        stringLength.ErrorMessage = "{0}は{1}文字以内で入力してください。";
                        break;
                    case MinLengthAttribute minLength:
                        minLength.ErrorMessage = "{0}は{1}件以上指定してください。";
                        break;
                    case MaxLengthAttribute maxLength:
                        maxLength.ErrorMessage = "{0}は{1}件以内で指定してください。";
                        break;
                }
            }
        }
    }
}
