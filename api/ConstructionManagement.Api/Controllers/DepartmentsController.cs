using ConstructionManagement.Api.Application.Departments.Dtos;
using ConstructionManagement.Api.Application.Departments.Queries;
using ConstructionManagement.Api.Common.Extensions;
using ConstructionManagement.Api.Common.Utils;
using Mediator;
using Microsoft.AspNetCore.Mvc;

namespace ConstructionManagement.Api.Controllers
{
    [Route("api/[controller]")]
    public class DepartmentsController : BaseController
    {
        private readonly IMediator _mediator;

        public DepartmentsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            Guid tenantId = User.GetTenantId();
            IReadOnlyList<DepartmentDto> dtos = await _mediator.Send(new GetAllDepartmentsQuery(tenantId));
            return Ok(dtos);
        }
    }
}