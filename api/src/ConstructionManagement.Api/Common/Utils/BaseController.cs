using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Mvc;

namespace ConstructionManagement.Api.Common.Utils
{
    [ApiController]
    public class BaseController : ControllerBase
    {
        protected ActionResult FromResult(UnitResult<Error> result)
        {
            return result.IsSuccess ? Ok() : ToProblem(result.Error);
        }

        protected ActionResult FromResult<T>(Result<T, Error> result)
        {
            return result.IsSuccess ? Ok(result.Value) : ToProblem(result.Error);
        }

        private ActionResult ToProblem(Error error)
        {
            if (error == Errors.General.NotFound())
                return Problem(detail: error.Message, statusCode: StatusCodes.Status404NotFound);

            if (error == Errors.General.Conflict())
                return Problem(detail: error.Message, statusCode: StatusCodes.Status409Conflict);

            if (error == Errors.General.UnprocessableEntity())
                return Problem(detail: error.Message, statusCode: StatusCodes.Status422UnprocessableEntity);

            if (error == Errors.General.Unauthorized())
                return Problem(detail: error.Message, statusCode: StatusCodes.Status401Unauthorized);

            if (error == Errors.General.Forbidden())
                return Problem(detail: error.Message, statusCode: StatusCodes.Status403Forbidden);

            return Problem(detail: error.Message, statusCode: StatusCodes.Status400BadRequest);
        }
    }
}