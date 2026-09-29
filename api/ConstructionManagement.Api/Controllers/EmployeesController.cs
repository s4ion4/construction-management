using ConstructionManagement.Api.Application.Employees.Dtos;
using ConstructionManagement.Api.Application.Employees.Queries;
using ConstructionManagement.Api.Common.Extensions;
using ConstructionManagement.Api.Common.Utils;
using Mediator;
using Microsoft.AspNetCore.Mvc;

namespace ConstructionManagement.Api.Controllers
{
    [Route("api/[controller]")]
    public class EmployeesController : BaseController
    {
        private readonly IMediator _mediator;

        public EmployeesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            Guid tenantId = User.GetTenantId();
            IReadOnlyList<EmployeeDto> dtos = await _mediator.Send(new GetAllEmployeesQuery(tenantId));
            return Ok(dtos);
        }
    }
}